/**
 * CheckboxMultiselectInputWidget is a
 * {@link OO.ui.CheckboxMultiselectWidget CheckboxMultiselectWidget} intended to be used within a
 * HTML form, such as a OO.ui.FormLayout. The selected values are synchronized with the value of
 * HTML `<input type=checkbox>` tags. Please see the [OOjs UI documentation on MediaWiki][1] for
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
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Inputs
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

	// Parent constructor
	OO.ui.CheckboxMultiselectInputWidget.parent.call( this, config );

	// Properties
	this.inputName = config.name;

	// Initialization
	this.$element
		.addClass( 'oo-ui-checkboxMultiselectInputWidget' )
		.append( this.checkboxMultiselectWidget.$element );
	// We don't use this.$input, but rather the CheckboxInputWidgets inside each option
	this.$input.detach();
	this.setOptions( config.options || [] );
	// Have to repeat this from parent, as we need options to be set up for this to make sense
	this.setValue( config.value );
};

/* Setup */

OO.inheritClass( OO.ui.CheckboxMultiselectInputWidget, OO.ui.InputWidget );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.CheckboxMultiselectInputWidget.static.supportsSimpleLabel = false;

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
		if ( !this.checkboxMultiselectWidget.getItemFromData( singleValue ) ) {
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
	var widget = this;

	// Rebuild the checkboxMultiselectWidget menu
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

	// Re-set the value, checking the checkboxes as needed.
	// This will also get rid of any stale options that we just removed.
	this.setValue( this.getValue() );

	return this;
};
