/**
 * NumberInputWidgets combine a {@link OO.ui.TextInputWidget text input} (where a value
 * can be entered manually) and two {@link OO.ui.ButtonWidget button widgets}
 * (to adjust the value in increments) to allow the user to enter a number.
 *
 *     @example
 *     // A NumberInputWidget.
 *     var numberInput = new OO.ui.NumberInputWidget( {
 *         label: 'NumberInputWidget',
 *         input: { value: 5 },
 *         min: 1,
 *         max: 10
 *     } );
 *     $( document.body ).append( numberInput.$element );
 *
 * @class
 * @extends OO.ui.TextInputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object} [minusButton] Configuration options to pass to the
 *  {@link OO.ui.ButtonWidget decrementing button widget}.
 * @cfg {Object} [plusButton] Configuration options to pass to the
 *  {@link OO.ui.ButtonWidget incrementing button widget}.
 * @cfg {number} [min=-Infinity] Minimum allowed value
 * @cfg {number} [max=Infinity] Maximum allowed value
 * @cfg {number|null} [step] If specified, the field only accepts values that are multiples of this.
 * @cfg {number} [buttonStep=step||1] Delta when using the buttons or Up/Down arrow keys.
 *  Defaults to `step` if specified, otherwise `1`.
 * @cfg {number} [pageStep=10*buttonStep] Delta when using the Page-up/Page-down keys.
 *  Defaults to 10 times `buttonStep`.
 * @cfg {boolean} [showButtons=true] Whether to show the plus and minus buttons.
 */
OO.ui.NumberInputWidget = function OoUiNumberInputWidget( config ) {
	var $field = $( '<div>' ).addClass( 'oo-ui-numberInputWidget-field' );

	// Configuration initialization
	config = $.extend( {
		min: -Infinity,
		max: Infinity,
		showButtons: true
	}, config );

	// For backward compatibility
	$.extend( config, config.input );
	this.input = this;

	// Parent constructor
	OO.ui.NumberInputWidget.parent.call( this, $.extend( config, {
		type: 'number'
	} ) );

	if ( config.showButtons ) {
		this.minusButton = new OO.ui.ButtonWidget( $.extend(
			{
				disabled: this.isDisabled(),
				tabIndex: -1,
				classes: [ 'oo-ui-numberInputWidget-minusButton' ],
				icon: 'subtract'
			},
			config.minusButton
		) );
		this.minusButton.$element.attr( 'aria-hidden', 'true' );
		this.plusButton = new OO.ui.ButtonWidget( $.extend(
			{
				disabled: this.isDisabled(),
				tabIndex: -1,
				classes: [ 'oo-ui-numberInputWidget-plusButton' ],
				icon: 'add'
			},
			config.plusButton
		) );
		this.plusButton.$element.attr( 'aria-hidden', 'true' );
	}

	// Events
	this.$input.on( {
		keydown: this.onKeyDown.bind( this ),
		'wheel mousewheel DOMMouseScroll': this.onWheel.bind( this )
	} );
	if ( config.showButtons ) {
		this.plusButton.connect( this, {
			click: [ 'onButtonClick', +1 ]
		} );
		this.minusButton.connect( this, {
			click: [ 'onButtonClick', -1 ]
		} );
	}

	// Build the field
	$field.append( this.$input );
	if ( config.showButtons ) {
		$field
			.prepend( this.minusButton.$element )
			.append( this.plusButton.$element );
	}

	// Initialization
	if ( config.allowInteger || config.isInteger ) {
		// Backward compatibility
		config.step = 1;
	}
	this.setRange( config.min, config.max );
	this.setStep( config.buttonStep, config.pageStep, config.step );
	// Set the validation method after we set step and range
	// so that it doesn't immediately call setValidityFlag
	this.setValidation( this.validateNumber.bind( this ) );

	this.$element
		.addClass( 'oo-ui-numberInputWidget' )
		.toggleClass( 'oo-ui-numberInputWidget-buttoned', config.showButtons )
		.append( $field );
};

/* Setup */

