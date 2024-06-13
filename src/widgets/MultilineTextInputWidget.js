/**
 * MultilineTextInputWidgets, like HTML textareas, are featuring customization options to
 * configure number of rows visible. In addition, these widgets can be autosized to fit user
 * inputs and can show {@link OO.ui.mixin.IconElement icons} and
 * {@link OO.ui.mixin.IndicatorElement indicators}.
 * Please see the [OOUI documentation on MediaWiki][1] for more information and examples.
 *
 * MultilineTextInputWidgets can also be used when a single line string is required, but
 * we want to display it to the user over mulitple lines (wrapped). This is done by setting
 * the `allowLinebreaks` config to `false`.
 *
 * This widget can be used inside an HTML form, such as a OO.ui.FormLayout.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Inputs#MultilineTextInputWidget
 *
 *     @example
 *     // A MultilineTextInputWidget.
 *     const multilineTextInput = new OO.ui.MultilineTextInputWidget( {
 *         value: 'Text input on multiple lines'
 *     } );
 *     $( document.body ).append( multilineTextInput.$element );
 *
 * @class
 * @extends OO.ui.TextInputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {number} [config.rows] Number of visible lines in textarea. If used with `autosize`,
 *  specifies minimum number of rows to display.
 * @param {boolean} [config.autosize=false] Automatically resize the text input to fit its content.
 *  Use the #maxRows config to specify a maximum number of displayed rows.
 * @param {number} [config.maxRows] Maximum number of rows to display when #autosize is set to true.
 *  Defaults to the maximum of `10` and `2 * rows`, or `10` if `rows` isn't provided.
 * @param {boolean} [config.allowLinebreaks=true] Whether to allow the user to add line breaks.
 */
OO.ui.MultilineTextInputWidget = function OoUiMultilineTextInputWidget( config ) {
	config = Object.assign( {
		type: 'text'
	}, config );

	// This property needs to exist before setValue in the parent constructor,
	// otherwise any linebreaks in the initial value won't be stripped by
	// cleanUpValue:
	this.allowLinebreaks = config.allowLinebreaks !== undefined ? config.allowLinebreaks : true;

	// Parent constructor
	OO.ui.MultilineTextInputWidget.super.call( this, config );

	// Properties
	this.autosize = !!config.autosize;
	this.styleHeight = null;
	this.minRows = config.rows !== undefined ? config.rows : '';
	this.maxRows = config.maxRows || Math.max( 2 * ( this.minRows || 0 ), 10 );

	// Clone for resizing
	if ( this.autosize ) {
		this.$clone = this.$input
			.clone()
			.removeAttr( 'id' )
			.removeAttr( 'name' )
			.insertAfter( this.$input )
			.attr( 'aria-hidden', 'true' )
			// Exclude scrollbars when calculating new size (T297963)
			.css( 'overflow', 'hidden' )
			.addClass( 'oo-ui-element-hidden' );
	}

	// Events
	this.connect( this, {
		change: 'onChange'
	} );

	// Initialization
	if ( config.rows ) {
		this.$input.attr( 'rows', config.rows );
	}
	if ( this.autosize ) {
		this.$input.addClass( 'oo-ui-textInputWidget-autosized' );
		this.isWaitingToBeAttached = true;
		this.installParentChangeDetector();
	}
};

/* Setup */

OO.inheritClass( OO.ui.MultilineTextInputWidget, OO.ui.TextInputWidget );

/* Events */

/**
 * An `resize` event is emitted when the widget changes size via the autosize functionality.
 *
 * @event OO.ui.MultilineTextInputWidget#resize
 */

/* Static Methods */

/**
 * @inheritdoc
 */
OO.ui.MultilineTextInputWidget.static.gatherPreInfuseState = function ( node, config ) {
	const state = OO.ui.MultilineTextInputWidget.super.static.gatherPreInfuseState( node, config );
	if ( config.$input ) {
		state.scrollTop = config.$input.scrollTop();
	}
	return state;
};

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.MultilineTextInputWidget.prototype.onElementAttach = function () {
	OO.ui.MultilineTextInputWidget.super.prototype.onElementAttach.call( this );
	this.adjustSize();
};

/**
 * Handle change events.
 *
 * @private
 */
OO.ui.MultilineTextInputWidget.prototype.onChange = function () {
	this.adjustSize();
};

/**
 * @inheritdoc
 */
OO.ui.MultilineTextInputWidget.prototype.updatePosition = function () {
	OO.ui.MultilineTextInputWidget.super.prototype.updatePosition.call( this );
	this.adjustSize();
};

/**
 * @inheritdoc
 *
 * Modify to emit 'enter' on Ctrl/Meta+Enter, instead of plain Enter
 */
