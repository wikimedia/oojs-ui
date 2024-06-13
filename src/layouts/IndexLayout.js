/**
 * IndexLayouts contain {@link OO.ui.TabPanelLayout tab panel layouts} as well as
 * {@link OO.ui.TabSelectWidget tabs} that allow users to easily navigate through the tab panels
 * and select which one to display. By default, only one tab panel is displayed at a time. When a
 * user navigates to a new tab panel, the index layout automatically focuses on the first focusable
 * element, unless the default setting is changed.
 *
 * TODO: This class is similar to BookletLayout, we may want to refactor to reduce duplication
 *
 *     @example
 *     // Example of a IndexLayout that contains two TabPanelLayouts.
 *
 *     function TabPanelOneLayout( name, config ) {
 *         TabPanelOneLayout.super.call( this, name, config );
 *         this.$element.append( '<p>First tab panel</p>' );
 *     }
 *     OO.inheritClass( TabPanelOneLayout, OO.ui.TabPanelLayout );
 *     TabPanelOneLayout.prototype.setupTabItem = function () {
 *         this.tabItem.setLabel( 'Tab panel one' );
 *     };
 *
 *     const tabPanel1 = new TabPanelOneLayout( 'one' ),
 *         tabPanel2 = new OO.ui.TabPanelLayout( 'two', { label: 'Tab panel two' } );
 *
 *     tabPanel2.$element.append( '<p>Second tab panel</p>' );
 *
 *     const index = new OO.ui.IndexLayout();
 *
 *     index.addTabPanels( [ tabPanel1, tabPanel2 ] );
 *     $( document.body ).append( index.$element );
 *
 * @class
 * @extends OO.ui.MenuLayout
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {OO.ui.StackLayout} [config.contentPanel] Content stack (see MenuLayout)
 * @param {boolean} [config.continuous=false] Show all tab panels, one after another
 * @param {boolean} [config.autoFocus=true] Focus on the first focusable element when a new tab panel is
 *  displayed. Disabled on mobile.
 * @param {boolean} [config.framed=true] Render the tabs with frames
 * @param {boolean} [config.openMatchedPanels=true] Automatically switch to a panel when the browser's
 *  find-in-page feature matches content there, in browsers that support it.
 */
OO.ui.IndexLayout = function OoUiIndexLayout( config ) {
	// Configuration initialization
	config = Object.assign( {}, config, { menuPosition: 'top' } );

	// Parent constructor
	OO.ui.IndexLayout.super.call( this, config );

	// Properties
	this.currentTabPanelName = null;
	// Allow infused widgets to pass existing tabPanels
	this.tabPanels = config.tabPanels || {};
	this.openMatchedPanels = config.openMatchedPanels === undefined || !!config.openMatchedPanels;

	this.ignoreFocus = false;
	if ( this.contentPanel ) {
		this.contentPanel.setHideUntilFound( this.openMatchedPanels );
	}
	this.stackLayout = this.contentPanel || new OO.ui.StackLayout( {
		continuous: !!config.continuous,
		expanded: this.expanded,
		hideUntilFound: this.openMatchedPanels
	} );
	this.setContentPanel( this.stackLayout );
	this.autoFocus = config.autoFocus === undefined || !!config.autoFocus;

	if ( config.tabSelectWidget ) {
		// If we are using a custom tabSelectWidget (e.g. infusing) then
		// ensure the tabPanels are linked to tabItems
		this.stackLayout.getItems().forEach( ( tabPanel, i ) => {
			if ( !tabPanel.getTabItem() ) {
				tabPanel.setTabItem( config.tabSelectWidget.items[ i ] || null );
			}
		} );
	}
	// Allow infused widgets to pass an existing tabSelectWidget
	this.tabSelectWidget = config.tabSelectWidget || new OO.ui.TabSelectWidget( {
		framed: config.framed === undefined || config.framed
	} );
	this.tabPanel = this.menuPanel || new OO.ui.PanelLayout( {
		expanded: this.expanded
	} );
	this.setMenuPanel( this.tabPanel );

	this.toggleMenu( true );

	// Events
	this.stackLayout.connect( this, {
		set: 'onStackLayoutSet'
	} );
	if ( this.openMatchedPanels ) {
		this.stackLayout.$element.on( 'beforematch', this.onStackLayoutBeforeMatch.bind( this ) );
	}
	this.tabSelectWidget.connect( this, {
		select: 'onTabSelectWidgetSelect'
	} );
	if ( this.autoFocus ) {
		// Event 'focus' does not bubble, but 'focusin' does.
		this.stackLayout.$element.on( 'focusin', this.onStackLayoutFocus.bind( this ) );
	}

	// Initialization
	this.$element.addClass( 'oo-ui-indexLayout' );
	this.stackLayout.$element.addClass( 'oo-ui-indexLayout-stackLayout' );
	this.tabPanel.$element
		.addClass( 'oo-ui-indexLayout-tabPanel' )
		.append( this.tabSelectWidget.$element );

	this.selectFirstSelectableTabPanel();
};

