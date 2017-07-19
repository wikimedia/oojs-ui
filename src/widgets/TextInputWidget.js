/**
 * TextInputWidgets, like HTML text inputs, can be configured with options that customize the
 * size of the field as well as its presentation. In addition, these widgets can be configured
 * with {@link OO.ui.mixin.IconElement icons}, {@link OO.ui.mixin.IndicatorElement indicators}, an optional
 * validation-pattern (used to determine if an input value is valid or not) and an input filter,
 * which modifies incoming values rather than validating them.
 * Please see the [OOjs UI documentation on MediaWiki] [1] for more information and examples.
 *
 * This widget can be used inside an HTML form, such as a OO.ui.FormLayout.
 *
 *     @example
 *     // Example of a text input widget
 *     var textInput = new OO.ui.TextInputWidget( {
 *         value: 'Text input'
 *     } )
 *     $( 'body' ).append( textInput.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Inputs
 *
 * @class
 * @extends OO.ui.InputWidget
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.PendingElement
 * @mixins OO.ui.mixin.LabelElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [type='text'] The value of the HTML `type` attribute: 'text', 'password'
 *  'email', 'url' or 'number'.
 * @cfg {string} [placeholder] Placeholder text
 * @cfg {boolean} [autofocus=false] Use an HTML `autofocus` attribute to
 *  instruct the browser to focus this widget.
 * @cfg {boolean} [readOnly=false] Prevent changes to the value of the text input.
 * @cfg {number} [maxLength] Maximum number of characters allowed in the input.
 * @cfg {string} [labelPosition='after'] The position of the inline label relative to that of
 *  the value or placeholder text: `'before'` or `'after'`
 * @cfg {boolean} [required=false] Mark the field as required. Implies `indicator: 'required'`.
 * @cfg {boolean} [autocomplete=true] Should the browser support autocomplete for this field
 * @cfg {RegExp|Function|string} [validate] Validation pattern: when string, a symbolic name of a
 *  pattern defined by the class: 'non-empty' (the value cannot be an empty string) or 'integer'
 *  (the value must contain only numbers); when RegExp, a regular expression that must match the
 *  value for it to be considered valid; when Function, a function receiving the value as parameter
 *  that must return true, or promise resolving to true, for it to be considered valid.
 */
