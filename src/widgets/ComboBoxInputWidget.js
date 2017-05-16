/**
 * ComboBoxInputWidgets combine a {@link OO.ui.TextInputWidget text input} (where a value
 * can be entered manually) and a {@link OO.ui.MenuSelectWidget menu of options} (from which
 * a value can be chosen instead). Users can choose options from the combo box in one of two ways:
 *
 * - by typing a value in the text input field. If the value exactly matches the value of a menu
 *   option, that option will appear to be selected.
 * - by choosing a value from the menu. The value of the chosen option will then appear in the text
 *   input field.
 *
 * After the user chooses an option, its `data` will be used as a new value for the widget.
 * A `label` also can be specified for each option: if given, it will be shown instead of the
 * `data` in the dropdown menu.
 *
 * This widget can be used inside an HTML form, such as a OO.ui.FormLayout.
 *
 * For more information about menus and options, please see the [OOjs UI documentation on MediaWiki][1].
 *
 *     @example
 *     // Example: A ComboBoxInputWidget.
 *     var comboBox = new OO.ui.ComboBoxInputWidget( {
 *         value: 'Option 1',
 *         options: [
 *             { data: 'Option 1' },
 *             { data: 'Option 2' },
 *             { data: 'Option 3' }
 *         ]
 *     } );
 *     $( 'body' ).append( comboBox.$element );
 *
 *     @example
 *     // Example: A ComboBoxInputWidget with additional option labels.
 *     var comboBox = new OO.ui.ComboBoxInputWidget( {
 *         value: 'Option 1',
 *         options: [
 *             {
 *                 data: 'Option 1',
 *                 label: 'Option One'
 *             },
 *             {
 *                 data: 'Option 2',
 *                 label: 'Option Two'
 *             },
 *             {
 *                 data: 'Option 3',
 *                 label: 'Option Three'
 *             }
 *         ]
 *     } );
 *     $( 'body' ).append( comboBox.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Selects_and_Options#Menu_selects_and_options
 *
 * @class
 * @extends OO.ui.TextInputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object[]} [options=[]] Array of menu options in the format `{ data: …, label: … }`
 * @cfg {Object} [menu] Configuration options to pass to the {@link OO.ui.MenuSelectWidget menu select widget}.
 * @cfg {jQuery} [$overlay] Render the menu into a separate layer. This configuration is useful in cases where
 *  the expanded menu is larger than its containing `<div>`. The specified overlay layer is usually on top of the
 *  containing `<div>` and has a larger area. By default, the menu uses relative positioning.
 *  See <https://www.mediawiki.org/wiki/OOjs_UI/Concepts#Overlays>.
 */
OO.ui.ComboBoxInputWidget = function OoUiComboBoxInputWidget( config ) {
	// Configuration initialization
	config = $.extend( {
		autocomplete: false
	}, config );

	// ComboBoxInputWidget shouldn't support `multiline`
	config.multiline = false;

	// See InputWidget#reusePreInfuseDOM about `config.$input`
	if ( config.$input ) {
		config.$input.removeAttr( 'list' );
	}

	// Parent constructor
	OO.ui.ComboBoxInputWidget.parent.call( this, config );

	// Properties
	this.$overlay = config.$overlay || this.$element;
	this.dropdownButton = new OO.ui.ButtonWidget( {
		classes: [ 'oo-ui-comboBoxInputWidget-dropdownButton' ],
		indicator: 'down',
		disabled: this.disabled
	} );
	this.menu = new OO.ui.MenuSelectWidget( $.extend(
		{
			widget: this,
			input: this,
			$floatableContainer: this.$element,
			disabled: this.isDisabled()
		},
		config.menu
	) );

	// Events
	this.connect( this, {
		change: 'onInputChange',
		enter: 'onInputEnter'
	} );
	this.dropdownButton.connect( this, {
		click: 'onDropdownButtonClick'
	} );
	this.menu.connect( this, {
		choose: 'onMenuChoose',
		add: 'onMenuItemsChange',
		remove: 'onMenuItemsChange'
	} );

	// Initialization
	this.$input.attr( {
		role: 'combobox',
		'aria-owns': this.menu.getElementId(),
		'aria-autocomplete': 'list'
	} );
	// Do not override options set via config.menu.items
	if ( config.options !== undefined ) {
		this.setOptions( config.options );
	}
	this.$field = $( '<div>' )
		.addClass( 'oo-ui-comboBoxInputWidget-field' )
		.append( this.$input, this.dropdownButton.$element );
	this.$element
		.addClass( 'oo-ui-comboBoxInputWidget' )
		.append( this.$field );
	this.$overlay.append( this.menu.$element );
	this.onMenuItemsChange();
};

