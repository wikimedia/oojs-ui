/**
 * DropdownInputWidget is a {@link OO.ui.DropdownWidget DropdownWidget} intended to be used
 * within an HTML form, such as a OO.ui.FormLayout. The selected value is synchronized with the value
 * of a hidden HTML `input` tag. Please see the [OOjs UI documentation on MediaWiki][1] for
 * more information about input widgets.
 *
 * A DropdownInputWidget always has a value (one of the options is always selected), unless there
 * are no options. If no `value` configuration option is provided, the first option is selected.
 * If you need a state representing no value (no option being selected), use a DropdownWidget.
 *
 * This and OO.ui.RadioSelectInputWidget support the same configuration options.
 *
 *     @example
 *     // Example: A DropdownInputWidget with three options
 *     var dropdownInput = new OO.ui.DropdownInputWidget( {
 *         options: [
 *             { data: 'a', label: 'First' },
 *             { data: 'b', label: 'Second'},
 *             { data: 'c', label: 'Third' }
 *         ]
 *     } );
 *     $( 'body' ).append( dropdownInput.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Inputs
 *
 * @class
 * @extends OO.ui.InputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object[]} [options=[]] Array of menu options in the format `{ data: …, label: … }`
 * @cfg {Object} [dropdown] Configuration options for {@link OO.ui.DropdownWidget DropdownWidget}
 */
OO.ui.DropdownInputWidget = function OoUiDropdownInputWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Properties (must be done before parent constructor which calls #setDisabled)
	this.dropdownWidget = new OO.ui.DropdownWidget( config.dropdown );

	// Parent constructor
	OO.ui.DropdownInputWidget.parent.call( this, config );

	// Events
	this.dropdownWidget.getMenu().connect( this, { select: 'onMenuSelect' } );

	// Initialization
	this.setOptions( config.options || [] );
	// Set the value again, after we did setOptions(). The call from parent doesn't work because the
	// widget has no valid options when it happens.
	this.setValue( config.value );
	this.$element
		.addClass( 'oo-ui-dropdownInputWidget' )
		.append( this.dropdownWidget.$element );
	this.setTabIndexedElement( null );
};

/* Setup */

OO.inheritClass( OO.ui.DropdownInputWidget, OO.ui.InputWidget );

/* Methods */

/**
 * @inheritdoc
 * @protected
 */
OO.ui.DropdownInputWidget.prototype.getInputElement = function () {
	return $( '<select>' );
};

/**
 * Handles menu select events.
 *
 * @private
 * @param {OO.ui.MenuOptionWidget|null} item Selected menu item
 */
OO.ui.DropdownInputWidget.prototype.onMenuSelect = function ( item ) {
	this.setValue( item ? item.getData() : '' );
};

/**
 * @inheritdoc
 */
OO.ui.DropdownInputWidget.prototype.setValue = function ( value ) {
	var selected;
	value = this.cleanUpValue( value );
	// Only allow setting values that are actually present in the dropdown
	selected = this.dropdownWidget.getMenu().getItemFromData( value ) ||
		this.dropdownWidget.getMenu().findFirstSelectableItem();
	this.dropdownWidget.getMenu().selectItem( selected );
	value = selected ? selected.getData() : '';
	OO.ui.DropdownInputWidget.parent.prototype.setValue.call( this, value );
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.DropdownInputWidget.prototype.setDisabled = function ( state ) {
	this.dropdownWidget.setDisabled( state );
	OO.ui.DropdownInputWidget.parent.prototype.setDisabled.call( this, state );
	return this;
};

/**
 * Set the options available for this input.
 *
 * @param {Object[]} options Array of menu options in the format `{ data: …, label: … }`
 * @chainable
 */
OO.ui.DropdownInputWidget.prototype.setOptions = function ( options ) {
	var
		optionWidgets = [],
		value = this.getValue(),
		$optionsContainer = this.$input,
		widget = this;

	this.dropdownWidget.getMenu().clearItems();
	this.$input.empty();

	// Rebuild the dropdown menu: our visible one and the hidden `<select>`
	options.forEach( function ( opt ) {
		var optValue, $optionNode, optionWidget;

		if ( opt.optgroup === undefined ) {
			optValue = widget.cleanUpValue( opt.data );

			$optionNode = $( '<option>' )
				.attr( 'value', optValue )
				.text( opt.label !== undefined ? opt.label : optValue );
			optionWidget = new OO.ui.MenuOptionWidget( {
				data: optValue,
				label: opt.label !== undefined ? opt.label : optValue
			} );

			$optionsContainer.append( $optionNode );
			optionWidgets.push( optionWidget );
		} else {
			$optionNode = $( '<optgroup>' )
				.attr( 'label', opt.optgroup );
			optionWidget = new OO.ui.MenuSectionOptionWidget( {
				label: opt.optgroup
			} );

			widget.$input.append( $optionNode );
			$optionsContainer = $optionNode;
			optionWidgets.push( optionWidget );
		}
	} );
	this.dropdownWidget.getMenu().addItems( optionWidgets );

	// Restore the previous value, or reset to something sensible
	if ( this.dropdownWidget.getMenu().getItemFromData( value ) ) {
		// Previous value is still available, ensure consistency with the dropdown
		this.setValue( value );
	} else {
		// No longer valid, reset
		if ( options.length ) {
			this.setValue( options[ 0 ].data );
		}
	}

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.DropdownInputWidget.prototype.focus = function () {
	this.dropdownWidget.focus();
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.DropdownInputWidget.prototype.blur = function () {
	this.dropdownWidget.blur();
	return this;
};
