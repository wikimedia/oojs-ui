/**
 * TextInputWidgets, like HTML text inputs, can be configured with options that customize the
 * size of the field as well as its presentation. In addition, these widgets can be configured
 * with {@link OO.ui.mixin.IconElement icons}, {@link OO.ui.mixin.IndicatorElement indicators}, an
 * optional validation-pattern (used to determine if an input value is valid or not) and an input
 * filter, which modifies incoming values rather than validating them.
 * Please see the [OOUI documentation on MediaWiki][1] for more information and examples.
 *
 * This widget can be used inside an HTML form, such as a OO.ui.FormLayout.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Inputs
 *
 *     @example
 *     // A TextInputWidget.
 *     const textInput = new OO.ui.TextInputWidget( {
 *         value: 'Text input'
 *     } );
 *     $( document.body ).append( textInput.$element );
 *
 * @class
 * @extends OO.ui.InputWidget
 * @mixes OO.ui.mixin.IconElement
 * @mixes OO.ui.mixin.IndicatorElement
 * @mixes OO.ui.mixin.PendingElement
 * @mixes OO.ui.mixin.LabelElement
 * @mixes OO.ui.mixin.FlaggedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {string} [config.type='text'] The value of the HTML `type` attribute: 'text', 'password'
 *  'email', 'url' or 'number'. Subclasses might support other types.
 * @param {string} [config.placeholder] Placeholder text
 * @param {boolean} [config.autofocus=false] Use an HTML `autofocus` attribute to
 *  instruct the browser to focus this widget.
 * @param {boolean} [config.readOnly=false] Prevent changes to the value of the text input.
 * @param {number} [config.maxLength] Maximum number of characters allowed in the input.
 * @param {number} [config.minLength] Minimum number of characters allowed in the input.
 *
 *  For unfortunate historical reasons, this counts the number of UTF-16 code units rather than
 *  Unicode codepoints, which means that codepoints outside the Basic Multilingual Plane (e.g.
 *  many emojis) count as 2 characters each.
 * @param {string} [config.labelPosition='after'] The position of the inline label relative to that of
 *  the value or placeholder text: `'before'` or `'after'`
 * @param {boolean|string} [config.autocomplete] Should the browser support autocomplete for this field?
 *  Type hints such as 'email' are also allowed.
 * @param {boolean} [config.spellcheck] Should the browser support spellcheck for this field (`undefined`
 *  means leaving it up to the browser).
 * @param {RegExp|Function|string} [config.validate] Validation pattern: when string, a symbolic name of a
 *  pattern defined by the class: 'non-empty' (the value cannot be an empty string) or 'integer'
 *  (the value must contain only numbers); when RegExp, a regular expression that must match the
 *  value for it to be considered valid; when Function, a function receiving the value as parameter
 *  that must return true, or promise resolving to true, for it to be considered valid.
 */
OO.ui.TextInputWidget = function OoUiTextInputWidget( config ) {
	// Configuration initialization
	config = Object.assign( {
		labelPosition: 'after'
	}, config );
	config.type = this.getValidType( config );
	if ( config.autocomplete === false ) {
		config.autocomplete = 'off';
	} else if ( config.autocomplete === true ) {
		config.autocomplete = 'on';
	}

	// Parent constructor
	OO.ui.TextInputWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.PendingElement.call( this, Object.assign( { $pending: this.$input }, config ) );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.RequiredElement.call( this, config );

	// Properties
	this.type = config.type;
	this.readOnly = false;
	this.validate = null;
	this.scrollWidth = null;

	this.setValidation( config.validate );
	this.setLabelPosition( config.labelPosition );

	// Events
	this.$input.on( {
		keypress: this.onKeyPress.bind( this ),
		blur: this.onBlur.bind( this ),
		focus: this.onFocus.bind( this )
	} );
	this.$icon.on( 'mousedown', this.onIconMouseDown.bind( this ) );
	this.$indicator.on( 'mousedown', this.onIndicatorMouseDown.bind( this ) );
	this.on( 'labelChange', this.updatePosition.bind( this ) );
	this.on( 'change', OO.ui.debounce( this.onDebouncedChange.bind( this ), 250 ) );

	// Initialization
	this.$element
		.addClass( 'oo-ui-textInputWidget oo-ui-textInputWidget-type-' + config.type )
		.append( this.$icon, this.$indicator );
	this.setReadOnly( !!config.readOnly );
	if ( config.placeholder !== undefined ) {
		this.$input.attr( 'placeholder', config.placeholder );
	}
	if ( config.maxLength !== undefined ) {
		this.$input.attr( 'maxlength', config.maxLength );
	}
	if ( config.minLength !== undefined ) {
		this.$input.attr( 'minlength', config.minLength );
	}
	if ( config.autofocus ) {
		this.$input.attr( 'autofocus', 'autofocus' );
	}
	if ( config.autocomplete !== null && config.autocomplete !== undefined ) {
		this.$input.attr( 'autocomplete', config.autocomplete );
		if ( config.autocomplete === 'off' ) {
			// Turning off autocompletion also disables "form caching" when the user navigates to a
			// different page and then clicks "Back". Re-enable it when leaving.
			// Borrowed from jQuery UI.
			$( window ).on( {
				beforeunload: function () {
					this.$input.removeAttr( 'autocomplete' );
				}.bind( this ),
				pageshow: function () {
					// Browsers don't seem to actually fire this event on "Back", they instead just
					// reload the whole page... it shouldn't hurt, though.
					this.$input.attr( 'autocomplete', 'off' );
				}.bind( this )
			} );
		}
	}
	if ( config.spellcheck !== undefined ) {
		this.$input.attr( 'spellcheck', config.spellcheck ? 'true' : 'false' );
	}
	if ( this.label ) {
		this.isWaitingToBeAttached = true;
		this.installParentChangeDetector();
	}
};

