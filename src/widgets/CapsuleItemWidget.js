/**
 * CapsuleItemWidgets are used within a {@link OO.ui.CapsuleMultiSelectWidget
 * CapsuleMultiSelectWidget} to display the selected items.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.ItemWidget
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.FlaggedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.CapsuleItemWidget = function OoUiCapsuleItemWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.CapsuleItemWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.ItemWidget.call( this );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );

	// Events
	this.closeButton = new OO.ui.ButtonWidget( {
		framed: false,
		indicator: 'clear'
	} ).on( 'click', this.onCloseClick.bind( this ) );

	this.on( 'disable', function ( disabled ) {
		this.closeButton.setDisabled( disabled );
	}.bind( this ) );

	// Initialization
	this.$element
		.addClass( 'oo-ui-capsuleItemWidget' )
		.append( this.$label, this.closeButton.$element );
};

/* Setup */

OO.inheritClass( OO.ui.CapsuleItemWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.ItemWidget );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.FlaggedElement );

/* Methods */

/**
 * Handle close icon clicks
 */
OO.ui.CapsuleItemWidget.prototype.onCloseClick = function () {
	var element = this.getElementGroup();

	if ( element && $.isFunction( element.removeItems ) ) {
		element.removeItems( [ this ] );
		element.focus();
	}
};
