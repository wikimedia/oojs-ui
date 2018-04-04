/**
 * RadioSelectInputWidget is a {@link OO.ui.RadioSelectWidget RadioSelectWidget} intended to be used
 * within an HTML form, such as a OO.ui.FormLayout. The selected value is synchronized with the value
 * of a hidden HTML `input` tag. Please see the [OOUI documentation on MediaWiki][1] for
 * more information about input widgets.
 *
 * This and OO.ui.DropdownInputWidget support the same configuration options.
 *
 *     @example
 *     // Example: A RadioSelectInputWidget with three options
 *     var radioSelectInput = new OO.ui.RadioSelectInputWidget( {
 *         options: [
 *             { data: 'a', label: 'First' },
 *             { data: 'b', label: 'Second'},
 *             { data: 'c', label: 'Third' }
 *         ]
 *     } );
 *     $( 'body' ).append( radioSelectInput.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Inputs
 *
 * @class
 * @extends OO.ui.InputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object[]} [options=[]] Array of menu options in the format `{ data: …, label: … }`
 */
OO.ui.RadioSelectInputWidget = function OoUiRadioSelectInputWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Properties (must be done before parent constructor which calls #setDisabled)
	this.radioSelectWidget = new OO.ui.RadioSelectWidget();
	// Set up the options before parent constructor, which uses them to validate config.value.
	// Use this instead of setOptions() because this.$input is not set up yet
	this.setOptionsData( config.options || [] );

	// Parent constructor
	OO.ui.RadioSelectInputWidget.parent.call( this, config );

	// Events
	this.radioSelectWidget.connect( this, { select: 'onMenuSelect' } );

	// Initialization
	this.$element
		.addClass( 'oo-ui-radioSelectInputWidget' )
		.append( this.radioSelectWidget.$element );
	this.setTabIndexedElement( this.radioSelectWidget.$tabIndexed );
};

/* Setup */

OO.inheritClass( OO.ui.RadioSelectInputWidget, OO.ui.InputWidget );

/* Static Methods */

/**
 * @inheritdoc
 */
OO.ui.RadioSelectInputWidget.static.gatherPreInfuseState = function ( node, config ) {
	var state = OO.ui.RadioSelectInputWidget.parent.static.gatherPreInfuseState( node, config );
	state.value = $( node ).find( '.oo-ui-radioInputWidget .oo-ui-inputWidget-input:checked' ).val();
	return state;
};

/**
 * @inheritdoc
 */
OO.ui.RadioSelectInputWidget.static.reusePreInfuseDOM = function ( node, config ) {
	config = OO.ui.RadioSelectInputWidget.parent.static.reusePreInfuseDOM( node, config );
	// Cannot reuse the `<input type=radio>` set
	delete config.$input;
	return config;
};

/* Methods */

/**
 * @inheritdoc
 * @protected
 */
OO.ui.RadioSelectInputWidget.prototype.getInputElement = function () {
	// Use this instead of <input type="hidden">, because hidden inputs do not have separate
	// 'value' and 'defaultValue' properties, and InputWidget wants to handle 'defaultValue'.
	return $( '<input>' ).addClass( 'oo-ui-element-hidden' );
};

/**
 * Handles menu select events.
 *
 * @private
 * @param {OO.ui.RadioOptionWidget} item Selected menu item
 */
OO.ui.RadioSelectInputWidget.prototype.onMenuSelect = function ( item ) {
	this.setValue( item.getData() );
};

/**
 * @inheritdoc
 */
OO.ui.RadioSelectInputWidget.prototype.setValue = function ( value ) {
	var selected;
	value = this.cleanUpValue( value );
	// Only allow setting values that are actually present in the dropdown
	selected = this.radioSelectWidget.findItemFromData( value ) ||
		this.radioSelectWidget.findFirstSelectableItem();
	this.radioSelectWidget.selectItem( selected );
	value = selected ? selected.getData() : '';
	OO.ui.RadioSelectInputWidget.parent.prototype.setValue.call( this, value );
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.RadioSelectInputWidget.prototype.setDisabled = function ( state ) {
	this.radioSelectWidget.setDisabled( state );
	OO.ui.RadioSelectInputWidget.parent.prototype.setDisabled.call( this, state );
	return this;
};

/**
 * Set the options available for this input.
 *
 * @param {Object[]} options Array of menu options in the format `{ data: …, label: … }`
 * @chainable
 */
OO.ui.RadioSelectInputWidget.prototype.setOptions = function ( options ) {
	var value = this.getValue();

	this.setOptionsData( options );

	// Re-set the value to update the visible interface (RadioSelectWidget).
	// In case the previous value is no longer an available option, select the first valid one.
	this.setValue( value );

	return this;
};

/**
 * Set the internal list of options, used e.g. by setValue() to see which options are allowed.
 *
 * This method may be called before the parent constructor, so various properties may not be
 * intialized yet.
 *
 * @param {Object[]} options Array of menu options in the format `{ data: …, label: … }`
 * @private
 */
OO.ui.RadioSelectInputWidget.prototype.setOptionsData = function ( options ) {
	var widget = this;

	this.radioSelectWidget
		.clearItems()
		.addItems( options.map( function ( opt ) {
			var optValue = widget.cleanUpValue( opt.data );
			return new OO.ui.RadioOptionWidget( {
				data: optValue,
				label: opt.label !== undefined ? opt.label : optValue
			} );
		} ) );
};

/**
 * @inheritdoc
 */
OO.ui.RadioSelectInputWidget.prototype.focus = function () {
	this.radioSelectWidget.focus();
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.RadioSelectInputWidget.prototype.blur = function () {
	this.radioSelectWidget.blur();
	return this;
};
