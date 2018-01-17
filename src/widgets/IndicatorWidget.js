/**
 * IndicatorWidgets create indicators, which are small graphics that are generally used to draw
 * attention to the status of an item or to clarify the function within a control. For a list of
 * indicators included in the library, please see the [OOUI documentation on MediaWiki][1].
 *
 *     @example
 *     // Example of an indicator widget
 *     var indicator1 = new OO.ui.IndicatorWidget( {
 *         indicator: 'required'
 *     } );
 *
 *     // Create a fieldset layout to add a label
 *     var fieldset = new OO.ui.FieldsetLayout();
 *     fieldset.addItems( [
 *         new OO.ui.FieldLayout( indicator1, { label: 'A required indicator:' } )
 *     ] );
 *     $( 'body' ).append( fieldset.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Icons,_Indicators,_and_Labels#Indicators
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
	OO.ui.IndicatorWidget.parent.call( this, config );

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

/**
 * @static
 * @inheritdoc
 */
OO.ui.IndicatorWidget.static.tagName = 'span';