/* Setup */

OO.inheritClass( OO.ui.ComboBoxInputWidget, OO.ui.TextInputWidget );

/* Methods */

/**
 * Get the combobox's menu.
 *
 * @return {OO.ui.MenuSelectWidget} Menu widget
 */
OO.ui.ComboBoxInputWidget.prototype.getMenu = function () {
	return this.menu;
};

/**
 * Get the combobox's text input widget.
 *
 * @return {OO.ui.TextInputWidget} Text input widget
 */
OO.ui.ComboBoxInputWidget.prototype.getInput = function () {
	return this;
};

/**
 * Handle input change events.
 *
 * @private
 * @param {string} value New value
 */
OO.ui.ComboBoxInputWidget.prototype.onInputChange = function ( value ) {
	var match = this.menu.getItemFromData( value );

	this.menu.selectItem( match );
	if ( this.menu.getHighlightedItem() ) {
		this.menu.highlightItem( match );
	}

	if ( !this.isDisabled() ) {
		this.menu.toggle( true );
	}
};

/**
 * Handle input enter events.
 *
 * @private
 */
OO.ui.ComboBoxInputWidget.prototype.onInputEnter = function () {
	if ( !this.isDisabled() ) {
		this.menu.toggle( false );
	}
};

/**
 * Handle button click events.
 *
 * @private
 */
OO.ui.ComboBoxInputWidget.prototype.onDropdownButtonClick = function () {
	this.menu.toggle();
	this.focus();
};

/**
 * Handle menu choose events.
 *
 * @private
 * @param {OO.ui.OptionWidget} item Chosen item
 */
OO.ui.ComboBoxInputWidget.prototype.onMenuChoose = function ( item ) {
	this.setValue( item.getData() );
};

/**
 * Handle menu item change events.
 *
 * @private
 */
OO.ui.ComboBoxInputWidget.prototype.onMenuItemsChange = function () {
	var match = this.menu.getItemFromData( this.getValue() );
	this.menu.selectItem( match );
	if ( this.menu.getHighlightedItem() ) {
		this.menu.highlightItem( match );
	}
	this.$element.toggleClass( 'oo-ui-comboBoxInputWidget-empty', this.menu.isEmpty() );
};

/**
 * @inheritdoc
 */
OO.ui.ComboBoxInputWidget.prototype.setDisabled = function ( disabled ) {
	// Parent method
	OO.ui.ComboBoxInputWidget.parent.prototype.setDisabled.call( this, disabled );

	if ( this.dropdownButton ) {
		this.dropdownButton.setDisabled( this.isDisabled() );
	}
	if ( this.menu ) {
		this.menu.setDisabled( this.isDisabled() );
	}

	return this;
};

/**
 * Set the options available for this input.
 *
 * @param {Object[]} options Array of menu options in the format `{ data: …, label: … }`
 * @chainable
 */
OO.ui.ComboBoxInputWidget.prototype.setOptions = function ( options ) {
	this.getMenu()
		.clearItems()
		.addItems( options.map( function ( opt ) {
			return new OO.ui.MenuOptionWidget( {
				data: opt.data,
				label: opt.label !== undefined ? opt.label : opt.data
			} );
		} ) );

	return this;
};
