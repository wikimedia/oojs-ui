/**
 * IndexLayouts contain {@link OO.ui.TabPanelLayout tab panel layouts} as well as
 * {@link OO.ui.TabSelectWidget tabs} that allow users to easily navigate through the tab panels and
 * select which one to display. By default, only one tab panel is displayed at a time. When a user
 * navigates to a new tab panel, the index layout automatically focuses on the first focusable element,
 * unless the default setting is changed.
 *
 * TODO: This class is similar to BookletLayout, we may want to refactor to reduce duplication
 *
 *     @example
 *     // Example of a IndexLayout that contains two TabPanelLayouts.
 *
 *     function TabPanelOneLayout( name, config ) {
 *         TabPanelOneLayout.parent.call( this, name, config );
 *         this.$element.append( '<p>First tab panel</p>' );
 *     }
 *     OO.inheritClass( TabPanelOneLayout, OO.ui.TabPanelLayout );
 *     TabPanelOneLayout.prototype.setupTabItem = function () {
 *         this.tabItem.setLabel( 'Tab panel one' );
 *     };
 *
 *     var tabPanel1 = new TabPanelOneLayout( 'one' ),
 *         tabPanel2 = new OO.ui.TabPanelLayout( 'two', { label: 'Tab panel two' } );
 *
 *     tabPanel2.$element.append( '<p>Second tab panel</p>' );
 *
 *     var index = new OO.ui.IndexLayout();
 *
 *     index.addTabPanelss ( [ tabPanel1, tabPanel2 ] );
 *     $( 'body' ).append( index.$element );
 *
 * @class
 * @extends OO.ui.MenuLayout
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [continuous=false] Show all tab panels, one after another
 * @cfg {boolean} [expanded=true] Expand the content panel to fill the entire parent element.
 * @cfg {boolean} [autoFocus=true] Focus on the first focusable element when a new tab panel is displayed. Disabled on mobile.
 */
OO.ui.IndexLayout = function OoUiIndexLayout( config ) {
	// Configuration initialization
	config = $.extend( {}, config, { menuPosition: 'top' } );

	// Parent constructor
	OO.ui.IndexLayout.parent.call( this, config );

	// Properties
	this.currentTabPanelName = null;
	this.tabPanels = {};

	Object.defineProperty( this, 'currentCardName', {
		// TODO: read documentation
		configurable: true,
		enumerable: true,
		get: function () {
			OO.ui.warnDeprecation( 'IndexLayout\'s currentCardName property is deprecated. Use currentTabPanelName instead. See T155152' );
			return this.currentTabPanelName;
		},
		set: function ( value ) {
			OO.ui.warnDeprecation( 'IndexLayout\'s currentCardName property is deprecated. Use currentTabPanelName instead. See T155152' );
			this.currentTabPanelName = value;
		}
	} );

	Object.defineProperty( this, 'cards', {
		// TODO: read documentation
		configurable: true,
		enumerable: true,
		get: function () {
			OO.ui.warnDeprecation( 'IndexLayout\'s cards property is deprecated. Use tabPanels instead. See T155152' );
			return this.tabPanels;
		},
		set: function ( value ) {
			OO.ui.warnDeprecation( 'IndexLayout\'s cards property is deprecated. Use tabPanels instead. See T155152' );
			this.tabPanels = value;
		}
	} );

	this.ignoreFocus = false;
	this.stackLayout = new OO.ui.StackLayout( {
		continuous: !!config.continuous,
		expanded: config.expanded
	} );
	this.$content.append( this.stackLayout.$element );
	this.autoFocus = config.autoFocus === undefined || !!config.autoFocus;

	this.tabSelectWidget = new OO.ui.TabSelectWidget();
	this.tabPanel = new OO.ui.PanelLayout();
	this.$menu.append( this.tabPanel.$element );

	this.toggleMenu( true );

	// Events
	this.stackLayout.connect( this, { set: 'onStackLayoutSet' } );
	this.tabSelectWidget.connect( this, { select: 'onTabSelectWidgetSelect' } );
	if ( this.autoFocus ) {
		// Event 'focus' does not bubble, but 'focusin' does
		this.stackLayout.$element.on( 'focusin', this.onStackLayoutFocus.bind( this ) );
	}

	// Initialization
	this.$element.addClass( 'oo-ui-indexLayout' );
	this.stackLayout.$element.addClass( 'oo-ui-indexLayout-stackLayout' );
	this.tabPanel.$element
		.addClass( 'oo-ui-indexLayout-tabPanel' )
		.append( this.tabSelectWidget.$element );
};

