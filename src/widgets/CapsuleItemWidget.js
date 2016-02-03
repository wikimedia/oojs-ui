/**
 * CapsuleItemWidgets are used within a {@link OO.ui.CapsuleMultiSelectWidget
 * CapsuleMultiSelectWidget} to display the selected items.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.ItemWidget
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

	// Mixin constructors
	OO.ui.mixin.ItemWidget.call( this );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.TabIndexedElement.call( this, config );

	// Events
	this.closeButton = new OO.ui.ButtonWidget( {
		framed: false,
		indicator: 'clear',
		tabIndex: -1
	} ).on( 'click', this.onCloseClick.bind( this ) );

	this.on( 'disable', function ( disabled ) {
		this.closeButton.setDisabled( disabled );
	}.bind( this ) );

	// Initialization
	this.$element
		.on( {
			click: this.onClick.bind( this ),
			keydown: this.onKeyDown.bind( this )
		} )
		.addClass( 'oo-ui-capsuleItemWidget' )
		.append( this.$label, this.closeButton.$element );
};

/* Setup */

OO.inheritClass( OO.ui.CapsuleItemWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.ItemWidget );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.FlaggedElement );
OO.mixinClass( OO.ui.CapsuleItemWidget, OO.ui.mixin.TabIndexedElement );

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

/**
 * Handle click event for the entire capsule
 */
OO.ui.CapsuleItemWidget.prototype.onClick = function () {
	var element = this.getElementGroup();

	if ( !this.isDisabled() && element && $.isFunction( element.editItem ) ) {
		element.editItem( this );
	}
};

/**
 * Handle keyDown event for the entire capsule
 */
OO.ui.CapsuleItemWidget.prototype.onKeyDown = function ( e ) {
	var element = this.getElementGroup();

	if ( e.keyCode === OO.ui.Keys.BACKSPACE || e.keyCode === OO.ui.Keys.DELETE ) {
		element.removeItems( [ this ] );
		element.focus();
		return false;
	} else if ( e.keyCode === OO.ui.Keys.ENTER ) {
		element.editItem( this );
		return false;
	} else if ( e.keyCode === OO.ui.Keys.LEFT ) {
		element.getPreviousItem( this ).focus();
	} else if ( e.keyCode === OO.ui.Keys.RIGHT ) {
		element.getNextItem( this ).focus();
	}
};

/**
 * Focuses the capsule
 */
OO.ui.CapsuleItemWidget.prototype.focus = function () {
	this.$element.focus();
};
