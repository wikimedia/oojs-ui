/**
 * Dropdown menu of options.
 *
 * Dropdown menus provide a control for accessing a menu and compose a menu within the widget, which
 * can be accessed using the #getMenu method.
 *
 * Use with OO.ui.MenuItemWidget.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.IconElement
 * @mixins OO.ui.IndicatorElement
 * @mixins OO.ui.LabelElement
 * @mixins OO.ui.TitledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object} [menu] Configuration options to pass to menu widget
 */
OO.ui.DropdownWidget = function OoUiDropdownWidget( config ) {
	// Configuration initialization
	config = $.extend( { indicator: 'down' }, config );

	// Parent constructor
	OO.ui.DropdownWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.IconElement.call( this, config );
	OO.ui.IndicatorElement.call( this, config );
	OO.ui.LabelElement.call( this, config );
	OO.ui.TitledElement.call( this, $.extend( {}, config, { $titled: this.$label } ) );

	// Properties
	this.menu = new OO.ui.MenuWidget( $.extend( { $: this.$, widget: this }, config.menu ) );
	this.$handle = this.$( '<span>' );

	// Events
	this.$element.on( { click: this.onClick.bind( this ) } );
	this.menu.connect( this, { select: 'onMenuSelect' } );

	// Initialization
	this.$handle
		.addClass( 'oo-ui-dropdownWidget-handle' )
		.append( this.$icon, this.$label, this.$indicator );
	this.$element
		.addClass( 'oo-ui-dropdownWidget' )
		.append( this.$handle, this.menu.$element );
};

/* Setup */

OO.inheritClass( OO.ui.DropdownWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.DropdownWidget, OO.ui.IconElement );
OO.mixinClass( OO.ui.DropdownWidget, OO.ui.IndicatorElement );
OO.mixinClass( OO.ui.DropdownWidget, OO.ui.LabelElement );
OO.mixinClass( OO.ui.DropdownWidget, OO.ui.TitledElement );

/* Methods */

/**
 * Get the menu.
 *
 * @return {OO.ui.MenuWidget} Menu of widget
 */
OO.ui.DropdownWidget.prototype.getMenu = function () {
	return this.menu;
};

/**
 * Handles menu select events.
 *
 * @param {OO.ui.MenuItemWidget} item Selected menu item
 */
OO.ui.DropdownWidget.prototype.onMenuSelect = function ( item ) {
	var selectedLabel;

	if ( !item ) {
		return;
	}

	selectedLabel = item.getLabel();

	// If the label is a DOM element, clone it, because setLabel will append() it
	if ( selectedLabel instanceof jQuery ) {
		selectedLabel = selectedLabel.clone();
	}

	this.setLabel( selectedLabel );
};

/**
 * Handles mouse click events.
 *
 * @param {jQuery.Event} e Mouse click event
 */
OO.ui.DropdownWidget.prototype.onClick = function ( e ) {
	// Skip clicks within the menu
	if ( $.contains( this.menu.$element[0], e.target ) ) {
		return;
	}

	if ( !this.isDisabled() ) {
		if ( this.menu.isVisible() ) {
			this.menu.toggle( false );
		} else {
			this.menu.toggle( true );
		}
	}
	return false;
};
