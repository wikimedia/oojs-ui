/**
 * BookletLayouts contain {@link OO.ui.PageLayout page layouts} as well as
 * an {@link OO.ui.OutlineSelectWidget outline} that allows users to easily navigate
 * through the pages and select which one to display. By default, only one page is
 * displayed at a time and the outline is hidden. When a user navigates to a new page,
 * the booklet layout automatically focuses on the first focusable element, unless the
 * default setting is changed. Optionally, booklets can be configured to show
 * {@link OO.ui.OutlineControlsWidget controls} for adding, moving, and removing items.
 *
 *     @example
 *     // Example of a BookletLayout that contains two PageLayouts.
 *
 *     function PageOneLayout( name, config ) {
 *         PageOneLayout.super.call( this, name, config );
 *         this.$element.append( '<p>First page</p><p>(This booklet has an outline, displayed on ' +
 *         'the left)</p>' );
 *     }
 *     OO.inheritClass( PageOneLayout, OO.ui.PageLayout );
 *     PageOneLayout.prototype.setupOutlineItem = function () {
 *         this.outlineItem.setLabel( 'Page One' );
 *     };
 *
 *     function PageTwoLayout( name, config ) {
 *         PageTwoLayout.super.call( this, name, config );
 *         this.$element.append( '<p>Second page</p>' );
 *     }
 *     OO.inheritClass( PageTwoLayout, OO.ui.PageLayout );
 *     PageTwoLayout.prototype.setupOutlineItem = function () {
 *         this.outlineItem.setLabel( 'Page Two' );
 *     };
 *
 *     const page1 = new PageOneLayout( 'one' ),
 *         page2 = new PageTwoLayout( 'two' );
 *
 *     const booklet = new OO.ui.BookletLayout( {
 *         outlined: true
 *     } );
 *
 *     booklet.addPages( [ page1, page2 ] );
 *     $( document.body ).append( booklet.$element );
 *
 * @class
 * @extends OO.ui.MenuLayout
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {boolean} [config.continuous=false] Show all pages, one after another
 * @param {boolean} [config.autoFocus=true] Focus on the first focusable element when a new page is
 *  displayed. Disabled on mobile.
 * @param {boolean} [config.outlined=false] Show the outline. The outline is used to navigate through the
 *  pages of the booklet.
 * @param {boolean} [config.editable=false] Show controls for adding, removing and reordering pages.
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
	this.stackLayout = new OO.ui.StackLayout( {
		continuous: !!config.continuous,
		expanded: this.expanded
	} );
	this.setContentPanel( this.stackLayout );
	this.autoFocus = config.autoFocus === undefined || !!config.autoFocus;
	this.outlineVisible = false;
	this.outlined = !!config.outlined;
	if ( this.outlined ) {
		this.editable = !!config.editable;
		this.outlineControlsWidget = null;
		this.outlineSelectWidget = new OO.ui.OutlineSelectWidget();
		this.outlinePanel = new OO.ui.PanelLayout( {
			expanded: this.expanded,
			scrollable: true
		} );
		this.setMenuPanel( this.outlinePanel );
		this.outlineVisible = true;
		if ( this.editable ) {
			this.outlineControlsWidget = new OO.ui.OutlineControlsWidget(
				this.outlineSelectWidget
			);
		}
	}
	this.toggleMenu( this.outlined );

	// Events
	this.stackLayout.connect( this, {
		set: 'onStackLayoutSet'
	} );
	if ( this.outlined ) {
		this.outlineSelectWidget.connect( this, {
			select: 'onOutlineSelectWidgetSelect'
		} );
	}
	if ( this.autoFocus ) {
		// Event 'focus' does not bubble, but 'focusin' does
		this.stackLayout.$element.on( 'focusin', this.onStackLayoutFocus.bind( this ) );
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
	}
};

/* Setup */

OO.inheritClass( OO.ui.BookletLayout, OO.ui.MenuLayout );

/* Events */

/**
 * A 'set' event is emitted when a page is {@link OO.ui.BookletLayout#setPage set} to be displayed by the
 * booklet layout.
 *
 * @event OO.ui.BookletLayout#set
 * @param {OO.ui.PageLayout} page Current page
 */

/**
 * An 'add' event is emitted when pages are {@link OO.ui.BookletLayout#addPages added} to the booklet layout.
 *
 * @event OO.ui.BookletLayout#add
 * @param {OO.ui.PageLayout[]} page Added pages
 * @param {number} index Index pages were added at
 */

