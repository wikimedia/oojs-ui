OO.ui.Demo.static.pages.widgets = function ( demo ) {
	var fieldset,
		$demo = demo.$element,
		fieldLayouts = [
			new OO.ui.FieldLayout(
				new OO.ui.IconWidget( {
					icon: 'picture',
					title: 'Picture icon'
				} ),
				{
					label: 'IconWidget (normal)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.IconWidget( {
					icon: 'picture',
					title: 'Picture icon',
					disabled: true
				} ),
				{
					label: 'IconWidget (disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.IndicatorWidget( {
					indicator: 'required',
					title: 'Required icon'
				} ),
				{
					label: 'IndicatorWidget (normal)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.IndicatorWidget( {
					indicator: 'required',
					title: 'Required icon',
					disabled: true
				} ),
				{
					label: 'IndicatorWidget (disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( { label: 'Normal' } ),
				{
					label: 'ButtonWidget (normal)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Primary',
					flags: [ 'primary' ]
				} ),
				{
					label: 'ButtonWidget (primary)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Constructive',
					flags: [ 'constructive' ]
				} ),
				{
					label: 'ButtonWidget (constructive)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Destructive',
					flags: [ 'destructive' ]
				} ),
				{
					label: 'ButtonWidget (destructive)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Disabled',
					disabled: true
				} ),
				{
					label: 'ButtonWidget (disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Constructive',
					flags: [ 'constructive' ],
					disabled: true
				} ),
				{
					label: 'ButtonWidget (constructive, disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Constructive',
					icon: 'picture',
					flags: [ 'constructive' ],
					disabled: true
				} ),
				{
					label: 'ButtonWidget (constructive, icon, disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Icon',
					icon: 'picture'
				} ),
				{
					label: 'ButtonWidget (icon)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Icon',
					icon: 'picture',
					flags: [ 'primary' ]
				} ),
				{
					label: 'ButtonWidget (icon, constructive)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Icon',
					indicator: 'down',
					flags: [ 'constructive' ]
				} ),
				{
					label: 'ButtonWidget (indicator, constructive)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Indicator',
					indicator: 'down'
				} ),
				{
					label: 'ButtonWidget (indicator)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					framed: false,
					icon: 'help',
					title: 'Icon only'
				} ),
				{
					label: 'ButtonWidget (icon only)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					framed: false,
					icon: 'picture',
					label: 'Labeled'
				} ),
				{
					label: 'ButtonWidget (frameless)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					framed: false,
					flags: [ 'primary' ],
					icon: 'check',
					label: 'Primary'
				} ),
				{
					label: 'ButtonWidget (frameless, primary)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					framed: false,
					flags: [ 'destructive' ],
					icon: 'remove',
					label: 'Destructive'
				} ),
				{
					label: 'ButtonWidget (frameless, destructive)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					framed: false,
					flags: [ 'constructive' ],
					icon: 'add',
					label: 'Constructive'
				} ),
				{
					label: 'ButtonWidget (frameless, constructive)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					framed: false,
					icon: 'picture',
					label: 'Disabled',
					disabled: true
				} ),
				{
					label: 'ButtonWidget (frameless, disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					framed: false,
					flags: [ 'constructive' ],
					icon: 'picture',
					label: 'Constructive',
					disabled: true
				} ),
				{
					label: 'ButtonWidget (frameless, constructive, disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.PopupButtonWidget( {
					icon: 'info',
					framed: false,
					popup: {
						head: true,
						label: 'More information',
						$content: $( '<p>Extra information here.</p>' ),
						padded: true,
						align: 'left'
					}
				} ),
				{
					label: 'PopupButtonWidget (frameless, with popup head)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.PopupButtonWidget( {
					icon: 'menu',
					label: 'Options',
					popup: {
						$content: $( '<p>Additional options here.</p>' ),
						padded: true,
						align: 'left'
					}
				} ),
				{
					label: 'PopupButtonWidget (framed, no popup head)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonGroupWidget( {
					items: [
						new OO.ui.ButtonWidget( { icon: 'picture', indicator: 'down' } ),
						new OO.ui.ToggleButtonWidget( {
							label: 'One',
							flags: [ 'primary' ]
						} ),
						new OO.ui.ToggleButtonWidget( {
							label: 'Two',
							flags: [ 'constructive' ]
						} ),
						new OO.ui.ToggleButtonWidget( {
							label: 'Three',
							flags: [ 'destructive' ]
						} )
					]
				} ),
				{
					label: 'ButtonGroupWidget',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonSelectWidget( {
					items: [
						new OO.ui.ButtonOptionWidget( 'a', {
							icon: 'picture', indicator: 'down'
						} ),
						new OO.ui.ButtonOptionWidget( 'b', {
							label: 'One',
							flags: [ 'primary' ]
						} ),
						new OO.ui.ButtonOptionWidget( 'c', {
							label: 'Two',
							flags: [ 'constructive' ]
						} ),
						new OO.ui.ButtonOptionWidget( 'd', {
							label: 'Three',
							flags: [ 'destructive' ]
						} )
					]
				} ),
				{
					label: 'ButtonSelectWidget',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonSelectWidget( {
					disabled: true,
					items: [
						new OO.ui.ButtonOptionWidget( 'a', {
							icon: 'picture', indicator: 'down'
						} ),
						new OO.ui.ButtonOptionWidget( 1, {
							label: 'One'
						} ),
						new OO.ui.ButtonOptionWidget( 2, {
							label: 'Two'
						} ),
						new OO.ui.ButtonOptionWidget( 3, {
							label: 'Three'
						} )
					]
				} ),
				{
					label: 'ButtonSelectWidget (disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonSelectWidget( {
					items: [
						new OO.ui.ButtonOptionWidget( 'a', {
							icon: 'picture', indicator: 'down'
						} ),
						new OO.ui.ButtonOptionWidget( 1, {
							label: 'One',
							disabled: true
						} ),
						new OO.ui.ButtonOptionWidget( 2, {
							label: 'Two'
						} ),
						new OO.ui.ButtonOptionWidget( 3, {
							label: 'Three',
							disabled: true
						} )
					]
				} ),
				{
					label: 'ButtonSelectWidget (disabled items)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ToggleButtonWidget( { label: 'Toggle' } ),
				{
					label: 'ToggleButtonWidget',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ToggleButtonWidget( { label: 'Toggle', value: true } ),
				{
					label: 'ToggleButtonWidget (initially active)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ToggleButtonWidget( { icon: 'next' } ),
				{
					label: 'ToggleButtonWidget (icon only)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ToggleSwitchWidget(),
				{
					label: 'ToggleSwitchWidget',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ToggleSwitchWidget( { disabled: true } ),
				{
					label: 'ToggleSwitchWidget (disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ToggleSwitchWidget( { disabled: true, value: true } ),
				{
					label: 'ToggleSwitchWidget (disabled, checked)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Button'
				} ),
				{
					label: 'FieldLayout with help',
					help: 'I am an additional, helpful information.\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonInputWidget( {
					label: 'Submit the form',
					type: 'submit'
				} ),
				{
					align: 'top',
					label: 'ButtonInputWidget (type: submit)'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonInputWidget( {
					label: 'Submit the form',
					type: 'submit',
					useInputTag: true
				} ),
				{
					align: 'top',
					label: 'ButtonInputWidget (type: submit, using <input/>)'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.CheckboxInputWidget( {
					value: true
				} ),
				{
					align: 'inline',
					label: 'CheckboxInputWidget'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.CheckboxInputWidget( {
					value: true,
					disabled: true
				} ),
				{
					align: 'inline',
					label: 'CheckboxInputWidget (disabled)\u200E'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.DropdownWidget( {
					label: 'Select one',
					align: 'top',
					menu: {
						items: [
							new OO.ui.MenuItemWidget( 'a', {
								label: 'First'
							} ),
							new OO.ui.MenuItemWidget( 'b', {
								label: 'Second'
							} ),
							new OO.ui.MenuItemWidget( 'c', {
								label: 'Third'
							} ),
							new OO.ui.MenuItemWidget( 'c', {
								label: 'The fourth option has a long label'
							} ),
							new OO.ui.MenuItemWidget( 'd', {
								label: 'Fifth'
							} )
						]
					}
				} ),
				{
					label: 'DropdownWidget',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.DropdownWidget( {
					label: 'Select one',
					menu: {
						items: [
							new OO.ui.MenuItemWidget( 'a', {
								label: 'First'
							} ),
							new OO.ui.MenuItemWidget( 'b', {
								label: 'Disabled second option',
								disabled: true
							} ),
							new OO.ui.MenuItemWidget( 'c', {
								label: 'Third'
							} ),
							new OO.ui.MenuItemWidget( 'd', {
								label: 'Disabled fourth option with long label',
								disabled: true
							} ),
							new OO.ui.MenuItemWidget( 'c', {
								label: 'Third'
							} )
						]
					}
				} ),
				{
					label: 'DropdownWidget (disabled options)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.DropdownWidget( {
					label: 'Select one',
					disabled: true,
					menu: {
						items: [
							new OO.ui.MenuItemWidget( 'a', {
								label: 'First'
							} ),
							new OO.ui.MenuItemWidget( 'b', {
								label: 'Second'
							} ),
							new OO.ui.MenuItemWidget( 'c', {
								label: 'Third'
							} ),
							new OO.ui.MenuItemWidget( 'd', {
								label: 'Fourth'
							} )
						]
					}
				} ),
				{
					label: 'DropdownWidget (disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ComboBoxWidget( {
					menu: {
						items: [
							new OO.ui.MenuItemWidget( 'asd', { label: 'Label for asd' } ),
							new OO.ui.MenuItemWidget( 'fgh', { label: 'Label for fgh' } ),
							new OO.ui.MenuItemWidget( 'jkl', { label: 'Label for jkl' } ),
							new OO.ui.MenuItemWidget( 'zxc', { label: 'Label for zxc' } ),
							new OO.ui.MenuItemWidget( 'vbn', { label: 'Label for vbn' } )
						]
					}
				} ),
				{
					label: 'ComboBoxWidget',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ComboBoxWidget( {
					disabled: true,
					menu: {
						items: [
							new OO.ui.MenuItemWidget( 'asd', { label: 'Label for asd' } ),
							new OO.ui.MenuItemWidget( 'fgh', { label: 'Label for fgh' } ),
							new OO.ui.MenuItemWidget( 'jkl', { label: 'Label for jkl' } ),
							new OO.ui.MenuItemWidget( 'zxc', { label: 'Label for zxc' } ),
							new OO.ui.MenuItemWidget( 'vbn', { label: 'Label for vbn' } )
						]
					}
				} ),
				{
					label: 'ComboBoxWidget (disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ComboBoxWidget(),
				{
					label: 'ComboBoxWidget (empty)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( { value: 'Text input' } ),
				{
					label: 'TextInputWidget\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( { icon: 'search' } ),
				{
					label: 'TextInputWidget (icon)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( { indicator: 'required' } ),
				{
					label: 'TextInputWidget (indicator)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( { placeholder: 'Placeholder' } ),
				{
					label: 'TextInputWidget (placeholder)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( {
					value: 'Readonly',
					readOnly: true
				} ),
				{
					label: 'TextInputWidget (readonly)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( {
					value: 'Disabled',
					disabled: true
				} ),
				{
					label: 'TextInputWidget (disabled)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( {
					multiline: true,
					value: 'Multiline'
				} ),
				{
					label: 'TextInputWidget (multiline)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( {
					multiline: true,
					autosize: true,
					value: 'Autosize'
				} ),
				{
					label: 'TextInputWidget (autosize)\u200E',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ProgressBarWidget( {
					progress: 33
				} ),
				{
					label: 'Progress bar',
					align: 'top'
				}
			)
		];

	$.each( fieldLayouts, function ( i, fieldLayout ) {
		fieldLayout.$element.append(
			demo.buildConsole( fieldLayout.fieldWidget, 'widget' )
		);
	} );

	fieldset = new OO.ui.FieldsetLayout( { label: 'Widgets' } );
	fieldset.addItems( fieldLayouts );
	$demo.append( $( '<div class="oo-ui-demo-container">' ).append( fieldset.$element ) );
};

OO.ui.Demo.static.defaultPage = 'widgets';
