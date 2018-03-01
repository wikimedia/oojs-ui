/**
 * CheckboxMultiselectInputWidget is a
 * {@link OO.ui.CheckboxMultiselectWidget CheckboxMultiselectWidget} intended to be used within a
 * HTML form, such as a OO.ui.FormLayout. The selected values are synchronized with the value of
 * HTML `<input type=checkbox>` tags. Please see the [OOUI documentation on MediaWiki][1] for
 * more information about input widgets.
 *
 *     @example
 *     // Example: A CheckboxMultiselectInputWidget with three options
 *     var multiselectInput = new OO.ui.CheckboxMultiselectInputWidget( {
 *         options: [
 *             { data: 'a', label: 'First' },
 *             { data: 'b', label: 'Second'},
 *             { data: 'c', label: 'Third' }
 *         ]
 *     } );
 *     $( 'body' ).append( multiselectInput.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Inputs
 *
 * @class
 * @extends OO.ui.InputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object[]} [options=[]] Array of menu options in the format `{ data: …, label: …, disabled: … }`
 */
OO.ui.CheckboxMultiselectInputWidget = function OoUiCheckboxMultiselectInputWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Properties (must be done before parent constructor which calls #setDisabled)
	this.checkboxMultiselectWidget = new OO.ui.CheckboxMultiselectWidget();
	// Must be set before the #setOptionsData call below
	this.inputName = config.name;
	// Set up the options before parent constructor, which uses them to validate config.value.
	// Use this instead of setOptions() because this.$input is not set up yet
	this.setOptionsData( config.options || [] );

	// Parent constructor
	OO.ui.CheckboxMultiselectInputWidget.parent.call( this, config );

	// Events
	this.checkboxMultiselectWidget.connect( this, { select: 'onCheckboxesSelect' } );

	// Initialization
	this.$element
		.addClass( 'oo-ui-checkboxMultiselectInputWidget' )
		.append( this.checkboxMultiselectWidget.$element );
	// We don't use this.$input, but rather the CheckboxInputWidgets inside each option
	this.$input.detach();
};

/* Setup */

OO.inheritClass( OO.ui.CheckboxMultiselectInputWidget, OO.ui.InputWidget );

/* Static Methods */

/**
 * @inheritdoc
 */
OO.ui.CheckboxMultiselectInputWidget.static.gatherPreInfuseState = function ( node, config ) {
	var state = OO.ui.CheckboxMultiselectInputWidget.parent.static.gatherPreInfuseState( node, config );
	state.value = $( node ).find( '.oo-ui-checkboxInputWidget .oo-ui-inputWidget-input:checked' )
		.toArray().map( function ( el ) { return el.value; } );
	return state;
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxMultiselectInputWidget.static.reusePreInfuseDOM = function ( node, config ) {
	config = OO.ui.CheckboxMultiselectInputWidget.parent.static.reusePreInfuseDOM( node, config );
	// Cannot reuse the `<input type=checkbox>` set
	delete config.$input;
	return config;
};

/* Methods */

/**
 * @inheritdoc
 * @protected
 */
OO.ui.CheckboxMultiselectInputWidget.prototype.getInputElement = function () {
	// Actually unused
	return $( '<unused>' );
};

/**
 * Handles CheckboxMultiselectWidget select events.
 *
 * @private
 */
OO.ui.CheckboxMultiselectInputWidget.prototype.onCheckboxesSelect = function () {
	this.setValue( this.checkboxMultiselectWidget.findSelectedItemsData() );
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxMultiselectInputWidget.prototype.getValue = function () {
	var value = this.$element.find( '.oo-ui-checkboxInputWidget .oo-ui-inputWidget-input:checked' )
		.toArray().map( function ( el ) { return el.value; } );
	if ( this.value !== value ) {
		this.setValue( value );
	}
	return this.value;
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxMultiselectInputWidget.prototype.setValue = function ( value ) {
	value = this.cleanUpValue( value );
	this.checkboxMultiselectWidget.selectItemsByData( value );
	OO.ui.CheckboxMultiselectInputWidget.parent.prototype.setValue.call( this, value );
	if ( this.optionsDirty ) {
		// We reached this from the constructor or from #setOptions.
		// We have to update the <select> element.
		this.updateOptionsInterface();
	}
	return this;
};

/**
 * Clean up incoming value.
 *
 * @param {string[]} value Original value
 * @return {string[]} Cleaned up value
 */
OO.ui.CheckboxMultiselectInputWidget.prototype.cleanUpValue = function ( value ) {
	var i, singleValue,
		cleanValue = [];
	if ( !Array.isArray( value ) ) {
		return cleanValue;
	}
	for ( i = 0; i < value.length; i++ ) {
		singleValue =
			OO.ui.CheckboxMultiselectInputWidget.parent.prototype.cleanUpValue.call( this, value[ i ] );
		// Remove options that we don't have here
		if ( !this.checkboxMultiselectWidget.findItemFromData( singleValue ) ) {
			continue;
		}
		cleanValue.push( singleValue );
	}
	return cleanValue;
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxMultiselectInputWidget.prototype.setDisabled = function ( state ) {
	this.checkboxMultiselectWidget.setDisabled( state );
	OO.ui.CheckboxMultiselectInputWidget.parent.prototype.setDisabled.call( this, state );
	return this;
};

/**
 * Set the options available for this input.
 *
 * @param {Object[]} options Array of menu options in the format `{ data: …, label: …, disabled: … }`
 * @chainable
 */
OO.ui.CheckboxMultiselectInputWidget.prototype.setOptions = function ( options ) {
	var value = this.getValue();

	this.setOptionsData( options );

	// Re-set the value to update the visible interface (CheckboxMultiselectWidget).
	// This will also get rid of any stale options that we just removed.
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
OO.ui.CheckboxMultiselectInputWidget.prototype.setOptionsData = function ( options ) {
	var widget = this;

	this.optionsDirty = true;

	this.checkboxMultiselectWidget
		.clearItems()
		.addItems( options.map( function ( opt ) {
			var optValue, item, optDisabled;
			optValue =
				OO.ui.CheckboxMultiselectInputWidget.parent.prototype.cleanUpValue.call( widget, opt.data );
			optDisabled = opt.disabled !== undefined ? opt.disabled : false;
			item = new OO.ui.CheckboxMultioptionWidget( {
				data: optValue,
				label: opt.label !== undefined ? opt.label : optValue,
				disabled: optDisabled
			} );
			// Set the 'name' and 'value' for form submission
			item.checkbox.$input.attr( 'name', widget.inputName );
			item.checkbox.setValue( optValue );
			return item;
		} ) );
};

/**
 * Update the user-visible interface to match the internal list of options and value.
 *
 * This method must only be called after the parent constructor.
 *
 * @private
 */
OO.ui.CheckboxMultiselectInputWidget.prototype.updateOptionsInterface = function () {
	var defaultValue = this.defaultValue;

	this.checkboxMultiselectWidget.getItems().forEach( function ( item ) {
		// Remember original selection state. This property can be later used to check whether
		// the selection state of the input has been changed since it was created.
		var isDefault = defaultValue.indexOf( item.getData() ) !== -1;
		item.checkbox.defaultSelected = isDefault;
		item.checkbox.$input[ 0 ].defaultChecked = isDefault;
	} );

	this.optionsDirty = false;
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxMultiselectInputWidget.prototype.focus = function () {
	this.checkboxMultiselectWidget.focus();
	return this;
};