/**
 * A 'remove' event is emitted when pages are {@link OO.ui.BookletLayout#clearPages cleared} or
 * {@link OO.ui.BookletLayout#removePages removed} from the booklet.
 *
 * @event OO.ui.BookletLayout#remove
 * @param {OO.ui.PageLayout[]} pages Removed pages
 */

/* Methods */

/**
 * Handle stack layout focus.
 *
 * @private
 * @param {jQuery.Event} e Focusin event
 */
OO.ui.BookletLayout.prototype.onStackLayoutFocus = function ( e ) {
	// Find the page that an element was focused within
	const $target = $( e.target ).closest( '.oo-ui-pageLayout' );
	for ( const name in this.pages ) {
		// Check for page match, exclude current page to find only page changes
		if ( this.pages[ name ].$element[ 0 ] === $target[ 0 ] && name !== this.currentPageName ) {
			this.setPage( name );
			break;
		}
	}
};

/**
 * Handle stack layout set events.
 *
 * @private
 * @param {OO.ui.PanelLayout|null} page The page panel that is now the current panel
 */
OO.ui.BookletLayout.prototype.onStackLayoutSet = function ( page ) {
	const layout = this;
	// If everything is unselected, do nothing
	if ( !page ) {
		return;
	}
	let promise;
	// For continuous BookletLayouts, scroll the selected page into view first
	if ( this.stackLayout.isContinuous() && !this.scrolling ) {
		promise = page.scrollElementIntoView();
	} else {
		promise = $.Deferred().resolve();
	}
	// Focus the first element on the newly selected panel.
	// Don't focus if the page was set by scrolling.
	if ( this.autoFocus && !OO.ui.isMobile() && !this.scrolling ) {
		promise.done( () => {
			layout.focus();
		} );
	}
};

/**
 * Focus the first input in the current page.
 *
 * If no page is selected, the first selectable page will be selected.
 * If the focus is already in an element on the current page, nothing will happen.
 *
 * @param {number} [itemIndex] A specific item to focus on
 */
OO.ui.BookletLayout.prototype.focus = function ( itemIndex ) {
	const items = this.stackLayout.getItems();

	let page;
	if ( itemIndex !== undefined && items[ itemIndex ] ) {
		page = items[ itemIndex ];
	} else {
		page = this.stackLayout.getCurrentItem();
	}

	if ( !page && this.outlined ) {
		this.selectFirstSelectablePage();
		page = this.stackLayout.getCurrentItem();
	}
	if ( !page ) {
		return;
	}
	// Only change the focus if is not already in the current page
	if ( !OO.ui.contains( page.$element[ 0 ], this.getElementDocument().activeElement, true ) ) {
		page.focus();
	}
};

/**
 * Find the first focusable input in the booklet layout and focus
 * on it.
 */
OO.ui.BookletLayout.prototype.focusFirstFocusable = function () {
	OO.ui.findFocusable( this.stackLayout.$element ).focus();
};

/**
 * Handle outline widget select events.
 *
 * @private
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
 * @return {boolean} Booklet has an outline
 */
OO.ui.BookletLayout.prototype.isOutlined = function () {
	return this.outlined;
};

/**
 * Check if booklet has editing controls.
 *
 * @return {boolean} Booklet is editable
 */
OO.ui.BookletLayout.prototype.isEditable = function () {
	return this.editable;
};

/**
 * Check if booklet has a visible outline.
 *
 * @return {boolean} Outline is visible
 */
OO.ui.BookletLayout.prototype.isOutlineVisible = function () {
	return this.outlined && this.outlineVisible;
};

/**
 * Hide or show the outline.
 *
 * @param {boolean} [show] Show outline, omit to invert current state
 * @chainable
 * @return {OO.ui.BookletLayout} The layout, for chaining
 */
OO.ui.BookletLayout.prototype.toggleOutline = function ( show ) {
	const booklet = this;

	if ( this.outlined ) {
		show = show === undefined ? !this.outlineVisible : !!show;
		this.outlineVisible = show;
		this.toggleMenu( show );
		if ( show && this.editable ) {
			// HACK: Kill dumb scrollbars when the sidebar stops animating, see T161798.
			// Only necessary when outline controls are present, delay matches transition on
			// `.oo-ui-menuLayout-menu`.
			setTimeout( () => {
				OO.ui.Element.static.reconsiderScrollbars( booklet.outlinePanel.$element[ 0 ] );
			}, OO.ui.theme.getDialogTransitionDuration() );
		}
	}

	return this;
};

/**
 * Find the page closest to the specified page.
 *
 * @param {OO.ui.PageLayout} page Page to use as a reference point
 * @return {OO.ui.PageLayout|null} Page closest to the specified page
 */