OO.inheritClass( OO.ui.NumberInputWidget, OO.ui.TextInputWidget );

/* Methods */

// Backward compatibility
OO.ui.NumberInputWidget.prototype.setAllowInteger = function ( flag ) {
	this.setStep( flag ? 1 : null );
};
// Backward compatibility
OO.ui.NumberInputWidget.prototype.setIsInteger = OO.ui.NumberInputWidget.prototype.setAllowInteger;

// Backward compatibility
OO.ui.NumberInputWidget.prototype.getAllowInteger = function () {
	return this.step === 1;
};
// Backward compatibility
OO.ui.NumberInputWidget.prototype.getIsInteger = OO.ui.NumberInputWidget.prototype.getAllowInteger;

/**
 * Set the range of allowed values
 *
 * @param {number} min Minimum allowed value
 * @param {number} max Maximum allowed value
 */
OO.ui.NumberInputWidget.prototype.setRange = function ( min, max ) {
	if ( min > max ) {
		throw new Error( 'Minimum (' + min + ') must not be greater than maximum (' + max + ')' );
	}
	this.min = min;
	this.max = max;
	this.$input.attr( 'min', this.min );
	this.$input.attr( 'max', this.max );
	this.setValidityFlag();
};

/**
 * Get the current range
 *
 * @return {number[]} Minimum and maximum values
 */
OO.ui.NumberInputWidget.prototype.getRange = function () {
	return [ this.min, this.max ];
};

/**
 * Set the stepping deltas
 *
 * @param {number} [buttonStep=step||1] Delta when using the buttons or up/down arrow keys.
 *  Defaults to `step` if specified, otherwise `1`.
 * @param {number} [pageStep=10*buttonStep] Delta when using the page-up/page-down keys.
 *  Defaults to 10 times `buttonStep`.
 * @param {number|null} [step] If specified, the field only accepts values that are multiples
 *  of this.
 */
OO.ui.NumberInputWidget.prototype.setStep = function ( buttonStep, pageStep, step ) {
	if ( buttonStep === undefined ) {
		buttonStep = step || 1;
	}
	if ( pageStep === undefined ) {
		pageStep = 10 * buttonStep;
	}
	if ( step !== null && step <= 0 ) {
		throw new Error( 'Step value, if given, must be positive' );
	}
	if ( buttonStep <= 0 ) {
		throw new Error( 'Button step value must be positive' );
	}
	if ( pageStep <= 0 ) {
		throw new Error( 'Page step value must be positive' );
	}
	this.step = step;
	this.buttonStep = buttonStep;
	this.pageStep = pageStep;
	this.$input.attr( 'step', this.step || 'any' );
	this.setValidityFlag();
};

/**
 * @inheritdoc
 */
OO.ui.NumberInputWidget.prototype.setValue = function ( value ) {
	if ( value === '' ) {
		// Some browsers allow a value in the input even if there isn't one reported by $input.val()
		// so here we make sure an 'empty' value is actually displayed as such.
		this.$input.val( '' );
	}
	return OO.ui.NumberInputWidget.parent.prototype.setValue.call( this, value );
};

/**
 * Get the current stepping values
 *
 * @return {number[]} Button step, page step, and validity step
 */
OO.ui.NumberInputWidget.prototype.getStep = function () {
	return [ this.buttonStep, this.pageStep, this.step ];
};

/**
 * Get the current value of the widget as a number
 *
 * @return {number} May be NaN, or an invalid number
 */
OO.ui.NumberInputWidget.prototype.getNumericValue = function () {
	return +this.getValue();
};

/**
 * Adjust the value of the widget
 *
 * @param {number} delta Adjustment amount
 */
OO.ui.NumberInputWidget.prototype.adjustValue = function ( delta ) {
	var n, v = this.getNumericValue();

	delta = +delta;
	if ( isNaN( delta ) || !isFinite( delta ) ) {
		throw new Error( 'Delta must be a finite number' );
	}

	if ( isNaN( v ) ) {
		n = 0;
	} else {
		n = v + delta;
		n = Math.max( Math.min( n, this.max ), this.min );
		if ( this.step ) {
			n = Math.round( n / this.step ) * this.step;
		}
	}

	if ( n !== v ) {
		this.setValue( n );
	}
};
/**
 * Validate input
 *
 * @private
 * @param {string} value Field value
 * @return {boolean}
 */
