/**
 * Option widget with an option icon and indicator.
 *
 * Use together with OO.ui.SelectWidget.
 *
 * @class
 * @extends OO.ui.OptionWidget
 * @mixins OO.ui.IconedElement
 * @mixins OO.ui.IndicatedElement
 *
 * @constructor
 * @param {Mixed} data Option data
 * @param {Object} [config] Configuration options
 */
OO.ui.DecoratedOptionWidget = function OoUiDecoratedOptionWidget( data, config ) {
	// Parent constructor
	OO.ui.DecoratedOptionWidget.super.call( this, data, config );

	// Mixin constructors
	OO.ui.IconedElement.call( this, this.$( '<span>' ), config );
	OO.ui.IndicatedElement.call( this, this.$( '<span>' ), config );

	// Initialization
	this.$element
		.addClass( 'oo-ui-decoratedOptionWidget' )
		.prepend( this.$icon )
		.append( this.$indicator );
};

/* Setup */

OO.inheritClass( OO.ui.DecoratedOptionWidget, OO.ui.OptionWidget );
OO.mixinClass( OO.ui.OptionWidget, OO.ui.IconedElement );
OO.mixinClass( OO.ui.OptionWidget, OO.ui.IndicatedElement );
