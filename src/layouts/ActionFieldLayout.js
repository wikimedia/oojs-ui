/**
 * Layout made of a field, a button, and an optional label.
 *
 * @class
 * @extends OO.ui.FieldLayout
 *
 * @constructor
 * @param {OO.ui.Widget} fieldWidget Field widget
 * @param {OO.ui.ButtonWidget} buttonWidget Button widget
 * @param {Object} [config] Configuration options
 * @cfg {string} [align='left'] Alignment mode, either 'left', 'right', 'top' or 'inline'
 * @cfg {string} [help] Explanatory text shown as a '?' icon.
 */
OO.ui.ActionFieldLayout = function OoUiActionFieldLayout( fieldWidget, buttonWidget, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( fieldWidget ) && config === undefined ) {
		config = fieldWidget;
		fieldWidget = config.fieldWidget;
		buttonWidget = config.buttonWidget;
	}

	// Configuration initialization
	config = $.extend( { align: 'left' }, config );

	// Parent constructor
	OO.ui.ActionFieldLayout.super.call( this, fieldWidget, config );

	// Mixin constructors
	OO.ui.LabelElement.call( this, config );

	// Properties
	this.fieldWidget = fieldWidget;
	this.buttonWidget = buttonWidget;
	this.$button = $( '<div>' )
		.addClass( 'oo-ui-actionFieldLayout-button' )
		.append( this.buttonWidget.$element );
	this.$input = $( '<div>' )
		.addClass( 'oo-ui-actionFieldLayout-input' )
		.append( this.fieldWidget.$element );
	this.$field
		.addClass( 'oo-ui-actionFieldLayout' )
		.append( this.$input, this.$button );
};

/* Setup */

OO.inheritClass( OO.ui.ActionFieldLayout, OO.ui.FieldLayout );
