/**
 * ButtonInputWidget is used to submit HTML forms and is intended to be used within
 * a OO.ui.FormLayout. If you do not need the button to work with HTML forms, you probably
 * want to use OO.ui.ButtonWidget instead. Button input widgets can be rendered as either an
 * HTML `<button>` (the default) or an HTML `<input>` tags. See the
 * [OOUI documentation on MediaWiki][1] for more information.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Inputs#Button_inputs
 *
 *     @example
 *     // A ButtonInputWidget rendered as an HTML button, the default.
 *     const button = new OO.ui.ButtonInputWidget( {
 *         label: 'Input button',
 *         icon: 'check',
 *         value: 'check'
 *     } );
 *     $( document.body ).append( button.$element );
 *
 * @class
 * @extends OO.ui.InputWidget
 * @mixes OO.ui.mixin.ButtonElement
 * @mixes OO.ui.mixin.IconElement
 * @mixes OO.ui.mixin.IndicatorElement
 * @mixes OO.ui.mixin.LabelElement
 * @mixes OO.ui.mixin.FlaggedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {string} [config.type='button'] The value of the HTML `'type'` attribute:
 *  'button', 'submit' or 'reset'.
 * @param {boolean} [config.useInputTag=false] Use an `<input>` tag instead of a `<button>` tag, the
 *  default. Widgets configured to be an `<input>` do not support {@link OO.ui.ButtonInputWidget#icon icons} and
 *  {@link OO.ui.ButtonInputWidget#indicator indicators}, non-plaintext {@link OO.ui.ButtonInputWidget#label labels}, or {@link OO.ui.ButtonInputWidget#value values}. In
 *  general, useInputTag should only be set to `true` when there’s need to support IE 6 in a form
 *  with multiple buttons.
 * @param {boolean} [config.formNoValidate=false] Whether to use `formnovalidate` attribute.
 */
OO.ui.ButtonInputWidget = function OoUiButtonInputWidget( config ) {
	// Configuration initialization
	config = Object.assign( { type: 'button', useInputTag: false, formNoValidate: false }, config );

	// See InputWidget#reusePreInfuseDOM about config.$input
	if ( config.$input ) {
		config.$input.empty();
	}

	// Properties (must be set before parent constructor, which calls #setValue)
	this.useInputTag = config.useInputTag;

	// Parent constructor
	OO.ui.ButtonInputWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.ButtonElement.call( this, Object.assign( {
		$button: this.$input
	}, config ) );
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );

	// Initialization
	if ( !config.useInputTag ) {
		this.$input.append( this.$icon, this.$label, this.$indicator );
	}

	if ( config.formNoValidate ) {
		this.$input.attr( 'formnovalidate', 'formnovalidate' );
	}

	this.$element.addClass( 'oo-ui-buttonInputWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.ButtonInputWidget, OO.ui.InputWidget );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.mixin.ButtonElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.ButtonInputWidget, OO.ui.mixin.FlaggedElement );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.ButtonInputWidget.static.tagName = 'span';

/* Methods */

/**
 * @inheritdoc
 * @protected
 */
OO.ui.ButtonInputWidget.prototype.getInputElement = function ( config ) {
	const type = config.type === 'submit' || config.type === 'reset' ? config.type : 'button';
	return $( '<' + ( config.useInputTag ? 'input' : 'button' ) + ' type="' + type + '">' );
};

/**
 * Set label value.
 *
 * If #useInputTag is `true`, the label is set as the `value` of the `<input>` tag.
 *
 * @param {jQuery|string|Function|null} label Label nodes, text, a function that returns nodes or
 *  text, or `null` for no label
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.ButtonInputWidget.prototype.setLabel = function ( label ) {
	label = OO.ui.resolveMsg( label );

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
 * This method is disabled for button inputs configured as {@link OO.ui.ButtonInputWidget#useInputTag <input> tags}, as
 * they do not support {@link OO.ui.ButtonInputWidget#value values}.
 *
 * @param {string} value New value
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.ButtonInputWidget.prototype.setValue = function ( value ) {
	if ( !this.useInputTag ) {
		OO.ui.ButtonInputWidget.super.prototype.setValue.call( this, value );
	}
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.ButtonInputWidget.prototype.getInputId = function () {
	// Disable generating `<label>` elements for buttons. One would very rarely need additional
	// label for a button, and it's already a big clickable target, and it causes
	// unexpected rendering.
	return null;
};
