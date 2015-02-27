/**
 * ButtonInputWidget is used to submit HTML forms and is intended to be used within
 * a OO.ui.FormLayout. If you do not need the button to work with HTML forms, you probably
 * want to use OO.ui.ButtonWidget instead. Button input widgets can be rendered as either an
 * HTML `<button/>` (the default) or an HTML `<input/>` tags. See the
 * [OOjs UI documentation on MediaWiki] [1] for more information.
 *
 *     @example
 *     // A ButtonInputWidget rendered as an HTML button, the default.
 *     var button = new OO.ui.ButtonInputWidget( {
 *         label: 'Input button',
 *         icon: 'check',
 *         value: 'check'
 *     } );
 *     $( 'body' ).append( button.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Inputs#Button_inputs
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
 *  if you need IE 6 support in a form with multiple buttons. If you use this option, icons and
 *  indicators will not be displayed, it won't be possible to have a non-plaintext label, and it
 *  won't be possible to set a value (which will internally become identical to the label).
 */
OO.ui.ButtonInputWidget = function OoUiButtonInputWidget( config ) {
	// Configuration initialization
	config = $.extend( { type: 'button', useInputTag: false }, config );

	// Properties (must be set before parent constructor, which calls #setValue)
	this.useInputTag = config.useInputTag;

	// Parent constructor
	OO.ui.ButtonInputWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.ButtonElement.call( this, $.extend( {}, config, { $button: this.$input } ) );
	OO.ui.IconElement.call( this, config );
	OO.ui.IndicatorElement.call( this, config );
	OO.ui.LabelElement.call( this, config );
	OO.ui.TitledElement.call( this, $.extend( {}, config, { $titled: this.$input } ) );
	OO.ui.FlaggedElement.call( this, config );

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

/* Methods */

/**
 * @inheritdoc
 * @private
 */
OO.ui.ButtonInputWidget.prototype.getInputElement = function ( config ) {
	var html = '<' + ( config.useInputTag ? 'input' : 'button' ) + ' type="' + config.type + '">';
	return $( html );
};

/**
 * Set label value.
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
 * Set the value of the input.
 *
 * Overridden to disable for `<input/>` elements, which have value identical to the label.
 *
 * @param {string} value New value
 * @chainable
 */
OO.ui.ButtonInputWidget.prototype.setValue = function ( value ) {
	if ( !this.useInputTag ) {
		OO.ui.ButtonInputWidget.super.prototype.setValue.call( this, value );
	}
	return this;
};