/* Setup */

OO.inheritClass( OO.ui.IndexLayout, OO.ui.MenuLayout );

/* Events */

/**
 * A 'set' event is emitted when a tab panel is {@link #setTabPanel set} to be displayed by the index layout.
 * @event set
 * @param {OO.ui.TabPanelLayout} tabPanel Current tab panel
 */

/**
 * An 'add' event is emitted when tab panels are {@link #addTabPanels added} to the index layout.
 *
 * @event add
 * @param {OO.ui.TabPanelLayout[]} tabPanel Added tab panels
 * @param {number} index Index tab panels were added at
 */

/**
 * A 'remove' event is emitted when tab panels are {@link #clearTabPanels cleared} or
 * {@link #removeTabPanels removed} from the index.
 *
 * @event remove
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
	var name, $target;

	// Find the tab panel that an element was focused within
	$target = $( e.target ).closest( '.oo-ui-tabPanelLayout' );
	for ( name in this.tabPanels ) {
		// Check for tab panel match, exclude current tab panel to find only tab panel changes
		if ( this.tabPanels[ name ].$element[ 0 ] === $target[ 0 ] && name !== this.currentTabPanelName ) {
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
	var layout = this;
	if ( tabPanel ) {
		tabPanel.scrollElementIntoView().done( function () {
			if ( layout.autoFocus && !OO.ui.isMobile() ) {
				layout.focus();
			}
		} );
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
	var tabPanel,
		items = this.stackLayout.getItems();

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
	if ( !OO.ui.contains( tabPanel.$element[ 0 ], this.getElementDocument().activeElement, true ) ) {
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
	var next, prev, level,
		tabPanels = this.stackLayout.getItems(),
		index = tabPanels.indexOf( tabPanel );

	if ( index !== -1 ) {
		next = tabPanels[ index + 1 ];
		prev = tabPanels[ index - 1 ];
		// Prefer adjacent tab panels at the same level
		level = this.tabSelectWidget.getItemFromData( tabPanel.getName() ).getLevel();
		if (
			prev &&
			level === this.tabSelectWidget.getItemFromData( prev.getName() ).getLevel()
		) {
			return prev;
		}
		if (
			next &&
			level === this.tabSelectWidget.getItemFromData( next.getName() ).getLevel()
		) {
			return next;
		}
	}
	return prev || next || null;
};

/**
 * Get the tab panel closest to the specified tab panel.
 *
 * @param {OO.ui.TabPanelLayout} tabPanel Tab panel to use as a reference point
 * @return {OO.ui.TabPanelLayout|null} Tab panel closest to the specified
 * @deprecated since v0.22.0, use `getClosestTabPanel` instead
 */
