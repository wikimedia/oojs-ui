/**
 * Layout containing a series of pages.
 *
 * @class
 * @extends OO.ui.Layout
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [continuous=false] Show all pages, one after another
 * @cfg {boolean} [autoFocus=false] Focus on the first focusable element when changing to a page
 * @cfg {boolean} [outlined=false] Show an outline
 * @cfg {boolean} [editable=false] Show controls for adding, removing and reordering pages
 * @cfg {Object[]} [adders List of adders for controls, each with name, icon and title properties
 */
OO.ui.BookletLayout = function OoUiBookletLayout( config ) {
	// Initialize configuration
	config = config || {};

	// Parent constructor
	OO.ui.Layout.call( this, config );

	// Properties
	this.currentPageName = null;
	this.pages = {};
	this.scrolling = false;
	this.selecting = false;
	this.stackLayout = new OO.ui.StackLayout( { '$': this.$, 'continuous': !!config.continuous } );
	this.scrollingTimeout = null;
	this.onStackLayoutDebouncedScrollHandler =
		OO.ui.bind( this.onStackLayoutDebouncedScroll, this );
	this.autoFocus = !!config.autoFocus;
	this.outlined = !!config.outlined;
	if ( this.outlined ) {
		this.editable = !!config.editable;
		this.adders = config.adders || null;
		this.outlineControlsWidget = null;
		this.outlineWidget = new OO.ui.OutlineWidget( { '$': this.$ } );
		this.outlinePanel = new OO.ui.PanelLayout( { '$': this.$, 'scrollable': true } );
		this.gridLayout = new OO.ui.GridLayout(
			[this.outlinePanel, this.stackLayout], { '$': this.$, 'widths': [1, 2] }
		);
		if ( this.editable ) {
			this.outlineControlsWidget = new OO.ui.OutlineControlsWidget(
				this.outlineWidget, { '$': this.$, 'adders': this.adders }
			);
		}
	}

	// Events
	this.stackLayout.connect( this, { 'set': 'onStackLayoutSet' } );
	if ( this.outlined ) {
		this.outlineWidget.connect( this, { 'select': 'onOutlineWidgetSelect' } );
		this.stackLayout.$element.on( 'scroll', OO.ui.bind( this.onStackLayoutScroll, this ) );
	}

	// Initialization
	this.$element.addClass( 'oo-ui-bookletLayout' );
	this.stackLayout.$element.addClass( 'oo-ui-bookletLayout-stackLayout' );
	if ( this.outlined ) {
		this.outlinePanel.$element
			.addClass( 'oo-ui-bookletLayout-outlinePanel' )
			.append( this.outlineWidget.$element );
		if ( this.editable ) {
			this.outlinePanel.$element
				.addClass( 'oo-ui-bookletLayout-outlinePanel-editable' )
				.append( this.outlineControlsWidget.$element );
		}
		this.$element.append( this.gridLayout.$element );
	} else {
		this.$element.append( this.stackLayout.$element );
	}
};

/* Inheritance */

OO.inheritClass( OO.ui.BookletLayout, OO.ui.Layout );

/* Events */

/**
 * @event add
 * @param {string} name The name of the page added.
 * @param {OO.ui.PageLayout} page The page panel.
 */

/**
 * @event remove
 * @param {OO.ui.PageLayout[]} pages An array of page panels that were removed.
 */

/**
 * @event set
 * @param {OO.ui.PageLayout} page The page panel that is now the current page.
 */

/* Methods */

/**
 * Handle stack layout scroll events.
 *
 * @method
 * @param {jQuery.Event} e Scroll event
 */
OO.ui.BookletLayout.prototype.onStackLayoutScroll = function () {
	if ( !this.selecting ) {
		this.scrolling = true;
		if ( !this.scrollingTimeout ) {
			this.scrollingTimeout = setTimeout( this.onStackLayoutDebouncedScrollHandler, 100 );
		}
	}
};

OO.ui.BookletLayout.prototype.onStackLayoutDebouncedScroll = function () {
	var i, len, name, top, height, $item, visible,
		items = this.stackLayout.getItems(),
		middle = this.stackLayout.$element.height() / 2;

	for ( i = 0, len = items.length; i < len; i++ ) {
		$item = items[i].$element;
		top = $item.position().top;
		height = $item.height();
		if ( top < middle && top + height > middle ) {
			visible = items[i];
			break;
		}
	}
	if ( visible ) {
		for ( name in this.pages ) {
			if ( this.pages[name] === items[i] ) {
				break;
			}
		}
		if ( name !== this.currentPageName ) {
			this.setPage( name );
		}
	}
	this.scrolling = false;
	this.scrollingTimeout = null;
};

/**
 * Handle stack layout set events.
 *
 * @method
 * @param {OO.ui.PanelLayout|null} page The page panel that is now the current panel
 */
