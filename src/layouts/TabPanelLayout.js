/**
 * TabPanelLayouts are used within {@link OO.ui.IndexLayout index layouts} to create tab panels that
 * users can select and display from the index's optional {@link OO.ui.TabSelectWidget tab}
 * navigation. TabPanels are usually not instantiated directly, rather extended to include the
 * required content and functionality.
 *
 * Each tab panel must have a unique symbolic name, which is passed to the constructor. In addition,
 * the tab panel's tab item is customized (with a label) using the #setupTabItem method. See
 * {@link OO.ui.IndexLayout IndexLayout} for an example.
 *
 * @class
 * @extends OO.ui.PanelLayout
 *
 * @constructor
 * @param {string} name Unique symbolic name of tab panel
 * @param {Object} [config] Configuration options
 * @param {jQuery|string|Function|OO.ui.HtmlSnippet} [config.label] Label for tab panel's tab
 * @param {Object} [config.tabItemConfig] Additional tab item config
 */
OO.ui.TabPanelLayout = function OoUiTabPanelLayout( name, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( name ) && config === undefined ) {
		config = name;
		name = config.name;
	}

	// Configuration initialization
	config = Object.assign( { scrollable: true }, config );

	// Parent constructor
	OO.ui.TabPanelLayout.super.call( this, config );

	// Properties
	this.name = name;
	this.label = config.label;
	this.tabItemConfig = config.tabItemConfig || {};
	this.tabItem = null;
	this.active = false;

	// Initialization
	this.$element
		.addClass( 'oo-ui-tabPanelLayout' )
		.attr( 'role', 'tabpanel' );
};

/* Setup */

OO.inheritClass( OO.ui.TabPanelLayout, OO.ui.PanelLayout );

/* Events */

/**
 * An 'active' event is emitted when the tab panel becomes active. Tab panels become active when
 * they are shown in a index layout that is configured to display only one tab panel at a time.
 *
 * @event OO.ui.TabPanelLayout#active
 * @param {boolean} active Tab panel is active
 */

/* Methods */

/**
 * Get the symbolic name of the tab panel.
 *
 * @return {string} Symbolic name of tab panel
 */
OO.ui.TabPanelLayout.prototype.getName = function () {
	return this.name;
};

/**
 * Check if tab panel is active.
 *
 * Tab panels become active when they are shown in a {@link OO.ui.IndexLayout index layout} that is
 * configured to display only one tab panel at a time. Additional CSS is applied to the tab panel's
 * tab item to reflect the active state.
 *
 * @return {boolean} Tab panel is active
 */
OO.ui.TabPanelLayout.prototype.isActive = function () {
	return this.active;
};

/**
 * Get tab item.
 *
 * The tab item allows users to access the tab panel from the index's tab
 * navigation. The tab item itself can be customized (with a label, level, etc.) using the
 * #setupTabItem method.
 *
 * @return {OO.ui.TabOptionWidget|null} Tab option widget
 */
OO.ui.TabPanelLayout.prototype.getTabItem = function () {
	return this.tabItem;
};

/**
 * Get config for creating a tab item.
 *
 * @return {Object} Tab option config
 */
OO.ui.TabPanelLayout.prototype.getTabItemConfig = function () {
	return this.tabItemConfig;
};

/**
 * Set or unset the tab item.
 *
 * Specify a {@link OO.ui.TabOptionWidget tab option} to set it,
 * or `null` to clear the tab item. To customize the tab item itself (e.g., to set a label or tab
 * level), use #setupTabItem instead of this method.
 *
 * @param {OO.ui.TabOptionWidget|null} tabItem Tab option widget, null to clear
 * @chainable
 * @return {OO.ui.TabPanelLayout} The layout, for chaining
 */
OO.ui.TabPanelLayout.prototype.setTabItem = function ( tabItem ) {
	this.tabItem = tabItem || null;
	if ( tabItem ) {
		this.setupTabItem();
	}
	return this;
};

/**
 * Set up the tab item.
 *
 * Use this method to customize the tab item (e.g., to add a label or tab level). To set or unset
 * the tab item itself (with a {@link OO.ui.TabOptionWidget tab option} or `null`), use
 * the #setTabItem method instead.
 *
 * @param {OO.ui.TabOptionWidget} tabItem Tab option widget to set up
 * @chainable
 * @return {OO.ui.TabPanelLayout} The layout, for chaining
 */
OO.ui.TabPanelLayout.prototype.setupTabItem = function () {
	this.$element.attr( 'aria-labelledby', this.tabItem.getElementId() );

	this.tabItem.$element.attr( 'aria-controls', this.getElementId() );

	if ( this.label ) {
		this.tabItem.setLabel( this.label );
	}
	return this;
};

/**
 * Set the tab panel to its 'active' state.
 *
 * Tab panels become active when they are shown in a index layout that is configured to display only
 * one tab panel at a time. Additional CSS is applied to the tab item to reflect the tab panel's
 * active state. Outside of the index context, setting the active state on a tab panel does nothing.
 *
 * @param {boolean} [active=false] Tab panel is active
 * @fires OO.ui.TabPanelLayout#active
 */
OO.ui.TabPanelLayout.prototype.setActive = function ( active ) {
	active = !!active;

	if ( active !== this.active ) {
		this.active = active;
		this.$element.toggleClass( 'oo-ui-tabPanelLayout-active', this.active );
		this.emit( 'active', this.active );
	}
};
