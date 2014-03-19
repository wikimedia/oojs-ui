$( function () {
	var name, fieldset,
		$demo = $( '.oo-ui-demo' ),
		sections = {
			'Widgets': [
				new OO.ui.FieldLayout(
					new OO.ui.IconWidget( {
						'icon': 'picture',
						'title': 'Picture icon'
					} ),
					{ 'label': 'IconWidget (normal)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.IconWidget( {
						'icon': 'picture',
						'title': 'Picture icon',
						'disabled': true
					} ),
					{ 'label': 'IconWidget (disabled)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.IndicatorWidget( {
						'indicator': 'required',
						'title': 'Required icon'
					} ),
					{ 'label': 'IndicatorWidget (normal)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.IndicatorWidget( {
						'indicator': 'required',
						'title': 'Required icon',
						'disabled': true
					} ),
					{ 'label': 'IndicatorWidget (disabled)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( { 'label': 'Normal' } ),
					{ 'label': 'ButtonWidget (normal)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						'label': 'Primary',
						'flags': [ 'primary' ]
					} ),
					{ 'label': 'ButtonWidget (primary)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						'label': 'Constructive',
						'flags': [ 'constructive' ]
					} ),
					{ 'label': 'ButtonWidget (constructive)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						'label': 'Destructive',
						'flags': [ 'destructive' ]
					} ),
					{ 'label': 'ButtonWidget (destructive)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						'label': 'Disabled',
						'disabled': true
					} ),
					{ 'label': 'ButtonWidget (disabled)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						'label': 'Iconed',
						'icon': 'picture'
					} ),
					{ 'label': 'ButtonWidget (iconed)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						'label': 'Indicated',
						'indicator': 'down'
					} ),
					{ 'label': 'ButtonWidget (indicated)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						'frameless': true,
						'icon': 'help',
						'title': 'Icon only'
					} ),
					{ 'label': 'ButtonWidget (icon only)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						'frameless': true,
						'icon': 'alert',
						'label': 'Labeled'
					} ),
					{ 'label': 'ButtonWidget (frameless)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						'frameless': true,
						'icon': 'menu',
						'label': 'Disabled',
						'disabled': true
					} ),
					{ 'label': 'ButtonWidget (frameless, disabled)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonGroupWidget( {
						'items': [
							new OO.ui.ButtonWidget( { 'icon': 'check', 'indicator': 'down' } ),
							new OO.ui.ToggleButtonWidget( {
								'label': 'Primary',
								'flags': [ 'primary' ]
							} ),
							new OO.ui.ToggleButtonWidget( {
								'label': 'Constructive',
								'flags': [ 'constructive' ]
							} ),
							new OO.ui.ToggleButtonWidget( {
								'label': 'Destructive',
								'flags': [ 'destructive' ]
							} )
						]
					} ),
					{ 'label': 'ButtonGroupWidget' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonSelectWidget( {
						'items': [
							new OO.ui.ButtonOptionWidget( 'a',  {
								'icon': 'check', 'indicator': 'down'
							} ),
							new OO.ui.ButtonOptionWidget( 'b', {
								'label': 'Primary',
								'flags': [ 'primary' ]
							} ),
							new OO.ui.ButtonOptionWidget( 'c', {
								'label': 'Constructive',
								'flags': [ 'constructive' ]
							} ),
							new OO.ui.ButtonOptionWidget( 'd', {
								'label': 'Destructive',
								'flags': [ 'destructive' ]
							} )
						]
					} ),
					{ 'label': 'ButtonSelectWidget' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonSelectWidget( {
						'disabled': true,
						'items': [
							new OO.ui.ButtonOptionWidget( 1, {
								'label': 'Disabled',
							} ),
							new OO.ui.ButtonOptionWidget( 2, {
								'label': 'state',
							} ),
							new OO.ui.ButtonOptionWidget( 3, {
								'label': 'is',
							} ),
							new OO.ui.ButtonOptionWidget( 3, {
								'label': 'inherited',
							} )
						]
					} ),
					{ 'label': 'ButtonSelectWidget (disabled)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ButtonSelectWidget( {
						'items': [
							new OO.ui.ButtonOptionWidget( 1, {
								'label': 'Disabled',
								'disabled': true
							} ),
							new OO.ui.ButtonOptionWidget( 2, {
								'label': 'Enabled'
							} ),
							new OO.ui.ButtonOptionWidget( 3, {
								'label': 'Disabled',
								'disabled': true
							} ),
							new OO.ui.ButtonOptionWidget( 3, {
								'label': 'Enabled'
							} )
						]
					} ),
					{ 'label': 'ButtonSelectWidget (disabled items)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ToggleButtonWidget( { 'label': 'Toggle' } ),
					{ 'label': 'ToggleButtonWidget' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ToggleButtonWidget( { 'icon': 'next' } ),
					{ 'label': 'ToggleButtonWidget (icon only)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ToggleSwitchWidget(),
					{ 'label': 'ToggleSwitchWidget' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ToggleSwitchWidget( { 'disabled': true } ),
					{ 'label': 'ToggleSwitchWidget (disabled)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.ToggleSwitchWidget( { 'disabled': true, value: true } ),
					{ 'label': 'ToggleSwitchWidget (disabled, checked)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.CheckboxInputWidget( {
						'value': true
					} ),
					{
						'align': 'inline',
						'label': 'CheckboxInputWidget'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.CheckboxInputWidget( {
						'value': true,
						'disabled': true
					} ),
					{
						'align': 'inline',
						'label': 'CheckboxInputWidget (disabled)'
					}
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget( { 'value': 'Text input' } ),
					{ 'label': 'TextInputWidget' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget( { 'placeholder': 'Placeholder' } ),
					{ 'label': 'TextInputWidget (placeholder)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget( {
						'value': 'Readonly',
						'readOnly': true
					} ),
					{ 'label': 'TextInputWidget (readonly)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget( {
						'value': 'Disabled',
						'disabled': true
					} ),
					{ 'label': 'TextInputWidget (disabled)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget( {
						'multiline': true,
						'value': 'Multiline'
					} ),
					{ 'label': 'TextInputWidget (multiline)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.TextInputWidget( {
						'multiline': true,
						'autosize': true,
						'value': 'Autosize'
					} ),
					{ 'label': 'TextInputWidget (autosize)' }
				),
				new OO.ui.FieldLayout(
					new OO.ui.InlineMenuWidget( {
						'label': 'Select one',
						'menu': {
							'items': [
								new OO.ui.MenuItemWidget( 'a',  {
									'label': 'First'
								} ),
								new OO.ui.MenuItemWidget( 'b', {
									'label': 'Second'
								} ),
								new OO.ui.MenuItemWidget( 'c', {
									'label': 'Third'
								} ),
								new OO.ui.MenuItemWidget( 'd', {
									'label': 'Fourth'
								} )
							]
						}
					} ),
					{ 'label': 'InlineMenuWidget' }
				)
			]
		};

	for ( name in sections ) {
		fieldset = new OO.ui.FieldsetLayout( { 'label': name } );
		fieldset.addItems( sections[name] );
		// TODO: Update buildConsole to add consoles to fieldsets full of field layouts
		// OO.ui.demo.buildConsole( item );
		$demo.append( fieldset.$element );
	}
} );
