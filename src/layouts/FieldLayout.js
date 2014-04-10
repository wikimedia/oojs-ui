/**
 * Layout made of a field and optional label.
 *
 * @class
 * @extends OO.ui.Layout
 * @mixins OO.ui.LabeledElement
 *
 * Available label alignment modes include:
 *  - 'left': Label is before the field and aligned away from it, best for when the user will be
 *    scanning for a specific label in a form with many fields
 *  - 'right': Label is before the field and aligned toward it, best for forms the user is very
 *    familiar with and will tab through field checking quickly to verify which field they are in
 *  - 'top': Label is before the field and above it, best for when the use will need to fill out all
 *    fields from top to bottom in a form with few fields
 *  - 'inline': Label is after the field and aligned toward it, best for small boolean fields like
 *    checkboxes or radio buttons
 *
 * @constructor
 * @param {OO.ui.Widget} field Field widget
 * @param {Object} [config] Configuration options
 * @cfg {string} [align='left'] Alignment mode, either 'left', 'right', 'top' or 'inline'
 */
OO.ui.FieldLayout = function OoUiFieldLayout( field, config ) {
	// Config initialization
	config = $.extend( { 'align': 'left' }, config );

	// Parent constructor
	OO.ui.FieldLayout.super.call( this, config );

	// Mixin constructors
	OO.ui.LabeledElement.call( this, this.$( '<label>' ), config );

	// Properties
	this.$field = this.$( '<div>' );
	this.field = field;
	this.align = null;

	// Events
	if ( this.field instanceof OO.ui.InputWidget ) {
		this.$label.on( 'click', OO.ui.bind( this.onLabelClick, this ) );
	}
	this.field.connect( this, { 'disable': 'onFieldDisable' } );

	// Initialization
	this.$element.addClass( 'oo-ui-fieldLayout' );
	this.$field
		.addClass( 'oo-ui-fieldLayout-field' )
		.toggleClass( 'oo-ui-fieldLayout-disable', this.field.isDisabled() )
		.append( this.field.$element );
	this.setAlignment( config.align );
};

/* Setup */

OO.inheritClass( OO.ui.FieldLayout, OO.ui.Layout );
OO.mixinClass( OO.ui.FieldLayout, OO.ui.LabeledElement );

/* Methods */

/**
 * Handle field disable events.
 *
 * @param {boolean} value Field is disabled
 */
OO.ui.FieldLayout.prototype.onFieldDisable = function ( value ) {
	this.$element.toggleClass( 'oo-ui-fieldLayout-disabled', value );
};

/**
 * Handle label mouse click events.
 *
 * @param {jQuery.Event} e Mouse click event
 */
OO.ui.FieldLayout.prototype.onLabelClick = function () {
	this.field.simulateLabelClick();
	return false;
};

/**
 * Get the field.
 *
 * @return {OO.ui.Widget} Field widget
 */
OO.ui.FieldLayout.prototype.getField = function () {
	return this.field;
};

/**
 * Set the field alignment mode.
 *
 * @param {string} value Alignment mode, either 'left', 'right', 'top' or 'inline'
 * @chainable
 */
OO.ui.FieldLayout.prototype.setAlignment = function ( value ) {
	if ( value !== this.align ) {
		// Default to 'left'
		if ( [ 'left', 'right', 'top', 'inline' ].indexOf( value ) === -1 ) {
			value = 'left';
		}
		// Reorder elements
		if ( value === 'inline' ) {
			this.$element.append( this.$field, this.$label );
		} else {
			this.$element.append( this.$label, this.$field );
		}
		// Set classes
		if ( this.align ) {
			this.$element.removeClass( 'oo-ui-fieldLayout-align-' + this.align );
		}
		this.align = value;
		this.$element.addClass( 'oo-ui-fieldLayout-align-' + this.align );
	}

	return this;
};
