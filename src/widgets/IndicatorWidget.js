/**
 * Indicator widget.
 *
 * See OO.ui.IndicatorElement for more information.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.IndicatorElement
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
	OO.ui.IndicatorElement.call( this, $.extend( {}, config, { $indicator: this.$element } ) );
	OO.ui.TitledElement.call( this, $.extend( {}, config, { $titled: this.$element } ) );

	// Initialization
	this.$element.addClass( 'oo-ui-indicatorWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.IndicatorWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.IndicatorWidget, OO.ui.IndicatorElement );
OO.mixinClass( OO.ui.IndicatorWidget, OO.ui.TitledElement );

/* Static Properties */

OO.ui.IndicatorWidget.static.tagName = 'span';
