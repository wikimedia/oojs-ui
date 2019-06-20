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
	'id' => 'demo-section-fieldLayouts',
	'infusable' => true,
	'label' => 'Field layouts',
	'help' => 'Fieldset help',
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'FieldLayout with help',
				'help' => $loremIpsum,
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'FieldLayout with inlined help',
				'help' => 'This is some inlined help. Assistive (optional) text, that isn\'t needed to '
					. 'understand the widget\'s purpose.',
				'helpInline' => true,
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'FieldLayout with rich text help',
				'help' => new OOUI\HtmlSnippet( '<b>Bold text</b> is helpful!' ),
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'FieldLayout with inlined rich text help',
				'help' => new OOUI\HtmlSnippet( '<b>Strong text</b> is helpful! It should only contain '
					. 'assistive (optional) text.' ),
				'helpInline' => true,
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'FieldLayout with title',
				'title' => 'Field title text',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => new OOUI\HtmlSnippet( '<i>FieldLayout with rich text label</i>' ),
				'align' => 'top'
			]
		),
		new OOUI\ActionFieldLayout(
			new OOUI\TextInputWidget(),
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'ActionFieldLayout aligned top',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget(),
			[
				'label' => 'FieldLayout aligned top with help',
				'help' => $loremIpsum,
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget(),
			[
				'label' => 'FieldLayout aligned top with inlined help',
				'help' => 'This is some inlined help. Assistive (optional) text, that isn\'t needed to '
					. 'understand the widget\'s purpose.',
				'helpInline' => true,
				'align' => 'top'
			]
		),
		new OOUI\ActionFieldLayout(
			new OOUI\TextInputWidget(),
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'ActionFieldLayout aligned top with help',
				'help' => $loremIpsum,
				'align' => 'top'
			]
		),
		new OOUI\ActionFieldLayout(
			new OOUI\CheckboxInputWidget( [ 'selected' => true ] ),
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'ActionFieldLayout aligned inline',
				'align' => 'inline'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\CheckboxInputWidget( [ 'selected' => true ] ),
			[
				'label' => 'FieldLayout aligned inline with help',
				'help' => $loremIpsum,
				'align' => 'inline'
			]
		),
		new OOUI\ActionFieldLayout(
			new OOUI\CheckboxInputWidget( [ 'selected' => true ] ),
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'ActionFieldLayout aligned inline with help',
				'help' => $loremIpsum,
				'align' => 'inline'
			]
		),
		new OOUI\ActionFieldLayout(
			new OOUI\TextInputWidget(),
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'ActionFieldLayout aligned left',
				'align' => 'left'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget(),
			[
				'label' => 'FieldLayout aligned left with help',
				'help' => $loremIpsum,
				'align' => 'left'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget(),
			[
				'label' => 'FieldLayout aligned left with help',
				'help' => 'This is some inlined help',
				'helpInline' => true,
				'align' => 'left'
			]
		),
		new OOUI\ActionFieldLayout(
			new OOUI\TextInputWidget(),
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'ActionFieldLayout aligned left with help',
				'help' => $loremIpsum,
				'align' => 'left'
			]
		),
		new OOUI\ActionFieldLayout(
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
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'ActionFieldLayout aligned left, DropdownInputWidget with help',
				'help' => 'This is some inlined help',
				'helpInline' => true,
				'align' => 'left'
			]
		),
		new OOUI\ActionFieldLayout(
			new OOUI\TextInputWidget(),
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'ActionFieldLayout aligned right',
				'align' => 'right'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget(),
			[
				'label' => 'FieldLayout aligned right with help',
				'help' => $loremIpsum,
				'align' => 'right'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget(),
			[
				'label' => 'FieldLayout aligned right with inlined help',
				'help' => 'This is some inlined help',
				'helpInline' => true,
				'align' => 'right'
			]
		),
		new OOUI\ActionFieldLayout(
			new OOUI\TextInputWidget(),
			new OOUI\ButtonWidget( [
				'label' => 'Button'
			] ),
			[
				'label' => 'ActionFieldLayout aligned right with help',
				'help' => $loremIpsum,
				'align' => 'right'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget(),
			[
				'label' => 'FieldLayout aligned top with a very long label. ' . $loremIpsum,
				'help' => $loremIpsum,
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\CheckboxInputWidget( [ 'selected' => true ] ),
			[
				'label' => 'FieldLayout aligned inline with a very long label. ' . $loremIpsum,
				'help' => $loremIpsum,
				'align' => 'inline'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget(),
			[
				'label' => 'FieldLayout aligned left with a very long label. ' . $loremIpsum,
				'help' => $loremIpsum,
				'align' => 'left'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget(),
			[
				'label' => 'FieldLayout aligned right with a very long label. ' . $loremIpsum,
				'help' => $loremIpsum,
				'align' => 'right'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget(),
			[
				'label' => 'FieldLayout aligned right with a very long label and inline help. ' . $loremIpsum,
				'help' => 'This is some inlined help',
				'helpInline' => true,
				'align' => 'right'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget( [
				'value' => ''
			] ),
			[
				'label' => 'FieldLayout with notice',
				'notices' => [ 'Please input a number.' ],
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget( [
				'value' => 'Foo'
			] ),
			[
				'label' => 'FieldLayout with error message',
				'errors' => [
					'The value must be a number. It is more than necessary. ' .
					'You can\'t go on without putting a number into this input field.'
				],
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\TextInputWidget( [
				'value' => 'Foo'
			] ),
			[
				'label' => 'FieldLayout with error, warning, success and notice message',
				'errors' => [ 'The value must be a number.' ],
				'warnings' => [ 'The value should be a number.' ],
				'successMessages' => [ 'The value is a number. Congratulations!' ],
				'notices' => [ 'Please input a number.' ],
				'align' => 'top'
			]
		)
	]
] ) );

// We can't make the outer FieldsetLayout infusable, because the Widget in its FieldLayout
// is added with 'content', which is not preserved after infusion. But we need the Widget
// to wrap the HorizontalLayout. Need to think about this at some point.
$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-horizontalLayout',
	'infusable' => false,
	'label' => 'HorizontalLayout',
	'help' => 'Inline FieldsetLayout help',
	'helpInline' => true,
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\Widget( [
				'content' => new OOUI\HorizontalLayout( [
					'infusable' => true,
					'items' => [
						new OOUI\ButtonWidget( [ 'label' => 'Button' ] ),
						new OOUI\ButtonGroupWidget( [ 'items' => [
							new OOUI\ButtonWidget( [ 'label' => 'A' ] ),
							new OOUI\ButtonWidget( [ 'label' => 'B' ] )
						] ] ),
						new OOUI\ButtonInputWidget( [ 'label' => 'ButtonInput' ] ),
						new OOUI\TextInputWidget( [ 'value' => 'TextInput' ] ),
						new OOUI\DropdownInputWidget( [ 'options' => [
							[
								'label' => 'DropdownInput',
								'data' => null
							]
						] ] ),
						new OOUI\CheckboxInputWidget( [ 'selected' => true ] ),
						new OOUI\RadioInputWidget( [ 'selected' => true ] ),
						new OOUI\LabelWidget( [ 'label' => 'Label' ] )
					],
				] ),
			] ),
			[
				'label' => 'Multiple widgets shown as a single line, ' .
					'as used in compact forms or in parts of a bigger widget.',
				'align' => 'top'
			]
		),
	],
] ) );

