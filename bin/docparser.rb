require 'pp'
require 'json'

$bad_input = false
def bad_input file, text
	$bad_input = true
	$stderr.puts "#{file}: unrecognized input: #{text}"
end

def parse_dir dirname
	Dir.entries(dirname).sort.map{|filename|
		if filename == '.' || filename == '..'
			nil
		else
			parse_any_path "#{dirname}/#{filename}"
		end
	}.compact.inject(:+)
end

def cleanup_class_name class_name
	class_name.sub(/OO\.ui\./, '').sub(/mixin\./, '')
end

def extract_default_from_description item
	m = item[:description].match(/\(default: (.+?)\)\s*?$/i)
	return if !m
	# modify `item` in-place
	item[:default] = m[1]
	item[:description] = m.pre_match
end

def parse_file filename
	if filename !~ /\.(php|js)$/
		return nil
	end
	filetype = filename[/\.(php|js)$/, 1].to_sym

	text = File.read filename, encoding: 'utf-8'

	# ewwww
	# some docblocks are missing and we really need them
	text = text.sub(/(?<!\*\/\n)^(class|trait)/, "/**\n*/\n\\1")

	# find all documentation blocks, together with the following line (unless it contains another docblock)
	docblocks = text.scan(/\/\*\*[\s\S]+?\*\/\n[ \t]*(?:(?=\/\*\*)|.*)/)

	current_class = nil
	output = []
	previous_item = {} # dummy

	docblocks.each{|d|
		kind = nil
		previous_item = data = {
			name: nil,
			description: '',
			parent: nil,
			mixes: [],
			methods: [],
			properties: [],
			events: [],
			params: [],
			config: [],
			visibility: :public,
			type: nil,
		}
		valid_for_all = %w[name description].map(&:to_sym)
		valid_per_kind = {
			class:    valid_for_all + %w[parent mixes methods properties events abstract].map(&:to_sym),
			method:   valid_for_all + %w[params config return visibility static].map(&:to_sym),
			property: valid_for_all + %w[type static].map(&:to_sym),
			event:    valid_for_all + %w[params].map(&:to_sym),
		}

		js_class_constructor = false
		js_class_constructor_desc = ''
		php_trait_constructor = false
		parsing_php_config_options = false
		ignore = false

		comment, code_line = d.split '*/'
		comment.split("\n").each{|comment_line|
			next if comment_line.strip == '/**'
			comment_line.sub!(/^[ \t]*\*[ \t]?/, '') # strip leading '*' and whitespace

			match_keyword = comment_line.match(/^@([\w-]+)(?:[ \t]+(.+))?/)
			match_php_config = comment_line.match(/^ *- (\S+) \&?(?:\.\.\.)?\$config(?:\['(\w+)'\])?( .+)?$/)
			if !match_keyword && parsing_php_config_options && match_php_config
				type, config, description = match_php_config.captures
				data[:config] << {name: config, type: cleanup_class_name(type), description: description || ''}
				previous_item = data[:config][-1]
				extract_default_from_description(previous_item)
				next
			end
			if !match_keyword
				# this is a continuation of previous item's description
				previous_item[:description] << comment_line + "\n"
				if filetype == :php
					extract_default_from_description(previous_item)
				end
				next
			end

			parsing_php_config_options = false
			keyword, content = match_keyword.captures

			# handle JS class/constructor conundrum
			if keyword == 'class' || keyword == 'constructor'
				js_class_constructor = true
			end

			case keyword
			when 'constructor'
				# handle JS class/constructor conundrum
				js_class_constructor_desc = data[:description]
				data[:description] = ''
				kind = :method
			when 'class'
				kind = :class
				data[:name] = cleanup_class_name(content.strip) if content && !content.strip.empty?
			when 'method'
				kind = :method
			when 'property', 'var'
				kind = :property
				m = content.match(/^\{?(.+?)\}?( .+)?$/)
				if !m
					bad_input filename, comment_line
					next
				end
				type, description = m.captures
				data[:type] = type
				data[:description] = description if description
			when 'event'
				kind = :event
				data[:name] = content.strip
			when 'extends'
				data[:parent] = cleanup_class_name(content.strip)
			when 'mixes'
				data[:mixes] << cleanup_class_name(content.strip)
			when 'param'
				case filetype
				when :js
					type, is_config, name, default, description =
						content.match(/^\{(?:\.\.\.)?(.+?)\} \[?(config\.)?([\w.$]+?)(?:=(.+?))?\]?( .+)?$/).captures
					# ignore the "Configuration options" parameter
					next if type == 'Object' && name == 'config'
					key = is_config ? :config : :params
					data[key] << {name: name, type: cleanup_class_name(type), description: description || '', default: default}
					previous_item = data[key][-1]
				when :php
					type, name, description =
						content.match(/^(\S+) \&?(?:\.\.\.)?\$(\w+)( .+)?$/).captures
					parsing_php_config_options = type == 'array' && name == 'config'
					# ignore the "Configuration options" parameter
					next if parsing_php_config_options
					data[:params] << {name: name, type: cleanup_class_name(type), description: description || ''}
					previous_item = data[:params][-1]
					extract_default_from_description(previous_item)
				end
			when 'return'
				case filetype
				when :js
					m = content.match(/^\{(.+?)\}( .+)?$/)
				when :php
					m = content.match(/^(\S+)( .+)?$/)
				end
				if !m
					bad_input filename, comment_line
					next
				end
				type, description = m.captures
				data[:return] = {type: cleanup_class_name(type), description: description || ''}
				previous_item = data[:return]
			when 'private'
				data[:visibility] = :private
			when 'protected'
				data[:visibility] = :protected
			when 'static'
				data[:static] = true
			when 'abstract'
				data[:abstract] = true
			when 'ignore', 'inheritdoc'
				ignore = true
			when 'inheritable', 'deprecated', 'namespace', 'throws',
				 'chainable', 'fires', 'memberof',
				 'see', 'uses', 'param-taint', 'suppress',
				 'phpcs',
				 /^phan-/
				# skip
			else
				bad_input filename, comment_line
				next
			end
		}

		next if ignore

		if code_line && code_line.strip != ''
			case filetype
			when :js
				m = code_line.match(/(?:(static|prototype|mixin)\.)?(\w+) =/)
				if !m
					bad_input filename, code_line.strip
					next
				end
				kind_, name = m.captures
				data[:static] = true if kind_ == 'static'
				kind = {'static' => :property, 'prototype' => :method}[ kind_.strip ] if kind_ && !kind
				data[:mixin] = true if kind_ == 'mixin'
				data[:name] ||= cleanup_class_name(name)
			when :php
				m = code_line.match(/
					\s*
					(?:(public|protected|private)\s)?
					(?:(static)\s)?(function\s|class\s|trait\s|\$)
					(\w+)
					(?:\sextends\s(\w+))?
				/x)
				if !m
					bad_input filename, code_line.strip
					next
				end
				visibility, static, kind_, name, parent = m.captures
				kind = {'$' => :property, 'function' => :method, 'class' => :class, 'trait' => :class}[ kind_.strip ]
				data[:visibility] = {'private' => :private, 'protected' => :protected, 'public' => :public}[ visibility ] || :public
				data[:mixin] = true if kind_.strip == 'trait'
				data[:static] = true if static
				data[:parent] = cleanup_class_name(parent) if parent
				data[:name] ||= cleanup_class_name(name)
				php_trait_constructor = true if kind == :method && data[:name] == 'initialize' + current_class[:name]
			end
		end

		# handle JS class/constructor conundrum
		if kind == :class || js_class_constructor
			if current_class
				output << current_class
			end
			current_class = data.select{|k, _v| valid_per_kind[:class].include? k }
			current_class[:description] = js_class_constructor_desc if js_class_constructor_desc != ''
			previous_item = current_class
		end

		# standardize
		# (also handle fake constructors for traits)
		if data[:name] == '__construct' || js_class_constructor || php_trait_constructor
			data[:name] = '#constructor'
		end

		# put into the current class
		if kind && kind != :class
			keys = {
				method: :methods,
				property: :properties,
				event: :events,
			}
			if current_class
				current_class[keys[kind]] << data.select{|k, _v| valid_per_kind[kind].include? k }
				previous_item = current_class[keys[kind]]
			end
		end
	}

	# this is evil, assumes we only have one class in a file, but we'd need a proper parser to do it better
	# note, we remove everything before the first "{\n" to make sure we don't parse `use` imports.
	if current_class && filetype == :php
		current_class[:mixes] +=
			text.gsub(/\A.+?\{\n/m, '').scan(/^[ \t]*use (\w+)(?: ?\{|;)/).flatten.map(&method(:cleanup_class_name))
	end

	output << current_class if current_class
	output
end

def parse_any_path path
	if File.directory? path
		result = parse_dir path
	else
		result = parse_file path
	end
	if $bad_input
		$stderr.puts 'Unrecognized inputs encountered, stopping.'
		exit 1
	end
	result
end

if __FILE__ == $PROGRAM_NAME
	if ARGV.empty? || ARGV == ['-h'] || ARGV == ['--help']
		$stderr.puts "usage: ruby #{$PROGRAM_NAME} <files...>"
		$stderr.puts "       ruby #{$PROGRAM_NAME} src > docs-js.json"
		$stderr.puts "       ruby #{$PROGRAM_NAME} php > docs-php.json"
	else
		out = JSON.pretty_generate ARGV.map{|a| parse_any_path a }.inject(:+)
		# ew
		out = out.gsub(/\{\s+\}/, '{}').gsub(/\[\s+\]/, '[]')
		puts out
	end
end
