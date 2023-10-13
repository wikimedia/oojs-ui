/**
 * CopyTextLayout is an action field layout containing some readonly text and a button to copy
 * it to the clipboard.
 *
 * @class
 * @extends OO.ui.ActionFieldLayout
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} copyText Text to copy, can also be provided as textInput.value
 * @cfg {Object} textInput Config for text input
 * @cfg {Object} button Config for button
 */
OO.ui.CopyTextLayout = function OoUiCopyTextLayout( config ) {
	var TextClass;
	config = config || {};

	// Properties
	TextClass = config.multiline ? OO.ui.MultilineTextInputWidget : OO.ui.TextInputWidget;
	this.textInput = new TextClass( $.extend( {
		value: config.copyText,
		readOnly: true
	}, config.textInput ) );
	this.button = new OO.ui.ButtonWidget( $.extend( {
		label: OO.ui.msg( 'ooui-copytextlayout-copy' ),
		icon: 'copy'
	}, config.button ) );

	// Parent constructor
	OO.ui.CopyTextLayout.super.call( this, this.textInput, this.button, config );

	// HACK: When using a multiline text input, remove classes which connect widgets
	if ( config.multiline ) {
		this.$input.removeClass( 'oo-ui-actionFieldLayout-input' );
		this.$button
			.removeClass( 'oo-ui-actionFieldLayout-button' )
			.addClass( 'oo-ui-copyTextLayout-multiline-button' );
	}

	// Events
	this.button.connect( this, { click: 'onButtonClick' } );
	this.textInput.$input.on( 'focus', this.onInputFocus.bind( this ) );

	this.$element.addClass( 'oo-ui-copyTextLayout' );
};

/* Inheritance */

OO.inheritClass( OO.ui.CopyTextLayout, OO.ui.ActionFieldLayout );

/* Events */

/**
 * When the user has executed a copy command
 *
 * @event copy
 * @param {boolean} Whether the copy command succeeded
 */

/* Methods */

/**
 * Handle button click events
 *
 * @fires copy
 */
OO.ui.CopyTextLayout.prototype.onButtonClick = function () {
	var copied;

	this.selectText();

	try {
		copied = document.execCommand( 'copy' );
	} catch ( e ) {
		copied = false;
	}
	this.emit( 'copy', copied );
};

/**
 * Handle text widget focus events
 */
OO.ui.CopyTextLayout.prototype.onInputFocus = function () {
	if ( !this.selecting ) {
		this.selectText();
	}
};

/**
 * Select the text to copy
 */
OO.ui.CopyTextLayout.prototype.selectText = function () {
	var input = this.textInput.$input[ 0 ],
		scrollTop = input.scrollTop,
		scrollLeft = input.scrollLeft;

	this.selecting = true;
	this.textInput.select();
	this.selecting = false;

	// Restore scroll position
	input.scrollTop = scrollTop;
	input.scrollLeft = scrollLeft;
};
