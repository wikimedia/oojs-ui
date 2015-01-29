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
 * @cfg {boolean} [autofocus=false] Ask the browser to focus this widget, using the 'autofocus' HTML
 *  attribute
 * @cfg {boolean} [readOnly=false] Prevent changes
 * @cfg {number} [maxLength] Maximum allowed number of characters to input
 * @cfg {boolean} [multiline=false] Allow multiple lines of text
 * @cfg {boolean} [autosize=false] Automatically resize to fit content
 * @cfg {boolean} [maxRows=10] Maximum number of rows to make visible when autosizing
 * @cfg {string} [labelPosition='after'] Label position, 'before' or 'after'
 * @cfg {RegExp|string} [validate] Regular expression to validate against (or symbolic name referencing
 *  one, see #static-validationPatterns)
 */
OO.ui.TextInputWidget = function OoUiTextInputWidget( config ) {
	// Configuration initialization
	config = $.extend( {
		type: 'text',
		labelPosition: 'after',
		maxRows: 10
	}, config );

	// Parent constructor
	OO.ui.TextInputWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.IconElement.call( this, config );
	OO.ui.IndicatorElement.call( this, config );
	OO.ui.PendingElement.call( this, config );
	OO.ui.LabelElement.call( this, config );

	// Properties
	this.readOnly = false;
	this.multiline = !!config.multiline;
	this.autosize = !!config.autosize;
	this.maxRows = config.maxRows;
	this.validate = null;
	this.attached = false;

	// Clone for resizing
	if ( this.autosize ) {
		this.$clone = this.$input
			.clone()
			.insertAfter( this.$input )
			.hide();
	}

	this.setValidation( config.validate );
	if ( config.labelPosition ) {
		this.setPosition( config.labelPosition );
	}

	// Events
	this.$input.on( {
		keypress: this.onKeyPress.bind( this ),
		blur: this.setValidityFlag.bind( this )
	} );
	this.$element.on( 'DOMNodeInsertedIntoDocument', this.onElementAttach.bind( this ) );
	this.$element.on( 'DOMNodeRemovedFromDocument', this.onElementDetach.bind( this ) );
	this.$icon.on( 'mousedown', this.onIconMouseDown.bind( this ) );
	this.$indicator.on( 'mousedown', this.onIndicatorMouseDown.bind( this ) );
	this.on( 'labelChange', this.updatePosition.bind( this ) );

	// Initialization
	this.$element
		.addClass( 'oo-ui-textInputWidget' )
		.append( this.$icon, this.$indicator, this.$label );
	this.setReadOnly( !!config.readOnly );
	if ( config.placeholder ) {
		this.$input.attr( 'placeholder', config.placeholder );
	}
	if ( config.maxLength ) {
		this.$input.attr( 'maxlength', config.maxLength );
	}
	if ( config.autofocus ) {
		this.$input.attr( 'autofocus', 'autofocus' );
	}
};

/* Setup */

OO.inheritClass( OO.ui.TextInputWidget, OO.ui.InputWidget );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.IconElement );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.IndicatorElement );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.PendingElement );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.LabelElement );

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
		this.$input[ 0 ].focus();
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
		this.$input[ 0 ].focus();
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
		this.emit( 'enter', e );
	}
};

/**
 * Handle element attach events.
 *
 * @param {jQuery.Event} e Element attach event
 */
OO.ui.TextInputWidget.prototype.onElementAttach = function () {
	this.attached = true;
	// If we reattached elsewhere, the valCache is now invalid
	this.valCache = null;
	this.adjustSize();
	this.positionLabel();
};

/**
 * Handle element detach events.
 *
 * @param {jQuery.Event} e Element detach event
 */
OO.ui.TextInputWidget.prototype.onElementDetach = function () {
	this.attached = false;
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
 * Check if the widget is read-only.
 *
 * @return {boolean}
 */
OO.ui.TextInputWidget.prototype.isReadOnly = function () {
	return this.readOnly;
};

/**
 * Set the read-only state of the widget.
 *
 * This should probably change the widget's appearance and prevent it from being used.
 *
 * @param {boolean} state Make input read-only
 * @chainable
 */
OO.ui.TextInputWidget.prototype.setReadOnly = function ( state ) {
	this.readOnly = !!state;
	this.$input.prop( 'readOnly', this.readOnly );
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
	var scrollHeight, innerHeight, outerHeight, maxInnerHeight, measurementError, idealHeight;

	if ( this.multiline && this.autosize && this.attached && this.$input.val() !== this.valCache ) {
		this.$clone
			.val( this.$input.val() )
			.attr( 'rows', '' )
			// Set inline height property to 0 to measure scroll height
			.css( 'height', 0 );

		this.$clone[ 0 ].style.display = 'block';

		this.valCache = this.$input.val();

		scrollHeight = this.$clone[ 0 ].scrollHeight;

		// Remove inline height property to measure natural heights
		this.$clone.css( 'height', '' );
		innerHeight = this.$clone.innerHeight();
		outerHeight = this.$clone.outerHeight();

		// Measure max rows height
		this.$clone
			.attr( 'rows', this.maxRows )
			.css( 'height', 'auto' )
			.val( '' );
		maxInnerHeight = this.$clone.innerHeight();

		// Difference between reported innerHeight and scrollHeight with no scrollbars present
		// Equals 1 on Blink-based browsers and 0 everywhere else
		measurementError = maxInnerHeight - this.$clone[ 0 ].scrollHeight;
		idealHeight = Math.min( maxInnerHeight, scrollHeight + measurementError );

		this.$clone[ 0 ].style.display = 'none';

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
 * @inheritdoc
 * @private
 */
OO.ui.TextInputWidget.prototype.getInputElement = function ( config ) {
	return config.multiline ? this.$( '<textarea>' ) : this.$( '<input type="' + config.type + '" />' );
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
		this.validate = this.constructor.static.validationPatterns[ validate ] || /.*/;
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

/**
 * Set the position of the inline label.
 *
 * @param {string} labelPosition Label position, 'before' or 'after'
 * @chainable
 */
OO.ui.TextInputWidget.prototype.setPosition = function ( labelPosition ) {
	this.labelPosition = labelPosition;
	this.updatePosition();
	return this;
};

/**
 * Update the position of the inline label.
 *
 * @chainable
 */
OO.ui.TextInputWidget.prototype.updatePosition = function () {
	var after = this.labelPosition === 'after';

	this.$element
		.toggleClass( 'oo-ui-textInputWidget-labelPosition-after', this.label && after )
		.toggleClass( 'oo-ui-textInputWidget-labelPosition-before', this.label && !after );

	if ( this.label ) {
		this.positionLabel();
	}

	return this;
};

/**
 * Position the label by setting the correct padding on the input.
 *
 * @chainable
 */
OO.ui.TextInputWidget.prototype.positionLabel = function () {
	// Clear old values
	this.$input
		// Clear old values if present
		.css( {
			'padding-right': '',
			'padding-left': ''
		} );

	if ( !this.$label.text() ) {
		return;
	}

	var after = this.labelPosition === 'after',
		rtl = this.$element.css( 'direction' ) === 'rtl',
		property = after === rtl ? 'padding-left' : 'padding-right';

	this.$input.css( property, this.$label.outerWidth() );

	return this;
};