/* Setup */

OO.inheritClass( OO.ui.TextInputWidget, OO.ui.InputWidget );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.mixin.PendingElement );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.mixin.FlaggedElement );
OO.mixinClass( OO.ui.TextInputWidget, OO.ui.mixin.RequiredElement );

/* Static Properties */

OO.ui.TextInputWidget.static.validationPatterns = {
	'non-empty': /^./,
	integer: /^\d+$/
};

/* Events */

/**
 * An `enter` event is emitted when the user presses Enter key inside the text box.
 *
 * @event OO.ui.TextInputWidget#enter
 */

/* Methods */

/**
 * Focus the input element when clicking on the icon.
 *
 * @private
 * @param {jQuery.Event} e Mouse down event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.TextInputWidget.prototype.onIconMouseDown = function ( e ) {
	if ( e.which === OO.ui.MouseButtons.LEFT ) {
		this.focus();
		return false;
	}
};

/**
 * Focus the input element when clicking on the indicator. This default implementation is
 * effectively only suitable for the 'required' indicator. If you are looking for functional 'clear'
 * or 'down' indicators, you might want to use the {@link OO.ui.SearchInputWidget SearchInputWidget}
 * or {@link OO.ui.ComboBoxInputWidget ComboBoxInputWidget} subclasses.
 *
 * @private
 * @param {jQuery.Event} e Mouse down event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.TextInputWidget.prototype.onIndicatorMouseDown = function ( e ) {
	if ( e.which === OO.ui.MouseButtons.LEFT ) {
		this.focus();
		return false;
	}
};

/**
 * Handle key press events.
 *
 * @private
 * @param {jQuery.Event} e Key press event
 * @fires OO.ui.TextInputWidget#enter If Enter key is pressed
 */
OO.ui.TextInputWidget.prototype.onKeyPress = function ( e ) {
	if ( e.which === OO.ui.Keys.ENTER ) {
		this.emit( 'enter', e );
	}
};

/**
 * Handle blur events.
 *
 * @private
 * @param {jQuery.Event} e Blur event
 */
OO.ui.TextInputWidget.prototype.onBlur = function () {
	this.setValidityFlag();
};

/**
 * Handle focus events.
 *
 * @private
 * @param {jQuery.Event} e Focus event
 */
OO.ui.TextInputWidget.prototype.onFocus = function () {
	if ( this.isWaitingToBeAttached ) {
		// If we've received focus, then we must be attached to the document, and if
		// isWaitingToBeAttached is still true, that means the handler never fired. Fire it now.
		this.onElementAttach();
	}
	this.setValidityFlag( true );
};

/**
 * Handle element attach events.
 *
 * @private
 * @param {jQuery.Event} e Element attach event
 */
OO.ui.TextInputWidget.prototype.onElementAttach = function () {
	this.isWaitingToBeAttached = false;
	// Any previously calculated size is now probably invalid if we reattached elsewhere
	this.valCache = null;
	this.positionLabel();
};

/**
 * Handle debounced change events.
 *
 * @param {string} value
 * @private
 */
OO.ui.TextInputWidget.prototype.onDebouncedChange = function () {
	this.setValidityFlag();
};

/**
 * Check if the input is {@link OO.ui.TextInputWidget#readOnly read-only}.
 *
 * @return {boolean}
 */
OO.ui.TextInputWidget.prototype.isReadOnly = function () {
	return this.readOnly;
};

