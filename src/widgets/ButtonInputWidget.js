/**
 * A button that is an input widget. Intended to be used within FormLayouts.
 *
 * @class
 * @extends OO.ui.InputWidget
 * @mixins OO.ui.ButtonElement
 * @mixins OO.ui.IconElement
 * @mixins OO.ui.IndicatorElement
 * @mixins OO.ui.LabelElement
 * @mixins OO.ui.TitledElement
 * @mixins OO.ui.FlaggedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [type='button'] HTML tag `type` attribute, may be 'button', 'submit' or 'reset'
 * @cfg {boolean} [useInputTag=false] Whether to use `<input/>` rather than `<button/>`. Only useful
 *  if you need IE 6 support in a form with multiple buttons. By using this option, you sacrifice
 *  icons and indicators, as well as the ability to have non-plaintext label or a label different
 *  from the value.
 */
OO.ui.ButtonInputWidget = function OoUiButtonInputWidget( config ) {
	// Configuration initialization
	config = $.extend( { type: 'button', useInputTag: false }, config );

	// Parent constructor
	OO.ui.ButtonInputWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.ButtonElement.call( this, $.extend( {}, config, { $button: this.$input } ) );
	OO.ui.IconElement.call( this, config );
	OO.ui.IndicatorElement.call( this, config );
	OO.ui.LabelElement.call( this, config );
	OO.ui.TitledElement.call( this, $.extend( {}, config, { $titled: this.$input } ) );
	OO.ui.FlaggedElement.call( this, config );

	// Properties
	this.useInputTag = config.useInputTag;

	// Events
	this.$input.on( {
		click: this.onClick.bind( this ),
		keypress: this.onKeyPress.bind( this )
	} );

	// Initialization
	if ( !config.useInputTag ) {
		this.$input.append( this.$icon, this.$label, this.$indicator );
	}
	this.$element.addClass( 'oo-ui-buttonInputWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.ButtonInputWidget, OO.ui.InputWidget );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.ButtonElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.IconElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.IndicatorElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.LabelElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.TitledElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.FlaggedElement );

/* Events */

/**
 * @event click
 */

/* Methods */

/**
 * Get input element.
 *
 * @param {Object} [config] Configuration options
 * @return {jQuery} Input element
 */
OO.ui.ButtonInputWidget.prototype.getInputElement = function ( config ) {
	var html = '<' + ( config.useInputTag ? 'input' : 'button' ) + ' type="' + config.type + '">';
	return this.$( html );
};

/**
 * Set the label.
 *
 * Overridden to support setting the 'value' of `<input/>` elements.
 *
 * @param {jQuery|string|Function|null} label Label nodes; text; a function that returns nodes or
 *  text; or null for no label
 * @chainable
 */
OO.ui.ButtonInputWidget.prototype.setLabel = function ( label ) {
	OO.ui.LabelElement.prototype.setLabel.call( this, label );

	if ( this.useInputTag ) {
		if ( typeof label === 'function' ) {
			label = OO.ui.resolveMsg( label );
		}
		if ( label instanceof jQuery ) {
			label = label.text();
		}
		if ( !label ) {
			label = '';
		}
		this.$input.val( label );
	}

	return this;
};

/**
 * Handles mouse click events.
 *
 * @param {jQuery.Event} e Mouse click event
 * @fires click
 */
OO.ui.ButtonInputWidget.prototype.onClick = function () {
	if ( !this.isDisabled() ) {
		this.emit( 'click' );
	}
	return false;
};

/**
 * Handles keypress events.
 *
 * @param {jQuery.Event} e Keypress event
 * @fires click
 */
OO.ui.ButtonInputWidget.prototype.onKeyPress = function ( e ) {
	if ( !this.isDisabled() && ( e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER ) ) {
		this.emit( 'click' );
	}
	return false;
};
