/**
 * Container for multiple related buttons.
 *
 * @class
 * @extends OO.ui.Widget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.ButtonGroupWidget = function OoUiButtonGroupWidget( config ) {
	// Parent constructor
	OO.ui.Widget.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-buttonGroupWidget' );
};

/* Inheritance */

OO.inheritClass( OO.ui.ButtonGroupWidget, OO.ui.Widget );
