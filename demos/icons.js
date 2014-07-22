OO.ui.demo.icons = function () {
	var i, len,
		icons = [
			'add-item',
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
			new OO.ui.ButtonWidget( {
				indicator: indicators[i],
				framed: false,
				label: indicators[i]
			} )
		] );
	}
	for ( i = 0, len = icons.length; i < len; i++ ) {
		iconsFieldset.addItems( [
			new OO.ui.ButtonWidget( {
				icon: icons[i],
				framed: false,
				label: icons[i]
			} )
		] );
	}

	$( '.oo-ui-demo' ).append( $( '<div class="oo-ui-demo-container oo-ui-demo-icons"></div>' ).append(
		indicatorsFieldset.$element,
		iconsFieldset.$element
	) );
};
