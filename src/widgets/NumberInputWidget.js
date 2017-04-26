/**
 * NumberInputWidgets combine a {@link OO.ui.TextInputWidget text input} (where a value
 * can be entered manually) and two {@link OO.ui.ButtonWidget button widgets}
 * (to adjust the value in increments) to allow the user to enter a number.
 *
 *     @example
 *     // Example: A NumberInputWidget.
 *     var numberInput = new OO.ui.NumberInputWidget( {
 *         label: 'NumberInputWidget',
 *         input: { value: 5 },
 *         min: 1,
 *         max: 10
 *     } );
 *     $( 'body' ).append( numberInput.$element );
 *
 * @class
 * @extends OO.ui.TextInputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object} [minusButton] Configuration options to pass to the {@link OO.ui.ButtonWidget decrementing button widget}.
 * @cfg {Object} [plusButton] Configuration options to pass to the {@link OO.ui.ButtonWidget incrementing button widget}.
 * @cfg {boolean} [allowInteger=false] Whether the field accepts only integer values.
 * @cfg {number} [min=-Infinity] Minimum allowed value
 * @cfg {number} [max=Infinity] Maximum allowed value
 * @cfg {number} [step=1] Delta when using the buttons or up/down arrow keys
 * @cfg {number|null} [pageStep] Delta when using the page-up/page-down keys. Defaults to 10 times #step.
 * @cfg {boolean} [showButtons=true] Whether to show the plus and minus buttons.
 */
OO.ui.NumberInputWidget = function OoUiNumberInputWidget( config ) {
	var $field = $( '<div>' )
		.addClass( 'oo-ui-numberInputWidget-field' );

	// Configuration initialization
	config = $.extend( {
		allowInteger: false,
		min: -Infinity,
		max: Infinity,
		step: 1,
		pageStep: null,
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
				label: '−'
			},
			config.minusButton
		) );
		this.plusButton = new OO.ui.ButtonWidget( $.extend(
			{
				disabled: this.isDisabled(),
				tabIndex: -1,
				classes: [ 'oo-ui-numberInputWidget-plusButton' ],
				label: '+'
			},
			config.plusButton
		) );
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
	this.setAllowInteger( config.allowInteger || config.isInteger );
	this.setRange( config.min, config.max );
	this.setStep( config.step, config.pageStep );
	// Set the validation method after we set allowInteger and range
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

/**
 * Set whether only integers are allowed
 *
 * @param {boolean} flag
 */
OO.ui.NumberInputWidget.prototype.setAllowInteger = function ( flag ) {
	this.allowInteger = !!flag;
	this.setValidityFlag();
};
// Backward compatibility
OO.ui.NumberInputWidget.prototype.setIsInteger = OO.ui.NumberInputWidget.prototype.setAllowInteger;

/**
 * Get whether only integers are allowed
 *
 * @return {boolean} Flag value
 */
OO.ui.NumberInputWidget.prototype.getAllowInteger = function () {
	return this.allowInteger;
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
 * @param {number} step Normal step
 * @param {number|null} pageStep Page step. If null, 10 * step will be used.
 */
OO.ui.NumberInputWidget.prototype.setStep = function ( step, pageStep ) {
	if ( step <= 0 ) {
		throw new Error( 'Step value must be positive' );
	}
	if ( pageStep === null ) {
		pageStep = step * 10;
	} else if ( pageStep <= 0 ) {
		throw new Error( 'Page step value must be positive' );
	}
	this.step = step;
	this.pageStep = pageStep;
};

/**
 * Get the current stepping values
 *
 * @return {number[]} Step and page step
 */
OO.ui.NumberInputWidget.prototype.getStep = function () {
	return [ this.step, this.pageStep ];
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
		if ( this.allowInteger ) {
			n = Math.round( n );
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

	if ( this.allowInteger && Math.floor( n ) !== n ) {
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
	this.adjustValue( dir * this.step );
};

/**
 * Handle mouse wheel events.
 *
 * @private
 * @param {jQuery.Event} event
 */
OO.ui.NumberInputWidget.prototype.onWheel = function ( event ) {
	var delta = 0;

	if ( !this.isDisabled() && this.$input.is( ':focus' ) ) {
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
			this.adjustValue( delta * this.step );
		}

		return false;
	}
};

/**
 * Handle key down events.
 *
 * @private
 * @param {jQuery.Event} e Key down event
 */
OO.ui.NumberInputWidget.prototype.onKeyDown = function ( e ) {
	if ( !this.isDisabled() ) {
		switch ( e.which ) {
			case OO.ui.Keys.UP:
				this.adjustValue( this.step );
				return false;
			case OO.ui.Keys.DOWN:
				this.adjustValue( -this.step );
				return false;
			case OO.ui.Keys.PAGEUP:
				this.adjustValue( this.pageStep );
				return false;
			case OO.ui.Keys.PAGEDOWN:
				this.adjustValue( -this.pageStep );
				return false;
		}
	}
};

/**
 * @inheritdoc
 */
OO.ui.NumberInputWidget.prototype.setDisabled = function ( disabled ) {
	// Parent method
	OO.ui.NumberInputWidget.parent.prototype.setDisabled.call( this, disabled );

	if ( this.minusButton ) {
		this.minusButton.setDisabled( this.isDisabled() );
	}
	if ( this.plusButton ) {
		this.plusButton.setDisabled( this.isDisabled() );
	}

	return this;
};