/* Setup */

OO.inheritClass( OO.ui.IndexLayout, OO.ui.MenuLayout );

/* Events */

/**
 * A 'set' event is emitted when a tab panel is {@link OO.ui.IndexLayout#setTabPanel set} to be displayed by the
 * index layout.
 *
 * @event OO.ui.IndexLayout#set
 * @param {OO.ui.TabPanelLayout} tabPanel Current tab panel
 */

/**
 * An 'add' event is emitted when tab panels are {@link OO.ui.IndexLayout#addTabPanels added} to the index layout.
 *
 * @event OO.ui.IndexLayout#add
 * @param {OO.ui.TabPanelLayout[]} tabPanel Added tab panels
 * @param {number} index Index tab panels were added at
 */

/**
 * A 'remove' event is emitted when tab panels are {@link OO.ui.IndexLayout#clearTabPanels cleared} or
 * {@link OO.ui.IndexLayout#removeTabPanels removed} from the index.
 *
 * @event OO.ui.IndexLayout#remove
 * @param {OO.ui.TabPanelLayout[]} tabPanel Removed tab panels
 */

/* Methods */

/**
 * Handle stack layout focus.
 *
 * @private
 * @param {jQuery.Event} e Focusing event
 */
OO.ui.IndexLayout.prototype.onStackLayoutFocus = function ( e ) {
	// Find the tab panel that an element was focused within
	const $target = $( e.target ).closest( '.oo-ui-tabPanelLayout' );
	for ( const name in this.tabPanels ) {
		// Check for tab panel match, exclude current tab panel to find only tab panel changes
		if ( this.tabPanels[ name ].$element[ 0 ] === $target[ 0 ] &&
				name !== this.currentTabPanelName ) {
			this.setTabPanel( name );
			break;
		}
	}
};

/**
 * Handle stack layout set events.
 *
 * @private
 * @param {OO.ui.PanelLayout|null} tabPanel The tab panel that is now the current panel
 */
OO.ui.IndexLayout.prototype.onStackLayoutSet = function ( tabPanel ) {
	// If everything is unselected, do nothing
	if ( !tabPanel ) {
		return;
	}
	// Focus the first element on the newly selected panel
	if ( this.autoFocus && !OO.ui.isMobile() ) {
		this.focus();
	}
};

/**
 * Handle beforematch events triggered by the browser's find-in-page feature
 *
 * @param {Event} event 'beforematch' event
 */
OO.ui.IndexLayout.prototype.onStackLayoutBeforeMatch = function ( event ) {
	let tabPanel;
	// Find TabPanel from DOM node
	this.stackLayout.getItems().some( ( item ) => {
		if ( item.$element[ 0 ] === event.target ) {
			tabPanel = item;
			return true;
		}
		return false;
	} );
	if ( tabPanel ) {
		const tabItem = tabPanel.getTabItem();
		if ( tabItem ) {
			this.tabSelectWidget.selectItem( tabItem );
		}
	}
};

/**
 * Focus the first input in the current tab panel.
 *
 * If no tab panel is selected, the first selectable tab panel will be selected.
 * If the focus is already in an element on the current tab panel, nothing will happen.
 *
 * @param {number} [itemIndex] A specific item to focus on
 */
OO.ui.IndexLayout.prototype.focus = function ( itemIndex ) {
	const items = this.stackLayout.getItems();

	let tabPanel;
	if ( itemIndex !== undefined && items[ itemIndex ] ) {
		tabPanel = items[ itemIndex ];
	} else {
		tabPanel = this.stackLayout.getCurrentItem();
	}

	if ( !tabPanel ) {
		this.selectFirstSelectableTabPanel();
		tabPanel = this.stackLayout.getCurrentItem();
	}
	if ( !tabPanel ) {
		return;
	}
	// Only change the focus if is not already in the current page
	if ( !OO.ui.contains(
		tabPanel.$element[ 0 ],
		this.getElementDocument().activeElement,
		true
	) ) {
		tabPanel.focus();
	}
};

/**
 * Find the first focusable input in the index layout and focus
 * on it.
 */
