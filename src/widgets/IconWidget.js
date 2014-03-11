/**
 * Creates an OO.ui.IconWidget object.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.IconedElement
 * @mixins OO.ui.TitledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.IconWidget = function OoUiIconWidget( config ) {
	// Config intialization
	config = config || {};

	// Parent constructor
	OO.ui.Widget.call( this, config );

	// Mixin constructors
	OO.ui.IconedElement.call( this, this.$element, config );
	OO.ui.TitledElement.call( this, this.$element, config );

	// Initialization
	this.$element.addClass( 'oo-ui-iconWidget' );
};

/* Inheritance */

OO.inheritClass( OO.ui.IconWidget, OO.ui.Widget );

OO.mixinClass( OO.ui.IconWidget, OO.ui.IconedElement );
OO.mixinClass( OO.ui.IconWidget, OO.ui.TitledElement );

/* Static Properties */

OO.ui.IconWidget.static.tagName = 'span';
