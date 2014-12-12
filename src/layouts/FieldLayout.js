/**
 * Layout made of a field and optional label.
 *
 * Available label alignment modes include:
 *  - left: Label is before the field and aligned away from it, best for when the user will be
 *    scanning for a specific label in a form with many fields
 *  - right: Label is before the field and aligned toward it, best for forms the user is very
 *    familiar with and will tab through field checking quickly to verify which field they are in
 *  - top: Label is before the field and above it, best for when the user will need to fill out all
 *    fields from top to bottom in a form with few fields
 *  - inline: Label is after the field and aligned toward it, best for small boolean fields like
 *    checkboxes or radio buttons
 *
 * @class
 * @extends OO.ui.Layout
 * @mixins OO.ui.LabelElement
 *
 * @constructor
 * @param {OO.ui.Widget} fieldWidget Field widget
 * @param {Object} [config] Configuration options
 * @cfg {string} [align='left'] Alignment mode, either 'left', 'right', 'top' or 'inline'
 * @cfg {string} [help] Explanatory text shown as a '?' icon.
 */
OO.ui.FieldLayout = function OoUiFieldLayout( fieldWidget, config ) {
	// Configuration initialization
	config = $.extend( { align: 'left' }, config );

	// Properties (must be set before parent constructor, which calls #getTagName)
	this.fieldWidget = fieldWidget;

	// Parent constructor
	OO.ui.FieldLayout.super.call( this, config );

	// Mixin constructors
	OO.ui.LabelElement.call( this, config );

	// Properties
	this.$field = this.$( '<div>' );
	this.$body = this.$( '<div>' );
	this.align = null;
	if ( config.help ) {
		this.popupButtonWidget = new OO.ui.PopupButtonWidget( {
			$: this.$,
			classes: [ 'oo-ui-fieldLayout-help' ],
			framed: false,
			icon: 'info'
		} );

		this.popupButtonWidget.getPopup().$body.append(
			this.$( '<div>' )
				.text( config.help )
				.addClass( 'oo-ui-fieldLayout-help-content' )
		);
		this.$help = this.popupButtonWidget.$element;
	} else {
		this.$help = this.$( [] );
	}

	// Events
	if ( this.fieldWidget instanceof OO.ui.InputWidget ) {
		this.$label.on( 'click', this.onLabelClick.bind( this ) );
	}
	this.fieldWidget.connect( this, { disable: 'onFieldDisable' } );

	// Initialization
	this.$element
		.addClass( 'oo-ui-fieldLayout' )
		.append( this.$help, this.$body );
	this.$body.addClass( 'oo-ui-fieldLayout-body' );
	this.$field
		.addClass( 'oo-ui-fieldLayout-field' )
		.toggleClass( 'oo-ui-fieldLayout-disable', this.fieldWidget.isDisabled() )
		.append( this.fieldWidget.$element );

	this.setAlignment( config.align );
};

/* Setup */

OO.inheritClass( OO.ui.FieldLayout, OO.ui.Layout );
OO.mixinClass( OO.ui.FieldLayout, OO.ui.LabelElement );

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.FieldLayout.prototype.getTagName = function () {
	if ( this.fieldWidget instanceof OO.ui.InputWidget ) {
		return 'label';
	} else {
		return 'div';
	}
};

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
	this.fieldWidget.simulateLabelClick();
	return false;
};

/**
 * Get the field.
 *
 * @return {OO.ui.Widget} Field widget
 */
OO.ui.FieldLayout.prototype.getField = function () {
	return this.fieldWidget;
};

/**
 * Set the field alignment mode.
 *
 * @private
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
			this.$body.append( this.$field, this.$label );
		} else {
			this.$body.append( this.$label, this.$field );
		}
		// Set classes. The following classes can be used here:
		// * oo-ui-fieldLayout-align-left
		// * oo-ui-fieldLayout-align-right
		// * oo-ui-fieldLayout-align-top
		// * oo-ui-fieldLayout-align-inline
		if ( this.align ) {
			this.$element.removeClass( 'oo-ui-fieldLayout-align-' + this.align );
		}
		this.$element.addClass( 'oo-ui-fieldLayout-align-' + value );
		this.align = value;
	}

	return this;
};
