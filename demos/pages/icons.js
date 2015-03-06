OO.ui.Demo.static.pages.icons = function ( demo ) {
	var i, len,
		icons = [
			'add',
			'advanced',
			'alert',
			'check',
			'clear',
			'close',
			'code',
			'collapse',
			'comment',
			'expand',
			'help',
			'info',
			'link',
			'lock',
			'menu',
			'next',
			'picture',
			'previous',
			'redo',
			'remove',
			'search',
			'settings',
			'tag',
			'undo',
			'window'
		],
		indicators = [
			'alert',
			'down',
			'next',
			'previous',
			'required',
			'up'
		],
		iconsFieldset = new OO.ui.FieldsetLayout( { label: 'Icons' } ),
		indicatorsFieldset = new OO.ui.FieldsetLayout( { label: 'Indicators' } );

	for ( i = 0, len = indicators.length; i < len; i++ ) {
		indicatorsFieldset.addItems( [
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					indicator: indicators[ i ],
					framed: false,
					label: indicators[ i ]
				} ),
				{ align: 'top' }
			)
		] );
	}
	for ( i = 0, len = icons.length; i < len; i++ ) {
		iconsFieldset.addItems( [
			new OO.ui.FieldLayout(
				new OO.ui.ButtonWidget( {
					icon: icons[ i ],
					framed: false,
					label: icons[ i ]
				} ),
				{ align: 'top' }
			)
		] );
	}

	demo.$element.append(
		new OO.ui.PanelLayout( {
			expanded: false,
			framed: true
		} ).$element
			.addClass( 'oo-ui-demo-container oo-ui-demo-icons' )
			.append(
				indicatorsFieldset.$element,
				iconsFieldset.$element
			) );
};