OO.ui.NumberInputWidget.prototype.validateNumber = function ( value ) {
	var n = +value;
	if ( value === '' ) {
		return !this.isRequired();
	}

	if ( isNaN( n ) || !isFinite( n ) ) {
		return false;
	}

	if ( this.step && Math.floor( n / this.step ) !== n / this.step ) {
		return false;
	}

	if ( n < this.min || n > this.max ) {
		return false;
	}

	return true;
};

/**
 * Handle mouse click events.
 *
 * @private
 * @param {number} dir +1 or -1
 */
OO.ui.NumberInputWidget.prototype.onButtonClick = function ( dir ) {
	this.adjustValue( dir * this.buttonStep );
};

/**
 * Handle mouse wheel events.
 *
 * @private
 * @param {jQuery.Event} event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.NumberInputWidget.prototype.onWheel = function ( event ) {
	var delta = 0;

	if ( this.isDisabled() || this.isReadOnly() ) {
		return;
	}

	if ( this.$input.is( ':focus' ) ) {
		// Standard 'wheel' event
		if ( event.originalEvent.deltaMode !== undefined ) {
			this.sawWheelEvent = true;
		}
		if ( event.originalEvent.deltaY ) {
			delta = -event.originalEvent.deltaY;
		} else if ( event.originalEvent.deltaX ) {
			delta = event.originalEvent.deltaX;
		}

		// Non-standard events
		if ( !this.sawWheelEvent ) {
			if ( event.originalEvent.wheelDeltaX ) {
				delta = -event.originalEvent.wheelDeltaX;
			} else if ( event.originalEvent.wheelDeltaY ) {
				delta = event.originalEvent.wheelDeltaY;
			} else if ( event.originalEvent.wheelDelta ) {
				delta = event.originalEvent.wheelDelta;
			} else if ( event.originalEvent.detail ) {
				delta = -event.originalEvent.detail;
			}
		}

		if ( delta ) {
			delta = delta < 0 ? -1 : 1;
			this.adjustValue( delta * this.buttonStep );
		}

		return false;
	}
};

/**
 * Handle key down events.
 *
 * @private
 * @param {jQuery.Event} e Key down event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.NumberInputWidget.prototype.onKeyDown = function ( e ) {
	if ( this.isDisabled() || this.isReadOnly() ) {
		return;
	}

	switch ( e.which ) {
		case OO.ui.Keys.UP:
			this.adjustValue( this.buttonStep );
			return false;
		case OO.ui.Keys.DOWN:
			this.adjustValue( -this.buttonStep );
			return false;
		case OO.ui.Keys.PAGEUP:
			this.adjustValue( this.pageStep );
			return false;
		case OO.ui.Keys.PAGEDOWN:
			this.adjustValue( -this.pageStep );
			return false;
	}
};

/**
 * Update the disabled state of the controls
 *
 * @chainable
 * @protected
 * @return {OO.ui.NumberInputWidget} The widget, for chaining
 */
OO.ui.NumberInputWidget.prototype.updateControlsDisabled = function () {
	var disabled = this.isDisabled() || this.isReadOnly();
	if ( this.minusButton ) {
		this.minusButton.setDisabled( disabled );
	}
	if ( this.plusButton ) {
		this.plusButton.setDisabled( disabled );
	}
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.NumberInputWidget.prototype.setDisabled = function ( disabled ) {
	// Parent method
	OO.ui.NumberInputWidget.parent.prototype.setDisabled.call( this, disabled );
	this.updateControlsDisabled();
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.NumberInputWidget.prototype.setReadOnly = function () {
	// Parent method
	OO.ui.NumberInputWidget.parent.prototype.setReadOnly.apply( this, arguments );
	this.updateControlsDisabled();
	return this;
};
