/**
 * Indicator widget.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.IndicatedElement
 * @mixins OO.ui.TitledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.IndicatorWidget = function OoUiIndicatorWidget( config ) {
	// Config intialization
	config = config || {};

	// Parent constructor
	OO.ui.IndicatorWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.IndicatedElement.call( this, this.$element, config );
	OO.ui.TitledElement.call( this, this.$element, config );

	// Initialization
	this.$element.addClass( 'oo-ui-indicatorWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.IndicatorWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.IndicatorWidget, OO.ui.IndicatedElement );
OO.mixinClass( OO.ui.IndicatorWidget, OO.ui.TitledElement );

/* Static Properties */

OO.ui.IndicatorWidget.static.tagName = 'span';
