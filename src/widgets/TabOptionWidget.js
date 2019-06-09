/**
 * TabOptionWidget is an item in a {@link OO.ui.TabSelectWidget TabSelectWidget}.
 *
 * Currently, this class is only used by {@link OO.ui.IndexLayout index layouts}, which contain
 * {@link OO.ui.TabPanelLayout tab panel layouts}. See {@link OO.ui.IndexLayout IndexLayout}
 * for an example.
 *
 * @class
 * @extends OO.ui.OptionWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.TabOptionWidget = function OoUiTabOptionWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.TabOptionWidget.parent.call( this, config );

	// Initialization
	this.$element
		.addClass( 'oo-ui-tabOptionWidget' )
		.attr( 'role', 'tab' );
};

/* Setup */

OO.inheritClass( OO.ui.TabOptionWidget, OO.ui.OptionWidget );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.TabOptionWidget.static.highlightable = false;

/**
 * @static
 * @inheritdoc
 */
OO.ui.TabOptionWidget.static.scrollIntoViewOnSelect = true;

/**
 * Center tab horizontally after selecting on mobile
 *
 * @param {Object} [config] Configuration options
 * @return {jQuery.Promise} Promise which resolves when the scroll is complete
 */
OO.ui.TabOptionWidget.prototype.scrollElementIntoView = function ( config ) {
	var padding;
	if ( !OO.ui.isMobile() || !this.getElementGroup() ) {
		// Parent method
		return OO.ui.TabOptionWidget.super.prototype.scrollElementIntoView.call( this );
	} else {
		padding = Math.max( (
			this.getElementGroup().$element[ 0 ].clientWidth - this.$element[ 0 ].clientWidth
		) / 2, 0 );
		// Parent method
		return OO.ui.TabOptionWidget.super.prototype.scrollElementIntoView.call( this, $.extend(
			{
				padding: {
					left: padding,
					right: padding
				}
			},
			config
		) );
	}
};