OO.ui.IndexLayout.prototype.focusFirstFocusable = function () {
	OO.ui.findFocusable( this.stackLayout.$element ).focus();
};

/**
 * Handle tab widget select events.
 *
 * @private
 * @param {OO.ui.OptionWidget|null} item Selected item
 */
OO.ui.IndexLayout.prototype.onTabSelectWidgetSelect = function ( item ) {
	if ( item ) {
		this.setTabPanel( item.getData() );
	}
};

/**
 * Get the tab panel closest to the specified tab panel.
 *
 * @param {OO.ui.TabPanelLayout} tabPanel Tab panel to use as a reference point
 * @return {OO.ui.TabPanelLayout|null} Tab panel closest to the specified
 */
OO.ui.IndexLayout.prototype.getClosestTabPanel = function ( tabPanel ) {
	const tabPanels = this.stackLayout.getItems(),
		index = tabPanels.indexOf( tabPanel );

	if ( index === -1 ) {
		return null;
	}

	const next = tabPanels[ index + 1 ];
	const prev = tabPanels[ index - 1 ];
	// Prefer adjacent tab panels at the same level
	const level = this.tabSelectWidget.findItemFromData( tabPanel.getName() ).getLevel();
	if (
		prev &&
		level === this.tabSelectWidget.findItemFromData( prev.getName() ).getLevel()
	) {
		return prev;
	}
	if (
		next &&
		level === this.tabSelectWidget.findItemFromData( next.getName() ).getLevel()
	) {
		return next;
	}
	return prev || next || null;
};

/**
 * Get the tabs widget.
 *
 * @return {OO.ui.TabSelectWidget} Tabs widget
 */
OO.ui.IndexLayout.prototype.getTabs = function () {
	return this.tabSelectWidget;
};

/**
 * Get a tab panel by its symbolic name.
 *
 * @param {string} name Symbolic name of tab panel
 * @return {OO.ui.TabPanelLayout|undefined} Tab panel, if found
 */
OO.ui.IndexLayout.prototype.getTabPanel = function ( name ) {
	return this.tabPanels[ name ];
};

/**
 * Get the current tab panel.
 *
 * @return {OO.ui.TabPanelLayout|undefined} Current tab panel, if found
 */
OO.ui.IndexLayout.prototype.getCurrentTabPanel = function () {
	const name = this.getCurrentTabPanelName();
	return name ? this.getTabPanel( name ) : undefined;
};

/**
 * Get the symbolic name of the current tab panel.
 *
 * @return {string|null} Symbolic name of the current tab panel
 */
OO.ui.IndexLayout.prototype.getCurrentTabPanelName = function () {
	return this.currentTabPanelName;
};

/**
 * Add tab panels to the index layout.
 *
 * When tab panels are added with the same names as existing tab panels, the existing tab panels
 * will be automatically removed before the new tab panels are added.
 *
 * @param {OO.ui.TabPanelLayout[]} tabPanels Tab panels to add
 * @param {number} index Index of the insertion point
 * @fires OO.ui.IndexLayout#add
 * @chainable
 * @return {OO.ui.IndexLayout} The layout, for chaining
 */
OO.ui.IndexLayout.prototype.addTabPanels = function ( tabPanels, index ) {
	let i, len, name, tabPanel, tabItem, currentIndex;
	const stackLayoutTabPanels = this.stackLayout.getItems(),
		remove = [],
		tabItems = [];

	// Remove tab panels with same names
	for ( i = 0, len = tabPanels.length; i < len; i++ ) {
		tabPanel = tabPanels[ i ];
		name = tabPanel.getName();

		if ( Object.prototype.hasOwnProperty.call( this.tabPanels, name ) ) {
			// Correct the insertion index
			currentIndex = stackLayoutTabPanels.indexOf( this.tabPanels[ name ] );
			if ( currentIndex !== -1 && currentIndex + 1 < index ) {
				index--;
			}
			remove.push( this.tabPanels[ name ] );
		}
	}
	if ( remove.length ) {
		this.removeTabPanels( remove );
	}

	// Add new tab panels
	for ( i = 0, len = tabPanels.length; i < len; i++ ) {
		tabPanel = tabPanels[ i ];
		name = tabPanel.getName();
		this.tabPanels[ name ] = tabPanel;
		tabItem = new OO.ui.TabOptionWidget(
			Object.assign( { data: name }, tabPanel.getTabItemConfig() )
		);
		tabPanel.setTabItem( tabItem );
		tabItems.push( tabItem );
	}

	if ( tabItems.length ) {
		this.tabSelectWidget.addItems( tabItems, index );
		this.selectFirstSelectableTabPanel();
	}
	this.stackLayout.addItems( tabPanels, index );
	this.emit( 'add', tabPanels, index );

	return this;
};

