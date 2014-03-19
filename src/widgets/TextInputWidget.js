/**
 * Creates an OO.ui.TextInputWidget object.
 *
 * @class
 * @extends OO.ui.InputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [placeholder] Placeholder text
 * @cfg {string} [icon] Symbolic name of icon
 * @cfg {boolean} [multiline=false] Allow multiple lines of text
 * @cfg {boolean} [autosize=false] Automatically resize to fit content
 * @cfg {boolean} [maxRows=10] Maximum number of rows to make visible when autosizing
 */
OO.ui.TextInputWidget = function OoUiTextInputWidget( config ) {
	config = $.extend( { 'maxRows': 10 }, config );

	// Parent constructor
	OO.ui.TextInputWidget.super.call( this, config );

	// Properties
	this.pending = 0;
	this.multiline = !!config.multiline;
	this.autosize = !!config.autosize;
	this.maxRows = config.maxRows;

	// Events
	this.$input.on( 'keypress', OO.ui.bind( this.onKeyPress, this ) );
	this.$element.on( 'DOMNodeInsertedIntoDocument', OO.ui.bind( this.onElementAttach, this ) );

	// Initialization
	this.$element.addClass( 'oo-ui-textInputWidget' );
	if ( config.icon ) {
		this.$element.addClass( 'oo-ui-textInputWidget-decorated' );
		this.$element.append(
			this.$( '<span>' )
				.addClass( 'oo-ui-textInputWidget-icon oo-ui-icon-' + config.icon )
				.mousedown( OO.ui.bind( function () {
					this.$input.focus();
					return false;
				}, this ) )
		);
	}
	if ( config.placeholder ) {
		this.$input.attr( 'placeholder', config.placeholder );
	}
};

/* Inheritance */

OO.inheritClass( OO.ui.TextInputWidget, OO.ui.InputWidget );

/* Events */

/**
 * User presses enter inside the text box.
 *
 * Not called if input is multiline.
 *
 * @event enter
 */

/* Methods */

/**
 * Handles key press events.
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
 * Handles element attach events.
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
 * Automatically adjust the size of the text input.
 *
 * This only affects multi-line inputs that are auto-sized.
 *
 * @chainable
 */
OO.ui.TextInputWidget.prototype.adjustSize = function() {
	var $clone, scrollHeight, innerHeight, outerHeight, maxInnerHeight, idealHeight;

	if ( this.multiline && this.autosize ) {
		$clone = this.$input.clone()
			.val( this.$input.val() )
			.css( { 'height': 0 } )
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
 * @method
 * @param {Object} [config] Configuration options
 * @returns {jQuery} Input element
 */
OO.ui.TextInputWidget.prototype.getInputElement = function ( config ) {
	return config.multiline ? this.$( '<textarea>' ) : this.$( '<input type="text" />' );
};

/* Methods */

/**
 * Checks if input supports multiple lines.
 *
 * @method
 * @returns {boolean} Input supports multiple lines
 */
OO.ui.TextInputWidget.prototype.isMultiline = function () {
	return !!this.multiline;
};

/**
 * Checks if input automatically adjusts its size.
 *
 * @method
 * @returns {boolean} Input automatically adjusts its size
 */
OO.ui.TextInputWidget.prototype.isAutosizing = function () {
	return !!this.autosize;
};

/**
 * Checks if input is pending.
 *
 * @method
 * @returns {boolean} Input is pending
 */
OO.ui.TextInputWidget.prototype.isPending = function () {
	return !!this.pending;
};

/**
 * Increases the pending stack.
 *
 * @method
 * @chainable
 */
OO.ui.TextInputWidget.prototype.pushPending = function () {
	this.pending++;
	this.$element.addClass( 'oo-ui-textInputWidget-pending' );
	this.$input.addClass( 'oo-ui-texture-pending' );
	return this;
};

/**
 * Reduces the pending stack.
 *
 * Clamped at zero.
 *
 * @method
 * @chainable
 */
OO.ui.TextInputWidget.prototype.popPending = function () {
	this.pending = Math.max( 0, this.pending - 1 );
	if ( !this.pending ) {
		this.$element.removeClass( 'oo-ui-textInputWidget-pending' );
		this.$input.removeClass( 'oo-ui-texture-pending' );
	}
	return this;
};
