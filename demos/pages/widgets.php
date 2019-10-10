<?php
if ( !defined( 'OOUI_DEMOS' ) ) {
	header( 'Location: ../demos.php' );
	exit;
}

$loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, " .
	"sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\u{200E}";

$demoContainer = new OOUI\PanelLayout( [
	'expanded' => false,
	'padded' => true,
	'framed' => true,
] );

$demoContainer
	->addClasses( [ 'demo-container' ] )
	->setAttributes( [ 'role' => 'main' ] );

$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-buttons',
	'infusable' => true,
	'label' => 'Buttons',
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [ 'label' => 'Normal' ] ),
			[
				'label' => "ButtonWidget (normal)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Primary progressive',
				'flags' => [ 'primary', 'progressive' ]
			] ),
			[
				'label' => "ButtonWidget (primary, progressive)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Primary destructive',
				'flags' => [ 'primary', 'destructive' ]
			] ),
			[
				'label' => "ButtonWidget (primary, destructive)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Progressive',
				'flags' => [ 'progressive' ]
			] ),
			[
				'label' => "ButtonWidget (progressive)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Destructive',
				'flags' => [ 'destructive' ]
			] ),
			[
				'label' => "ButtonWidget (destructive)",
				'align' => 'top',
				'help' => 'Flagged (progressive or destructive) normal ButtonWidgets should ' .
					'only be used in contexts where two equally important primary actions ' .
					'are available.',
				'helpInline' => true,
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Disabled',
				'disabled' => true
			] ),
			[
				'label' => "ButtonWidget (disabled)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Progressive',
				'icon' => 'tag',
				'flags' => [ 'progressive' ],
				'disabled' => true
			] ),
			[
				'label' => "ButtonWidget (progressive, icon, disabled)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Icon',
				'icon' => 'tag'
			] ),
			[
				'label' => "ButtonWidget (icon)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Icon',
				'icon' => 'tag',
				'flags' => [ 'progressive' ]
			] ),
			[
				'label' => "ButtonWidget (icon, progressive)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Indicator',
				'indicator' => 'down'
			] ),
			[
				'label' => "ButtonWidget (indicator)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Indicator',
				'indicator' => 'down',
				'flags' => [ 'progressive' ]
			] ),
			[
				'label' => "ButtonWidget (indicator, progressive)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'framed' => false,
				'icon' => 'edit',
				'label' => 'Edit',
				'invisibleLabel' => true,
				'title' => 'Icon only'
			] ),
			[
				'label' => "ButtonWidget (frameless, icon only)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'framed' => false,
				'icon' => 'tag',
				'label' => 'Labeled'
			] ),
			[
				'label' => "ButtonWidget (frameless)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'framed' => false,
				'flags' => [ 'progressive' ],
				'icon' => 'check',
				'label' => 'Progressive'
			] ),
			[
				'label' => "ButtonWidget (frameless, progressive)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'framed' => false,
				'flags' => [ 'destructive' ],
				'icon' => 'trash',
				'label' => 'Destructive'
			] ),
			[
				'label' => "ButtonWidget (frameless, destructive)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'framed' => false,
				'flags' => [ 'destructive' ],
				'label' => 'Cancel'
			] ),
			[
				'label' => "ButtonWidget (frameless, label-only, destructive)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'framed' => false,
				'icon' => 'tag',
				'label' => 'Disabled',
				'disabled' => true
			] ),
			[
				'label' => "ButtonWidget (frameless, disabled)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonInputWidget( [
				'label' => 'Submit the form',
				'type' => 'submit',
				'flags' => [ 'primary', 'progressive' ],
				'useInputTag' => true
			] ),
			[
				'align' => 'top',
				'label' => "ButtonInputWidget (using <input>)"
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonInputWidget( [
				'label' => 'Another button',
				'type' => 'button'
			] ),
			[
				'align' => 'top',
				'label' => "ButtonInputWidget (using <button>)"
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonInputWidget( [
				'framed' => false,
				'label' => 'Another button',
				'type' => 'button'
			] ),
			[
				'align' => 'top',
				'label' => "ButtonInputWidget (frameless)"
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonInputWidget( [
				'framed' => false,
				'label' => 'Another button',
				'type' => 'button',
				'useInputTag' => true
			] ),
			[
				'align' => 'top',
				'label' => "ButtonInputWidget (frameless, using <input>)"
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Access key: G',
				'accessKey' => 'g'
			] ),
			[
				'label' => "ButtonWidget (with access key)",
				'align' => 'top',
				'help' => new OOUI\HtmlSnippet( 'Notice: Using access key might ' .
					'<a href="http://webaim.org/techniques/keyboard/accesskey" target="_blank"' .
					' rel="noopener">negatively impact screen readers</a>!' )
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonInputWidget( [
				'title' => 'Access key is added to the title.',
				'label' => 'Access key: H',
				'accessKey' => 'h'
			] ),
			[
				'label' => "ButtonInputWidget (with access key and title)",
				'align' => 'top',
			]
		)
	]
] ) );

