/**
 * Layout with a content and menu area.
 *
 * The menu area can be positioned at the top, after, bottom or before. The content area will fill
 * all remaining space.
 *
 * @class
 * @extends OO.ui.Layout
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {number|string} [menuSize='18em'] Size of menu in pixels or any CSS unit
 * @cfg {boolean} [showMenu=true] Show menu
 * @cfg {string} [position='before'] Position of menu, either `top`, `after`, `bottom` or `before`
 * @cfg {boolean} [collapse] Collapse the menu out of view
 */
OO.ui.MenuLayout = function OoUiMenuLayout( config ) {
	var positions = this.constructor.static.menuPositions;

	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.MenuLayout.super.call( this, config );

	// Properties
	this.showMenu = config.showMenu !== false;
	this.menuSize = config.menuSize || '18em';
	this.menuPosition = positions[ config.menuPosition ] || positions.before;

	/**
	 * Menu DOM node
	 *
	 * @property {jQuery}
	 */
	this.$menu = this.$( '<div>' );
	/**
	 * Content DOM node
	 *
	 * @property {jQuery}
	 */
	this.$content = this.$( '<div>' );

	// Events
	this.$element.on( 'DOMNodeInsertedIntoDocument', this.onElementAttach.bind( this ) );

	// Initialization
	this.toggleMenu( this.showMenu );
	this.$menu
		.addClass( 'oo-ui-menuLayout-menu' )
		.css( this.menuPosition.sizeProperty, this.menuSize );
	this.$content.addClass( 'oo-ui-menuLayout-content' );
	this.$element
		.addClass( 'oo-ui-menuLayout ' + this.menuPosition.className )
		.append( this.$content, this.$menu );
};

/* Setup */

OO.inheritClass( OO.ui.MenuLayout, OO.ui.Layout );

/* Static Properties */

OO.ui.MenuLayout.static.menuPositions = {
	top: {
		sizeProperty: 'height',
		positionProperty: 'top',
		className: 'oo-ui-menuLayout-top'
	},
	after: {
		sizeProperty: 'width',
		positionProperty: 'right',
		rtlPositionProperty: 'left',
		className: 'oo-ui-menuLayout-after'
	},
	bottom: {
		sizeProperty: 'height',
		positionProperty: 'bottom',
		className: 'oo-ui-menuLayout-bottom'
	},
	before: {
		sizeProperty: 'width',
		positionProperty: 'left',
		rtlPositionProperty: 'right',
		className: 'oo-ui-menuLayout-before'
	}
};

/* Methods */

/**
 * Handle DOM attachment events
 */
OO.ui.MenuLayout.prototype.onElementAttach = function () {
	// getPositionProperty won't know about directionality until the layout is attached
	if ( this.showMenu ) {
		this.$content.css( this.getPositionProperty(), this.menuSize );
	}
};

/**
 * Toggle menu.
 *
 * @param {boolean} showMenu Show menu, omit to toggle
 * @chainable
 */
OO.ui.MenuLayout.prototype.toggleMenu = function ( showMenu ) {
	showMenu = showMenu === undefined ? !this.showMenu : !!showMenu;

	if ( this.showMenu !== showMenu ) {
		this.showMenu = showMenu;
		this.updateSizes();
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
 * Set menu size.
 *
 * @param {number|string} size Size of menu in pixels or any CSS unit
 * @chainable
 */
OO.ui.MenuLayout.prototype.setMenuSize = function ( size ) {
	this.menuSize = size;
	this.updateSizes();

	return this;
};

/**
 * Update menu and content CSS based on current menu size and visibility
 */
OO.ui.MenuLayout.prototype.updateSizes = function () {
	if ( this.showMenu ) {
		this.$menu
			.css( this.menuPosition.sizeProperty, this.menuSize )
			.css( 'overflow', '' );
		this.$content.css( this.getPositionProperty(), this.menuSize );
	} else {
		this.$menu
			.css( this.menuPosition.sizeProperty, 0 )
			.css( 'overflow', 'hidden' );
		this.$content.css( this.getPositionProperty(), 0 );
	}
};

/**
 * Get menu size.
 *
 * @return {number|string} Menu size
 */
OO.ui.MenuLayout.prototype.getMenuSize = function () {
	return this.menuSize;
};

/**
 * Set menu position.
 *
 * @param {string} position Position of menu, either `top`, `after`, `bottom` or `before`
 * @throws {Error} If position value is not supported
 * @chainable
 */
OO.ui.MenuLayout.prototype.setMenuPosition = function ( position ) {
	var positionProperty, positions = this.constructor.static.menuPositions;

	if ( !positions[ position ] ) {
		throw new Error( 'Cannot set position; unsupported position value: ' + position );
	}

	positionProperty = this.getPositionProperty();
	this.$menu.css( this.menuPosition.sizeProperty, '' );
	this.$content.css( positionProperty, '' );
	this.$element.removeClass( this.menuPosition.className );

	this.menuPosition = positions[ position ];

	this.updateSizes();
	this.$element.addClass( this.menuPosition.className );

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
 * Get the menu position property.
 *
 * @return {string} Menu position CSS property
 */
OO.ui.MenuLayout.prototype.getPositionProperty = function () {
	if ( this.menuPosition.rtlPositionProperty && this.$element.css( 'direction' ) === 'rtl' ) {
		return this.menuPosition.rtlPositionProperty;
	} else {
		return this.menuPosition.positionProperty;
	}
};