/**
 * Set the {@link OO.ui.TextInputWidget#readOnly read-only} state of the input.
 *
 * @param {boolean} [state=false] Make input read-only
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.TextInputWidget.prototype.setReadOnly = function ( state ) {
	this.readOnly = !!state;
	this.$input.prop( 'readOnly', this.readOnly );
	return this;
};

/**
 * Support function for making #onElementAttach work.
 */
OO.ui.TextInputWidget.prototype.installParentChangeDetector = function () {
	this.connectDetectorNode = document.createElement( 'ooui-connect-detector' );
	this.connectDetectorNode.onConnectOOUI = () => {
		if ( this.isElementAttached() ) {
			this.onElementAttach();
		}
	};

	this.$element.append( this.connectDetectorNode );
};

/**
 * @inheritdoc
 * @protected
 */
OO.ui.TextInputWidget.prototype.getInputElement = function ( config ) {
	const $input = $( '<input>' ).attr( 'type', config.type );

	if ( config.type === 'number' ) {
		$input.attr( 'step', 'any' );
	}

	return $input;
};

/**
 * Get sanitized value for 'type' for given config. Subclasses might support other types.
 *
 * @param {Object} config Configuration options
 * @param {string} [config.type='text']
 * @return {string}
 * @protected
 */
OO.ui.TextInputWidget.prototype.getValidType = function ( config ) {
	const allowedTypes = [
		'text',
		'password',
		'email',
		'url',
		'number'
	];
	return allowedTypes.includes( config.type ) ? config.type : 'text';
};

/**
 * Focus the input and select a specified range within the text.
 *
 * @param {number} from Select from offset
 * @param {number} [to=from] Select to offset
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.TextInputWidget.prototype.selectRange = function ( from, to ) {
	const input = this.$input[ 0 ];

	to = to || from;

	const isBackwards = to < from,
		start = isBackwards ? to : from,
		end = isBackwards ? from : to;

	this.focus();

	try {
		input.setSelectionRange( start, end, isBackwards ? 'backward' : 'forward' );
	} catch ( e ) {
		// IE throws an exception if you call setSelectionRange on a unattached DOM node.
		// Rather than expensively check if the input is attached every time, just check
		// if it was the cause of an error being thrown. If not, rethrow the error.
		if ( this.getElementDocument().body.contains( input ) ) {
			throw e;
		}
	}
	return this;
};

/**
 * Get an object describing the current selection range in a directional manner
 *
 * @return {Object} Object containing 'from' and 'to' offsets
 */
OO.ui.TextInputWidget.prototype.getRange = function () {
	const input = this.$input[ 0 ],
		start = input.selectionStart,
		end = input.selectionEnd,
		isBackwards = input.selectionDirection === 'backward';

	return {
		from: isBackwards ? end : start,
		to: isBackwards ? start : end
	};
};

/**
 * Get the length of the text input value.
 *
 * This could differ from the length of #getValue if the
 * value gets filtered
 *
 * @return {number} Input length
 */
OO.ui.TextInputWidget.prototype.getInputLength = function () {
	return this.$input[ 0 ].value.length;
};

/**
 * Focus the input and select the entire text.
 *
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.TextInputWidget.prototype.select = function () {
	return this.selectRange( 0, this.getInputLength() );
};

/**
 * Focus the input and move the cursor to the start.
 *
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.TextInputWidget.prototype.moveCursorToStart = function () {
	return this.selectRange( 0 );
};

/**
 * Focus the input and move the cursor to the end.
 *
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.TextInputWidget.prototype.moveCursorToEnd = function () {
	return this.selectRange( this.getInputLength() );
};

/**
 * Insert new content into the input.
 *
 * @param {string} content Content to be inserted
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.TextInputWidget.prototype.insertContent = function ( content ) {
	const value = this.getValue(),
		range = this.getRange(),
		start = Math.min( range.from, range.to ),
		end = Math.max( range.from, range.to );

	this.setValue( value.slice( 0, start ) + content + value.slice( end ) );
	this.selectRange( start + content.length );
	return this;
};

/**
 * Insert new content either side of a selection.
 *
 * @param {string} pre Content to be inserted before the selection
 * @param {string} post Content to be inserted after the selection
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.TextInputWidget.prototype.encapsulateContent = function ( pre, post ) {
	const offset = pre.length,
		range = this.getRange(),
		start = Math.min( range.from, range.to ),
		end = Math.max( range.from, range.to );

	this.selectRange( start ).insertContent( pre );
	this.selectRange( offset + end ).insertContent( post );

	this.selectRange( offset + start, offset + end );
	return this;
};

/**
 * Set the validation pattern.
 *
 * The validation pattern is either a regular expression, a function, or the symbolic name of a
 * pattern defined by the class: 'non-empty' (the value cannot be an empty string) or 'integer' (the
 * value must contain only numbers).
 *
 * @param {RegExp|Function|string|null} validate Regular expression, function, or the symbolic name
 *  of a pattern (either ‘integer’ or ‘non-empty’) defined by the class.
 */
