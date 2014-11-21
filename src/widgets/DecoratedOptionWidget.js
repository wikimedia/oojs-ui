/**
 * Option widget with an option icon and indicator.
 *
 * Use together with OO.ui.SelectWidget.
 *
 * @class
 * @extends OO.ui.OptionWidget
 * @mixins OO.ui.IconElement
 * @mixins OO.ui.IndicatorElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.DecoratedOptionWidget = function OoUiDecoratedOptionWidget( config ) {
	// Parent constructor
	OO.ui.DecoratedOptionWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.IconElement.call( this, config );
	OO.ui.IndicatorElement.call( this, config );

	// Initialization
	this.$element
		.addClass( 'oo-ui-decoratedOptionWidget' )
		.prepend( this.$icon )
		.append( this.$indicator );
};

/* Setup */

OO.inheritClass( OO.ui.DecoratedOptionWidget, OO.ui.OptionWidget );
OO.mixinClass( OO.ui.OptionWidget, OO.ui.IconElement );
OO.mixinClass( OO.ui.OptionWidget, OO.ui.IndicatorElement );