$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-button-sets',
	'infusable' => true,
	'label' => 'Button sets',
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\ButtonGroupWidget( [
				'items' => [
					new OOUI\ButtonWidget( [
						'icon' => 'tag',
						'label' => 'One'
					] ),
					new OOUI\ButtonWidget( [
						'label' => 'Two'
					] ),
					new OOUI\ButtonWidget( [
						'indicator' => 'clear',
						'label' => 'Three'
					] )
				]
			] ),
			[
				'label' => 'ButtonGroupWidget',
				'align' => 'top'
			]
		)
	]
] ) );

$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-button-showcase',
	'infusable' => true,
	'label' => 'Button style showcase',
	'items' => [
		new OOUI\FieldLayout(
			new Demo\ButtonStyleShowcaseWidget(),
			[
				'align' => 'top',
			]
		)
	]
] ) );

$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-inputs',
	'infusable' => true,
	'label' => 'TextInput',
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget( [ 'value' => 'Text input' ] ),
			[
				'label' => "TextInputWidget",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget( [ 'icon' => 'globe' ] ),
			[
				'label' => "TextInputWidget (icon)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget( [
				'required' => true
			] ),
			[
				'label' => "TextInputWidget (required)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget( [ 'placeholder' => 'Placeholder' ] ),
			[
				'label' => "TextInputWidget (placeholder)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget( [
				'value' => 'Title attribute',
				'title' => 'Title attribute with more information about me.'
			] ),
			[
				'label' => "TextInputWidget (with title)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget( [
				'value' => 'Readonly',
				'readOnly' => true
			] ),
			[
				'label' => "TextInputWidget (readonly)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget( [
				'value' => 'Disabled',
				'disabled' => true
			] ),
			[
				'label' => "TextInputWidget (disabled)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget( [
				'value' => 'Access key: S',
				'accessKey' => 's'
			] ),
			[
				'label' => "TextInputWidget (with access key)",
				'align' => 'top',
				'help' => new OOUI\HtmlSnippet( 'Notice: Using access key might ' .
					'<a href="http://webaim.org/techniques/keyboard/accesskey" target="_blank"' .
					' rel="noopener">negatively impact screen readers</a>!' )
			]
		),
		new OOUI\FieldLayout(
			new OOUI\MultilineTextInputWidget( [
				'value' => "Multiline\nMultiline"
			] ),
			[
				'label' => "MultilineTextInputWidget",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\MultilineTextInputWidget( [
				'rows' => 15,
				'value' => "Multiline\nMultiline"
			] ),
			[
				'label' => "MultilineTextInputWidget (rows=15)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\MultilineTextInputWidget( [
				'value' => "Multiline\nMultiline",
				'icon' => 'tag',
				'indicator' => 'required'
			] ),
			[
				'label' => "MultilineTextInputWidget (icon, indicator)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\SearchInputWidget(),
			[
				'label' => "SearchInputWidget (type=search)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\NumberInputWidget(),
			[
				'label' => "NumberInputWidget",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\NumberInputWidget( [ 'disabled' => true ] ),
			[
				'label' => "NumberInputWidget (disabled)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\NumberInputWidget( [ 'min' => 0, 'max' => 5, 'step' => 1 ] ),
			[
				'label' => "NumberInputWidget (1-5, ints only)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\NumberInputWidget( [ 'min' => -1, 'max' => 1, 'step' => 0.1, 'pageStep' => 0.5 ] ),
			[
				'label' => "NumberInputWidget (-1–1, step by .1, page by .5)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\NumberInputWidget( [ 'showButtons' => false ] ),
			[
				'label' => "NumberInputWidget (no buttons)",
				'align' => 'top'
			]
		)
	]
] ) );

$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-inputs-binary',
	'infusable' => true,
	'label' => 'Checkbox & Radio',
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\CheckboxInputWidget( [
				'selected' => true
			] ),
			[
				'align' => 'inline',
				'label' => 'CheckboxInputWidget'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\CheckboxInputWidget( [
				'selected' => true,
				'disabled' => true
			] ),
			[
				'align' => 'inline',
				'label' => "CheckboxInputWidget (disabled)"
			]
		),
		new OOUI\FieldLayout(
			new OOUI\CheckboxInputWidget( [
				'selected' => true,
				'accessKey' => 't'
			] ),
			[
				'align' => 'inline',
				'label' => "CheckboxInputWidget (with access key T and title)",
				'title' => 'Access key is added to the title.',
			]
		),
		new OOUI\FieldLayout(
			new OOUI\CheckboxInputWidget( [
				'indeterminate' => true
			] ),
			[
				'align' => 'inline',
				'label' => 'CheckboxInputWidget (indeterminate) * requires infusion'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\CheckboxInputWidget( [
				'indeterminate' => true,
				'disabled' => true
			] ),
			[
				'align' => 'inline',
				'label' => 'CheckboxInputWidget (indeterminate, disabled) * requires infusion'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\RadioInputWidget( [
				'name' => 'oojs-ui-radio-demo'
			] ),
			[
				'align' => 'inline',
				'label' => 'Connected RadioInputWidget #1'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\RadioInputWidget( [
				'name' => 'oojs-ui-radio-demo',
				'selected' => true
			] ),
			[
				'align' => 'inline',
				'label' => 'Connected RadioInputWidget #2'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\RadioInputWidget( [
				'selected' => true,
				'disabled' => true
			] ),
			[
				'align' => 'inline',
				'label' => "RadioInputWidget (disabled)"
			]
		),
		new OOUI\FieldLayout(
			new OOUI\RadioSelectInputWidget( [
				'value' => 'dog',
				'options' => [
					[
						'data' => 'cat',
						'label' => 'Cat'
					],
					[
						'data' => 'dog',
						'label' => 'Dog'
					],
					[
						'data' => 'goldfish',
						'label' => 'Goldfish'
					],
				]
			] ),
			[
				'align' => 'top',
				'label' => 'RadioSelectInputWidget',
			]
		),
		new OOUI\FieldLayout(
			new OOUI\CheckboxMultiselectInputWidget( [
				'value' => [ 'dog', 'cat' ],
				'options' => [
					[
						'data' => 'cat',
						'label' => 'Cat'
					],
					[
						'data' => 'dog',
						'label' => "Dog (disabled)",
						'disabled' => true
					],
					[
						'data' => 'goldfish',
						'label' => 'Goldfish'
					],
				]
			] ),
			[
				'align' => 'top',
				'label' => 'CheckboxMultiselectInputWidget',
			]
		)
	]
] ) );

$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-dropdown',
	'infusable' => true,
	'label' => 'Dropdown',
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\DropdownInputWidget( [
				'options' => [
					[
						'data' => 'a',
						'label' => 'First'
					],
					[
						'data' => 'b',
						'label' => 'Second'
					],
					[
						'data' => 'c',
						'label' => 'Third'
					]
				],
				'value' => 'b'
			] ),
			[
				'label' => 'DropdownInputWidget',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\DropdownInputWidget( [
				'disabled' => true
			] ),
			[
				'label' => 'DropdownInputWidget (disabled)',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\DropdownInputWidget( [
				'options' => [
					[
						'optgroup' => 'Vowels'
					],
					[
						'data' => 'a',
						'label' => 'A'
					],
					[
						'optgroup' => 'Consonants'
					],
					[
						'data' => 'b',
						'label' => 'B'
					],
					[
						'data' => 'c',
						'label' => 'C'
					]
				],
				'value' => 'b'
			] ),
			[
				'label' => 'DropdownInputWidget (with optgroup)',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\DropdownInputWidget( [
				'options' => [
					[
						'data' => 'top',
						'label' => 'Top-level option'
					],
					[
						'optgroup' => 'Whole optgroup disabled',
						'disabled' => true
					],
					[
						'data' => 'a',
						'label' => 'A'
					],
					[
						'optgroup' => 'Optgroup with one disabled option'
					],
					[
						'data' => 'b',
						'label' => 'B'
					],
					[
						'data' => 'c',
						'label' => 'C',
						'disabled' => true
					],
					[
						'data' => 'd',
						'label' => 'D'
					]
				],
				'value' => 'b',
			] ),
			[
				'label' => "DropdownInputWidget (with disabled option and optgroup)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\DropdownInputWidget( [
				'options' => [
					[ 'data' => 'sq', 'label' => 'Albanian' ],
					[ 'data' => 'frp', 'label' => 'Arpitan' ],
					[ 'data' => 'ba', 'label' => 'Bashkir' ],
					[ 'data' => 'pt-br', 'label' => 'Brazilian Portuguese' ],
					[ 'data' => 'tzm', 'label' => 'Central Atlas Tamazight' ],
					[ 'data' => 'zh', 'label' => 'Chinese' ],
					[ 'data' => 'co', 'label' => 'Corsican' ],
					[ 'data' => 'del', 'label' => 'Delaware' ],
					[ 'data' => 'eml', 'label' => 'Emiliano-Romagnolo' ],
					[ 'data' => 'en', 'label' => 'English' ],
					[ 'data' => 'fi', 'label' => 'Finnish' ],
					[ 'data' => 'aln', 'label' => 'Gheg Albanian' ],
					[ 'data' => 'he', 'label' => 'Hebrew' ],
					[ 'data' => 'ilo', 'label' => 'Iloko' ],
					[ 'data' => 'kbd', 'label' => 'Kabardian' ],
					[ 'data' => 'csb', 'label' => 'Kashubian' ],
					[ 'data' => 'avk', 'label' => 'Kotava' ],
					[ 'data' => 'lez', 'label' => 'Lezghian' ],
					[ 'data' => 'nds-nl', 'label' => 'Low Saxon' ],
					[ 'data' => 'ml', 'label' => 'Malayalam' ],
					[ 'data' => 'dum', 'label' => 'Middle Dutch' ],
					[ 'data' => 'ary', 'label' => 'Moroccan Arabic' ],
					[ 'data' => 'pih', 'label' => 'Norfuk / Pitkern' ],
					[ 'data' => 'ny', 'label' => 'Nyanja' ],
					[ 'data' => 'ang', 'label' => 'Old English' ],
					[ 'data' => 'non', 'label' => 'Old Norse' ],
					[ 'data' => 'pau', 'label' => 'Palauan' ],
					[ 'data' => 'pdt', 'label' => 'Plautdietsch' ],
					[ 'data' => 'ru', 'label' => 'Russian' ],
					[ 'data' => 'stq', 'label' => 'Saterland Frisian' ],
					[ 'data' => 'ii', 'label' => 'Sichuan Yi' ],
					[ 'data' => 'bcc', 'label' => 'Southern Balochi' ],
					[ 'data' => 'shi', 'label' => 'Tachelhit' ],
					[ 'data' => 'th', 'label' => 'Thai' ],
					[ 'data' => 'tr', 'label' => 'Turkish' ],
					[ 'data' => 'fiu-vro', 'label' => 'Võro' ],
					[ 'data' => 'vls', 'label' => 'West Flemish' ],
					[ 'data' => 'zea', 'label' => 'Zeelandic' ],
				],
				'value' => 'en',
			] ),
			[
				'label' => "DropdownInputWidget (long)",
				'align' => 'top'
			]
		)
	]
] ) );

