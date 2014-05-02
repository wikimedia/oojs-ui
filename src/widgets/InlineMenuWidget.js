/**
 * Inline menu of options.
 *
 * Use with OO.ui.MenuOptionWidget.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.IconedElement
 * @mixins OO.ui.IndicatedElement
 * @mixins OO.ui.LabeledElement
 * @mixins OO.ui.TitledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object} [menu] Configuration options to pass to menu widget
 */
OO.ui.InlineMenuWidget = function OoUiInlineMenuWidget( config ) {
	// Configuration initialization
	config = $.extend( { 'indicator': 'down' }, config );

	// Parent constructor
	OO.ui.InlineMenuWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.IconedElement.call( this, this.$( '<span>' ), config );
	OO.ui.IndicatedElement.call( this, this.$( '<span>' ), config );
	OO.ui.LabeledElement.call( this, this.$( '<span>' ), config );
	OO.ui.TitledElement.call( this, this.$label, config );

	// Properties
	this.menu = new OO.ui.MenuWidget( $.extend( { '$': this.$ }, config.menu ) );
	this.$handle = this.$( '<span>' );

	// Events
	this.$element.on( { 'click': OO.ui.bind( this.onClick, this ) } );
	this.menu.connect( this, { 'select': 'onMenuSelect' } );

	// Initialization
	this.$handle
		.addClass( 'oo-ui-inlineMenuWidget-handle' )
		.append( this.$icon, this.$label, this.$indicator );
	this.$element
		.addClass( 'oo-ui-inlineMenuWidget' )
		.append( this.$handle, this.menu.$element );
};

/* Setup */

OO.inheritClass( OO.ui.InlineMenuWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.InlineMenuWidget, OO.ui.IconedElement );
OO.mixinClass( OO.ui.InlineMenuWidget, OO.ui.IndicatedElement );
OO.mixinClass( OO.ui.InlineMenuWidget, OO.ui.LabeledElement );
OO.mixinClass( OO.ui.InlineMenuWidget, OO.ui.TitledElement );

/* Methods */

/**
 * Get the menu.
 *
 * @return {OO.ui.MenuWidget} Menu of widget
 */
OO.ui.InlineMenuWidget.prototype.getMenu = function () {
	return this.menu;
};

/**
 * Handles menu select events.
 *
 * @param {OO.ui.MenuItemWidget} item Selected menu item
 */
OO.ui.InlineMenuWidget.prototype.onMenuSelect = function ( item ) {
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
OO.ui.InlineMenuWidget.prototype.onClick = function ( e ) {
	// Skip clicks within the menu
	if ( $.contains( this.menu.$element[0], e.target ) ) {
		return;
	}

	if ( !this.isDisabled() ) {
		if ( this.menu.isVisible() ) {
			this.menu.hide();
		} else {
			this.menu.show();
		}
	}
	return false;
};
