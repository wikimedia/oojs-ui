OO.ui.Demo.static.pages.icons = function ( demo ) {
	var i, len, iconSet, iconsFieldset,
		icons = {
			core: [
				'add',
				'advanced',
				'alert',
				'check',
				'circle',
				'clear',
				'close',
				'code',
				'collapse',
				'comment',
				'ellipsis',
				'expand',
				'help',
				'info',
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
			movement: [
				'arrowLast',
				'arrowNext',
				'downTriangle',
				'upTriangle',
				'caretLast',
				'caretNext',
				'caretDown',
				'caretUp',
				'move'
			],
			content: [
				'article',
				'articleCheck',
				'articleSearch',
				'citeArticle',
				'book',
				'journal',
				'newspaper',
				'folderPlaceholder',
				'die',
				'download',
				'upload'
			],
			alerts: [
				'bell',
				'bellOn',
				'eye',
				'eyeClosed',
				'message',
				'signature',
				'speechBubble',
				'speechBubbleAdd',
				'speechBubbles'
			],
			interactions: [
				'beta',
				'betaLaunch',
				'bookmark',
				'browser',
				'clock',
				'closeInput',
				'funnel',
				'heart',
				'key',
				'keyboard',
				'logOut',
				'magnifyingGlass',
				'newWindow',
				'printer',
				'ribbonPrize',
				'sun',
				'watchlist'
			],
			moderation: [
				'block',
				'blockUndo',
				'flag',
				'flagUndo',
				'lock',
				'star',
				'trash',
				'trashUndo',
				'unStar',
				'unLock'
			],
			'editing-core': [
				'edit',
				'editLock',
				'editUndo',
				'link'
			],
			'editing-styling': [
				'bigger',
				'smaller',
				'subscript',
				'superscript'
			],
			'editing-list': [
				'indent',
				'listBullet',
				'listNumbered',
				'outdent'
			],
			'editing-advanced': [
				'newline',
				'noWikiText',
				'puzzle',
				'quotes',
				'quotesAdd',
				'redirect',
				'table',
				'templateAdd',
				'translation',
				'wikiText'
			],
			media: [
				'image',
				'imageAdd',
				'imageLock',
				'photoGallery',
				'play',
				'stop'
			],
			location: [
				'map',
				'mapPin',
				'mapPinAdd',
				'wikitrail'
			],
			user: [
				'userActive',
				'userAvatar',
				'userInactive',
				'userTalk'
			],
			layout: [
				'stripeFlow',
				'stripeSideMenu',
				'stripeSummary',
				'stripeToC'
			],
			wikimedia: [
				'logoCC',
				'logoWikimediaCommons',
				'logoWikipedia'
			]
		},
		indicators = [
			'alert',
			'down',
			'next',
			'previous',
			'required',
			'up'
		],
		iconsFieldsets = [],
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
	for ( iconSet in icons ) {
		iconsFieldset = new OO.ui.FieldsetLayout( { label: 'Icons – ' + iconSet } );
		iconsFieldsets.push( iconsFieldset );

		for ( i = 0, len = icons[ iconSet ].length; i < len; i++ ) {
			iconsFieldset.addItems( [
				new OO.ui.FieldLayout(
					new OO.ui.ButtonWidget( {
						icon: icons[ iconSet ][ i ],
						framed: false,
						label: icons[ iconSet ][ i ]
					} ),
					{ align: 'top' }
				)
			] );
		}
	}

	demo.$element.append(
		new OO.ui.PanelLayout( {
			expanded: false,
			framed: true
		} ).$element
			.addClass( 'oo-ui-demo-container oo-ui-demo-icons' )
			.append(
				indicatorsFieldset.$element,
				iconsFieldsets.map( function ( item ) { return item.$element[0]; } )
			) );
};