$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-comboBox',
	'infusable' => true,
	'label' => 'ComboBox',
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\ComboBoxInputWidget( [
				'options' => [
					[ 'data' => 'asd', 'label' => 'Label for asd' ],
					[ 'data' => 'fgh', 'label' => 'Label for fgh' ],
					[ 'data' => 'jkl', 'label' => 'Label for jkl' ],
					[ 'data' => 'zxc', 'label' => 'Label for zxc' ],
					[ 'data' => 'vbn', 'label' => 'Label for vbn' ],
				]
			] ),
			[
				'label' => 'ComboBoxInputWidget',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ComboBoxInputWidget( [
				'disabled' => true,
				'options' => [
					[ 'data' => 'asd', 'label' => 'Label for asd' ],
					[ 'data' => 'fgh', 'label' => 'Label for fgh' ],
					[ 'data' => 'jkl', 'label' => 'Label for jkl' ],
					[ 'data' => 'zxc', 'label' => 'Label for zxc' ],
					[ 'data' => 'vbn', 'label' => 'Label for vbn' ],
				]
			] ),
			[
				'label' => "ComboBoxInputWidget (disabled)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ComboBoxInputWidget(),
			[
				'label' => "ComboBoxInputWidget (empty)",
				'align' => 'top'
			]
		)
	]
] ) );

