/**
 * Input widget with a text field.
 *
 * @class
 * @extends OO.ui.InputWidget
 * @mixins OO.ui.IconElement
 * @mixins OO.ui.IndicatorElement
 * @mixins OO.ui.PendingElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [type='text'] HTML tag `type` attribute
 * @cfg {string} [placeholder] Placeholder text
 * @cfg {boolean} [multiline=false] Allow multiple lines of text
 * @cfg {boolean} [autosize=false] Automatically resize to fit content
 * @cfg {boolean} [maxRows=10] Maximum number of rows to make visible when autosizing
 * @cfg {RegExp|string} [validate] Regular expression (or symbolic name referencing
 *  one, see #static-validationPatterns)
 */
OO.ui.TextInputWidget = function OoUiTextInputWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.TextInputWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.IconElement.call( this, config );
	OO.ui.IndicatorElement.call( this, config );
	OO.ui.PendingElement.call( this, config );

	// Properties
	this.multiline = !!config.multiline;
	this.autosize = !!config.autosize;
	this.maxRows = config.maxRows !== undefined ? config.maxRows : 10;
	this.validate = null;

	this.setValidation( config.validate );

	// Events
	this.$input.on( {
		keypress: this.onKeyPress.bind( this ),
		blur: this.setValidityFlag.bind( this )
	} );
	this.$element.on( 'DOMNodeInsertedIntoDocument', this.onElementAttach.bind( this ) );
	this.$icon.on( 'mousedown', this.onIconMouseDown.bind( this ) );
	this.$indicator.on( 'mousedown', this.onIndicatorMouseDown.bind( this ) );

	// Initialization
	this.$element
		.addClass( 'oo-ui-textInputWidget' )
		.append( this.$icon, this.$indicator );
	if ( config.placeholder ) {
		this.$input.attr( 'placeholder', config.placeholder );
	}
	this.$element.attr( 'role', 'textbox' );
};

/* Setup */

OO.inheritClass( OO.ui.TextInputWidget, OO.ui.InputWidget );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.IconElement );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.IndicatorElement );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.PendingElement );

/* Static properties */

OO.ui.TextInputWidget.static.validationPatterns = {
	'non-empty': /.+/,
	integer: /^\d+$/
};

/* Events */

/**
 * User presses enter inside the text box.
 *
 * Not called if input is multiline.
 *
 * @event enter
 */

/**
 * User clicks the icon.
 *
 * @event icon
 */

/**
 * User clicks the indicator.
 *
 * @event indicator
 */

/* Methods */

/**
 * Handle icon mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 * @fires icon
 */
OO.ui.TextInputWidget.prototype.onIconMouseDown = function ( e ) {
	if ( e.which === 1 ) {
		this.$input[0].focus();
		this.emit( 'icon' );
		return false;
	}
};

/**
 * Handle indicator mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 * @fires indicator
 */
OO.ui.TextInputWidget.prototype.onIndicatorMouseDown = function ( e ) {
	if ( e.which === 1 ) {
		this.$input[0].focus();
		this.emit( 'indicator' );
		return false;
	}
};

/**
 * Handle key press events.
 *
 * @param {jQuery.Event} e Key press event
 * @fires enter If enter key is pressed and input is not multiline
 */
OO.ui.TextInputWidget.prototype.onKeyPress = function ( e ) {
	if ( e.which === OO.ui.Keys.ENTER && !this.multiline ) {
		this.emit( 'enter' );
	}
};

/**
 * Handle element attach events.
 *
 * @param {jQuery.Event} e Element attach event
 */
OO.ui.TextInputWidget.prototype.onElementAttach = function () {
	this.adjustSize();
};

/**
 * @inheritdoc
 */
OO.ui.TextInputWidget.prototype.onEdit = function () {
	this.adjustSize();

	// Parent method
	return OO.ui.TextInputWidget.super.prototype.onEdit.call( this );
};

/**
 * @inheritdoc
 */
OO.ui.TextInputWidget.prototype.setValue = function ( value ) {
	// Parent method
	OO.ui.TextInputWidget.super.prototype.setValue.call( this, value );

	this.setValidityFlag();
	this.adjustSize();
	return this;
};

/**
 * Automatically adjust the size of the text input.
 *
 * This only affects multi-line inputs that are auto-sized.
 *
 * @chainable
 */
OO.ui.TextInputWidget.prototype.adjustSize = function () {
	var $clone, scrollHeight, innerHeight, outerHeight, maxInnerHeight, measurementError, idealHeight;

	if ( this.multiline && this.autosize ) {
		$clone = this.$input.clone()
			.val( this.$input.val() )
			// Set inline height property to 0 to measure scroll height
			.css( { height: 0 } )
			.insertAfter( this.$input );
		scrollHeight = $clone[0].scrollHeight;
		// Remove inline height property to measure natural heights
		$clone.css( 'height', '' );
		innerHeight = $clone.innerHeight();
		outerHeight = $clone.outerHeight();
		// Measure max rows height
		$clone.attr( 'rows', this.maxRows ).css( 'height', 'auto' ).val( '' );
		maxInnerHeight = $clone.innerHeight();
		// Difference between reported innerHeight and scrollHeight with no scrollbars present
		// Equals 1 on Blink-based browsers and 0 everywhere else
		measurementError = maxInnerHeight - $clone[0].scrollHeight;
		$clone.remove();
		idealHeight = Math.min( maxInnerHeight, scrollHeight + measurementError );
		// Only apply inline height when expansion beyond natural height is needed
		if ( idealHeight > innerHeight ) {
			// Use the difference between the inner and outer height as a buffer
			this.$input.css( 'height', idealHeight + ( outerHeight - innerHeight ) );
		} else {
			this.$input.css( 'height', '' );
		}
	}
	return this;
};

/**
 * Get input element.
 *
 * @param {Object} [config] Configuration options
 * @return {jQuery} Input element
 */
OO.ui.TextInputWidget.prototype.getInputElement = function ( config ) {
	var type = config.type || 'text';
	return config.multiline ? this.$( '<textarea>' ) : this.$( '<input type="' + type + '" />' );
};

/**
 * Check if input supports multiple lines.
 *
 * @return {boolean}
 */
OO.ui.TextInputWidget.prototype.isMultiline = function () {
	return !!this.multiline;
};

/**
 * Check if input automatically adjusts its size.
 *
 * @return {boolean}
 */
OO.ui.TextInputWidget.prototype.isAutosizing = function () {
	return !!this.autosize;
};

/**
 * Select the contents of the input.
 *
 * @chainable
 */
OO.ui.TextInputWidget.prototype.select = function () {
	this.$input.select();
	return this;
};

/**
 * Sets the validation pattern to use.
 * @param {RegExp|string|null} validate Regular expression (or symbolic name referencing
 *  one, see #static-validationPatterns)
 */
OO.ui.TextInputWidget.prototype.setValidation = function ( validate ) {
	if ( validate instanceof RegExp ) {
		this.validate = validate;
	} else {
		this.validate = this.constructor.static.validationPatterns[validate] || /.*/;
	}
};

/**
 * Sets the 'invalid' flag appropriately.
 */
OO.ui.TextInputWidget.prototype.setValidityFlag = function () {
	var widget = this;
	this.isValid().done( function ( valid ) {
		widget.setFlags( { invalid: !valid } );
	} );
};

/**
 * Returns whether or not the current value is considered valid, according to the
 * supplied validation pattern.
 *
 * @return {jQuery.Deferred}
 */
OO.ui.TextInputWidget.prototype.isValid = function () {
	return $.Deferred().resolve( !!this.getValue().match( this.validate ) ).promise();
};
