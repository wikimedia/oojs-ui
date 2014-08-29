/**
 * Input widget with a text field.
 *
 * @class
 * @extends OO.ui.InputWidget
 * @mixins OO.ui.IconElement
 * @mixins OO.ui.IndicatorElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [placeholder] Placeholder text
 * @cfg {boolean} [multiline=false] Allow multiple lines of text
 * @cfg {boolean} [autosize=false] Automatically resize to fit content
 * @cfg {boolean} [maxRows=10] Maximum number of rows to make visible when autosizing
 */
OO.ui.TextInputWidget = function OoUiTextInputWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.TextInputWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.IconElement.call( this, config );
	OO.ui.IndicatorElement.call( this, config );

	// Properties
	this.pending = 0;
	this.multiline = !!config.multiline;
	this.autosize = !!config.autosize;
	this.maxRows = config.maxRows !== undefined ? config.maxRows : 10;

	// Events
	this.$input.on( 'keypress', OO.ui.bind( this.onKeyPress, this ) );
	this.$element.on( 'DOMNodeInsertedIntoDocument', OO.ui.bind( this.onElementAttach, this ) );
	this.$icon.on( 'mousedown', OO.ui.bind( this.onIconMouseDown, this ) );
	this.$indicator.on( 'mousedown', OO.ui.bind( this.onIndicatorMouseDown, this ) );

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
	var $clone, scrollHeight, innerHeight, outerHeight, maxInnerHeight, idealHeight;

	if ( this.multiline && this.autosize ) {
		$clone = this.$input.clone()
			.val( this.$input.val() )
			.css( { height: 0 } )
			.insertAfter( this.$input );
		// Set inline height property to 0 to measure scroll height
		scrollHeight = $clone[0].scrollHeight;
		// Remove inline height property to measure natural heights
		$clone.css( 'height', '' );
		innerHeight = $clone.innerHeight();
		outerHeight = $clone.outerHeight();
		// Measure max rows height
		$clone.attr( 'rows', this.maxRows ).css( 'height', 'auto' );
		maxInnerHeight = $clone.innerHeight();
		$clone.removeAttr( 'rows' ).css( 'height', '' );
		$clone.remove();
		idealHeight = Math.min( maxInnerHeight, scrollHeight );
		// Only apply inline height when expansion beyond natural height is needed
		this.$input.css(
			'height',
			// Use the difference between the inner and outer height as a buffer
			idealHeight > outerHeight ? idealHeight + ( outerHeight - innerHeight ) : ''
		);
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
	return config.multiline ? this.$( '<textarea>' ) : this.$( '<input type="text" />' );
};

/* Methods */

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
 * Check if input is pending.
 *
 * @return {boolean}
 */
OO.ui.TextInputWidget.prototype.isPending = function () {
	return !!this.pending;
};

/**
 * Increase the pending stack.
 *
 * @chainable
 */
OO.ui.TextInputWidget.prototype.pushPending = function () {
	if ( this.pending === 0 ) {
		this.$element.addClass( 'oo-ui-textInputWidget-pending' );
		this.$input.addClass( 'oo-ui-texture-pending' );
	}
	this.pending++;

	return this;
};

/**
 * Reduce the pending stack.
 *
 * Clamped at zero.
 *
 * @chainable
 */
OO.ui.TextInputWidget.prototype.popPending = function () {
	if ( this.pending === 1 ) {
		this.$element.removeClass( 'oo-ui-textInputWidget-pending' );
		this.$input.removeClass( 'oo-ui-texture-pending' );
	}
	this.pending = Math.max( 0, this.pending - 1 );

	return this;
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