$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-selectFile',
	'infusable' => true,
	'label' => 'SelectFile',
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\SelectFileInputWidget( [] ),
			[
				'label' => 'SelectFileInputWidget',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\SelectFileInputWidget( [ 'multiple' => true ] ),
			[
				'label' => 'SelectFileInputWidget (multiple)',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\SelectFileInputWidget( [
				'button' => [
					'flags' => [ 'primary', 'progressive' ],
					'icon' => 'upload',
					'label' => 'Custom button'
				]
			] ),
			[
				'label' => 'SelectFileInputWidget (custom button)',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\SelectFileInputWidget( [
				'accept' => [ 'image/png', 'image/jpeg' ],
				'title' => 'This SelectFileInputWidget accepts only PNG `image/png`' .
					' and JPEG `image/jpeg` files and has `title` configured'
			] ),
			[
				'label' => 'SelectFileInputWidget (accept PNG and JPEG)',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\SelectFileInputWidget( [
				'icon' => 'tag',
			] ),
			[
				'label' => 'SelectFileInputWidget (icon)',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\SelectFileInputWidget( [
				'icon' => 'tag',
				'indicator' => 'required',
				'disabled' => true
			] ),
			[
				'label' => 'SelectFileInputWidget (disabled)',
				'align' => 'top'
			]
		),
	]
] ) );