$indexLayouts = [];
for ( $i = 0; $i < 2; $i++ ) {
	$indexLayout = new OOUI\IndexLayout( [
		'infusable' => true,
		'expanded' => false,
		'framed' => $i === 0,
	] );
	$indexLayout->addTabPanels( [
		new OOUI\TabPanelLayout( [
			'name' => 'panel1',
			'label' => 'Panel 1',
			'content' => new OOUI\HtmlSnippet( 'Panel <b>1</b> <i>content</i>' ),
			'expanded' => false,
		] ),
		new OOUI\TabPanelLayout( [
			'name' => 'panel2',
			'label' => 'Panel 2',
			'content' => new OOUI\HtmlSnippet( 'Panel <b>2</b> <i>content</i>' ),
			'expanded' => false,
		] )
	] );
	$indexLayouts[] = $indexLayout;
}
$demoContainer->appendContent( new Demo\LinkedFieldsetLayout( [
	'id' => 'demo-section-other-layouts',
	'infusable' => false,
	'label' => 'Other layouts',
	'items' => [
		new OOUI\FieldLayout(
			new OOUI\Widget( [
				'content' => $indexLayouts[ 0 ],
			] ),
			[
				'label' => 'IndexLayout (framed)',
				'align' => 'top'
			]
		),
		new OOUI\FieldLayout(
			new OOUI\Widget( [
				'content' => $indexLayouts[ 1 ],
			] ),
			[
				'label' => 'IndexLayout (frameless)',
				'align' => 'top'
			]
		),
	],
] ) );

