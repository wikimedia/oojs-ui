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
	Tutorials.Toolbar.super.call( this, config );

	const urlPieces = window.location.pathname.split( 'demos/tutorials/' );
	this.baseUrl = urlPieces[ 0 ];

	this.links = new OO.ui.ButtonGroupWidget( {
		items: [
			new OO.ui.ButtonWidget( {
				label: 'Demos',
				classes: [ 'tutorials-toolbar-demos' ],
				icon: 'window',
				href: this.baseUrl + 'demos/index.html',
				flags: [ 'progressive' ]
			} ),
			new OO.ui.ButtonWidget( {
				label: 'Docs',
				classes: [ 'tutorials-toolbar-docs' ],
				icon: 'journal',
				href: this.baseUrl + 'js/',
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

	this.tutorialsDropdown.getMenu().items.forEach( ( item ) => {
		if ( location.pathname.includes( item.getData() ) ) {
			item.setSelected( true );
		}
	} );

	this.tutorialsDropdown.getMenu().connect( this, {
		choose: 'urlRedirection'
	} );
};

OO.inheritClass( Tutorials.Toolbar, OO.ui.Widget );

Tutorials.Toolbar.prototype.urlRedirection = function ( item ) {
	window.location = this.baseUrl + item.getData();
};
