/**
 * Button that shows and hides a popup.
 *
 * @class
 * @extends OO.ui.ButtonWidget
 * @mixins OO.ui.PopupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.PopupButtonWidget = function OoUiPopupButtonWidget( config ) {
	// Parent constructor
	OO.ui.PopupButtonWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.PopupElement.call( this, config );

	// Events
	this.connect( this, { click: 'onAction' } );

	// Initialization
	this.$element
		.addClass( 'oo-ui-popupButtonWidget' )
		.attr( 'aria-haspopup', 'true' )
		.append( this.popup.$element );
};

/* Setup */

OO.inheritClass( OO.ui.PopupButtonWidget, OO.ui.ButtonWidget );
OO.mixinClass( OO.ui.PopupButtonWidget, OO.ui.PopupElement );

/* Methods */

/**
 * Handle the button action being triggered.
 */
OO.ui.PopupButtonWidget.prototype.onAction = function () {
	this.popup.toggle();
};