OO.ui.BookletLayout.prototype.findClosestPage = function ( page ) {
	const pages = this.stackLayout.getItems(),
		index = pages.indexOf( page );

	if ( index === -1 ) {
		return null;
	}

	const next = pages[ index + 1 ];
	const prev = pages[ index - 1 ];
	// Prefer adjacent pages at the same level
	if ( this.outlined ) {
		const level = this.outlineSelectWidget.findItemFromData( page.getName() ).getLevel();
		if (
			prev &&
			level === this.outlineSelectWidget.findItemFromData( prev.getName() ).getLevel()
		) {
			return prev;
		}
		if (
			next &&
			level === this.outlineSelectWidget.findItemFromData( next.getName() ).getLevel()
		) {
			return next;
		}
	}
	return prev || next || null;
};

/**
 * Get the outline widget.
 *
 * If the booklet is not outlined, the method will return `null`.
 *
 * @return {OO.ui.OutlineSelectWidget|null} Outline widget, or null if the booklet is not outlined
 */
OO.ui.BookletLayout.prototype.getOutline = function () {
	return this.outlineSelectWidget;
};

/**
 * Get the outline controls widget.
 *
 * If the outline is not editable, the method will return `null`.
 *
 * @return {OO.ui.OutlineControlsWidget|null} The outline controls widget.
 */
OO.ui.BookletLayout.prototype.getOutlineControls = function () {
	return this.outlineControlsWidget;
};

/**
 * Get a page by its symbolic name.
 *
 * @param {string} name Symbolic name of page
 * @return {OO.ui.PageLayout|undefined} Page, if found
 */
OO.ui.BookletLayout.prototype.getPage = function ( name ) {
	return this.pages[ name ];
};

/**
 * Get the current page.
 *
 * @return {OO.ui.PageLayout|undefined} Current page, if found
 */
OO.ui.BookletLayout.prototype.getCurrentPage = function () {
	const name = this.getCurrentPageName();
	return name ? this.getPage( name ) : undefined;
};

/**
 * Get the symbolic name of the current page.
 *
 * @return {string|null} Symbolic name of the current page
 */
OO.ui.BookletLayout.prototype.getCurrentPageName = function () {
	return this.currentPageName;
};

/**
 * Add pages to the booklet layout
 *
 * When pages are added with the same names as existing pages, the existing pages will be
 * automatically removed before the new pages are added.
 *
 * @param {OO.ui.PageLayout[]} pages Pages to add
 * @param {number} index Index of the insertion point
 * @fires OO.ui.BookletLayout#add
 * @chainable
 * @return {OO.ui.BookletLayout} The layout, for chaining
 */
OO.ui.BookletLayout.prototype.addPages = function ( pages, index ) {
	const stackLayoutPages = this.stackLayout.getItems(),
		remove = [],
		items = [];

	let i, len;
	let page, name;
	// Remove pages with same names
	for ( i = 0, len = pages.length; i < len; i++ ) {
		page = pages[ i ];
		name = page.getName();

		if ( Object.prototype.hasOwnProperty.call( this.pages, name ) ) {
			// Correct the insertion index
			const currentIndex = stackLayoutPages.indexOf( this.pages[ name ] );
			if ( currentIndex !== -1 && currentIndex + 1 < index ) {
				index--;
			}
			remove.push( this.pages[ name ] );
		}
	}
	if ( remove.length ) {
		this.removePages( remove );
	}

	// Add new pages
	for ( i = 0, len = pages.length; i < len; i++ ) {
		page = pages[ i ];
		name = page.getName();
		this.pages[ page.getName() ] = page;
		if ( this.outlined ) {
			const item = new OO.ui.OutlineOptionWidget( { data: name } );
			page.setOutlineItem( item );
			items.push( item );
		}
	}

	if ( this.outlined ) {
		this.outlineSelectWidget.addItems( items, index );
		// It's impossible to lose a selection here. Selecting something else is business logic.
	}
	this.stackLayout.addItems( pages, index );
	this.emit( 'add', pages, index );

	return this;
};

/**
 * Remove the specified pages from the booklet layout.
 *
 * To remove all pages from the booklet, you may wish to use the #clearPages method instead.
 *
 * @param {OO.ui.PageLayout[]} pages An array of pages to remove
 * @fires OO.ui.BookletLayout#remove
 * @chainable
 * @return {OO.ui.BookletLayout} The layout, for chaining
 */
