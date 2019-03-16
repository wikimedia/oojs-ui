/**
 * MultilineTextInputWidgets, like HTML textareas, are featuring customization options to
 * configure number of rows visible. In addition, these widgets can be autosized to fit user
 * inputs and can show {@link OO.ui.mixin.IconElement icons} and
 * {@link OO.ui.mixin.IndicatorElement indicators}.
 * Please see the [OOUI documentation on MediaWiki] [1] for more information and examples.
 *
 * This widget can be used inside an HTML form, such as a OO.ui.FormLayout.
 *
 *     @example
 *     // A MultilineTextInputWidget.
 *     var multilineTextInput = new OO.ui.MultilineTextInputWidget( {
 *         value: 'Text input on multiple lines'
 *     } );
 *     $( document.body ).append( multilineTextInput.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Inputs#MultilineTextInputWidget
 *
 * @class
 * @extends OO.ui.TextInputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {number} [rows] Number of visible lines in textarea. If used with `autosize`,
 *  specifies minimum number of rows to display.
 * @cfg {boolean} [autosize=false] Automatically resize the text input to fit its content.
 *  Use the #maxRows config to specify a maximum number of displayed rows.
 * @cfg {number} [maxRows] Maximum number of rows to display when #autosize is set to true.
 *  Defaults to the maximum of `10` and `2 * rows`, or `10` if `rows` isn't provided.
 */
OO.ui.MultilineTextInputWidget = function OoUiMultilineTextInputWidget( config ) {
	config = $.extend( {
		type: 'text'
	}, config );
	// Parent constructor
	OO.ui.MultilineTextInputWidget.parent.call( this, config );

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

/* Static Methods */

/**
 * @inheritdoc
 */
OO.ui.MultilineTextInputWidget.static.gatherPreInfuseState = function ( node, config ) {
	var state = OO.ui.MultilineTextInputWidget.parent.static.gatherPreInfuseState( node, config );
	state.scrollTop = config.$input.scrollTop();
	return state;
};

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.MultilineTextInputWidget.prototype.onElementAttach = function () {
	OO.ui.MultilineTextInputWidget.parent.prototype.onElementAttach.call( this );
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
	OO.ui.MultilineTextInputWidget.parent.prototype.updatePosition.call( this );
	this.adjustSize();
};

/**
 * @inheritdoc
 *
 * Modify to emit 'enter' on Ctrl/Meta+Enter, instead of plain Enter
 */
OO.ui.MultilineTextInputWidget.prototype.onKeyPress = function ( e ) {
	if (
		( e.which === OO.ui.Keys.ENTER && ( e.ctrlKey || e.metaKey ) ) ||
		// Some platforms emit keycode 10 for Control+Enter keypress in a textarea
		e.which === 10
	) {
		this.emit( 'enter', e );
	}
};

/**
 * Automatically adjust the size of the text input.
 *
 * This only affects multiline inputs that are {@link #autosize autosized}.
 *
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 * @fires resize
 */
OO.ui.MultilineTextInputWidget.prototype.adjustSize = function () {
	var scrollHeight, innerHeight, outerHeight, maxInnerHeight, measurementError,
		idealHeight, newHeight, scrollWidth, property;

	if ( this.$input.val() !== this.valCache ) {
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
	OO.ui.MultilineTextInputWidget.parent.prototype.restorePreInfuseState.call( this, state );
	if ( state.scrollTop !== undefined ) {
		this.$input.scrollTop( state.scrollTop );
	}
};
