/**
 * TextInputWidgets, like HTML text inputs, can be configured with options that customize the
 * size of the field as well as its presentation. In addition, these widgets can be configured
 * with {@link OO.ui.mixin.IconElement icons}, {@link OO.ui.mixin.IndicatorElement indicators}, an optional
 * validation-pattern (used to determine if an input value is valid or not) and an input filter,
 * which modifies incoming values rather than validating them.
 * Please see the [OOjs UI documentation on MediaWiki] [1] for more information and examples.
 *
 * This widget can be used inside a HTML form, such as a OO.ui.FormLayout.
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
 * @cfg {string} [type='text'] The value of the HTML `type` attribute: 'text', 'password', 'search',
 *  'email', 'url', 'date' or 'number'. Ignored if `multiline` is true.
 *
 *  Some values of `type` result in additional behaviors:
 *
 *  - `search`: implies `icon: 'search'` and `indicator: 'clear'`; when clicked, the indicator
 *    empties the text field
 * @cfg {string} [placeholder] Placeholder text
 * @cfg {boolean} [autofocus=false] Use an HTML `autofocus` attribute to
 *  instruct the browser to focus this widget.
 * @cfg {boolean} [readOnly=false] Prevent changes to the value of the text input.
 * @cfg {number} [maxLength] Maximum number of characters allowed in the input.
 * @cfg {boolean} [multiline=false] Allow multiple lines of text
 * @cfg {number} [rows] If multiline, number of visible lines in textarea. If used with `autosize`,
 *  specifies minimum number of rows to display.
 * @cfg {boolean} [autosize=false] Automatically resize the text input to fit its content.
 *  Use the #maxRows config to specify a maximum number of displayed rows.
 * @cfg {boolean} [maxRows] Maximum number of rows to display when #autosize is set to true.
 *  Defaults to the maximum of `10` and `2 * rows`, or `10` if `rows` isn't provided.
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
	if ( config.type === 'search' ) {
		if ( config.icon === undefined ) {
			config.icon = 'search';
		}
		// indicator: 'clear' is set dynamically later, depending on value
	}
	if ( config.required ) {
		if ( config.indicator === undefined ) {
			config.indicator = 'required';
		}
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
	this.multiline = !!config.multiline;
	this.autosize = !!config.autosize;
	this.minRows = config.rows !== undefined ? config.rows : '';
	this.maxRows = config.maxRows || Math.max( 2 * ( this.minRows || 0 ), 10 );
	this.validate = null;
	this.styleHeight = null;
	this.scrollWidth = null;

	// Clone for resizing
	if ( this.autosize ) {
		this.$clone = this.$input
			.clone()
			.insertAfter( this.$input )
			.attr( 'aria-hidden', 'true' )
			.addClass( 'oo-ui-element-hidden' );
	}

	this.setValidation( config.validate );
	this.setLabelPosition( config.labelPosition );

	// Events
	this.$input.on( {
		keypress: this.onKeyPress.bind( this ),
		blur: this.onBlur.bind( this )
	} );
	this.$input.one( {
		focus: this.onElementAttach.bind( this )
	} );
	this.$icon.on( 'mousedown', this.onIconMouseDown.bind( this ) );
	this.$indicator.on( 'mousedown', this.onIndicatorMouseDown.bind( this ) );
	this.on( 'labelChange', this.updatePosition.bind( this ) );
	this.connect( this, {
		change: 'onChange',
		disable: 'onDisable'
	} );

	// Initialization
	this.$element
		.addClass( 'oo-ui-textInputWidget oo-ui-textInputWidget-type-' + this.type )
		.append( this.$icon, this.$indicator );
	this.setReadOnly( !!config.readOnly );
	this.updateSearchIndicator();
	if ( config.placeholder !== undefined ) {
		this.$input.attr( 'placeholder', config.placeholder );
	}
	if ( config.maxLength !== undefined ) {
		this.$input.attr( 'maxlength', config.maxLength );
	}
	if ( config.autofocus ) {
		this.$input.attr( 'autofocus', 'autofocus' );
	}
	if ( config.required ) {
		this.$input.attr( 'required', 'required' );
		this.$input.attr( 'aria-required', 'true' );
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
	if ( this.multiline && config.rows ) {
		this.$input.attr( 'rows', config.rows );
	}
	if ( this.label || config.autosize ) {
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
	if ( config.multiline ) {
		state.scrollTop = config.$input.scrollTop();
	}
	return state;
};

/* Events */

/**
 * An `enter` event is emitted when the user presses 'enter' inside the text box.
 *
 * Not emitted if the input is multiline.
 *
 * @event enter
 */

/**
 * A `resize` event is emitted when autosize is set and the widget resizes
 *
 * @event resize
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
		this.$input[ 0 ].focus();
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
		if ( this.type === 'search' ) {
			// Clear the text field
			this.setValue( '' );
		}
		this.$input[ 0 ].focus();
		return false;
	}
};

/**
 * Handle key press events.
 *
 * @private
 * @param {jQuery.Event} e Key press event
 * @fires enter If enter key is pressed and input is not multiline
 */