OO.ui.TextInputWidget = function OoUiTextInputWidget( config ) {
	// Configuration initialization
	config = $.extend( {
		type: 'text',
		labelPosition: 'after'
	}, config );

	if ( config.multiline ) {
		OO.ui.warnDeprecation( 'TextInputWidget: config.multiline is deprecated. Use the MultilineTextInputWidget instead. See T130434 for details.' );
		return new OO.ui.MultilineTextInputWidget( config );
	}

	// Parent constructor
	OO.ui.TextInputWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.PendingElement.call( this, $.extend( {}, config, { $pending: this.$input } ) );
	OO.ui.mixin.LabelElement.call( this, config );

	// Properties
	this.type = this.getSaneType( config );
	this.readOnly = false;
	this.required = false;
	this.validate = null;
	this.styleHeight = null;
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
		.addClass( 'oo-ui-textInputWidget oo-ui-textInputWidget-type-' + this.type )
		.append( this.$icon, this.$indicator );
	this.setReadOnly( !!config.readOnly );
	this.setRequired( !!config.required );
	if ( config.placeholder !== undefined ) {
		this.$input.attr( 'placeholder', config.placeholder );
	}
	if ( config.maxLength !== undefined ) {
		this.$input.attr( 'maxlength', config.maxLength );
	}
	if ( config.autofocus ) {
		this.$input.attr( 'autofocus', 'autofocus' );
	}
	if ( config.autocomplete === false ) {
		this.$input.attr( 'autocomplete', 'off' );
		// Turning off autocompletion also disables "form caching" when the user navigates to a
		// different page and then clicks "Back". Re-enable it when leaving. Borrowed from jQuery UI.
		$( window ).on( {
			beforeunload: function () {
				this.$input.removeAttr( 'autocomplete' );
			}.bind( this ),
			pageshow: function () {
				// Browsers don't seem to actually fire this event on "Back", they instead just reload the
				// whole page... it shouldn't hurt, though.
				this.$input.attr( 'autocomplete', 'off' );
			}.bind( this )
		} );
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

/* Static Properties */

OO.ui.TextInputWidget.static.validationPatterns = {
	'non-empty': /.+/,
	integer: /^\d+$/
};

/* Static Methods */

/**
 * @inheritdoc
 */
OO.ui.TextInputWidget.static.gatherPreInfuseState = function ( node, config ) {
	var state = OO.ui.TextInputWidget.parent.static.gatherPreInfuseState( node, config );
	return state;
};

/* Events */

/**
 * An `enter` event is emitted when the user presses 'enter' inside the text box.
 *
 * @event enter
 */

/* Methods */

/**
 * Handle icon mouse down events.
 *
 * @private
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.TextInputWidget.prototype.onIconMouseDown = function ( e ) {
	if ( e.which === OO.ui.MouseButtons.LEFT ) {
		this.focus();
		return false;
	}
};

/**
 * Handle indicator mouse down events.
 *
 * @private
 * @param {jQuery.Event} e Mouse down event
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
 * @fires enter If enter key is pressed
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
 * Check if the input is {@link #readOnly read-only}.
 *
 * @return {boolean}
 */
OO.ui.TextInputWidget.prototype.isReadOnly = function () {
	return this.readOnly;
};

/**
 * Set the {@link #readOnly read-only} state of the input.
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
 * Check if the input is {@link #required required}.
 *
 * @return {boolean}
 */
OO.ui.TextInputWidget.prototype.isRequired = function () {
	return this.required;
};

/**
 * Set the {@link #required required} state of the input.
 *
 * @param {boolean} state Make input required
 * @chainable
 */
OO.ui.TextInputWidget.prototype.setRequired = function ( state ) {
	this.required = !!state;
	if ( this.required ) {
		this.$input
			.prop( 'required', true )
			.attr( 'aria-required', 'true' );
		if ( this.getIndicator() === null ) {
			this.setIndicator( 'required' );
		}
	} else {
		this.$input
			.prop( 'required', false )
			.removeAttr( 'aria-required' );
		if ( this.getIndicator() === 'required' ) {
			this.setIndicator( null );
		}
	}
	return this;
};

/**
 * Support function for making #onElementAttach work across browsers.
 *
 * This whole function could be replaced with one line of code using the DOMNodeInsertedIntoDocument
 * event, but it's not supported by Firefox and allegedly deprecated, so we only use it as fallback.
 *
 * Due to MutationObserver performance woes, #onElementAttach is only somewhat reliably called the
 * first time that the element gets attached to the documented.
 */
OO.ui.TextInputWidget.prototype.installParentChangeDetector = function () {
	var mutationObserver, onRemove, topmostNode, fakeParentNode,
		MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
		widget = this;

	if ( MutationObserver ) {
		// The new way. If only it wasn't so ugly.

		if ( this.isElementAttached() ) {
			// Widget is attached already, do nothing. This breaks the functionality of this function when
			// the widget is detached and reattached. Alas, doing this correctly with MutationObserver
			// would require observation of the whole document, which would hurt performance of other,
			// more important code.
			return;
		}

		// Find topmost node in the tree
		topmostNode = this.$element[ 0 ];
		while ( topmostNode.parentNode ) {
			topmostNode = topmostNode.parentNode;
		}

		// We have no way to detect the $element being attached somewhere without observing the entire
		// DOM with subtree modifications, which would hurt performance. So we cheat: we hook to the
		// parent node of $element, and instead detect when $element is removed from it (and thus
		// probably attached somewhere else). If there is no parent, we create a "fake" one. If it
		// doesn't get attached, we end up back here and create the parent.

		mutationObserver = new MutationObserver( function ( mutations ) {
			var i, j, removedNodes;
			for ( i = 0; i < mutations.length; i++ ) {
				removedNodes = mutations[ i ].removedNodes;
				for ( j = 0; j < removedNodes.length; j++ ) {
					if ( removedNodes[ j ] === topmostNode ) {
						setTimeout( onRemove, 0 );
						return;
					}
				}
			}
		} );

		onRemove = function () {
			// If the node was attached somewhere else, report it
			if ( widget.isElementAttached() ) {
				widget.onElementAttach();
			}
			mutationObserver.disconnect();
			widget.installParentChangeDetector();
		};

		// Create a fake parent and observe it
		fakeParentNode = $( '<div>' ).append( topmostNode )[ 0 ];
		mutationObserver.observe( fakeParentNode, { childList: true } );
	} else {
		// Using the DOMNodeInsertedIntoDocument event is much nicer and less magical, and works for
		// detachment and reattachment, but it's not supported by Firefox and allegedly deprecated.
		this.$element.on( 'DOMNodeInsertedIntoDocument', this.onElementAttach.bind( this ) );
	}
};

/**
 * @inheritdoc
 * @protected
 */
OO.ui.TextInputWidget.prototype.getInputElement = function ( config ) {
	if ( this.getSaneType( config ) === 'number' ) {
		return $( '<input>' )
			.attr( 'step', 'any' )
			.attr( 'type', 'number' );
	} else {
		return $( '<input>' ).attr( 'type', this.getSaneType( config ) );
	}
};

/**
 * Get sanitized value for 'type' for given config.
 *
 * @param {Object} config Configuration options
 * @return {string|null}
 * @private
 */
OO.ui.TextInputWidget.prototype.getSaneType = function ( config ) {
	var allowedTypes = [
		'text',
		'password',
		'email',
		'url',
		'number'
	];
	return allowedTypes.indexOf( config.type ) !== -1 ? config.type : 'text';
};

/**
 * Focus the input and select a specified range within the text.
 *
 * @param {number} from Select from offset
 * @param {number} [to] Select to offset, defaults to from
 * @chainable
 */
OO.ui.TextInputWidget.prototype.selectRange = function ( from, to ) {
	var isBackwards, start, end,
		input = this.$input[ 0 ];

	to = to || from;

	isBackwards = to < from;
	start = isBackwards ? to : from;
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
	var input = this.$input[ 0 ],
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
 */
OO.ui.TextInputWidget.prototype.select = function () {
	return this.selectRange( 0, this.getInputLength() );
};

/**
 * Focus the input and move the cursor to the start.
 *
 * @chainable
 */
OO.ui.TextInputWidget.prototype.moveCursorToStart = function () {
	return this.selectRange( 0 );
};

/**
 * Focus the input and move the cursor to the end.
 *
 * @chainable
 */
OO.ui.TextInputWidget.prototype.moveCursorToEnd = function () {
	return this.selectRange( this.getInputLength() );
};

/**
 * Insert new content into the input.
 *
 * @param {string} content Content to be inserted
 * @chainable
 */
OO.ui.TextInputWidget.prototype.insertContent = function ( content ) {
	var start, end,
		range = this.getRange(),
		value = this.getValue();

	start = Math.min( range.from, range.to );
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
 */
OO.ui.TextInputWidget.prototype.encapsulateContent = function ( pre, post ) {
	var start, end,
		range = this.getRange(),
		offset = pre.length;

	start = Math.min( range.from, range.to );
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
	if ( validate instanceof RegExp || validate instanceof Function ) {
		this.validate = validate;
	} else {
		this.validate = this.constructor.static.validationPatterns[ validate ] || /.*/;
	}
};

/**
 * Sets the 'invalid' flag appropriately.
 *
 * @param {boolean} [isValid] Optionally override validation result
 */
OO.ui.TextInputWidget.prototype.setValidityFlag = function ( isValid ) {
	var widget = this,
		setFlag = function ( valid ) {
			if ( !valid ) {
				widget.$input.attr( 'aria-invalid', 'true' );
			} else {
				widget.$input.removeAttr( 'aria-invalid' );
			}
			widget.setFlags( { invalid: !valid } );
		};

	if ( isValid !== undefined ) {
		setFlag( isValid );
	} else {
		this.getValidity().then( function () {
			setFlag( true );
		}, function () {
			setFlag( false );
		} );
	}
};

/**
 * Get the validity of current value.
 *
 * This method returns a promise that resolves if the value is valid and rejects if
 * it isn't. Uses the {@link #validate validation pattern}  to check for validity.
 *
 * @return {jQuery.Promise} A promise that resolves if the value is valid, rejects if not.
 */
OO.ui.TextInputWidget.prototype.getValidity = function () {
	var result;

	function rejectOrResolve( valid ) {
		if ( valid ) {
			return $.Deferred().resolve().promise();
		} else {
			return $.Deferred().reject().promise();
		}
	}

	// Check browser validity and reject if it is invalid
	if (
		this.$input[ 0 ].checkValidity !== undefined &&
		this.$input[ 0 ].checkValidity() === false
	) {
		return rejectOrResolve( false );
	}

	// Run our checks if the browser thinks the field is valid
	if ( this.validate instanceof Function ) {
		result = this.validate( this.getValue() );
		if ( result && $.isFunction( result.promise ) ) {
			return result.promise().then( function ( valid ) {
				return rejectOrResolve( valid );
			} );
		} else {
			return rejectOrResolve( result );
		}
	} else {
		return rejectOrResolve( this.getValue().match( this.validate ) );
	}
};

/**
 * Set the position of the inline label relative to that of the value: `‘before’` or `‘after’`.
 *
 * @param {string} labelPosition Label position, 'before' or 'after'
 * @chainable
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
 */
OO.ui.TextInputWidget.prototype.updatePosition = function () {
	var after = this.labelPosition === 'after';

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
 */
OO.ui.TextInputWidget.prototype.positionLabel = function () {
	var after, rtl, property, newCss;

	if ( this.isWaitingToBeAttached ) {
		// #onElementAttach will be called soon, which calls this method
		return this;
	}

	newCss = {
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

	after = this.labelPosition === 'after';
	rtl = this.$element.css( 'direction' ) === 'rtl';
	property = after === rtl ? 'padding-left' : 'padding-right';

	newCss[ property ] = this.$label.outerWidth( true ) + ( after ? this.scrollWidth : 0 );
	// We have to clear the padding on the other side, in case the element direction changed
	this.$input.css( newCss );

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.TextInputWidget.prototype.restorePreInfuseState = function ( state ) {
	OO.ui.TextInputWidget.parent.prototype.restorePreInfuseState.call( this, state );
	if ( state.scrollTop !== undefined ) {
		this.$input.scrollTop( state.scrollTop );
	}
};
