/**
 * IndicatorWidgets create indicators, which are small graphics that are generally used to draw
 * attention to the status of an item or to clarify the function within a control. For a list of
 * indicators included in the library, please see the [OOUI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Icons,_Indicators,_and_Labels#Indicators
 *
 *     @example
 *     // An indicator widget.
 *     const indicator1 = new OO.ui.IndicatorWidget( {
 *             indicator: 'required'
 *         } ),
 *         // Create a fieldset layout to add a label.
 *         fieldset = new OO.ui.FieldsetLayout();
 *     fieldset.addItems( [
 *         new OO.ui.FieldLayout( indicator1, {
 *             label: 'A required indicator:'
 *         } )
 *     ] );
 *     $( document.body ).append( fieldset.$element );
 *
 * @class
 * @extends OO.ui.Widget
 * @mixes OO.ui.mixin.IndicatorElement
 * @mixes OO.ui.mixin.TitledElement
 * @mixes OO.ui.mixin.LabelElement
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
	OO.ui.mixin.IndicatorElement.call( this, Object.assign( {
		$indicator: this.$element
	}, config ) );
	OO.ui.mixin.TitledElement.call( this, Object.assign( {
		$titled: this.$element
	}, config ) );
	OO.ui.mixin.LabelElement.call( this, Object.assign( {
		$label: this.$element,
		invisibleLabel: true
	}, config ) );

	// Initialization
	this.$element.addClass( 'oo-ui-indicatorWidget' );
	// Remove class added by LabelElement initialization. It causes unexpected CSS to apply when
	// nested in other widgets, because this widget used to not mix in LabelElement.
	this.$element.removeClass( 'oo-ui-labelElement-label' );
};

/* Setup */

OO.inheritClass( OO.ui.IndicatorWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.IndicatorWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.IndicatorWidget, OO.ui.mixin.TitledElement );
OO.mixinClass( OO.ui.IndicatorWidget, OO.ui.mixin.LabelElement );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.IndicatorWidget.static.tagName = 'span';
