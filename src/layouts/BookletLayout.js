/**
 * Layout containing a series of pages.
 *
 * @class
 * @extends OO.ui.Layout
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [continuous=false] Show all pages, one after another
 * @cfg {boolean} [autoFocus=true] Focus on the first focusable element when changing to a page
 * @cfg {boolean} [outlined=false] Show an outline
 * @cfg {boolean} [editable=false] Show controls for adding, removing and reordering pages
 */
OO.ui.BookletLayout = function OoUiBookletLayout( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.BookletLayout.super.call( this, config );

	// Properties
	this.currentPageName = null;
	this.pages = {};
	this.ignoreFocus = false;
	this.stackLayout = new OO.ui.StackLayout( { $: this.$, continuous: !!config.continuous } );
	this.autoFocus = config.autoFocus === undefined || !!config.autoFocus;
	this.outlineVisible = false;
	this.outlined = !!config.outlined;
	if ( this.outlined ) {
		this.editable = !!config.editable;
		this.outlineControlsWidget = null;
		this.outlineSelectWidget = new OO.ui.OutlineSelectWidget( { $: this.$ } );
		this.outlinePanel = new OO.ui.PanelLayout( { $: this.$, scrollable: true } );
		this.gridLayout = new OO.ui.GridLayout(
			[ this.outlinePanel, this.stackLayout ],
			{ $: this.$, widths: [ 1, 2 ] }
		);
		this.outlineVisible = true;
		if ( this.editable ) {
			this.outlineControlsWidget = new OO.ui.OutlineControlsWidget(
				this.outlineSelectWidget, { $: this.$ }
			);
		}
	}

	// Events
	this.stackLayout.connect( this, { set: 'onStackLayoutSet' } );
	if ( this.outlined ) {
		this.outlineSelectWidget.connect( this, { select: 'onOutlineSelectWidgetSelect' } );
	}
	if ( this.autoFocus ) {
		// Event 'focus' does not bubble, but 'focusin' does
		this.stackLayout.onDOMEvent( 'focusin', this.onStackLayoutFocus.bind( this ) );
	}

	// Initialization
	this.$element.addClass( 'oo-ui-bookletLayout' );
	this.stackLayout.$element.addClass( 'oo-ui-bookletLayout-stackLayout' );
	if ( this.outlined ) {
		this.outlinePanel.$element
			.addClass( 'oo-ui-bookletLayout-outlinePanel' )
			.append( this.outlineSelectWidget.$element );
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

/* Setup */

OO.inheritClass( OO.ui.BookletLayout, OO.ui.Layout );

/* Events */

/**
 * @event set
 * @param {OO.ui.PageLayout} page Current page
 */

/**
 * @event add
 * @param {OO.ui.PageLayout[]} page Added pages
 * @param {number} index Index pages were added at
 */

/**
 * @event remove
 * @param {OO.ui.PageLayout[]} pages Removed pages
 */

/* Methods */

/**
 * Handle stack layout focus.
 *
 * @param {jQuery.Event} e Focusin event
 */
OO.ui.BookletLayout.prototype.onStackLayoutFocus = function ( e ) {
	var name, $target;

	// Find the page that an element was focused within
	$target = $( e.target ).closest( '.oo-ui-pageLayout' );
	for ( name in this.pages ) {
		// Check for page match, exclude current page to find only page changes
		if ( this.pages[name].$element[0] === $target[0] && name !== this.currentPageName ) {
			this.setPage( name );
			break;
		}
	}
};

/**
 * Handle stack layout set events.
 *
 * @param {OO.ui.PanelLayout|null} page The page panel that is now the current panel
 */
OO.ui.BookletLayout.prototype.onStackLayoutSet = function ( page ) {
	var $input, layout = this;
	if ( page ) {
		page.scrollElementIntoView( { complete: function () {
			if ( layout.autoFocus ) {
				// Set focus to the first input if nothing on the page is focused yet
				if ( !page.$element.find( ':focus' ).length ) {
					$input = page.$element.find( ':input:first' );
					if ( $input.length ) {
						$input[0].focus();
					}
				}
			}
		} } );
	}
};

/**
 * Handle outline widget select events.
 *
 * @param {OO.ui.OptionWidget|null} item Selected item
 */
OO.ui.BookletLayout.prototype.onOutlineSelectWidgetSelect = function ( item ) {
	if ( item ) {
		this.setPage( item.getData() );
	}
};

/**
 * Check if booklet has an outline.
 *
 * @return {boolean}
 */
OO.ui.BookletLayout.prototype.isOutlined = function () {
	return this.outlined;
};

/**
 * Check if booklet has editing controls.
 *
 * @return {boolean}
 */
OO.ui.BookletLayout.prototype.isEditable = function () {
	return this.editable;
};

/**
 * Check if booklet has a visible outline.
 *
 * @return {boolean}
 */
OO.ui.BookletLayout.prototype.isOutlineVisible = function () {
	return this.outlined && this.outlineVisible;
};

/**
 * Hide or show the outline.
 *
 * @param {boolean} [show] Show outline, omit to invert current state
 * @chainable
 */
OO.ui.BookletLayout.prototype.toggleOutline = function ( show ) {
	if ( this.outlined ) {
		show = show === undefined ? !this.outlineVisible : !!show;
		this.outlineVisible = show;
		this.gridLayout.layout( show ? [ 1, 2 ] : [ 0, 1 ], [ 1 ] );
	}

	return this;
};

/**
 * Get the outline widget.
 *
 * @param {OO.ui.PageLayout} page Page to be selected
 * @return {OO.ui.PageLayout|null} Closest page to another
 */
OO.ui.BookletLayout.prototype.getClosestPage = function ( page ) {
	var next, prev, level,
		pages = this.stackLayout.getItems(),
		index = $.inArray( page, pages );

	if ( index !== -1 ) {
		next = pages[index + 1];
		prev = pages[index - 1];
		// Prefer adjacent pages at the same level
		if ( this.outlined ) {
			level = this.outlineSelectWidget.getItemFromData( page.getName() ).getLevel();
			if (
				prev &&
				level === this.outlineSelectWidget.getItemFromData( prev.getName() ).getLevel()
			) {
				return prev;
			}
			if (
				next &&
				level === this.outlineSelectWidget.getItemFromData( next.getName() ).getLevel()
			) {
				return next;
			}
		}
	}
	return prev || next || null;
};

/**
 * Get the outline widget.
 *
 * @return {OO.ui.OutlineSelectWidget|null} Outline widget, or null if booklet has no outline
 */
OO.ui.BookletLayout.prototype.getOutline = function () {
	return this.outlineSelectWidget;
};

/**
 * Get the outline controls widget. If the outline is not editable, null is returned.
 *
 * @return {OO.ui.OutlineControlsWidget|null} The outline controls widget.
 */
OO.ui.BookletLayout.prototype.getOutlineControls = function () {
	return this.outlineControlsWidget;
};

/**
 * Get a page by name.
 *
 * @param {string} name Symbolic name of page
 * @return {OO.ui.PageLayout|undefined} Page, if found
 */
OO.ui.BookletLayout.prototype.getPage = function ( name ) {
	return this.pages[name];
};

/**
 * Get the current page name.
 *
 * @return {string|null} Current page name
 */
OO.ui.BookletLayout.prototype.getPageName = function () {
	return this.currentPageName;
};

/**
 * Add a page to the layout.
 *
 * When pages are added with the same names as existing pages, the existing pages will be
 * automatically removed before the new pages are added.
 *
 * @param {OO.ui.PageLayout[]} pages Pages to add
 * @param {number} index Index to insert pages after
 * @fires add
 * @chainable
 */
OO.ui.BookletLayout.prototype.addPages = function ( pages, index ) {
	var i, len, name, page, item, currentIndex,
		stackLayoutPages = this.stackLayout.getItems(),
		remove = [],
		items = [];

	// Remove pages with same names
	for ( i = 0, len = pages.length; i < len; i++ ) {
		page = pages[i];
		name = page.getName();

		if ( Object.prototype.hasOwnProperty.call( this.pages, name ) ) {
			// Correct the insertion index
			currentIndex = $.inArray( this.pages[name], stackLayoutPages );
			if ( currentIndex !== -1 && currentIndex + 1 < index ) {
				index--;
			}
			remove.push( this.pages[name] );
		}
	}
	if ( remove.length ) {
		this.removePages( remove );
	}

	// Add new pages
	for ( i = 0, len = pages.length; i < len; i++ ) {
		page = pages[i];
		name = page.getName();
		this.pages[page.getName()] = page;
		if ( this.outlined ) {
			item = new OO.ui.OutlineOptionWidget( { $: this.$, data: name } );
			page.setOutlineItem( item );
			items.push( item );
		}
	}

	if ( this.outlined && items.length ) {
		this.outlineSelectWidget.addItems( items, index );
		this.updateOutlineSelectWidget();
	}
	this.stackLayout.addItems( pages, index );
	this.emit( 'add', pages, index );

	return this;
};

/**
 * Remove a page from the layout.
 *
 * @fires remove
 * @chainable
 */
OO.ui.BookletLayout.prototype.removePages = function ( pages ) {
	var i, len, name, page,
		items = [];

	for ( i = 0, len = pages.length; i < len; i++ ) {
		page = pages[i];
		name = page.getName();
		delete this.pages[name];
		if ( this.outlined ) {
			items.push( this.outlineSelectWidget.getItemFromData( name ) );
			page.setOutlineItem( null );
		}
	}
	if ( this.outlined && items.length ) {
		this.outlineSelectWidget.removeItems( items );
		this.updateOutlineSelectWidget();
	}
	this.stackLayout.removeItems( pages );
	this.emit( 'remove', pages );

	return this;
};

/**
 * Clear all pages from the layout.
 *
 * @fires remove
 * @chainable
 */
OO.ui.BookletLayout.prototype.clearPages = function () {
	var i, len,
		pages = this.stackLayout.getItems();

	this.pages = {};
	this.currentPageName = null;
	if ( this.outlined ) {
		this.outlineSelectWidget.clearItems();
		for ( i = 0, len = pages.length; i < len; i++ ) {
			pages[i].setOutlineItem( null );
		}
	}
	this.stackLayout.clearItems();

	this.emit( 'remove', pages );

	return this;
};

/**
 * Set the current page by name.
 *
 * @fires set
 * @param {string} name Symbolic name of page
 */
OO.ui.BookletLayout.prototype.setPage = function ( name ) {
	var selectedItem,
		$focused,
		page = this.pages[name];

	if ( name !== this.currentPageName ) {
		if ( this.outlined ) {
			selectedItem = this.outlineSelectWidget.getSelectedItem();
			if ( selectedItem && selectedItem.getData() !== name ) {
				this.outlineSelectWidget.selectItem( this.outlineSelectWidget.getItemFromData( name ) );
			}
		}
		if ( page ) {
			if ( this.currentPageName && this.pages[this.currentPageName] ) {
				this.pages[this.currentPageName].setActive( false );
				// Blur anything focused if the next page doesn't have anything focusable - this
				// is not needed if the next page has something focusable because once it is focused
				// this blur happens automatically
				if ( this.autoFocus && !page.$element.find( ':input' ).length ) {
					$focused = this.pages[this.currentPageName].$element.find( ':focus' );
					if ( $focused.length ) {
						$focused[0].blur();
					}
				}
			}
			this.currentPageName = name;
			this.stackLayout.setItem( page );
			page.setActive( true );
			this.emit( 'set', page );
		}
	}
};

/**
 * Call this after adding or removing items from the OutlineSelectWidget.
 *
 * @chainable
 */
OO.ui.BookletLayout.prototype.updateOutlineSelectWidget = function () {
	// Auto-select first item when nothing is selected anymore
	if ( !this.outlineSelectWidget.getSelectedItem() ) {
		this.outlineSelectWidget.selectItem( this.outlineSelectWidget.getFirstSelectableItem() );
	}

	return this;
};