$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-tabs',
	'infusable' => true,
	'label' => 'Tabs',
	'help' => new \OOUI\HtmlSnippet(
		'Use <a href="' . '?' . http_build_query( array_merge( $query, [ 'page' => 'layouts' ] ) ) .
		'#demo-section-other-layouts">IndexLayout</a> ' .
		'if you want to use a TabSelectWidget to switch between content.'
	),
	'helpInline' => true,
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\TabSelectWidget( [
				'items' => [
					new OOUI\TabOptionWidget( [
						'label' => 'Tab 1',
						'selected' => true,
					] ),
					new OOUI\TabOptionWidget( [
						'label' => 'Tab 2'
					] )
				]
			] ),
			[
				'label' => 'TabSelectWidget (framed)',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TabSelectWidget( [
				'framed' => false,
				'items' => [
					new OOUI\TabOptionWidget( [
						'label' => 'Tab 1',
						'selected' => true,
					] ),
					new OOUI\TabOptionWidget( [
						'label' => 'Tab 2'
					] )
				]
			] ),
			[
				'label' => 'TabSelectWidget (frameless)',
				'align' => 'top'
			]
		),
	]
] ) );

$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-progressBar',
	'infusable' => true,
	'label' => 'Progress bar',
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\ProgressBarWidget( [
				'progress' => 33
			] ),
			[
				'label' => 'Progress bar',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ProgressBarWidget( [
				'disabled' => true,
				'progress' => 50
			] ),
			[
				'label' => 'Progress bar (disabled)',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ProgressBarWidget( [
				'progress' => false
			] ),
			[
				'label' => 'Progress bar (indeterminate)',
				'align' => 'top'
			]
		),
	]
] ) );