/**
 * Remove the specified tab panels from the index layout.
 *
 * To remove all tab panels from the index, you may wish to use the #clearTabPanels method instead.
 *
 * @param {OO.ui.TabPanelLayout[]} tabPanels An array of tab panels to remove
 * @fires OO.ui.IndexLayout#remove
 * @chainable
 * @return {OO.ui.IndexLayout} The layout, for chaining
 */
OO.ui.IndexLayout.prototype.removeTabPanels = function ( tabPanels ) {
	let i, len, name, tabPanel;

	const items = [];

	for ( i = 0, len = tabPanels.length; i < len; i++ ) {
		tabPanel = tabPanels[ i ];
		name = tabPanel.getName();
		delete this.tabPanels[ name ];
		items.push( this.tabSelectWidget.findItemFromData( name ) );
		tabPanel.setTabItem( null );
	}
	if ( items.length ) {
		this.tabSelectWidget.removeItems( items );
		this.selectFirstSelectableTabPanel();
	}
	this.stackLayout.removeItems( tabPanels );
	this.emit( 'remove', tabPanels );

	return this;
};

/**
 * Clear all tab panels from the index layout.
 *
 * To remove only a subset of tab panels from the index, use the #removeTabPanels method.
 *
 * @fires OO.ui.IndexLayout#remove
 * @chainable
 * @return {OO.ui.IndexLayout} The layout, for chaining
 */
OO.ui.IndexLayout.prototype.clearTabPanels = function () {
	let i, len;

	const tabPanels = this.stackLayout.getItems();

	this.tabPanels = {};
	this.currentTabPanelName = null;
	this.tabSelectWidget.clearItems();
	for ( i = 0, len = tabPanels.length; i < len; i++ ) {
		tabPanels[ i ].setTabItem( null );
	}
	this.stackLayout.clearItems();

	this.emit( 'remove', tabPanels );

	return this;
};

/**
 * Set the current tab panel by symbolic name.
 *
 * @fires OO.ui.IndexLayout#set
 * @param {string} name Symbolic name of tab panel
 */
OO.ui.IndexLayout.prototype.setTabPanel = function ( name ) {
	let selectedItem,
		$focused,
		previousTabPanel,
		tabPanel;

	if ( name !== this.currentTabPanelName ) {
		tabPanel = this.getTabPanel( name );
		previousTabPanel = this.getCurrentTabPanel();
		selectedItem = this.tabSelectWidget.findSelectedItem();
		if ( !selectedItem || selectedItem.getData() !== name ) {
			this.tabSelectWidget.selectItemByData( name );
		}
		if ( tabPanel ) {
			if ( previousTabPanel ) {
				previousTabPanel.setActive( false );
				// Blur anything focused if the next tab panel doesn't have anything focusable.
				// This is not needed if the next tab panel has something focusable (because once
				// it is focused this blur happens automatically). If the layout is non-continuous,
				// this check is meaningless because the next tab panel is not visible yet and thus
				// can't hold focus.
				if (
					this.autoFocus &&
					!OO.ui.isMobile() &&
					this.stackLayout.isContinuous() &&
					OO.ui.findFocusable( tabPanel.$element ).length !== 0
				) {
					$focused = previousTabPanel.$element.find( ':focus' );
					if ( $focused.length ) {
						$focused[ 0 ].blur();
					}
				}
			}
			this.currentTabPanelName = name;
			tabPanel.setActive( true );
			this.stackLayout.setItem( tabPanel );
			if ( !this.stackLayout.isContinuous() && previousTabPanel ) {
				// This should not be necessary, since any inputs on the previous tab panel should
				// have been blurred when it was hidden, but browsers are not very consistent about
				// this.
				$focused = previousTabPanel.$element.find( ':focus' );
				if ( $focused.length ) {
					$focused[ 0 ].blur();
				}
			}
			this.emit( 'set', tabPanel );
		}
	}
};

/**
 * Select the first selectable tab panel.
 *
 * @chainable
 * @return {OO.ui.IndexLayout} The layout, for chaining
 */
OO.ui.IndexLayout.prototype.selectFirstSelectableTabPanel = function () {
	if ( !this.tabSelectWidget.findSelectedItem() ) {
		this.tabSelectWidget.selectItem( this.tabSelectWidget.findFirstSelectableItem() );
	}

	return this;
};
