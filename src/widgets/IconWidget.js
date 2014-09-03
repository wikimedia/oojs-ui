/**
 * Icon widget.
 *
 * See OO.ui.IconElement for more information.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.IconElement
 * @mixins OO.ui.TitledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.IconWidget = function OoUiIconWidget( config ) {
	// Config intialization
	config = config || {};

	// Parent constructor
	OO.ui.IconWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.IconElement.call( this, $.extend( {}, config, { $icon: this.$element } ) );
	OO.ui.TitledElement.call( this, $.extend( {}, config, { $titled: this.$element } ) );

	// Initialization
	this.$element.addClass( 'oo-ui-iconWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.IconWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.IconWidget, OO.ui.IconElement );
OO.mixinClass( OO.ui.IconWidget, OO.ui.TitledElement );

/* Static Properties */

OO.ui.IconWidget.static.tagName = 'span';