OO.ui.BookletLayout.prototype.onStackLayoutSet = function ( page ) {
	if ( page ) {
		this.selecting = true;
		if ( this.scrolling ) {
			if ( this.autoFocus ) {
				page.$element.find( ':input:first' ).focus();
			}
			this.selecting = false;
		} else {
			page.scrollElementIntoView( { 'complete': OO.ui.bind( function () {
				if ( this.autoFocus ) {
					page.$element.find( ':input:first' ).focus();
				}
				this.selecting = false;
			}, this ) } );
		}
	}
};

/**
 * Handle outline widget select events.
 *
 * @method
 * @param {OO.ui.OptionWidget|null} item Selected item
 */
OO.ui.BookletLayout.prototype.onOutlineWidgetSelect = function ( item ) {
	if ( item && !this.scrolling ) {
		this.setPage( item.getData() );
	}
};

/**
 * Check if booklet has an outline.
 *
 * @method
 * @returns {boolean} Booklet is outlined
 */
OO.ui.BookletLayout.prototype.isOutlined = function () {
	return this.outlined;
};

/**
 * Check if booklet has editing controls.
 *
 * @method
 * @returns {boolean} Booklet is outlined
 */
OO.ui.BookletLayout.prototype.isEditable = function () {
	return this.editable;
};

/**
 * Get the outline widget.
 *
 * @method
 * @returns {OO.ui.OutlineWidget} Outline widget
 */
OO.ui.BookletLayout.prototype.getOutline = function () {
	return this.outlineWidget;
};

/**
 * Get the outline controls widget. If the outline is not editable, null is returned.
 *
 * @method
 * @returns {OO.ui.OutlineControlsWidget|null} The outline controls widget.
 */
OO.ui.BookletLayout.prototype.getOutlineControls = function () {
	return this.outlineControlsWidget;
};

/**
 * Get a page by name.
 *
 * @method
 * @param {string} name Symbolic name of page
 * @returns {OO.ui.PageLayout|undefined} Page, if found
 */
OO.ui.BookletLayout.prototype.getPage = function ( name ) {
	return this.pages[name];
};

/**
 * Get the current page name.
 *
 * @method
 * @returns {string|null} Current page name
 */
OO.ui.BookletLayout.prototype.getPageName = function () {
	return this.currentPageName;
};

/**
 * Add a page to the layout.
 *
 * @method
 * @param {string} name Symbolic name of page
 * @param {OO.ui.PageLayout} page Page to add
 * @param {number} index Specific index to insert page at
 * @fires add
 * @chainable
 */
OO.ui.BookletLayout.prototype.addPage = function ( name, page, index ) {
	if ( this.outlined ) {
		this.outlineWidget.addItems(
			[
				new OO.ui.OutlineItemWidget( name, {
					'$': this.$,
					'label': page.getLabel() || name,
					'level': page.getLevel(),
					'icon': page.getIcon(),
					'moveable': page.isMovable()
				} )
			],
			index
		);
		this.updateOutlineWidget();
	}
	this.pages[name] = page;
	this.stackLayout.addItems( [ page ], index );
	this.emit( 'add', name, page );
	return this;
};

/**
 * Remove a page from the layout.
 *
 * @method
 * @fires remove
 * @chainable
 */
OO.ui.BookletLayout.prototype.removePage = function ( name ) {
	var page = this.pages[name];

	if ( page ) {
		if ( this.outlined ) {
			this.outlineWidget.removeItems( [ this.outlineWidget.getItemFromData( name ) ] );
			this.updateOutlineWidget();
		}
		page = [ page ];
		delete this.pages[name];
		this.stackLayout.removeItems( page );
		this.emit( 'remove', page );
	}

	return this;
};

/**
 * Clear all pages from the layout.
 *
 * @method
 * @fires remove
 * @chainable
 */
OO.ui.BookletLayout.prototype.clearPages = function () {
	var pages = this.stackLayout.getItems();

	if ( this.outlined ) {
		this.outlineWidget.clearItems();
	}
	this.currentPageName = null;
	this.pages = {};
	this.stackLayout.clearItems();
	this.emit( 'remove', pages );

	return this;
};

/**
 * Set the current page by name.
 *
 * @method
 * @fires set
 * @param {string} name Symbolic name of page
 */
OO.ui.BookletLayout.prototype.setPage = function ( name ) {
	var page = this.pages[name];

	if ( this.outlined && name !== this.outlineWidget.getSelectedItem().getData() ) {
		this.outlineWidget.selectItem( this.outlineWidget.getItemFromData( name ) );
	}
	if ( page ) {
		this.currentPageName = name;
		this.stackLayout.setItem( page );
		this.emit( 'set', page );
	}
};

/**
 * Call this after adding or removing items from the OutlineWidget.
 *
 * @method
 * @chainable
 */
OO.ui.BookletLayout.prototype.updateOutlineWidget = function () {
	// Auto-select first item when nothing is selected anymore
	if ( !this.outlineWidget.getSelectedItem() ) {
		this.outlineWidget.selectItem( this.outlineWidget.getFirstSelectableItem() );
	}

	return this;
};
