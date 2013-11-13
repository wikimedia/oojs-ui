/**
 * Creates an OO.ui.PushButtonWidget object.
 *
 * @class
 * @extends OO.ui.ButtonWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.PushButtonWidget = function OoUiPushButtonWidget( config ) {
	// Parent constructor
	OO.ui.ButtonWidget.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-pushButtonWidget' );
};

/* Inheritance */

OO.inheritClass( OO.ui.PushButtonWidget, OO.ui.ButtonWidget );