$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-others',
	'infusable' => true,
	'label' => 'Other widgets',
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\IconWidget( [
				'icon' => 'search',
				'label' => 'Search',
				'invisibleLabel' => true,
				'title' => 'Search icon'
			] ),
			[
				'label' => "IconWidget (normal)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\IconWidget( [
				'icon' => 'trash',
				'label' => 'Trash',
				'invisibleLabel' => true,
				'title' => 'Trash icon',
				'flags' => 'destructive',
			] ),
			[
				'label' => "IconWidget (flagged)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\IconWidget( [
				'icon' => 'search',
				'label' => 'Search',
				'invisibleLabel' => true,
				'title' => 'Search icon',
				'disabled' => true
			] ),
			[
				'label' => "IconWidget (disabled)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\IndicatorWidget( [
				'indicator' => 'required',
				'label' => 'Required',
				'invisibleLabel' => true,
				'title' => 'Required indicator'
			] ),
			[
				'label' => "IndicatorWidget (normal)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\IndicatorWidget( [
				'indicator' => 'required',
				'label' => 'Required',
				'invisibleLabel' => true,
				'title' => 'Required indicator',
				'disabled' => true
			] ),
			[
				'label' => "IndicatorWidget (disabled)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\LabelWidget( [
				'label' => 'Label'
			] ),
			[
				'label' => "LabelWidget (normal)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\LabelWidget( [
				'label' => 'Label',
				'disabled' => true,
			] ),
			[
				'label' => "LabelWidget (disabled)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\LabelWidget( [
				'label' => new OOUI\HtmlSnippet( '<b>Fancy</b> <i>text</i> <u>formatting</u>!' ),
			] ),
			[
				'label' => "LabelWidget (with HTML)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\MessageWidget( [
				'type' => 'notice',
				'label' => new OOUI\HtmlSnippet( '<strong>MessageWidget with notice for the ' .
					'user.</strong><br>Featuring multiple lines of notice.' )
			] ),
			[
				'label' => "MessageWidget (type => 'notice')",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\MessageWidget( [
				'type' => 'notice',
				'inline' => true,
				'label' => 'Inlined MessageWidget with notice for the user.'
			] ),
			[
				'label' => "MessageWidget (type => 'notice', inline)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\MessageWidget( [
				'type' => 'error',
				'label' => 'MessageWidget with comprehensive error message for the user.'
			] ),
			[
				'label' => "MessageWidget (type => 'error')",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\MessageWidget( [
				'type' => 'error',
				'inline' => true,
				'label' => 'Inline MessageWidget with error message for the user.'
			] ),
			[
				'label' => "MessageWidget (type => 'error', inline)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\MessageWidget( [
				'type' => 'warning',
				'label' => 'MessageWidget with warning message for the user.'
			] ),
			[
				'label' => "MessageWidget (type => 'warning')",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\MessageWidget( [
				'type' => 'warning',
				'inline' => true,
				'label' => 'Inline MessageWidget with warning message for the user.'
			] ),
			[
				'label' => "MessageWidget (type => 'warning', inline)",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\MessageWidget( [
				'type' => 'success',
				'label' => 'MessageWidget with engaging success message for the user.'
			] ),
			[
				'label' => "MessageWidget (type => 'success')",
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\MessageWidget( [
				'type' => 'success',
				'inline' => true,
				'label' => 'Inline MessageWidget with engaging success message for the user.'
			] ),
			[
				'label' => "MessageWidget (type => 'success', inline)",
				'align' => 'top'
			]
		),
	]
] ) );

echo $demoContainer;
