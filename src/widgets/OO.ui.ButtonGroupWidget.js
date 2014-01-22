/**
 * Container for multiple related buttons.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {OO.ui.ButtonWidget} [items] Buttons to add
 */
OO.ui.ButtonGroupWidget = function OoUiButtonGroupWidget( config ) {
	// Parent constructor
	OO.ui.Widget.call( this, config );

	// Mixin constructors
	OO.ui.GroupElement.call( this, this.$element, config );

	// Initialization
	this.$element.addClass( 'oo-ui-buttonGroupWidget' );
	if ( $.isArray( config.items ) ) {
		this.addItems( config.items );
	}
};

/* Inheritance */

OO.inheritClass( OO.ui.ButtonGroupWidget, OO.ui.Widget );

OO.mixinClass( OO.ui.ButtonGroupWidget, OO.ui.GroupElement );