OO.ui.TextInputWidget.prototype.onKeyPress = function ( e ) {
	if ( e.which === OO.ui.Keys.ENTER && !this.multiline ) {
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
 * Handle element attach events.
 *
 * @private
 * @param {jQuery.Event} e Element attach event
 */
OO.ui.TextInputWidget.prototype.onElementAttach = function () {
	// Any previously calculated size is now probably invalid if we reattached elsewhere
	this.valCache = null;
	this.adjustSize();
	this.positionLabel();
};

/**
 * Handle change events.
 *
 * @param {string} value
 * @private
 */
OO.ui.TextInputWidget.prototype.onChange = function () {
	this.updateSearchIndicator();
	this.setValidityFlag();
	this.adjustSize();
};

/**
 * Handle disable events.
 *
 * @param {boolean} disabled Element is disabled
 * @private
 */
OO.ui.TextInputWidget.prototype.onDisable = function () {
	this.updateSearchIndicator();
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
	this.updateSearchIndicator();
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

		if ( this.$element.closest( 'html' ).length ) {
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
			if ( widget.$element.closest( 'html' ).length ) {
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
 * Automatically adjust the size of the text input.
 *
 * This only affects #multiline inputs that are {@link #autosize autosized}.
 *
 * @chainable
 * @fires resize
 */
OO.ui.TextInputWidget.prototype.adjustSize = function () {
	var scrollHeight, innerHeight, outerHeight, maxInnerHeight, measurementError,
		idealHeight, newHeight, scrollWidth, property;

	if ( this.multiline && this.$input.val() !== this.valCache ) {
		if ( this.autosize ) {
			this.$clone
				.val( this.$input.val() )
				.attr( 'rows', this.minRows )
				// Set inline height property to 0 to measure scroll height
				.css( 'height', 0 );

			this.$clone.removeClass( 'oo-ui-element-hidden' );

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

			// Difference between reported innerHeight and scrollHeight with no scrollbars present.
			// This is sometimes non-zero on Blink-based browsers, depending on zoom level.
			measurementError = maxInnerHeight - this.$clone[ 0 ].scrollHeight;
			idealHeight = Math.min( maxInnerHeight, scrollHeight + measurementError );

			this.$clone.addClass( 'oo-ui-element-hidden' );

			// Only apply inline height when expansion beyond natural height is needed
			// Use the difference between the inner and outer height as a buffer
			newHeight = idealHeight > innerHeight ? idealHeight + ( outerHeight - innerHeight ) : '';
			if ( newHeight !== this.styleHeight ) {
				this.$input.css( 'height', newHeight );
				this.styleHeight = newHeight;
				this.emit( 'resize' );
			}
		}
		scrollWidth = this.$input[ 0 ].offsetWidth - this.$input[ 0 ].clientWidth;
		if ( scrollWidth !== this.scrollWidth ) {
			property = this.$element.css( 'direction' ) === 'rtl' ? 'left' : 'right';
			// Reset
			this.$label.css( { right: '', left: '' } );
			this.$indicator.css( { right: '', left: '' } );

			if ( scrollWidth ) {
				this.$indicator.css( property, scrollWidth );
				if ( this.labelPosition === 'after' ) {
					this.$label.css( property, scrollWidth );
				}
			}

			this.scrollWidth = scrollWidth;
			this.positionLabel();
		}
	}
	return this;
};

/**
 * @inheritdoc
 * @protected
 */
OO.ui.TextInputWidget.prototype.getInputElement = function ( config ) {
	if ( config.multiline ) {
		return $( '<textarea>' );
	} else if ( this.getSaneType( config ) === 'number' ) {
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
			'search',
			'email',
			'url',
			'date',
			'number'
		],
		type = allowedTypes.indexOf( config.type ) !== -1 ? config.type : 'text';
	return config.multiline ? 'multiline' : type;
};

/**
 * Check if the input supports multiple lines.
 *
 * @return {boolean}
 */
OO.ui.TextInputWidget.prototype.isMultiline = function () {
	return !!this.multiline;
};

/**
 * Check if the input automatically adjusts its size.
 *
 * @return {boolean}
 */
OO.ui.TextInputWidget.prototype.isAutosizing = function () {
	return !!this.autosize;
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
 * Check if a value is valid.
 *
 * This method returns a promise that resolves with a boolean `true` if the current value is
 * considered valid according to the supplied {@link #validate validation pattern}.
 *
 * @deprecated since v0.12.3
 * @return {jQuery.Promise} A promise that resolves to a boolean `true` if the value is valid.
 */
OO.ui.TextInputWidget.prototype.isValid = function () {
	var result;

	if ( this.validate instanceof Function ) {
		result = this.validate( this.getValue() );
		if ( result && $.isFunction( result.promise ) ) {
			return result.promise();
		} else {
			return $.Deferred().resolve( !!result ).promise();
		}
	} else {
		return $.Deferred().resolve( !!this.getValue().match( this.validate ) ).promise();
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
	this.adjustSize();
	this.positionLabel();

	return this;
};

/**
 * Update the 'clear' indicator displayed on type: 'search' text fields, hiding it when the field is
 * already empty or when it's not editable.
 */
OO.ui.TextInputWidget.prototype.updateSearchIndicator = function () {
	if ( this.type === 'search' ) {
		if ( this.getValue() === '' || this.isDisabled() || this.isReadOnly() ) {
			this.setIndicator( null );
		} else {
			this.setIndicator( 'clear' );
		}
	}
};

/**
 * Position the label by setting the correct padding on the input.
 *
 * @private
 * @chainable
 */
OO.ui.TextInputWidget.prototype.positionLabel = function () {
	var after, rtl, property;
	// Clear old values
	this.$input
		// Clear old values if present
		.css( {
			'padding-right': '',
			'padding-left': ''
		} );

	if ( this.label ) {
		this.$element.append( this.$label );
	} else {
		this.$label.detach();
		return;
	}

	after = this.labelPosition === 'after';
	rtl = this.$element.css( 'direction' ) === 'rtl';
	property = after === rtl ? 'padding-left' : 'padding-right';

	this.$input.css( property, this.$label.outerWidth( true ) + ( after ? this.scrollWidth : 0 ) );

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
