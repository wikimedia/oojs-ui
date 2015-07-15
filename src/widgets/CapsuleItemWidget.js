/**
 * CapsuleItemWidgets are used within a {@link OO.ui.CapsuleMultiSelectWidget
 * CapsuleMultiSelectWidget} to display the selected items.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.ItemWidget
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.FlaggedElement
 * @mixins OO.ui.mixin.TabIndexedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.CapsuleItemWidget = function OoUiCapsuleItemWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.CapsuleItemWidget.parent.call( this, config );

	// Properties (must be set before mixin constructor calls)
	this.$indicator = $( '<span>' );

	// Mixin constructors
	OO.ui.mixin.ItemWidget.call( this );
	OO.ui.mixin.IndicatorElement.call( this, $.extend( {}, config, { $indicator: this.$indicator, indicator: 'clear' } ) );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.TabIndexedElement.call( this, $.extend( {}, config, { $tabIndexed: this.$indicator } ) );

	// Events
	this.$indicator.on( {
		keydown: this.onCloseKeyDown.bind( this ),
		click: this.onCloseClick.bind( this )
	} );
	this.$element.on( 'click', false );

	// Initialization
	this.$element
		.addClass( 'oo-ui-capsuleItemWidget' )
		.append( this.$indicator, this.$label );
};

/* Setup */

OO.inheritClass( OO.ui.CapsuleItemWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.ItemWidget );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.FlaggedElement );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.TabIndexedElement );

/* Methods */

/**
 * Handle close icon clicks
 * @param {jQuery.Event} event
 */
OO.ui.CapsuleItemWidget.prototype.onCloseClick = function () {
	var element = this.getElementGroup();

	if ( !this.isDisabled() && element && $.isFunction( element.removeItems ) ) {
		element.removeItems( [ this ] );
		element.focus();
	}
};

/**
 * Handle close keyboard events
 * @param {jQuery.Event} event Key down event
 */
OO.ui.CapsuleItemWidget.prototype.onCloseKeyDown = function ( e ) {
	if ( !this.isDisabled() && $.isFunction( this.getElementGroup().removeItems ) ) {
		switch ( e.which ) {
			case OO.ui.Keys.ENTER:
			case OO.ui.Keys.BACKSPACE:
			case OO.ui.Keys.SPACE:
				this.getElementGroup().removeItems( [ this ] );
				return false;
		}
	}
};