OO.ui.IndexLayout.prototype.getClosestCard = function ( tabPanel ) {
	OO.ui.warnDeprecation( 'IndexLayout\'s getClosestCard method is deprecated. Use getClosestTabPanel instead. See T155152' );
	return this.getClosestTabPanel( tabPanel );
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
 * Get a tab panel by its symbolic name.
 *
 * @param {string} name Symbolic name of tab panel
 * @return {OO.ui.TabPanelLayout|undefined} Tab panel, if found
 * @deprecated since v0.22.0, use `getTabPanel` instead
 */
OO.ui.IndexLayout.prototype.getCard = function ( name ) {
	OO.ui.warnDeprecation( 'IndexLayout\'s getCard method is deprecated. Use getTabPanel instead. See T155152' );
	return this.getTabPanel( name );
};

/**
 * Get the current tab panel.
 *
 * @return {OO.ui.TabPanelLayout|undefined} Current tab panel, if found
 */
OO.ui.IndexLayout.prototype.getCurrentTabPanel = function () {
	var name = this.getCurrentTabPanelName();
	return name ? this.getTabPanel( name ) : undefined;
};

/**
 * Get the current tab panel.
 *
 * @return {OO.ui.TabPanelLayout|undefined} Current tab panel, if found
 * @deprecated since v0.22.0, use `getCurrentTabPanel` instead
 */
OO.ui.IndexLayout.prototype.getCurrentCard = function () {
	OO.ui.warnDeprecation( 'IndexLayout\'s getCurrentCard method is deprecated. Use getCurrentTabPanel instead. See T155152' );
	return this.getCurrentTabPanel();
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
 * Get the symbolic name of the current tab panel.
 *
 * @return {string|null} Symbolic name of the current tab panel
 * @deprecated since v0.22.0, use `getCurrentTabPanelName` instead
 */
OO.ui.IndexLayout.prototype.getCurrentCardName = function () {
	OO.ui.warnDeprecation( 'IndexLayout\'s getCurrentCardName method is deprecated. Use getCurrentTabPanelName instead. See T155152' );
	return this.getCurrentTabPanelName();
};

/**
 * Add tab panels to the index layout
 *
 * When tab panels are added with the same names as existing tab panels, the existing tab panels
 * will be automatically removed before the new tab panels are added.
 *
 * @param {OO.ui.TabPanelLayout[]} tabPanels Tab panels to add
 * @param {number} index Index of the insertion point
 * @fires add
 * @chainable
 */
OO.ui.IndexLayout.prototype.addTabPanels = function ( tabPanels, index ) {
	var i, len, name, tabPanel, item, currentIndex,
		stackLayoutTabPanels = this.stackLayout.getItems(),
		remove = [],
		items = [];

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
		this.tabPanels[ tabPanel.getName() ] = tabPanel;
		item = new OO.ui.TabOptionWidget( { data: name } );
		tabPanel.setTabItem( item );
		items.push( item );
	}

	if ( items.length ) {
		this.tabSelectWidget.addItems( items, index );
		this.selectFirstSelectableTabPanel();
	}
	this.stackLayout.addItems( tabPanels, index );
	this.emit( 'add', tabPanels, index );

	return this;
};

/**
 * Add tab panels to the index layout
 *
 * When tab panels are added with the same names as existing tab panels, the existing tab panels
 * will be automatically removed before the new tab panels are added.
 *
 * @param {OO.ui.TabPanelLayout[]} tabPanels Tab panels to add
 * @param {number} index Index of the insertion point
 * @fires add
 * @chainable
 * @deprecated since v0.22.0, use `addTabPanels` instead
 */
OO.ui.IndexLayout.prototype.addCards = function ( tabPanels, index ) {
	OO.ui.warnDeprecation( 'IndexLayout\'s addCards method is deprecated. Use addTabPanels instead. See T155152' );
	return this.addTabPanels( tabPanels, index );
};

/**
 * Remove the specified tab panels from the index layout.
 *
 * To remove all tab panels from the index, you may wish to use the #clearTabPanels method instead.
 *
 * @param {OO.ui.TabPanelLayout[]} tabPanels An array of tab panels to remove
 * @fires remove
 * @chainable
 */
OO.ui.IndexLayout.prototype.removeTabPanels = function ( tabPanels ) {
	var i, len, name, tabPanel,
		items = [];

	for ( i = 0, len = tabPanels.length; i < len; i++ ) {
		tabPanel = tabPanels[ i ];
		name = tabPanel.getName();
		delete this.tabPanels[ name ];
		items.push( this.tabSelectWidget.getItemFromData( name ) );
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
 * Remove the specified tab panels from the index layout.
 *
 * To remove all tab panels from the index, you may wish to use the #clearTabPanels method instead.
 *
 * @param {OO.ui.TabPanelLayout[]} tabPanels An array of tab panels to remove
 * @fires remove
 * @chainable
 * @deprecated since v0.22.0, use `removeTabPanels` instead
 */
OO.ui.IndexLayout.prototype.removeCards = function ( tabPanels ) {
	OO.ui.warnDeprecation( 'IndexLayout\'s removeCards method is deprecated. Use removeTabPanels instead. See T155152.' );
	return this.removeTabPanels( tabPanels );
};

/**
 * Clear all tab panels from the index layout.
 *
 * To remove only a subset of tab panels from the index, use the #removeTabPanels method.
 *
 * @fires remove
 * @chainable
 */
OO.ui.IndexLayout.prototype.clearTabPanels = function () {
	var i, len,
		tabPanels = this.stackLayout.getItems();

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
 * Clear all tab panels from the index layout.
 *
 * To remove only a subset of tab panels from the index, use the #removeTabPanels method.
 *
 * @fires remove
 * @chainable
 * @deprecated since v0.22.0, use `clearTabPanels` instead
 */
OO.ui.IndexLayout.prototype.clearCards = function () {
	OO.ui.warnDeprecation( 'IndexLayout\'s clearCards method is deprecated. Use clearTabPanels instead. See T155152.' );
	return this.clearTabPanels();
};

/**
 * Set the current tab panel by symbolic name.
 *
 * @fires set
 * @param {string} name Symbolic name of tab panel
 */
OO.ui.IndexLayout.prototype.setTabPanel = function ( name ) {
	var selectedItem,
		$focused,
		tabPanel = this.tabPanels[ name ],
		previousTabPanel = this.currentTabPanelName && this.tabPanels[ this.currentTabPanelName ];

	if ( name !== this.currentTabPanelName ) {
		selectedItem = this.tabSelectWidget.getSelectedItem();
		if ( selectedItem && selectedItem.getData() !== name ) {
			this.tabSelectWidget.selectItemByData( name );
		}
		if ( tabPanel ) {
			if ( previousTabPanel ) {
				previousTabPanel.setActive( false );
				// Blur anything focused if the next tab panel doesn't have anything focusable.
				// This is not needed if the next tab panel has something focusable (because once it is focused
				// this blur happens automatically). If the layout is non-continuous, this check is
				// meaningless because the next tab panel is not visible yet and thus can't hold focus.
				if (
					this.autoFocus &&
					!OO.ui.isMobile() &&
					this.stackLayout.continuous &&
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
			if ( !this.stackLayout.continuous && previousTabPanel ) {
				// This should not be necessary, since any inputs on the previous tab panel should have been
				// blurred when it was hidden, but browsers are not very consistent about this.
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
 * Set the current tab panel by symbolic name.
 *
 * @fires set
 * @param {string} name Symbolic name of tab panel
 * @deprecated since v0.22.0, use `setTabPanel` instead
 */
OO.ui.IndexLayout.prototype.setCard = function ( name ) {
	OO.ui.warnDeprecation( 'IndexLayout\'s setCard method is deprecated. Use setTabPanel instead. See T155152.' );
	return this.setTabPanel( name );
};

/**
 * Select the first selectable tab panel.
 *
 * @chainable
 */
OO.ui.IndexLayout.prototype.selectFirstSelectableTabPanel = function () {
	if ( !this.tabSelectWidget.getSelectedItem() ) {
		this.tabSelectWidget.selectItem( this.tabSelectWidget.getFirstSelectableItem() );
	}

	return this;
};

/**
 * Select the first selectable tab panel.
 *
 * @chainable
 * @deprecated since v0.22.0, use `selectFirstSelectableTabPanel` instead
 */
OO.ui.IndexLayout.prototype.selectFirstSelectableCard = function () {
	OO.ui.warnDeprecation( 'IndexLayout\'s selectFirstSelectableCard method is deprecated. Use selectFirestSelectableTabPanel instead. See T155152.' );
	return this.selectFirstSelectableTabPanel();
};