$demoContainer->appendContent( new OOUI\FormLayout( [
	'infusable' => true,
	'method' => 'GET',
	'action' => 'demos.php',
	'items' => [
		new Demo\LinkedFieldsetLayout( [
			'id' => 'demo-section-formLayout',
			'label' => 'Form layout',
			'items' => [
				new OOUI\FieldLayout(
					new OOUI\TextInputWidget( [
						'name' => 'username',
					] ),
					[
						'label' => 'User name',
						'align' => 'top',
					]
				),
				new OOUI\FieldLayout(
					new OOUI\TextInputWidget( [
						'name' => 'password',
						'type' => 'password',
					] ),
					[
						'label' => 'Password',
						'align' => 'top',
					]
				),
				new OOUI\FieldLayout(
					new OOUI\CheckboxInputWidget( [
						'name' => 'rememberme',
						'selected' => true,
					] ),
					[
						'label' => 'Remember me',
						'align' => 'inline',
					]
				),
				new OOUI\FieldLayout(
					new OOUI\HiddenInputWidget( [
						'name' => 'hidden',
						'value' => 'hidden value',
					] )
				),
				new OOUI\FieldLayout(
					new OOUI\ButtonInputWidget( [
						'type' => 'submit',
						'label' => 'Submit form',
					] )
				),
			]
		] ),
		new OOUI\FieldsetLayout( [
			'label' => null,
			'items' => [
				new OOUI\FieldLayout(
					new OOUI\TextInputWidget( [
						'name' => 'summary',
					] ),
					[
						'label' => 'Summary',
						'align' => 'top',
					]
				),
				new OOUI\FieldLayout(
					new OOUI\Widget( [
						'content' => new OOUI\HorizontalLayout( [
							'items' => [
								new OOUI\ButtonInputWidget( [
									'name' => 'login',
									'label' => 'Log in',
									'type' => 'submit',
									'flags' => [ 'primary', 'progressive' ],
									'icon' => 'userAvatar',
								] ),
								new OOUI\ButtonInputWidget( [
									'framed' => false,
									'flags' => [ 'destructive' ],
									'label' => 'Cancel',
									'classes' => [ 'demo-summary-buttonElement' ],
								] ),
								new OOUI\ButtonInputWidget( [
									'framed' => false,
									'icon' => 'tag',
									'label' => 'Random icon button',
								] ),
								new OOUI\ButtonInputWidget( [
									'framed' => false,
									'icon' => 'helpNotice',
									'label' => 'Help',
									'invisibleLabel' => true,
									'title' => 'Icon only'
								] ),
							]
						] ),
					] ),
					[
						'label' => null,
						'align' => 'top',
					]
				),
			]
		] ),
	]
] ) );

echo $demoContainer;
