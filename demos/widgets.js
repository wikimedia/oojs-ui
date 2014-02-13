$( function () {
	var i, name, len, item, items, fieldset,
		$demo = $( '.oo-ui-demo' ),
		sections = {
			'Widgets': [
				{
					'label': 'ButtonWidget',
					'widget': new OO.ui.ButtonWidget( { 'label': 'Normal' } )
				},
				{
					'widget': new OO.ui.ButtonWidget( {
						'label': 'Primary',
						'flags': [ 'primary' ]
					} )
				},
				{
					'widget': new OO.ui.ButtonWidget( {
						'label': 'Constructive',
						'flags': [ 'constructive' ]
					} )
				},
				{
					'widget': new OO.ui.ButtonWidget( {
						'label': 'Destructive',
						'flags': [ 'destructive' ]
					} )
				},
				{
					'widget': new OO.ui.ButtonWidget( {
						'label': 'Disabled',
						'disabled': true
					} )
				},
				{
					'widget': new OO.ui.ButtonWidget( {
						'label': 'Iconed',
						'icon': 'check'
					} )
				},
				{
					'widget': new OO.ui.ButtonWidget( {
						'label': 'Indicated',
						'indicator': 'down'
					} )
				},
				{
					'widget': new OO.ui.ButtonWidget( {
						'frameless': true,
						'icon': 'help',
						'title': 'Icon only'
					} )
				},
				{
					'widget': new OO.ui.ButtonWidget( {
						'frameless': true,
						'icon': 'alert',
						'label': 'Labeled'
					} )
				},
				{
					'widget': new OO.ui.ButtonWidget( {
						'frameless': true,
						'icon': 'menu',
						'label': 'Disabled',
						'disabled': true
					} )
				},
				{
					'label': 'ButtonGroupWidget',
					'widget': new OO.ui.ButtonGroupWidget(),
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
				},
				{
					'label': 'ButtonSelectWidget',
					'widget': new OO.ui.ButtonSelectWidget(),
					'items': [
						new OO.ui.ButtonOptionWidget( 'a',  { 'icon': 'check', 'indicator': 'down' } ),
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
				},
				{
					'widget': new OO.ui.ButtonSelectWidget( {
						'disabled': true
					} ),
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
				},
				{
					'widget': new OO.ui.ButtonSelectWidget(),
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
				},
				{
					'label': 'ToggleButtonWidget',
					'widget': new OO.ui.ToggleButtonWidget( { 'label': 'Toggle' } )
				},
				{
					'widget': new OO.ui.ToggleButtonWidget( {
						'icon': 'next'
					} )
				},
				{
					'label': 'ToggleSwitchWidget',
					'widget': new OO.ui.ToggleSwitchWidget()
				},
				{
					'widget': new OO.ui.ToggleSwitchWidget( {
						'offLabel': 'Disabled',
						'disabled': true
					} )
				},
				{
					'label': 'CheckboxInputWidget',
					'widget': new OO.ui.CheckboxInputWidget( {
						'value': true
					} )
				},
				{
					'label': 'CheckboxWidget',
					'widget': new OO.ui.CheckboxWidget( {
						'value': true,
						'label': 'Labeled'
					} )
				},
				{
					'widget': new OO.ui.CheckboxWidget( {
						'value': true,
						'label': 'Disabled',
						'disabled': true
					} )
				},
				{
					'label': 'TextInputWidget',
					'widget': new OO.ui.TextInputWidget( { 'value': 'Text input' } )
				},
				{
					'widget': new OO.ui.TextInputWidget( {
						'placeholder': 'Placeholder'
					} )
				},
				{
					'widget': new OO.ui.TextInputWidget( {
						'value': 'Readonly',
						'readOnly': true
					} )
				},
				{
					'widget': new OO.ui.TextInputWidget( {
						'value': 'Disabled',
						'disabled': true
					} )
				},
				{
					'widget': new OO.ui.TextInputWidget( {
						'multiline': true,
						'value': 'Multiline'
					} )
				}
			]
		};

	for ( name in sections ) {
		fieldset = new OO.ui.FieldsetLayout( { 'label': name } );
		items = sections[name];
		for ( i = 0, len = items.length; i < len; i++ ) {
			item = items[i];
			if ( item.items ) {
				item.widget.addItems( item.items );
			}
			fieldset.$element.append(
				$( '<div>' )
					.addClass( 'oo-ui-demo-item' )
					.append(
						$( '<div>' )
							.addClass( 'oo-ui-demo-item-label' )
							.text( item.label ),
						$( '<div>' )
							.addClass( 'oo-ui-demo-item-widget' )
							.append( item.widget.$element ),
						OO.ui.demo.buildConsole( item )
					)
			);
		}
		$demo.append( fieldset.$element );
	}
} );
