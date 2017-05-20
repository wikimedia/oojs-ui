/**
 * InputWidget is the base class for all input widgets, which
 * include {@link OO.ui.TextInputWidget text inputs}, {@link OO.ui.CheckboxInputWidget checkbox inputs},
 * {@link OO.ui.RadioInputWidget radio inputs}, and {@link OO.ui.ButtonInputWidget button inputs}.
 * See the [OOjs UI documentation on MediaWiki] [1] for more information and examples.
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Inputs
 *
 * @abstract
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.FlaggedElement
 * @mixins OO.ui.mixin.TabIndexedElement
 * @mixins OO.ui.mixin.TitledElement
 * @mixins OO.ui.mixin.AccessKeyedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [name=''] The value of the input’s HTML `name` attribute.
 * @cfg {string} [value=''] The value of the input.
 * @cfg {string} [dir] The directionality of the input (ltr/rtl).
 * @cfg {string} [inputId] The value of the input’s HTML `id` attribute.
 * @cfg {Function} [inputFilter] The name of an input filter function. Input filters modify the value of an input
 *  before it is accepted.
 */
OO.ui.InputWidget = function OoUiInputWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.InputWidget.parent.call( this, config );

	// Properties
	// See #reusePreInfuseDOM about config.$input
	this.$input = config.$input || this.getInputElement( config );
	this.value = '';
	this.inputFilter = config.inputFilter;

	// Mixin constructors
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.TabIndexedElement.call( this, $.extend( {}, config, { $tabIndexed: this.$input } ) );
	OO.ui.mixin.TitledElement.call( this, $.extend( {}, config, { $titled: this.$input } ) );
	OO.ui.mixin.AccessKeyedElement.call( this, $.extend( {}, config, { $accessKeyed: this.$input } ) );

	// Events
	this.$input.on( 'keydown mouseup cut paste change input select', this.onEdit.bind( this ) );

	// Initialization
	this.$input
		.addClass( 'oo-ui-inputWidget-input' )
		.attr( 'name', config.name )
		.prop( 'disabled', this.isDisabled() );
	this.$element
		.addClass( 'oo-ui-inputWidget' )
		.append( this.$input );
	this.setValue( config.value );
	if ( config.dir ) {
		this.setDir( config.dir );
	}
	if ( config.inputId !== undefined ) {
		this.setInputId( config.inputId );
	}
};

/* Setup */

OO.inheritClass( OO.ui.InputWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.InputWidget, OO.ui.mixin.FlaggedElement );
OO.mixinClass( OO.ui.InputWidget, OO.ui.mixin.TabIndexedElement );
OO.mixinClass( OO.ui.InputWidget, OO.ui.mixin.TitledElement );
OO.mixinClass( OO.ui.InputWidget, OO.ui.mixin.AccessKeyedElement );

/* Static Methods */

/**
 * @inheritdoc
 */
OO.ui.InputWidget.static.reusePreInfuseDOM = function ( node, config ) {
	config = OO.ui.InputWidget.parent.static.reusePreInfuseDOM( node, config );
	// Reusing $input lets browsers preserve inputted values across page reloads (T114134)
	config.$input = $( node ).find( '.oo-ui-inputWidget-input' );
	return config;
};

/**
 * @inheritdoc
 */
OO.ui.InputWidget.static.gatherPreInfuseState = function ( node, config ) {
	var state = OO.ui.InputWidget.parent.static.gatherPreInfuseState( node, config );
	if ( config.$input && config.$input.length ) {
		state.value = config.$input.val();
		// Might be better in TabIndexedElement, but it's awkward to do there because mixins are awkward
		state.focus = config.$input.is( ':focus' );
	}
	return state;
};

/* Events */

/**
 * @event change
 *
 * A change event is emitted when the value of the input changes.
 *
 * @param {string} value
 */

/* Methods */