OO.ui.MultilineTextInputWidget.prototype.onKeyPress = function ( e ) {
	if ( !this.allowLinebreaks ) {
		// In this mode we're pretending to be a single-line input, so we
		// prevent adding newlines and react to enter in the same way as
		// TextInputWidget:
		if ( e.which === OO.ui.Keys.ENTER ) {
			e.preventDefault();
		}
		return OO.ui.TextInputWidget.prototype.onKeyPress.call( this, e );
	}
	if (
		( e.which === OO.ui.Keys.ENTER && ( e.ctrlKey || e.metaKey ) ) ||
		// Some platforms emit keycode 10 for Control+Enter keypress in a textarea
		e.which === 10
	) {
		this.emit( 'enter', e );
	}
};

/**
 * @inheritdoc
 */
OO.ui.MultilineTextInputWidget.prototype.cleanUpValue = function ( value ) {
	// Parent method will guarantee we're dealing with a string, and apply inputFilter:
	value = OO.ui.MultilineTextInputWidget.super.prototype.cleanUpValue( value );
	if ( !this.allowLinebreaks ) {
		// If we're forbidding linebreaks then clean them out of the incoming
		// value to avoid a confusing situation
		// TODO: Better handle a paste with linebreaks by using the paste event, as when
		// we use input filtering the cursor is always reset to the end of the input.
		value = value.replace( /\r?\n/g, ' ' );
	}
	return value;
};

/**
 * Automatically adjust the size of the text input.
 *
 * This only affects multiline inputs that are {@link OO.ui.MultilineTextInputWidget#autosize autosized}.
 *
 * @chainable
 * @param {boolean} [force=false] Force an update, even if the value hasn't changed
 * @return {OO.ui.Widget} The widget, for chaining
 * @fires OO.ui.MultilineTextInputWidget#resize
 */
OO.ui.MultilineTextInputWidget.prototype.adjustSize = function ( force ) {
	if ( force || this.$input.val() !== this.valCache ) {
		if ( this.autosize ) {
			this.$clone
				.val( this.$input.val() )
				.attr( 'rows', this.minRows )
				// Set inline height property to 0 to measure scroll height
				.css( 'height', 0 )
				.removeClass( 'oo-ui-element-hidden' );

			this.valCache = this.$input.val();

			// https://bugzilla.mozilla.org/show_bug.cgi?id=1799404
			// eslint-disable-next-line no-unused-expressions
			this.$clone[ 0 ].scrollHeight;
			const scrollHeight = this.$clone[ 0 ].scrollHeight;

			// Remove inline height property to measure natural heights
			this.$clone.css( 'height', '' );
			const innerHeight = this.$clone.innerHeight();
			const outerHeight = this.$clone.outerHeight();

			// Measure max rows height
			this.$clone
				.attr( 'rows', this.maxRows )
				.css( 'height', 'auto' )
				.val( '' );
			const maxInnerHeight = this.$clone.innerHeight();

			// Difference between reported innerHeight and scrollHeight with no scrollbars present.
			// This is sometimes non-zero on Blink-based browsers, depending on zoom level.
			const measurementError = maxInnerHeight - this.$clone[ 0 ].scrollHeight;
			const idealHeight = Math.min( maxInnerHeight, scrollHeight + measurementError );

			this.$clone.addClass( 'oo-ui-element-hidden' );

			// Only apply inline height when expansion beyond natural height is needed
			// Use the difference between the inner and outer height as a buffer
			const newHeight = idealHeight > innerHeight ? idealHeight + ( outerHeight - innerHeight ) : '';
			if ( newHeight !== this.styleHeight ) {
				this.$input.css( 'height', newHeight );
				this.styleHeight = newHeight;
				this.emit( 'resize' );
			}
		}
		const scrollWidth = this.$input[ 0 ].offsetWidth - this.$input[ 0 ].clientWidth;
		if ( scrollWidth !== this.scrollWidth ) {
			const property = this.$element.css( 'direction' ) === 'rtl' ? 'left' : 'right';
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
OO.ui.MultilineTextInputWidget.prototype.getInputElement = function () {
	return $( '<textarea>' );
};

/**
 * Check if the input automatically adjusts its size.
 *
 * @return {boolean}
 */
OO.ui.MultilineTextInputWidget.prototype.isAutosizing = function () {
	return !!this.autosize;
};

/**
 * @inheritdoc
 */
OO.ui.MultilineTextInputWidget.prototype.restorePreInfuseState = function ( state ) {
	OO.ui.MultilineTextInputWidget.super.prototype.restorePreInfuseState.call( this, state );
	if ( state.scrollTop !== undefined ) {
		this.$input.scrollTop( state.scrollTop );
	}
};
