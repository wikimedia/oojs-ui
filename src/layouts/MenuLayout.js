/**
 * MenuLayouts combine a menu and a content {@link OO.ui.PanelLayout panel}. The menu is positioned
 * relative to the content (after, before, top, or bottom) and its size is customized with the
 * #menuSize config. The content area will fill all remaining space.
 *
 *     @example
 *     var menuLayout,
 *         menuPanel = new OO.ui.PanelLayout( {
 *             padded: true,
 *             expanded: true,
 *             scrollable: true
 *         } ),
 *         contentPanel = new OO.ui.PanelLayout( {
 *             padded: true,
 *             expanded: true,
 *             scrollable: true
 *         } ),
 *         select = new OO.ui.SelectWidget( {
 *             items: [
 *                 new OO.ui.OptionWidget( {
 *                     data: 'before',
 *                     label: 'Before'
 *                 } ),
 *                 new OO.ui.OptionWidget( {
 *                     data: 'after',
 *                     label: 'After'
 *                 } ),
 *                 new OO.ui.OptionWidget( {
 *                     data: 'top',
 *                     label: 'Top'
 *                 } ),
 *                 new OO.ui.OptionWidget( {
 *                     data: 'bottom',
 *                     label: 'Bottom'
 *                 } )
 *              ]
 *         } ).on( 'select', function ( item ) {
 *            menuLayout.setMenuPosition( item.getData() );
 *         } );
 *
 *     menuLayout = new OO.ui.MenuLayout( {
 *         position: 'top',
 *         menuPanel: menuPanel,
 *         contentPanel: contentPanel
 *     } );
 *     menuLayout.$menu.append(
 *         menuPanel.$element.append( '<b>Menu panel</b>', select.$element )
 *     );
 *     menuLayout.$content.append(
 *         contentPanel.$element.append(
 *             '<b>Content panel</b>',
 *             '<p>Note that the menu is positioned relative to the content panel: ' +
 *             'top, bottom, after, before.</p>'
 *          )
 *     );
 *     $( document.body ).append( menuLayout.$element );
 *
 * If menu size needs to be overridden, it can be accomplished using CSS similar to the snippet
 * below. MenuLayout's CSS will override the appropriate values with 'auto' or '0' to display the
 * menu correctly. If `menuPosition` is known beforehand, CSS rules corresponding to other positions
 * may be omitted.
 *
 *     .oo-ui-menuLayout-menu {
 *         width: 200px;
 *         height: 200px;
 *     }
 *
 *     .oo-ui-menuLayout-content {
 *         top: 200px;
 *         left: 200px;
 *         right: 200px;
 *         bottom: 200px;
 *     }
 *
 * @class
 * @extends OO.ui.Layout
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {OO.ui.PanelLayout} [menuPanel] Menu panel
 * @cfg {OO.ui.PanelLayout} [contentPanel] Content panel
 * @cfg {boolean} [expanded=true] Expand the layout to fill the entire parent element.
 * @cfg {boolean} [showMenu=true] Show menu
 * @cfg {string} [menuPosition='before'] Position of menu: `top`, `after`, `bottom` or `before`
 */
OO.ui.MenuLayout = function OoUiMenuLayout( config ) {
	// Configuration initialization
	config = $.extend( {
		expanded: true,
		showMenu: true,
		menuPosition: 'before'
	}, config );

	// Parent constructor
	OO.ui.MenuLayout.parent.call( this, config );

	this.menuPanel = null;
	this.contentPanel = null;
	this.expanded = !!config.expanded;
	/**
	 * Menu DOM node
	 *
	 * @property {jQuery}
	 */
	this.$menu = $( '<div>' );
	/**
	 * Content DOM node
	 *
	 * @property {jQuery}
	 */
	this.$content = $( '<div>' );

	// Initialization
	this.$menu.addClass( 'oo-ui-menuLayout-menu' );
	this.$content.addClass( 'oo-ui-menuLayout-content' );
	this.$element.addClass( 'oo-ui-menuLayout' );
	if ( config.expanded ) {
		this.$element.addClass( 'oo-ui-menuLayout-expanded' );
	} else {
		this.$element.addClass( 'oo-ui-menuLayout-static' );
	}
	if ( config.menuPanel ) {
		this.setMenuPanel( config.menuPanel );
	}
	if ( config.contentPanel ) {
		this.setContentPanel( config.contentPanel );
	}
	this.setMenuPosition( config.menuPosition );
	this.toggleMenu( config.showMenu );
};