OO.ui.BookletLayout.prototype.removePages = function ( pages ) {
	const itemsToRemove = [];

	for ( let i = 0, len = pages.length; i < len; i++ ) {
		const page = pages[ i ];
		const name = page.getName();
		delete this.pages[ name ];
		if ( this.outlined ) {
			itemsToRemove.push( this.outlineSelectWidget.findItemFromData( name ) );
			page.setOutlineItem( null );
		}
		// If the current page is removed, clear currentPageName
		if ( this.currentPageName === name ) {
			this.currentPageName = null;
		}
	}
	if ( itemsToRemove.length ) {
		this.outlineSelectWidget.removeItems( itemsToRemove );
		// We might loose the selection here, but what to select instead is business logic.
	}
	this.stackLayout.removeItems( pages );
	this.emit( 'remove', pages );

	return this;
};

/**
 * Clear all pages from the booklet layout.
 *
 * To remove only a subset of pages from the booklet, use the #removePages method.
 *
 * @fires OO.ui.BookletLayout#remove
 * @chainable
 * @return {OO.ui.BookletLayout} The layout, for chaining
 */
OO.ui.BookletLayout.prototype.clearPages = function () {
	const pages = this.stackLayout.getItems();

	this.pages = {};
	this.currentPageName = null;
	if ( this.outlined ) {
		this.outlineSelectWidget.clearItems();
		for ( let i = 0, len = pages.length; i < len; i++ ) {
			pages[ i ].setOutlineItem( null );
		}
	}
	this.stackLayout.clearItems();

	this.emit( 'remove', pages );

	return this;
};

/**
 * Set the current page by symbolic name.
 *
 * @fires OO.ui.BookletLayout#set
 * @param {string} name Symbolic name of page
 */
OO.ui.BookletLayout.prototype.setPage = function ( name ) {
	const page = this.pages[ name ];
	if ( !page || name === this.currentPageName ) {
		return;
	}

	const previousPage = this.currentPageName ? this.pages[ this.currentPageName ] : null;
	this.currentPageName = name;

	if ( this.outlined ) {
		const selectedItem = this.outlineSelectWidget.findSelectedItem();
		if ( !selectedItem || selectedItem.getData() !== name ) {
			// Warning! This triggers a "select" event and the .onOutlineSelectWidgetSelect()
			// handler, which calls .setPage() a second time. Make sure .currentPageName is set to
			// break this loop.
			this.outlineSelectWidget.selectItemByData( name );
		}
	}

	let $focused;
	if ( previousPage ) {
		previousPage.setActive( false );
		// Blur anything focused if the next page doesn't have anything focusable.
		// This is not needed if the next page has something focusable (because once it is
		// focused this blur happens automatically). If the layout is non-continuous, this
		// check is meaningless because the next page is not visible yet and thus can't
		// hold focus.
		if ( this.autoFocus &&
			!OO.ui.isMobile() &&
			this.stackLayout.isContinuous() &&
			OO.ui.findFocusable( page.$element ).length !== 0
		) {
			$focused = previousPage.$element.find( ':focus' );
			if ( $focused.length ) {
				$focused[ 0 ].blur();
			}
		}
	}
	page.setActive( true );
	this.stackLayout.setItem( page );
	if ( !this.stackLayout.isContinuous() && previousPage ) {
		// This should not be necessary, since any inputs on the previous page should have
		// been blurred when it was hidden, but browsers are not very consistent about
		// this.
		$focused = previousPage.$element.find( ':focus' );
		if ( $focused.length ) {
			$focused[ 0 ].blur();
		}
	}
	this.emit( 'set', page );
};

/**
 * For outlined-continuous booklets, also reset the outlineSelectWidget to the first item.
 *
 * @inheritdoc
 */
OO.ui.BookletLayout.prototype.resetScroll = function () {
	// Parent method
	OO.ui.BookletLayout.super.prototype.resetScroll.call( this );

	if (
		this.outlined &&
		this.stackLayout.isContinuous() &&
		this.outlineSelectWidget.findFirstSelectableItem()
	) {
		this.scrolling = true;
		this.outlineSelectWidget.selectItem( this.outlineSelectWidget.findFirstSelectableItem() );
		this.scrolling = false;
	}
	return this;
};

/**
 * Select the first selectable page.
 *
 * @chainable
 * @return {OO.ui.BookletLayout} The layout, for chaining
 */
OO.ui.BookletLayout.prototype.selectFirstSelectablePage = function () {
	if ( !this.outlineSelectWidget.findSelectedItem() ) {
		this.outlineSelectWidget.selectItem( this.outlineSelectWidget.findFirstSelectableItem() );
	}

	return this;
};
