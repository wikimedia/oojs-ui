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
 * @extends OO.ui.Widget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object} [input] Configuration options to pass to the {@link OO.ui.TextInputWidget text input widget}.
 * @cfg {Object} [minusButton] Configuration options to pass to the {@link OO.ui.ButtonWidget decrementing button widget}.
 * @cfg {Object} [plusButton] Configuration options to pass to the {@link OO.ui.ButtonWidget incrementing button widget}.
 * @cfg {boolean} [isInteger=false] Whether the field accepts only integer values.
 * @cfg {number} [min=-Infinity] Minimum allowed value
 * @cfg {number} [max=Infinity] Maximum allowed value
 * @cfg {number} [step=1] Delta when using the buttons or up/down arrow keys
 * @cfg {number|null} [pageStep] Delta when using the page-up/page-down keys. Defaults to 10 times #step.
 * @cfg {boolean} [showButtons=true] Whether to show the plus and minus buttons.
 */
OO.ui.NumberInputWidget = function OoUiNumberInputWidget( config ) {
	// Configuration initialization
	config = $.extend( {
		isInteger: false,
		min: -Infinity,
		max: Infinity,
		step: 1,
		pageStep: null,
		showButtons: true
	}, config );

	// Parent constructor
	OO.ui.NumberInputWidget.parent.call( this, config );

	// Properties
	this.input = new OO.ui.TextInputWidget( $.extend(
		{
			disabled: this.isDisabled(),
			type: 'number'
		},
		config.input
	) );
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
	this.input.connect( this, {
		change: this.emit.bind( this, 'change' ),
		enter: this.emit.bind( this, 'enter' )
	} );
	this.input.$input.on( {
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

	// Initialization
	this.setIsInteger( !!config.isInteger );
	this.setRange( config.min, config.max );
	this.setStep( config.step, config.pageStep );

	this.$field = $( '<div>' ).addClass( 'oo-ui-numberInputWidget-field' )
		.append( this.input.$element );
	this.$element.addClass( 'oo-ui-numberInputWidget' ).append( this.$field );
	if ( config.showButtons ) {
		this.$field
			.prepend( this.minusButton.$element )
			.append( this.plusButton.$element );
		this.$element.addClass( 'oo-ui-numberInputWidget-buttoned' );
	}
	this.input.setValidation( this.validateNumber.bind( this ) );
};

/* Setup */

OO.inheritClass( OO.ui.NumberInputWidget, OO.ui.Widget );

/* Events */

/**
 * A `change` event is emitted when the value of the input changes.
 *
 * @event change
 */

/**
 * An `enter` event is emitted when the user presses 'enter' inside the text box.
 *
 * @event enter
 */

/* Methods */

/**
 * Set whether only integers are allowed
 *
 * @param {boolean} flag
 */
OO.ui.NumberInputWidget.prototype.setIsInteger = function ( flag ) {
	this.isInteger = !!flag;
	this.input.setValidityFlag();
};

/**
 * Get whether only integers are allowed
 *
 * @return {boolean} Flag value
 */
OO.ui.NumberInputWidget.prototype.getIsInteger = function () {
	return this.isInteger;
};

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
	this.input.setValidityFlag();
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
 * Get the current value of the widget
 *
 * @return {string}
 */
OO.ui.NumberInputWidget.prototype.getValue = function () {
	return this.input.getValue();
};

/**
 * Get the current value of the widget as a number
 *
 * @return {number} May be NaN, or an invalid number
 */
OO.ui.NumberInputWidget.prototype.getNumericValue = function () {
	return +this.input.getValue();
};

/**
 * Set the value of the widget
 *
 * @param {string} value Invalid values are allowed
 */
OO.ui.NumberInputWidget.prototype.setValue = function ( value ) {
	this.input.setValue( value );
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
		if ( this.isInteger ) {
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
	if ( isNaN( n ) || !isFinite( n ) ) {
		return false;
	}

	/* eslint-disable no-bitwise */
	if ( this.isInteger && ( n | 0 ) !== n ) {
		return false;
	}
	/* eslint-enable no-bitwise */

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

	if ( !this.isDisabled() && this.input.$input.is( ':focus' ) ) {
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

	if ( this.input ) {
		this.input.setDisabled( this.isDisabled() );
	}
	if ( this.minusButton ) {
		this.minusButton.setDisabled( this.isDisabled() );
	}
	if ( this.plusButton ) {
		this.plusButton.setDisabled( this.isDisabled() );
	}

	return this;
};