/* Setup */

OO.inheritClass( OO.ui.MenuLayout, OO.ui.Layout );

/* Methods */

/**
 * Toggle menu.
 *
 * @param {boolean} showMenu Show menu, omit to toggle
 * @chainable
 * @return {OO.ui.MenuLayout} The layout, for chaining
 */
OO.ui.MenuLayout.prototype.toggleMenu = function ( showMenu ) {
	showMenu = showMenu === undefined ? !this.showMenu : !!showMenu;

	if ( this.showMenu !== showMenu ) {
		this.showMenu = showMenu;
		this.$element
			.toggleClass( 'oo-ui-menuLayout-showMenu', this.showMenu )
			.toggleClass( 'oo-ui-menuLayout-hideMenu', !this.showMenu );
		this.$menu.attr( 'aria-hidden', this.showMenu ? 'false' : 'true' );
	}

	return this;
};

/**
 * Check if menu is visible
 *
 * @return {boolean} Menu is visible
 */
OO.ui.MenuLayout.prototype.isMenuVisible = function () {
	return this.showMenu;
};

/**
 * Set menu position.
 *
 * @param {string} position Position of menu, either `top`, `after`, `bottom` or `before`
 * @chainable
 * @return {OO.ui.MenuLayout} The layout, for chaining
 */
OO.ui.MenuLayout.prototype.setMenuPosition = function ( position ) {
	if ( [ 'top', 'bottom', 'before', 'after' ].indexOf( position ) === -1 ) {
		position = 'before';
	}

	this.$element.removeClass( 'oo-ui-menuLayout-' + this.menuPosition );
	this.menuPosition = position;
	if ( this.menuPosition === 'top' || this.menuPosition === 'before' ) {
		this.$element.append( this.$menu, this.$content );
	} else {
		this.$element.append( this.$content, this.$menu );
	}
	this.$element.addClass( 'oo-ui-menuLayout-' + position );

	return this;
};

/**
 * Get menu position.
 *
 * @return {string} Menu position
 */
OO.ui.MenuLayout.prototype.getMenuPosition = function () {
	return this.menuPosition;
};

/**
 * Set the menu panel.
 *
 * @param {OO.ui.PanelLayout} menuPanel Menu panel
 */
OO.ui.MenuLayout.prototype.setMenuPanel = function ( menuPanel ) {
	this.menuPanel = menuPanel;
	this.$menu.append( this.menuPanel.$element );
};

/**
 * Set the content panel.
 *
 * @param {OO.ui.PanelLayout} contentPanel Content panel
 */
OO.ui.MenuLayout.prototype.setContentPanel = function ( contentPanel ) {
	this.contentPanel = contentPanel;
	this.$content.append( this.contentPanel.$element );
};

/**
 * Clear the menu panel.
 */
OO.ui.MenuLayout.prototype.clearMenuPanel = function () {
	this.menuPanel = null;
	this.$menu.empty();
};

/**
 * Clear the content panel.
 */
OO.ui.MenuLayout.prototype.clearContentPanel = function () {
	this.contentPanel = null;
	this.$content.empty();
};

/**
 * Reset the scroll offset of all panels and the tab select widget
 *
 * @inheritdoc
 */
OO.ui.MenuLayout.prototype.resetScroll = function () {
	if ( this.menuPanel ) {
		this.menuPanel.resetScroll();
	}
	if ( this.contentPanel ) {
		this.contentPanel.resetScroll();
	}

	return this;
};
