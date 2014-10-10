/**
 * Base class for input widgets.
 *
 * @abstract
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.FlaggedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [name=''] HTML input name
 * @cfg {string} [value=''] Input value
 * @cfg {boolean} [readOnly=false] Prevent changes
 * @cfg {Function} [inputFilter] Filter function to apply to the input. Takes a string argument and returns a string.
 */
OO.ui.InputWidget = function OoUiInputWidget( config ) {
	// Config intialization
	config = $.extend( { readOnly: false }, config );

	// Parent constructor
	OO.ui.InputWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.FlaggedElement.call( this, config );

	// Properties
	this.$input = this.getInputElement( config );
	this.value = '';
	this.readOnly = false;
	this.inputFilter = config.inputFilter;

	// Events
	this.$input.on( 'keydown mouseup cut paste change input select', this.onEdit.bind( this ) );

	// Initialization
	this.$input
		.attr( 'name', config.name )
		.prop( 'disabled', this.isDisabled() );
	this.setReadOnly( config.readOnly );
	this.$element.addClass( 'oo-ui-inputWidget' ).append( this.$input );
	this.setValue( config.value );
};

/* Setup */

OO.inheritClass( OO.ui.InputWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.InputWidget, OO.ui.FlaggedElement );

/* Events */

/**
 * @event change
 * @param value
 */

/* Methods */

/**
 * Get input element.
 *
 * @param {Object} [config] Configuration options
 * @return {jQuery} Input element
 */
OO.ui.InputWidget.prototype.getInputElement = function () {
	return this.$( '<input>' );
};

/**
 * Handle potentially value-changing events.
 *
 * @param {jQuery.Event} e Key down, mouse up, cut, paste, change, input, or select event
 */
OO.ui.InputWidget.prototype.onEdit = function () {
	var widget = this;
	if ( !this.isDisabled() ) {
		// Allow the stack to clear so the value will be updated
		setTimeout( function () {
			widget.setValue( widget.$input.val() );
		} );
	}
};

/**
 * Get the value of the input.
 *
 * @return {string} Input value
 */
OO.ui.InputWidget.prototype.getValue = function () {
	return this.value;
};

/**
 * Sets the direction of the current input, either RTL or LTR
 *
 * @param {boolean} isRTL
 */
OO.ui.InputWidget.prototype.setRTL = function ( isRTL ) {
	if ( isRTL ) {
		this.$input.removeClass( 'oo-ui-ltr' );
		this.$input.addClass( 'oo-ui-rtl' );
	} else {
		this.$input.removeClass( 'oo-ui-rtl' );
		this.$input.addClass( 'oo-ui-ltr' );
	}
};

/**
 * Set the value of the input.
 *
 * @param {string} value New value
 * @fires change
 * @chainable
 */
OO.ui.InputWidget.prototype.setValue = function ( value ) {
	value = this.sanitizeValue( value );
	if ( this.value !== value ) {
		this.value = value;
		this.emit( 'change', this.value );
	}
	// Update the DOM if it has changed. Note that with sanitizeValue, it
	// is possible for the DOM value to change without this.value changing.
	if ( this.$input.val() !== this.value ) {
		this.$input.val( this.value );
	}
	return this;
};

/**
 * Sanitize incoming value.
 *
 * Ensures value is a string, and converts undefined and null to empty strings.
 *
 * @param {string} value Original value
 * @return {string} Sanitized value
 */
OO.ui.InputWidget.prototype.sanitizeValue = function ( value ) {
	if ( value === undefined || value === null ) {
		return '';
	} else if ( this.inputFilter ) {
		return this.inputFilter( String( value ) );
	} else {
		return String( value );
	}
};

/**
 * Simulate the behavior of clicking on a label bound to this input.
 */
OO.ui.InputWidget.prototype.simulateLabelClick = function () {
	if ( !this.isDisabled() ) {
		if ( this.$input.is( ':checkbox,:radio' ) ) {
			this.$input.click();
		} else if ( this.$input.is( ':input' ) ) {
			this.$input[0].focus();
		}
	}
};

/**
 * Check if the widget is read-only.
 *
 * @return {boolean}
 */
OO.ui.InputWidget.prototype.isReadOnly = function () {
	return this.readOnly;
};

/**
 * Set the read-only state of the widget.
 *
 * This should probably change the widgets's appearance and prevent it from being used.
 *
 * @param {boolean} state Make input read-only
 * @chainable
 */
OO.ui.InputWidget.prototype.setReadOnly = function ( state ) {
	this.readOnly = !!state;
	this.$input.prop( 'readOnly', this.readOnly );
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.InputWidget.prototype.setDisabled = function ( state ) {
	OO.ui.InputWidget.super.prototype.setDisabled.call( this, state );
	if ( this.$input ) {
		this.$input.prop( 'disabled', this.isDisabled() );
	}
	return this;
};

/**
 * Focus the input.
 *
 * @chainable
 */
OO.ui.InputWidget.prototype.focus = function () {
	this.$input[0].focus();
	return this;
};

/**
 * Blur the input.
 *
 * @chainable
 */
OO.ui.InputWidget.prototype.blur = function () {
	this.$input[0].blur();
	return this;
};
