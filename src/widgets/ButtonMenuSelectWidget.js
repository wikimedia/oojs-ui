/**
 * ButtonMenuSelectWidgets launch a menu of options created with OO.ui.MenuOptionWidget.
 * The ButtonMenuSelectWidget takes care of opening and displaying the menu so that
 * users can interact with it.
 *
 *     @example
 *     // A ButtonMenuSelectWidget with a menu that contains three options.
 *     var buttonMenu = new OO.ui.ButtonMenuSelectWidget( {
 *         icon: 'menu',
 *         menu: {
 *             items: [
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'a',
 *                     label: 'First'
 *                 } ),
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'b',
 *                     label: 'Second'
 *                 } ),
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'c',
 *                     label: 'Third'
 *                 } )
 *             ]
 *         }
 *     } );
 *
 *     $( document.body ).append( buttonMenu.$element );
 *
 *     // When using the `clearOnSelect` option, listen to the `choose` event
 *     // to avoid getting the null select event.
 *     buttonMenu.getMenu().on( 'choose', function ( menuOption ) {
 *         console.log( menuOption.getData() );
 *     } );
 *
 * @class
 * @extends OO.ui.ButtonWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [clearOnSelect=true] Clear selection immediately after making it
 * @cfg {Object} [menuClass=OO.ui.MenuSelectWidget] Class for the menu widget. This
 *  must be a subclass of {@link OO.ui.MenuSelectWidget menu select widget}.
 * @cfg {Object} [menu] Configuration options to pass to
 *  {@link OO.ui.MenuSelectWidget menu select widget}.
 * @cfg {jQuery|boolean} [$overlay] Render the menu into a separate layer. This configuration is
 *  useful in cases where the expanded menu is larger than its containing `<div>`. The specified
 *  overlay layer is usually on top of the containing `<div>` and has a larger area. By default,
 *  the menu uses relative positioning. Pass 'true' to use the default overlay.
 *  See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
 */
OO.ui.ButtonMenuSelectWidget = function OoUiButtonMenuSelectWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.ButtonMenuSelectWidget.super.call( this, config );

	this.$overlay = ( config.$overlay === true ?
		OO.ui.getDefaultOverlay() : config.$overlay ) || this.$element;

	var MenuClass = config.menuClass || OO.ui.MenuSelectWidget;

	// Properties
	this.clearOnSelect = config.clearOnSelect !== false;
	this.menu = new MenuClass( $.extend( {
		widget: this,
		$floatableContainer: this.$element
	}, config.menu ) );

	// Events
	this.connect( this, {
		click: 'onButtonMenuClick'
	} );
	this.getMenu().connect( this, {
		select: 'onMenuSelect',
		toggle: 'onMenuToggle'
	} );

	// Initialization
	this.$button
		.attr( {
			'aria-expanded': 'false',
			'aria-haspopup': 'true',
			'aria-owns': this.menu.getElementId()
		} );
	this.$element.addClass( 'oo-ui-buttonMenuSelectWidget' );
	this.$overlay.append( this.menu.$element );
};

/* Setup */

OO.inheritClass( OO.ui.ButtonMenuSelectWidget, OO.ui.ButtonWidget );

/* Methods */

/**
 * Get the menu.
 *
 * @return {OO.ui.MenuSelectWidget} Menu of widget
 */
OO.ui.ButtonMenuSelectWidget.prototype.getMenu = function () {
	return this.menu;
};

/**
 * Handle menu select events.
 *
 * @private
 * @param {OO.ui.MenuOptionWidget} item Selected menu item
 */
OO.ui.ButtonMenuSelectWidget.prototype.onMenuSelect = function ( item ) {
	if ( this.clearOnSelect && item ) {
		// This will cause an additional 'select' event to fire, so
		// users should probably listen to the 'choose' event.
		this.getMenu().selectItem();
	}
};

/**
 * Handle menu toggle events.
 *
 * @private
 * @param {boolean} isVisible Open state of the menu
 */
OO.ui.ButtonMenuSelectWidget.prototype.onMenuToggle = function ( isVisible ) {
	this.$element.toggleClass( 'oo-ui-buttonElement-pressed', isVisible );
};

/**
 * Handle mouse click events.
 *
 * @private
 */
OO.ui.ButtonMenuSelectWidget.prototype.onButtonMenuClick = function () {
	this.menu.toggle();
};
