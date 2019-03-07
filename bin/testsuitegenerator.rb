require 'pp'
require_relative 'docparser'

def make_class_instance_placeholder klass, config
	'_placeholder_' + {
		class: klass,
		config: config
	}.to_json
end

def find_class classes, klass
	classes.find{|c| c[:name] == klass }
end

def expand_type_to_values classes, type
	# values to test for each type
	expandos = {
		'null' => [nil],
		'int' => [0, -1, 300], # PHP code
		'number' => [0, -1, 300], # JS code
		'bool' => [true, false], # PHP code
		'boolean' => [true, false], # JS code
		'string' => ['Foo bar <b>HTML?</b>', '', ' ', '0'],
		'HtmlSnippet' => ['Foo bar <b>HTML?</b>'].map{|v|
			make_class_instance_placeholder('HtmlSnippet', v)
		},
		'PanelLayout' => ['Foo bar <b>HTML?</b>', ''].map{|v|
			config = { content: [v] }
			make_class_instance_placeholder('PanelLayout', config)
		},
	}

	types = type.split '|'
	# For abstract classes (not "testable"), test a few different subclasses instead
	if types.delete 'Widget'
		types.push 'ButtonWidget', 'TextInputWidget'
	end
	if types.delete 'InputWidget'
		types.push 'CheckboxInputWidget', 'TextInputWidget'
	end

	types.map{|t|
		as_array = true if t.sub! '[]', ''
		if expandos[t]
			# Primitive. Run tests with the provided values.
			vals = expandos[t]
		elsif find_class(classes, t)
			# OOUI object. Test suite will instantiate one and run the test with it.
			constructor = find_class(classes, t)[:methods].find{|m| m[:name] == '#constructor' }
			params = constructor ? (constructor[:params] || []) : []
			config = params.map{|config_option|
				values = expand_type_to_values(classes, config_option[:type])
				{ config_option[:name] => values[0] }
			}
			vals = [
				make_class_instance_placeholder( t, config.inject({}, :merge) )
			]
		else
			# We don't know how to test this. The empty value will result in no
			# tests being generated for this combination of config values.
			vals = []
		end
		as_array ? vals.map{|v| [v] } : vals
	}.inject(:+)
end

def find_config_sources classes, klass_name
	return [] unless klass_name
	klass_names = [klass_name]
	while klass_name
		klass = find_class(classes, klass_name)
		break unless klass
		klass_names +=
			find_config_sources(classes, klass[:parent]) +
			klass[:mixins].map{|mixin_name| find_config_sources(classes, mixin_name) }.flatten
		klass_name = klass[:parent]
	end
	klass_names.uniq
end

if ARGV.empty? || ARGV == ['-h'] || ARGV == ['--help']
	$stderr.puts "usage: ruby #{$PROGRAM_NAME} <dirA> <dirB> -o <file>"
	$stderr.puts "       ruby #{$PROGRAM_NAME} src php -o tests/JSPHP-suite.json"
