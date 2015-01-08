require 'pp'
require_relative 'docparser'

if ARGV.empty? || ARGV == ['-h'] || ARGV == ['--help']
	$stderr.puts "usage: ruby #{$0} <dirA> <dirB>"
	$stderr.puts "       ruby #{$0} src php > tests/JSPHP-suite.json"
else
	dir_a, dir_b = ARGV
	js = parse_any_path dir_a
	php = parse_any_path dir_b

	class_names = (js + php).map{|c| c[:name] }.sort.uniq

	tests = []
	classes = php.select{|c| class_names.include? c[:name] }

	testable_classes = classes
		.reject{|c| c[:abstract] } # can't test abstract classes
		.reject{|c| !c[:parent] || c[:parent] == 'ElementMixin' } # can't test abstract
		.reject{|c| %w[Element Widget Layout Theme MediaWikiTheme].include? c[:name] } # no toplevel
		.select{|c| c[:methods][0][:params].empty? } # only without params :(

	# values to test for each type
	expandos = {
		'null' => [nil],
		'number' => [0, -1, 300],
		'boolean' => [true, false],
		'string' => ['Foo bar', '<b>HTML?</b>'],
	}

	# values to test for names
	sensible_values = {
		'href' => ['http://example.com/'],
		['TextInputWidget', 'type'] => %w[text password],
		['ButtonInputWidget', 'type'] => %w[button input],
		'type' => %w[text button],
		'method' => %w[GET POST],
		'action' => [],
		'enctype' => true,
		'target' => ['_blank'],
		'name' => true,
		'tabIndex' => true,
		'icon' => ['picture'],
		'indicator' => ['down'],
		'flags' => %w[constructive],
		'label' => expandos['string'] + ['', ' '],
	}

	expand_types_to_values = lambda do |types|
		return types.map{|t|
			as_array = true if t.sub! '[]', ''
			vals = expandos[ t ] || [] # the empty value will result in no tests being generated
			as_array ? vals.map{|v| [v] } : vals
		}.inject(:+)
	end

	find_class = lambda do |klass|
		return classes.find{|c| c[:name] == klass }
	end

	testable_classes.each do |klass|
		# constructor = klass[:methods][0]
		# params = constructor[:params]

		config_sources = [ klass[:name], klass[:parent] ] + klass[:mixins]
		config = config_sources.map{|c| find_class.call(c)[:methods][0][:config] }.compact.inject(:+)

		# generate every possible configuration of configuration option sets
		maxlength = [config.length, 3].min
		config_combinations = (0..maxlength).map{|l| config.combination(l).to_a }.inject(:+)
		# for each set, generate all possible values to use based on option's type
		config_combinations = config_combinations.map{|config_comb|
			expanded = config_comb.map{|config_option|
				types = config_option[:type].split '|'
				sensible = sensible_values[ [ klass[:name], config_option[:name] ] ] ||
					sensible_values[ config_option[:name] ]
				if sensible == true
					[] # the empty value will result in no tests being generated
				else
					values = sensible || expand_types_to_values.call(types)
					values.map{|v| config_option.dup.merge(value: v) } + [nil]
				end
			}
			expanded.length > 0 ? expanded[0].product(*expanded[1..-1]) : []
		}.inject(:concat).map(&:compact).uniq

		# param_types = params.map{|p| { placeholder_for: p[:type] } }

		config_combinations.each do |config_comb|
			tests << {
				class: klass[:name],
				# params: param_types,
				config: Hash[ config_comb.map{|c| [ c[:name], c[:value] ] } ]
			}
		end
	end

	tests = tests.group_by{|t| t[:class] }

	puts JSON.pretty_generate tests
end