OO.ui.TextInputWidget.prototype.setValidation = function ( validate ) {
	this.validate = validate instanceof RegExp || validate instanceof Function ?
		validate :
		this.constructor.static.validationPatterns[ validate ];
};

/**
 * Sets the 'invalid' flag appropriately.
 *
 * @param {boolean} [isValid] Optionally override validation result
 */
OO.ui.TextInputWidget.prototype.setValidityFlag = function ( isValid ) {
	const setFlag = ( valid ) => {
		if ( !valid ) {
			this.$input.attr( 'aria-invalid', 'true' );
		} else {
			this.$input.removeAttr( 'aria-invalid' );
		}
		this.setFlags( { invalid: !valid } );
	};

	if ( isValid !== undefined ) {
		setFlag( isValid );
	} else {
		this.getValidity().then( () => {
			setFlag( true );
		}, () => {
			setFlag( false );
		} );
	}
};

/**
 * Get the validity of current value.
 *
 * This method returns a promise that resolves if the value is valid and rejects if
 * it isn't. Uses the {@link OO.ui.TextInputWidget#validate validation pattern}  to check for validity.
 *
 * @return {jQuery.Promise} A promise that resolves if the value is valid, rejects if not.
 */
OO.ui.TextInputWidget.prototype.getValidity = function () {
	function rejectOrResolve( valid ) {
		const deferred = $.Deferred(),
			promise = valid ? deferred.resolve() : deferred.reject();
		return promise.promise();
	}

	// Check browser validity and reject if it is invalid
	if ( this.$input[ 0 ].checkValidity && this.$input[ 0 ].checkValidity() === false ) {
		return rejectOrResolve( false );
	}

	if ( !this.validate ) {
		return rejectOrResolve( true );
	}

	// Run our checks if the browser thinks the field is valid
	let result;
	if ( this.validate instanceof Function ) {
		result = this.validate( this.getValue() );
		if ( result && typeof result.promise === 'function' ) {
			return result.promise().then( ( valid ) => rejectOrResolve( valid ) );
		}
	} else {
		// The only other type we accept is a RegExp, see #setValidation
		result = this.validate.test( this.getValue() );
	}
	return rejectOrResolve( result );
};

/**
 * Set the position of the inline label relative to that of the value: `‘before’` or `‘after’`.
 *
 * @param {string} labelPosition Label position, 'before' or 'after'
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.TextInputWidget.prototype.setLabelPosition = function ( labelPosition ) {
	this.labelPosition = labelPosition;
	if ( this.label ) {
		// If there is no label and we only change the position, #updatePosition is a no-op,
		// but it takes really a lot of work to do nothing.
		this.updatePosition();
	}
	return this;
};

/**
 * Update the position of the inline label.
 *
 * This method is called by #setLabelPosition, and can also be called on its own if
 * something causes the label to be mispositioned.
 *
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.TextInputWidget.prototype.updatePosition = function () {
	const after = this.labelPosition === 'after';

	this.$element
		.toggleClass( 'oo-ui-textInputWidget-labelPosition-after', !!this.label && after )
		.toggleClass( 'oo-ui-textInputWidget-labelPosition-before', !!this.label && !after );

	this.valCache = null;
	this.scrollWidth = null;
	this.positionLabel();

	return this;
};

/**
 * Position the label by setting the correct padding on the input.
 *
 * @private
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.TextInputWidget.prototype.positionLabel = function () {
	if ( this.isWaitingToBeAttached ) {
		// #onElementAttach will be called soon, which calls this method
		return this;
	}

	const newCss = {
		'padding-right': '',
		'padding-left': ''
	};

	if ( this.label ) {
		this.$element.append( this.$label );
	} else {
		this.$label.detach();
		// Clear old values if present
		this.$input.css( newCss );
		return;
	}

	const after = this.labelPosition === 'after',
		rtl = this.$element.css( 'direction' ) === 'rtl',
		property = after === rtl ? 'padding-left' : 'padding-right';

	newCss[ property ] = this.$label.outerWidth( true ) + ( after ? this.scrollWidth : 0 );
	// We have to clear the padding on the other side, in case the element direction changed
	this.$input.css( newCss );

	return this;
};
