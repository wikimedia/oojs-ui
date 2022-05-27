Demo.static.pages.icons = function ( demo ) {
	var imageList = Demo.static.imageLists[ demo.mode.theme ];

	var iconOrder = [
		'movement',
		'content',
		'alerts',
		'interactions',
		'moderation',
		'editing-core',
		'editing-styling',
		'editing-list',
		'editing-advanced',
		'editing-citation',
		'media',
		'location',
		'user',
		'layout',
		'accessibility',
		'wikimedia'
	];

	var iconsFieldsets,
		iconsWidgets = [],
		indicatorsFieldset = new Demo.LinkedFieldsetLayout( {
			label: 'Indicators',
			id: 'demo-section-indicators'
		} );

	Object.keys( imageList.indicators ).forEach( function ( indicator ) {
		indicatorsFieldset.addItems( [
			new OO.ui.FieldLayout(
				new OO.ui.IndicatorWidget( {
					indicator: indicator,
					title: indicator
				} ),
				{
					align: 'inline',
					label: indicator
				}
			)
		] );
	} );
	iconsFieldsets = iconOrder.map( function ( name ) {
		var iconsFieldset = new Demo.LinkedFieldsetLayout( {
			label: 'Icons – ' + name,
			id: 'demo-section-' + name
		} );

		var icons = imageList[ 'icons-' + name ];
		Object.keys( icons ).forEach( function ( icon ) {
			var deprecationMessage = icons[ icon ].deprecated;
			var iconWidget = new OO.ui.IconWidget( {
				icon: icon,
				disabled: !!deprecationMessage,
				title: deprecationMessage || icon
			} );
			iconsWidgets.push( iconWidget );
			iconsFieldset.addItems( [
				new OO.ui.FieldLayout( iconWidget, {
					label: icon,
					align: 'inline'
				} )
			] );
			if ( icons[ icon ].file.lang ) {
				Object.keys( icons[ icon ].file.lang ).forEach( function ( lang ) {
					var langs = lang.split( ',' );
					var langList = langs.join( ', ' );
					var title = icon + ' (' + langList + ')';
					var $label = $( '<span>' ).text( icon + ' ' ).append(
						$( '<small>' ).text( '(' + langList + ')' )
					);
					var iconWidgetLang = new OO.ui.IconWidget( {
						icon: icon,
						title: title
					} );
					iconWidgetLang.$element.attr( 'lang', langs[ 0 ] );
					iconsWidgets.push( iconWidgetLang );
					iconsFieldset.addItems( [
						new OO.ui.FieldLayout( iconWidgetLang, {
							label: $label,
							align: 'inline'
						} )
					] );
				} );
			}
		} );

		return iconsFieldset;
	} );

	var selector = new OO.ui.ButtonSelectWidget( {
		items: [
			new OO.ui.ButtonOptionWidget( {
				label: 'None',
				flags: [],
				data: {
					progressive: false,
					destructive: false
				}
			} ),
			new OO.ui.ButtonOptionWidget( {
				label: 'Progressive',
				flags: [ 'progressive' ],
				data: {
					progressive: true,
					destructive: false
				}
			} ),
			new OO.ui.ButtonOptionWidget( {
				label: 'Destructive',
				flags: [ 'destructive' ],
				data: {
					progressive: false,
					destructive: true
				}
			} )
		]
	} );

	selector
		.on( 'select', function ( selected ) {
			iconsWidgets.forEach( function ( iconWidget ) {
				iconWidget.setFlags( selected.getData() );
			} );
		} )
		.selectItemByData( {
			progressive: false,
			destructive: false
		} );

	demo.$container.append(
		new OO.ui.PanelLayout( {
			expanded: false,
			framed: true
		} ).$element
			.addClass( 'demo-icons' )
			.attr( {
				// 'default' is not a real language, but forces us to render
				// non-language specific icons, e.g. bold-a.svg
				lang: 'default'
			} )
			.append(
				selector.$element,
				iconsFieldsets.map( function ( item ) { return item.$element[ 0 ]; } ),
				indicatorsFieldset.$element
			)
	);
};
