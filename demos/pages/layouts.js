Demo.static.pages.layouts = function ( demo ) {
	// Unicode LTR marker `\u200E` is added for loremIpsum text in RTL demo, as it's not translated
	var fieldsets,
		loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, ' +
			'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\u200E',
		inputForValidation, fieldLayoutForValidation,
		$overlay = $( '<div>' ).addClass( 'demo-overlay' ).attr( 'id', 'demo-overlay' ),
		$demo = demo.$element;

	inputForValidation = new OO.ui.TextInputWidget( {
		validate: function ( value ) {
			return value.length % 2 === 0;
		}
	} );

	fieldLayoutForValidation = new OO.ui.FieldLayout( inputForValidation, {
		align: 'top',
		label: 'FieldLayout aligned top with validation errors',
		help: 'Enter only even number of characters'
	} );

	inputForValidation.$input.on( 'blur', function () {
		inputForValidation.getValidity().then( function () {
			fieldLayoutForValidation.setErrors( [] );
		}, function () {
			fieldLayoutForValidation.setErrors( [
				'Please enter an even number of characters'
			] );
		} );
	} );

	fieldsets = [
		new Demo.LinkedFieldsetLayout( {
			id: 'demo-section-fieldLayouts',
			label: 'Field layouts',
			help: 'Fieldset help',
			items: [
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'FieldLayout with help',
						help: loremIpsum,
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'FieldLayout with inlined help',
						help: 'This is some inlined help. Assistive (optional) text, that isn\'t needed to understand the widget\'s purpose.',
						helpInline: true,
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'FieldLayout with rich text help',
						help: new OO.ui.HtmlSnippet( '<b>Bold text</b> is helpful!' ),
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'FieldLayout with inlined rich text help',
						help: new OO.ui.HtmlSnippet( '<b>Strong text</b> is helpful! It should only contain assistive (optional) text.' ),
						helpInline: true,
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'FieldLayout with title',
						title: 'Field title text',
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: $( '<i>' ).text( 'FieldLayout with rich text label' ),
						align: 'top'
					}
				),
				new OO.ui.ActionFieldLayout(
					new OO.ui.TextInputWidget(),
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'ActionFieldLayout aligned top',
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget(),
					{
						label: 'FieldLayout aligned top with help',
						help: loremIpsum,
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget(),
					{
						label: 'FieldLayout aligned top with inlined help',
						help: 'This is some inlined help. Assistive (optional) text, that isn\'t needed to understand the widget\'s purpose.',
						helpInline: true,
						align: 'top'
					}
				),
				new OO.ui.ActionFieldLayout(
					new OO.ui.TextInputWidget(),
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'ActionFieldLayout aligned top with help',
						help: loremIpsum,
						align: 'top'
					}
				),
				new OO.ui.ActionFieldLayout(
					new OO.ui.CheckboxInputWidget( { selected: true } ),
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'ActionFieldLayout aligned inline',
						align: 'inline'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.CheckboxInputWidget( { selected: true } ),
					{
						label: 'FieldLayout aligned inline with help',
						help: loremIpsum,
						align: 'inline'
					}
				),
				new OO.ui.ActionFieldLayout(
					new OO.ui.CheckboxInputWidget( { selected: true } ),
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'ActionFieldLayout aligned inline with help',
						help: loremIpsum,
						align: 'inline'
					}
				),
				new OO.ui.ActionFieldLayout(
					new OO.ui.TextInputWidget(),
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'ActionFieldLayout aligned left',
						align: 'left'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget(),
					{
						label: 'FieldLayout aligned left with help',
						help: loremIpsum,
						align: 'left'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget(),
					{
						label: 'FieldLayout aligned left, inlined help',
						help: 'This is some inlined help',
						helpInline: true,
						align: 'left'
					}
				),
				new OO.ui.ActionFieldLayout(
					new OO.ui.TextInputWidget(),
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'ActionFieldLayout aligned left with help',
						help: loremIpsum,
						align: 'left'
					}
				),
				new OO.ui.ActionFieldLayout(
					new OO.ui.DropdownWidget( {
						label: 'Select one',
						options: [
							{
								data: 'a',
								label: 'First'
							},
							{
								data: 'b',
								label: 'Second'
							},
							{
								data: 'c',
								label: 'Third'
							}
						],
						value: 'b'
					} ),
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'ActionFieldLayout aligned left, DropdownWidget',
						help: 'This is some inlined help',
						helpInline: true,
						align: 'left'
					}
				),
				new OO.ui.ActionFieldLayout(
					new OO.ui.TextInputWidget(),
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'ActionFieldLayout aligned right',
						align: 'right'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget(),
					{
						label: 'FieldLayout aligned right with help',
						help: loremIpsum,
						align: 'right'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget(),
					{
						label: 'FieldLayout aligned right, inlined help',
						help: 'This is some inlined help',
						helpInline: true,
						align: 'right'
					}
				),
				new OO.ui.ActionFieldLayout(
					new OO.ui.TextInputWidget(),
					new OO.ui.ButtonWidget( {
						label: 'Button'
					} ),
					{
						label: 'ActionFieldLayout aligned right with help',
						help: loremIpsum,
						align: 'right'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget(),
					{
						label: 'FieldLayout aligned top with a very long label. ' + loremIpsum,
						help: loremIpsum,
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.CheckboxInputWidget( { selected: true } ),
					{
						label: 'FieldLayout aligned inline with a very long label. ' + loremIpsum,
						help: loremIpsum,
						align: 'inline'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget(),
					{
						label: 'FieldLayout aligned left with a very long label. ' + loremIpsum,
						help: loremIpsum,
						align: 'left'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget(),
					{
						label: 'FieldLayout aligned right with a very long label. ' + loremIpsum,
						help: loremIpsum,
						align: 'right'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget(),
					{
						label: 'FieldLayout aligned right with a very long label and inline help. ' + loremIpsum,
						help: 'This is some inlined help',
						helpInline: true,
						align: 'right'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget( {
						value: ''
					} ),
					{
						label: 'FieldLayout with notice',
						notices: [ 'Please input a number.' ],
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget( {
						value: 'Foo'
					} ),
					{
						label: 'FieldLayout with error message',
						errors: [ 'The value must be a number. It is more than necessary. You can\'t go on without putting a number into this input field.' ],
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget( {
						value: 'Foo'
					} ),
					{
						label: 'FieldLayout with error, warning, success and notice message',
						errors: [ 'The value must be a number.' ],
						warnings: [ 'The value should be a number.' ],
						successMessages: [ 'The value is a number. Congratulations!' ],
						notices: [ 'Please input a number.' ],
						align: 'top'
					}
				),
				fieldLayoutForValidation
			]
		} ),
		new Demo.LinkedFieldsetLayout( {
			id: 'demo-section-horizontalLayout',
			label: 'HorizontalLayout',
			help: 'Inline FieldsetLayout help',
			helpInline: true,
			items: [
				new OO.ui.FieldLayout(
					new OO.ui.Widget( {
						content: [ new OO.ui.HorizontalLayout( {
							items: [
								new OO.ui.ButtonWidget( { label: 'Button' } ),
								new OO.ui.ButtonGroupWidget( { items: [
									new OO.ui.ToggleButtonWidget( { label: 'A' } ),
									new OO.ui.ToggleButtonWidget( { label: 'B' } )
								] } ),
								new OO.ui.ButtonInputWidget( { label: 'ButtonInput' } ),
								new OO.ui.TextInputWidget( { value: 'TextInput' } ),
								new OO.ui.DropdownInputWidget( { options: [
									{
										label: 'DropdownInput',
										data: null
									}
								] } ),
								new OO.ui.CheckboxInputWidget( { selected: true } ),
								new OO.ui.RadioInputWidget( { selected: true } ),
								new OO.ui.LabelWidget( { label: 'Label' } )
							]
						} ) ]
					} ),
					{
						label: 'Multiple widgets shown as a single line, ' +
							'as used in compact forms or in parts of a bigger widget.',
						align: 'top'
					}
				)
			]
		} ),
		new Demo.LinkedFieldsetLayout( {
			id: 'demo-section-other-layouts',
			label: 'Other layouts',
			items: [
				new OO.ui.FieldLayout(
					new OO.ui.Widget( {
						content: [
							new OO.ui.PanelLayout( {
								expanded: false,
								framed: true,
								content: [
									new OO.ui.BookletLayout( {
										expanded: false,
										outlined: true
									} ).addPages( [
										new Demo.SamplePage( 'first', {
											expanded: false,
											label: 'One'
										} ),
										new Demo.SamplePage( 'second', {
											expanded: false,
											label: 'Two'
										} ),
										new Demo.SamplePage( 'third', {
											expanded: false,
											label: 'Three'
										} ),
										new Demo.SamplePage( 'fourth', {
											expanded: false,
											label: 'Four'
										} ),
										new Demo.SamplePage( 'long', {
											expanded: false,
											label: 'Long',
											content: [
												$( '<p>' ).text( loremIpsum ),
												$( '<p>' ).text( loremIpsum ),
												$( '<p>' ).text( loremIpsum ),
												$( '<p>' ).text( loremIpsum ),
												$( '<p>' ).text( loremIpsum ),
												$( '<p>' ).text( loremIpsum ),
												$( '<p>' ).text( loremIpsum )
											]
										} )
									] )
								]
							} )
						]
					} ),
					{
						label: 'Outlined BookletLayout',
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.Widget( {
						content: [
							new OO.ui.PanelLayout( {
								expanded: false,
								framed: true,
								content: [
									new OO.ui.IndexLayout( {
										expanded: false
									} ).addTabPanels( [
										new Demo.SampleTabPanel( 'first', {
											expanded: false,
											label: 'One tab'
										} ),
										new Demo.SampleTabPanel( 'second', {
											expanded: false,
											label: 'Two tab'
										} ),
										new Demo.SampleTabPanel( 'third', {
											expanded: false,
											label: 'Three tab'
										} ),
										new Demo.SampleTabPanel( 'fourth', {
											expanded: false,
											label: 'Four tab'
										} ),
										new Demo.SampleTabPanel( 'long', {
											expanded: false,
											label: 'Long tab',
											content: [
												$( '<p>' ).text( loremIpsum ),
												$( '<p>' ).text( loremIpsum ),
												$( '<p>' ).text( loremIpsum )
											]
										} )
									] )
								]
							} )
						]
					} ),
					{
						label: 'IndexLayout (framed)',
						align: 'top'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.Widget( {
						content: [
							new OO.ui.PanelLayout( {
								expanded: false,
								framed: false,
								content: [
									new OO.ui.IndexLayout( {
										expanded: false,
										framed: false
									} ).addTabPanels( [
										new Demo.SampleTabPanel( 'first', {
											expanded: false,
											label: 'One tab'
										} ),
										new Demo.SampleTabPanel( 'second', {
											expanded: false,
											label: 'Two tab'
										} ),
										new Demo.SampleTabPanel( 'third', {
											expanded: false,
											label: 'Three tab'
										} ),
										new Demo.SampleTabPanel( 'fourth', {
											expanded: false,
											label: 'Four tab'
										} ),
										new Demo.SampleTabPanel( 'long', {
											expanded: false,
											label: 'Long tab',
											content: [
												$( '<p>' ).text( loremIpsum ),
												$( '<p>' ).text( loremIpsum ),
												$( '<p>' ).text( loremIpsum )
											]
										} )
									] )
								]
							} )
						]
					} ),
					{
						label: 'IndexLayout (frameless)',
						align: 'top'
					}
				)
			]
		} ),
		new OO.ui.FormLayout( {
			method: 'GET',
			action: 'demos.php',
			items: [
				new Demo.LinkedFieldsetLayout( {
					id: 'demo-section-formLayout',
					label: 'Form layout (compounded example)',
					items: [
						new OO.ui.FieldLayout(
							new OO.ui.TextInputWidget( {
								name: 'username'
							} ),
							{
								label: 'User name',
								align: 'top'
							}
						),
						new OO.ui.FieldLayout(
							new OO.ui.TextInputWidget( {
								name: 'password',
								type: 'password'
							} ),
							{
								label: 'Password',
								align: 'top'
							}
						),
						new OO.ui.FieldLayout(
							new OO.ui.ButtonSelectWidget( {
								items: [
									new OO.ui.ButtonOptionWidget( {
										label: 'One'
									} ),
									new OO.ui.ButtonOptionWidget( {
										label: 'Two'
									} ),
									new OO.ui.ButtonOptionWidget( {
										indicator: 'clear',
										label: 'Three'
									} )
								]
							} ),
							{
								label: 'Select one of multiple ButtonSelectWidget Buttons',
								align: 'top'
							}
						),
						new OO.ui.FieldLayout(
							new OO.ui.SelectFileWidget( {} ),
							{
								label: 'Select a file with SelectFileWidget',
								align: 'top'
							}
						),
						new OO.ui.FieldLayout(
							new OO.ui.MenuTagMultiselectWidget( {
								menu: {
									items: [
										new OO.ui.MenuOptionWidget( { data: 'abc', label: 'Abc Label' } ),
										new OO.ui.MenuOptionWidget( { data: 'def', label: 'Def Label' } ),
										new OO.ui.MenuOptionWidget( { data: 'ghi', label: 'Ghi Label' } )
									]
								},
								selected: [
									{ data: 'abc', label: 'Abc Label' },
									{ data: 'def', label: 'Def Label' }
								]
							} ),
							{
								label: 'Select from multiple TagMultiselectWidget items',
								align: 'top'
							}
						),
						new OO.ui.FieldLayout(
							new OO.ui.RadioSelectWidget( {
								items: [
									new OO.ui.RadioOptionWidget( {
										data: 'mouse',
										label: 'Mouse'
									} ),
									new OO.ui.RadioOptionWidget( {
										data: 'elephant',
										label: 'Elephant'
									} )
								]
							} ),
							{
								align: 'top',
								label: 'Toggle the RadioSelectWidget'
							}
						),
						new OO.ui.FieldLayout(
							new OO.ui.ToggleSwitchWidget( { value: true } ),
							{
								label: 'Switch the ToggleSwitchWidget (checked)',
								align: 'right'
							}
						),
						new OO.ui.FieldLayout(
							new OO.ui.CheckboxInputWidget( {
								name: 'rememberme',
								selected: true
							} ),
							{
								label: 'Remember me',
								align: 'inline'
							}
						),
						new OO.ui.FieldLayout(
							new OO.ui.HiddenInputWidget( {
								name: 'hidden',
								value: 'hidden value'
							} )
						),
						new OO.ui.FieldLayout(
							new OO.ui.ButtonInputWidget( {
								type: 'submit',
								label: 'Submit form'
							} )
						)
					]
				} ),
				new OO.ui.FieldsetLayout( {
					label: null,
					items: [
						new OO.ui.FieldLayout(
							new OO.ui.TextInputWidget(),
							{
								label: 'Summary',
								align: 'top'
							}
						),
						new OO.ui.FieldLayout(
							new OO.ui.Widget( {
								content: [ new OO.ui.HorizontalLayout( {
									items: [
										new OO.ui.ButtonInputWidget( {
											name: 'login',
											label: 'Log in',
											type: 'submit',
											flags: [ 'primary', 'progressive' ],
											icon: 'userAvatar'
										} ),
										new OO.ui.ButtonWidget( {
											framed: false,
											flags: [ 'destructive' ],
											label: 'Cancel',
											classes: [ 'demo-summary-buttonElement' ]
										} ),
										new OO.ui.ButtonWidget( {
											framed: false,
											icon: 'tag',
											label: 'Random icon button'
										} ),
										new OO.ui.ButtonWidget( {
											framed: false,
											icon: 'helpNotice',
											label: 'Help',
											invisibleLabel: true,
											title: 'Icon only'
										} )
									]
								} ) ]
							} ),
							{
								label: null,
								align: 'top'
							}
						)
					]
				} )
			]
		} )
	];

	fieldsets.forEach( function ( fieldsetLayout ) {
		fieldsetLayout.getItems().forEach( function ( fieldLayout ) {
			fieldLayout.$element.append(
				demo.buildLinkExample( fieldLayout ),
				demo.buildConsole( fieldLayout, 'layout', 'widget', true )
			);
		} );
	} );

	$demo.append(
		new OO.ui.PanelLayout( {
			expanded: false,
			framed: true
		} ).$element
			.addClass( 'demo-container' )
			.attr( 'role', 'main' )
			.append(
				$( fieldsets.map( function ( fieldset ) { return fieldset.$element[ 0 ]; } ) )
			)
	);

	$overlay.appendTo( 'body' );

	demo.once( 'destroy', function () {
		// We are removing all of the widgets from the page, so also remove their "detached"
		// menus and stuff, otherwise they can remain visible forever.
		$overlay.remove();
		// Check if getDefaultOverlay was used
		if ( OO.ui.$defaultOverlay ) {
			OO.ui.$defaultOverlay.empty();
		}
	} );
};
