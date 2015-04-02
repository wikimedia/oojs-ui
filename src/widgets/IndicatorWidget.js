/**
 * IndicatorWidgets create indicators, which are small graphics that are generally used to draw
 * attention to the status of an item or to clarify the function of a control. For a list of
 * indicators included in the library, please see the [OOjs UI documentation on MediaWiki][1].
 *
 *     @example
 *     // Example of an indicator widget
 *     var indicator1 = new OO.ui.IndicatorWidget( {
 *         indicator: 'alert'
 *     } );
 *
 *     // Create a fieldset layout to add a label
 *     var fieldset = new OO.ui.FieldsetLayout();
 *     fieldset.addItems( [
 *         new OO.ui.FieldLayout( indicator1, { label: 'An alert indicator:' } )
 *     ] );
 *     $( 'body' ).append( fieldset.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Icons,_Indicators,_and_Labels#Indicators
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.TitledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.IndicatorWidget = function OoUiIndicatorWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.IndicatorWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.IndicatorElement.call( this, $.extend( {}, config, { $indicator: this.$element } ) );
	OO.ui.mixin.TitledElement.call( this, $.extend( {}, config, { $titled: this.$element } ) );

	// Initialization
	this.$element.addClass( 'oo-ui-indicatorWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.IndicatorWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.IndicatorWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.IndicatorWidget, OO.ui.mixin.TitledElement );

/* Static Properties */

OO.ui.IndicatorWidget.static.tagName = 'span';
