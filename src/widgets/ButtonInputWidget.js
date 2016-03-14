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
 * @mixins OO.ui.mixin.ButtonElement
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.TitledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [type='button'] The value of the HTML `'type'` attribute: 'button', 'submit' or 'reset'.
 * @cfg {boolean} [useInputTag=false] Use an `<input/>` tag instead of a `<button/>` tag, the default.
 *  Widgets configured to be an `<input/>` do not support {@link #icon icons} and {@link #indicator indicators},
 *  non-plaintext {@link #label labels}, or {@link #value values}. In general, useInputTag should only
 *  be set to `true` when there’s need to support IE 6 in a form with multiple buttons.
 */
OO.ui.ButtonInputWidget = function OoUiButtonInputWidget( config ) {
	// Configuration initialization
	config = $.extend( { type: 'button', useInputTag: false }, config );

	// See InputWidget#reusePreInfuseDOM about config.$input
	if ( config.$input ) {
		config.$input.empty();
	}

	// Properties (must be set before parent constructor, which calls #setValue)
	this.useInputTag = config.useInputTag;

	// Parent constructor
	OO.ui.ButtonInputWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.ButtonElement.call( this, $.extend( {}, config, { $button: this.$input } ) );
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.TitledElement.call( this, $.extend( {}, config, { $titled: this.$input } ) );

	// Initialization
	if ( !config.useInputTag ) {
		this.$input.append( this.$icon, this.$label, this.$indicator );
	}
	this.$element.addClass( 'oo-ui-buttonInputWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.ButtonInputWidget, OO.ui.InputWidget );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.mixin.ButtonElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.mixin.TitledElement );

/* Static Properties */

/**
 * Disable generating `<label>` elements for buttons. One would very rarely need additional label
 * for a button, and it's already a big clickable target, and it causes unexpected rendering.
 */
OO.ui.ButtonInputWidget.static.supportsSimpleLabel = false;

/* Methods */

/**
 * @inheritdoc
 * @protected
 */
OO.ui.ButtonInputWidget.prototype.getInputElement = function ( config ) {
	var type;
	type = [ 'button', 'submit', 'reset' ].indexOf( config.type ) !== -1 ? config.type : 'button';
	return $( '<' + ( config.useInputTag ? 'input' : 'button' ) + ' type="' + type + '">' );
};

/**
 * Set label value.
 *
 * If #useInputTag is `true`, the label is set as the `value` of the `<input/>` tag.
 *
 * @param {jQuery|string|Function|null} label Label nodes, text, a function that returns nodes or
 *  text, or `null` for no label
 * @chainable
 */
OO.ui.ButtonInputWidget.prototype.setLabel = function ( label ) {
	if ( typeof label === 'function' ) {
		label = OO.ui.resolveMsg( label );
	}

	if ( this.useInputTag ) {
		// Discard non-plaintext labels
		if ( typeof label !== 'string' ) {
			label = '';
		}

		this.$input.val( label );
	}

	return OO.ui.mixin.LabelElement.prototype.setLabel.call( this, label );
};

/**
 * Set the value of the input.
 *
 * This method is disabled for button inputs configured as {@link #useInputTag <input/> tags}, as
 * they do not support {@link #value values}.
 *
 * @param {string} value New value
 * @chainable
 */
OO.ui.ButtonInputWidget.prototype.setValue = function ( value ) {
	if ( !this.useInputTag ) {
		OO.ui.ButtonInputWidget.parent.prototype.setValue.call( this, value );
	}
	return this;
};
