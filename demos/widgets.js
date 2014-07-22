OO.ui.demo.widgets = function () {
	var fieldset,
		$demo = $( '.oo-ui-demo' ),
		fieldLayouts = [
			new OO.ui.FieldLayout(
				new OO.ui.IconWidget( {
					icon: 'picture',
					title: 'Picture icon'
				} ),
				{
					label: 'IconWidget (normal)',
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
					label: 'IconWidget (disabled)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.IndicatorWidget( {
					indicator: 'required',
					title: 'Required icon'
				} ),
				{
					label: 'IndicatorWidget (normal)',
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
					label: 'IndicatorWidget (disabled)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( { label: 'Normal' } ),
				{
					label: 'ButtonWidget (normal)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Primary',
					flags: [ 'primary' ]
				} ),
				{
					label: 'ButtonWidget (primary)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Constructive',
					flags: [ 'constructive' ]
				} ),
				{
					label: 'ButtonWidget (constructive)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Destructive',
					flags: [ 'destructive' ]
				} ),
				{
					label: 'ButtonWidget (destructive)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Disabled',
					disabled: true
				} ),
				{
					label: 'ButtonWidget (disabled)',
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
					label: 'ButtonWidget (constructive, disabled)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Iconed',
					icon: 'picture'
				} ),
				{
					label: 'ButtonWidget (iconed)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					label: 'Indicated',
					indicator: 'down'
				} ),
				{
					label: 'ButtonWidget (indicated)',
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
					label: 'ButtonWidget (icon only)',
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
					label: 'ButtonWidget (frameless)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					framed: false,
					flags: [ 'primary' ],
					icon: 'picture',
					label: 'Primary'
				} ),
				{
					label: 'ButtonWidget (frameless, primary)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					framed: false,
					flags: [ 'destructive' ],
					icon: 'picture',
					label: 'Destructive'
				} ),
				{
					label: 'ButtonWidget (frameless, destructive)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					framed: false,
					flags: [ 'constructive' ],
					icon: 'picture',
					label: 'Constructive'
				} ),
				{
					label: 'ButtonWidget (frameless, constructive)',
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
					label: 'ButtonWidget (frameless, disabled)',
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
					label: 'ButtonWidget (frameless, constructive, disabled)',
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
					label: 'PopupButtonWidget (frameless, with popup head)',
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
					label: 'PopupButtonWidget (framed, no popup head)',
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
					label: 'ButtonSelectWidget (disabled)',
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
					label: 'ButtonSelectWidget (disabled items)',
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
					label: 'ToggleButtonWidget (initially active)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ToggleButtonWidget( { icon: 'next' } ),
				{
					label: 'ToggleButtonWidget (icon only)',
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
					label: 'ToggleSwitchWidget (disabled)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.ToggleSwitchWidget( { disabled: true, value: true } ),
				{
					label: 'ToggleSwitchWidget (disabled, checked)',
					align: 'top'
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
					label: 'CheckboxInputWidget (disabled)'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( { value: 'Text input' } ),
				{
					label: 'TextInputWidget',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( { placeholder: 'Placeholder' } ),
				{
					label: 'TextInputWidget (placeholder)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( {
					value: 'Readonly',
					readOnly: true
				} ),
				{
					label: 'TextInputWidget (readonly)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( {
					value: 'Disabled',
					disabled: true
				} ),
				{
					label: 'TextInputWidget (disabled)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.TextInputWidget( {
					multiline: true,
					value: 'Multiline'
				} ),
				{
					label: 'TextInputWidget (multiline)',
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
					label: 'TextInputWidget (autosize)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.InlineMenuWidget( {
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
							new OO.ui.MenuItemWidget( 'd', {
								label: 'Fourth'
							} )
						]
					}
				} ),
				{
					label: 'InlineMenuWidget',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.InlineMenuWidget( {
					label: 'Select one',
					menu: {
						items: [
							new OO.ui.MenuItemWidget( 'a', {
								label: 'First'
							} ),
							new OO.ui.MenuItemWidget( 'b', {
								label: 'Disabled',
								disabled: true
							} ),
							new OO.ui.MenuItemWidget( 'c', {
								label: 'Third'
							} ),
							new OO.ui.MenuItemWidget( 'd', {
								label: 'Disabled',
								disabled: true
							} )
						]
					}
				} ),
				{
					label: 'InlineMenuWidget (disabled options)',
					align: 'top'
				}
			),
			new OO.ui.FieldLayout(
				new OO.ui.InlineMenuWidget( {
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
					label: 'InlineMenuWidget (disabled)',
					align: 'top'
				}
			)
		];

	$.each( fieldLayouts, function ( i, fieldLayout ) {
		fieldLayout.$element.append(
			OO.ui.demo.buildConsole( fieldLayout.field, 'widget' )
		);
	} );

	fieldset = new OO.ui.FieldsetLayout( { label: 'Widgets' } );
	fieldset.addItems( fieldLayouts );
	$demo.append( $( '<div class="oo-ui-demo-container">' ).append( fieldset.$element ) );
};
