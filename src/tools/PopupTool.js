/**
 * Tool that shows a popup when selected.
 *
 * @abstract
 * @class
 * @extends OO.ui.Tool
 * @mixins OO.ui.PopupElement
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 */
OO.ui.PopupTool = function OoUiPopupTool( toolbar, config ) {
	// Parent constructor
	OO.ui.PopupTool.super.call( this, toolbar, config );

	// Mixin constructors
	OO.ui.PopupElement.call( this, config );

	// Initialization
	this.$element
		.addClass( 'oo-ui-popupTool' )
		.append( this.popup.$element );
};

/* Setup */

OO.inheritClass( OO.ui.PopupTool, OO.ui.Tool );
OO.mixinClass( OO.ui.PopupTool, OO.ui.PopupElement );

/* Methods */

/**
 * Handle the tool being selected.
 *
 * @inheritdoc
 */
OO.ui.PopupTool.prototype.onSelect = function () {
	if ( !this.isDisabled() ) {
		this.popup.toggle();
	}
	this.setActive( false );
	return false;
};

/**
 * Handle the toolbar state being updated.
 *
 * @inheritdoc
 */
OO.ui.PopupTool.prototype.onUpdateState = function () {
	this.setActive( false );
};