/**
 * Get input element.
 *
 * Subclasses of OO.ui.InputWidget use the `config` parameter to produce different elements in
 * different circumstances. The element must have a `value` property (like form elements).
 *
 * @protected
 * @param {Object} config Configuration options
 * @return {jQuery} Input element
 */
OO.ui.InputWidget.prototype.getInputElement = function () {
	return $( '<input>' );
};

/**
 * Handle potentially value-changing events.
 *
 * @private
 * @param {jQuery.Event} e Key down, mouse up, cut, paste, change, input, or select event
 */
OO.ui.InputWidget.prototype.onEdit = function () {
	var widget = this;
	if ( !this.isDisabled() ) {
		// Allow the stack to clear so the value will be updated
		setTimeout( function () {
			widget.setValue( widget.$input.val() );
		} );
	}
};

/**
 * Get the value of the input.
 *
 * @return {string} Input value
 */
OO.ui.InputWidget.prototype.getValue = function () {
	// Resynchronize our internal data with DOM data. Other scripts executing on the page can modify
	// it, and we won't know unless they're kind enough to trigger a 'change' event.
	var value = this.$input.val();
	if ( this.value !== value ) {
		this.setValue( value );
	}
	return this.value;
};

/**
 * Set the directionality of the input.
 *
 * @param {string} dir Text directionality: 'ltr', 'rtl' or 'auto'
 * @chainable
 */
OO.ui.InputWidget.prototype.setDir = function ( dir ) {
	this.$input.prop( 'dir', dir );
	return this;
};

/**
 * Set the value of the input.
 *
 * @param {string} value New value
 * @fires change
 * @chainable
 */
OO.ui.InputWidget.prototype.setValue = function ( value ) {
	value = this.cleanUpValue( value );
	// Update the DOM if it has changed. Note that with cleanUpValue, it
	// is possible for the DOM value to change without this.value changing.
	if ( this.$input.val() !== value ) {
		this.$input.val( value );
	}
	if ( this.value !== value ) {
		this.value = value;
		this.emit( 'change', this.value );
	}
	return this;
};

/**
 * Clean up incoming value.
 *
 * Ensures value is a string, and converts undefined and null to empty string.
 *
 * @private
 * @param {string} value Original value
 * @return {string} Cleaned up value
 */
OO.ui.InputWidget.prototype.cleanUpValue = function ( value ) {
	if ( value === undefined || value === null ) {
		return '';
	} else if ( this.inputFilter ) {
		return this.inputFilter( String( value ) );
	} else {
		return String( value );
	}
};

/**
 * Simulate the behavior of clicking on a label bound to this input. This method is only called by
 * {@link OO.ui.LabelWidget LabelWidget} and {@link OO.ui.FieldLayout FieldLayout}. It should not be
 * called directly.
 */
OO.ui.InputWidget.prototype.simulateLabelClick = function () {
	OO.ui.warnDeprecation( 'InputWidget: simulateLabelClick() is deprecated.' );
	if ( !this.isDisabled() ) {
		if ( this.$input.is( ':checkbox, :radio' ) ) {
			this.$input.click();
		}
		if ( this.$input.is( ':input' ) ) {
			this.$input[ 0 ].focus();
		}
	}
};

/**
 * @inheritdoc
 */
OO.ui.InputWidget.prototype.setDisabled = function ( state ) {
	OO.ui.InputWidget.parent.prototype.setDisabled.call( this, state );
	if ( this.$input ) {
		this.$input.prop( 'disabled', this.isDisabled() );
	}
	return this;
};

/**
 * Set the 'id' attribute of the `<input>` element.
 *
 * @param {string} id
 * @chainable
 */
OO.ui.InputWidget.prototype.setInputId = function ( id ) {
	this.$input.attr( 'id', id );
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.InputWidget.prototype.restorePreInfuseState = function ( state ) {
	OO.ui.InputWidget.parent.prototype.restorePreInfuseState.call( this, state );
	if ( state.value !== undefined && state.value !== this.getValue() ) {
		this.setValue( state.value );
	}
	if ( state.focus ) {
		this.focus();
	}
};
