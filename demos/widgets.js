$( function () {
	var i, j, name, iLen, jLen, item, items, fieldset,
		$demo = $( '.oo-ui-demo' ),
		sections = {
			'Widgets': [
				{
					'label': 'PushButtonWidget',
					'widget': new OO.ui.PushButtonWidget( { 'label': 'Normal' } ),
				},
				{
					'widget': new OO.ui.PushButtonWidget( {
						'label': 'Primary',
						'flags': [ 'primary' ]
					} ),
				},
				{
					'widget': new OO.ui.PushButtonWidget( {
						'label': 'Constructive',
						'flags': [ 'constructive' ]
					} ),
				},
				{
					'widget': new OO.ui.PushButtonWidget( {
						'label': 'Destructive',
						'flags': [ 'destructive' ]
					} ),
				},
				{
					'widget': new OO.ui.PushButtonWidget( {
						'label': 'Disabled',
						'disabled': true
					} ),
				},
				{
					'label': 'IconButtonWidget',
					'widget': new OO.ui.IconButtonWidget( {
						'icon': 'help',
						'title': 'Icon only'
					} )
				},
				{
					'widget': new OO.ui.IconButtonWidget( {
						'icon': 'alert',
						'label': 'Labeled'
					} )
				},
				{
					'widget': new OO.ui.IconButtonWidget( {
						'icon': 'menu',
						'label': 'Disabled',
						'disabled': true
					} )
				},
				{
					'label': 'ToggleButtonWidget',
					'widget': new OO.ui.ToggleButtonWidget( { 'label': 'Toggle' } ),
				},
				{
					'label': 'ButtonGroupWidget',
					'widget': new OO.ui.ButtonGroupWidget(),
					'content': [
						new OO.ui.ToggleButtonWidget( { 'label': 'Normal' } ),
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
					'label': 'ToggleSwitchWidget',
					'widget': new OO.ui.ToggleSwitchWidget()
				},
				{
					'widget': new OO.ui.ToggleSwitchWidget( {
						'onLabel': 'Any',
						'offLabel': 'Label',
					} )
				},
				{
					'widget': new OO.ui.ToggleSwitchWidget( { 'disabled': true } )
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
		for ( i = 0, iLen = items.length; i < iLen; i++ ) {
			item = items[i];
			if ( item.content ) {
				for ( j = 0, jLen = item.content.length; j < jLen; j++ ) {
					item.widget.$element.append( item.content[j].$element );
				}
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
							.append( item.widget.$element )
					)
			);
		}
		$demo.append( fieldset.$element );
	}
} );
