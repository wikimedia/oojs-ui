// eslint-disable-next-line no-implicit-globals
var urlPieces, baseUrl;

window.Tutorials = {};
/**
 * @class
 * @extends OO.ui.Widget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
Tutorials.Toolbar = function ( config ) {
	config = config || {};
	Tutorials.Toolbar.parent.call( this, config );

	urlPieces = window.location.pathname.split( 'demos/tutorials/' );
	baseUrl = urlPieces[ 0 ];

	this.links = new OO.ui.ButtonGroupWidget( {
		items: [
			new OO.ui.ButtonWidget( {
				label: 'Demos',
				classes: [ 'tutorials-toolbar-demos' ],
				icon: 'window',
				href: baseUrl + 'demos/index.html',
				flags: [ 'progressive' ]
			} ),
			new OO.ui.ButtonWidget( {
				label: 'Docs',
				classes: [ 'tutorials-toolbar-docs' ],
				icon: 'journal',
				href: baseUrl + 'js/',
				flags: [ 'progressive' ]
			} )
		]
	} );

	this.tutorialsDropdown = new OO.ui.DropdownWidget( {
		indicator: 'down',
		label: 'Browse Tutorials...',
		menu: {
			items: [
				new OO.ui.MenuOptionWidget( {
					data: 'demos/tutorials/index.html',
					label: 'Tutorials Index',
					icon: 'article'
				} ),
				new OO.ui.MenuOptionWidget( {
					data: 'demos/tutorials/collection/basics1/contents.html',
					label: 'Basics: ToDo App - Part 1',
					icon: 'article'
				} ),
				new OO.ui.MenuOptionWidget( {
					data: 'demos/tutorials/collection/basics2/contents.html',
					label: 'Basics: ToDo App - Part 2',
					icon: 'article'
				} )
			]
		},
		classes: [ 'tutorials-toolbar-tutorials' ],
		icon: 'book',
		flags: [ 'progressive' ]
	} );

	this.$element
		.addClass( 'tutorials-toolbar' )
		.attr( 'role', 'navigation' )
		.append(
			this.tutorialsDropdown.$element,
			this.links.$element
		);

	this.tutorialsDropdown.getMenu().items.forEach( function ( item ) {
		if ( location.pathname.indexOf( item.getData() ) !== -1 ) {
			item.setSelected( true );
		}
	} );

	this.tutorialsDropdown.getMenu().on( 'choose', Tutorials.Toolbar.prototype.urlRedirection );
};

OO.inheritClass( Tutorials.Toolbar, OO.ui.Widget );

Tutorials.Toolbar.prototype.urlRedirection = function ( item ) {
	window.location = baseUrl + item.getData();
};
