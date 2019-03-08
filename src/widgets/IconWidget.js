/**
 * IconWidget is a generic widget for {@link OO.ui.mixin.IconElement icons}.
 * In general, IconWidgets should be used with OO.ui.LabelWidget, which creates a label that
 * identifies the icon’s function. See the [OOUI documentation on MediaWiki] [1]
 * for a list of icons included in the library.
 *
 *     @example
 *     // An IconWidget with a label via LabelWidget.
 *     var myIcon = new OO.ui.IconWidget( {
 *             icon: 'help',
 *             title: 'Help'
 *          } ),
 *          // Create a label.
 *          iconLabel = new OO.ui.LabelWidget( {
 *              label: 'Help'
 *          } );
 *      $( document.body ).append( myIcon.$element, iconLabel.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Icons,_Indicators,_and_Labels#Icons
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.TitledElement
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.FlaggedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.IconWidget = function OoUiIconWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.IconWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, $.extend( {
		$icon: this.$element
	}, config ) );
	OO.ui.mixin.TitledElement.call( this, $.extend( {
		$titled: this.$element
	}, config ) );
	OO.ui.mixin.LabelElement.call( this, $.extend( {
		$label: this.$element,
		invisibleLabel: true
	}, config ) );
	OO.ui.mixin.FlaggedElement.call( this, $.extend( {
		$flagged: this.$element
	}, config ) );

	// Initialization
	this.$element.addClass( 'oo-ui-iconWidget' );
	// Remove class added by LabelElement initialization. It causes unexpected CSS to apply when
	// nested in other widgets, because this widget used to not mix in LabelElement.
	this.$element.removeClass( 'oo-ui-labelElement-label' );
};

/* Setup */

OO.inheritClass( OO.ui.IconWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.IconWidget, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.IconWidget, OO.ui.mixin.TitledElement );
OO.mixinClass( OO.ui.IconWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.IconWidget, OO.ui.mixin.FlaggedElement );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.IconWidget.static.tagName = 'span';