else
	if (i = ARGV.index('-o'))
		out = File.open(ARGV[i + 1], 'wb')
		ARGV[i..(i + 1)] = []
	else
		out = $stdout
	end

	dir_a, dir_b = ARGV
	js = parse_any_path dir_a
	php = parse_any_path dir_b

	class_names = (js + php).map{|c| c[:name] }.sort.uniq

	tests = {}
	classes = php.select{|c| class_names.include? c[:name] }

	# classes with different PHP and JS implementations.
	# we can still compare the PHP-infuse result to JS result, though.
	infuse_only_classes = %w[ComboBoxInputWidget
		RadioSelectInputWidget CheckboxMultiselectInputWidget NumberInputWidget SelectFileInputWidget]
	testable_classes = classes
		.reject{|c| c[:abstract] } # can't test abstract classes
		.reject{|c| !c[:parent] || c[:trait] || c[:parent] == 'Theme' } # can't test abstract
		.reject{|c| %w[Element Widget Layout Theme].include? c[:name] } # no toplevel

	simple_string = ['', 'Foo bar <b>HTML?</b>']

	# Values to test for specific config options, when not all values of given type are valid.
	# Empty array will result in no tests for this config option being generated.
	sensible_values = {
		'align' => %w[top inline left],
		# could also be 'auto', but this only sets an attribute
		'dir' => %w[ltr rtl],
		'href' => ['http://example.com/'],
		['TextInputWidget', 'type'] => %w[text number password foo],
		['ButtonInputWidget', 'type'] => %w[button submit foo],
		['NumberInputWidget', 'step'] => %w[1],
		['NumberInputWidget', 'buttonStep'] => %w[2],
		['NumberInputWidget', 'pageStep'] => %w[10],
		['NumberInputWidget', 'min'] => %w[1 3],
		['NumberInputWidget', 'max'] => %w[3 5],
		# this overrides 'string[]|HtmlSnippet[]' from the doc comment
		['FieldLayout', 'errors'] => expand_type_to_values([], 'string[]'),
		['FieldLayout', 'notices'] => expand_type_to_values([], 'string[]'),
		['FieldLayout', 'warnings'] => [],
		# it is sufficient to test FieldLayout only
		['ActionFieldLayout', 'errors'] => [],
		['ActionFieldLayout', 'notices'] => [],
		['ActionFieldLayout', 'warnings'] => [],
		'type' => %w[text button],
		'method' => %w[GET POST],
		'inputId' => ['input-id'],
		'target' => ['_blank'],
		'accessKey' => ['k'],
		'tabIndex' => [-1, 0, 100, '42'],
		'maxLength' => [100],
		'icon' => ['image'],
		'indicator' => ['down'],
		'flags' => %w[progressive primary],
		'progress' => [0, 50, 100, false],
		'options' => [
			[],
			[ { 'data' => 'a', 'label' => 'A' } ],
			[ { 'data' => 'a' }, { 'data' => 'b' } ],
			[ { 'data' => 'a', 'label' => 'A' }, { 'data' => 'b', 'label' => 'B' } ],
		],
		'value' => simple_string,
		'title' => simple_string,
		'help' => simple_string,
		'menuPosition' => %w[before after top bottom invalid],
		# usually makes no sense in JS
		'autofocus' => [],
		# too simple to test?
		'action' => [],
		'enctype' => [],
		'name' => [],
		# the dynamic 'clear' indicator in JS messes everything up
		['SearchInputWidget', 'value'] => [],
		['SearchInputWidget', 'indicator'] => [],
		['SearchInputWidget', 'required'] => [],
		['SearchInputWidget', 'disabled'] => [],
		# don't try to set value/label on file widgets
		['SelectFileInputWidget', 'value'] => [],
		['SelectFileInputWidget', 'label'] => [],
		['SelectFileInputWidget', 'thumbnailSizeLimit'] => [10],
		['SelectFileInputWidget', 'placeholder'] => ['placeholder text'],
		['SelectFileInputWidget', 'notsupported'] => ['notsupported text'],
		['SelectFileInputWidget', 'accept'] => [['image/png', 'image/jpeg']],
		# these are defined by Element and would bloat the tests
		'classes' => [],
		'id' => [],
		'content' => [],
		'text' => [],
		# test content on basic Panels
		# this overrides 'string[]|HtmlSnippet[]|Element[]' from the doc comment
		['PanelLayout', 'content'] => expand_type_to_values([], 'string[]'),
		# only used internally
		'preserveContent' => [],
		['TabPanelLayout', 'name'] => ['panelName'],
		# this overrides 'string|HtmlSnippet' from the doc comment
		# TODO: this looks incorrect, this option doesn't look like it takes arrays.
		['TabPanelLayout', 'label'] => expand_type_to_values([], 'string[]'),
		# IndexLayout overrides contentPanel to be a StackLayout which there
		# are current no test values for, so don't use the inherited type
		# of PanelLayout from MenuLayout.
		['IndexLayout', 'contentPanel'] => [],
		# menuPanel contains a TabSelectWidget so must use preserveContent
		['IndexLayout', 'menuPanel'] => [],
	}

	testable_classes.each do |klass|
		class_name = klass[:name]
		tests[class_name] = {
			infuseonly: !infuse_only_classes.index(class_name).nil?,
			tests: [],
		}

		config_sources = find_config_sources(classes, class_name)
			.map{|c| find_class(classes, c)[:methods].find{|m| m[:name] == '#constructor' } }
		config = config_sources.compact.map{|c| c[:config] }.compact.inject([], :+)
		constructor = klass[:methods].find{|m| m[:name] == '#constructor' }
		required_config = constructor ? (constructor[:params] || []) : []

		# generate every possible configuration of configuration option sets
		maxlength = [config.length, 2].min
		config_combinations = (0..maxlength).map{|l| config.combination(l).to_a }.inject(:+)
		# for each set, generate all possible values to use based on option's type
		config_combinations = config_combinations.map{|config_comb|
			config_comb += required_config
			expanded = config_comb.map{|config_option|
				values =
					sensible_values[ [ class_name, config_option[:name] ] ] ||
					sensible_values[ config_option[:name] ] ||
					expand_type_to_values(testable_classes, config_option[:type])
				values.map{|v| config_option.dup.merge(value: v) }
			}
			expanded.empty? ? [ [] ] : expanded[0].product(*expanded[1..-1])
		}.inject(:concat).uniq

		config_combinations.each do |config_comb|
			tests[class_name][:tests] << {
				class: class_name,
				config: Hash[ config_comb.map{|c| [ c[:name], c[:value] ] } ]
			}
		end
	end

	$stderr.puts "Generated #{tests.values.map{|a| a[:tests].length}.inject(:+)} test cases."

	$stderr.puts tests.map{|class_name, class_tests| "* #{class_name}: #{class_tests[:tests].length}" }
	out.puts JSON.pretty_generate tests
end
