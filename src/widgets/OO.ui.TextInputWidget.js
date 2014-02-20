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
 */
OO.ui.TextInputWidget = function OoUiTextInputWidget( config ) {
	config = config || {};

	// Parent constructor
	OO.ui.InputWidget.call( this, config );

	// Properties
	this.pending = 0;
	this.multiline = !!config.multiline;
	this.autosize = !!config.autosize;

	// Events
	this.$input.on( 'keypress', OO.ui.bind( this.onKeyPress, this ) );

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
 * @inheritdoc
 */
OO.ui.TextInputWidget.prototype.onEdit = function () {
	var $clone, scrollHeight, innerHeight, outerHeight;

	// Automatic size adjustment
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
		$clone.remove();
		// Only apply inline height when expansion beyond natural height is needed
		this.$input.css(
			'height',
			// Use the difference between the inner and outer height as a buffer
			scrollHeight > outerHeight ? scrollHeight + ( outerHeight - innerHeight ) : ''
		);
	}

	// Parent method
	return OO.ui.InputWidget.prototype.onEdit.call( this );
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
