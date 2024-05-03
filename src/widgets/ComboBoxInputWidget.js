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
 * For more information about menus and options, please see the
 * [OOUI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Selects_and_Options#Menu_selects_and_options
 *
 *     @example
 *     // A ComboBoxInputWidget.
 *     const comboBox = new OO.ui.ComboBoxInputWidget( {
 *         value: 'Option 1',
 *         options: [
 *             { data: 'Option 1' },
 *             { data: 'Option 2' },
 *             { data: 'Option 3' }
 *         ]
 *     } );
 *     $( document.body ).append( comboBox.$element );
 *
 *     @example <caption>A ComboBoxInputWidget can have additional option labels:</caption>
 *     const comboBox = new OO.ui.ComboBoxInputWidget( {
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
 *     $( document.body ).append( comboBox.$element );
 *
 * @class
 * @extends OO.ui.TextInputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {Object[]} [config.options=[]] Array of menu options in the format `{ data: …, label: … }`
 * @param {Object} [config.menu] Configuration options to pass to the {@link OO.ui.MenuSelectWidget menu
 *  select widget}.
 * @param {jQuery} [config.$overlay] Render the menu into a separate layer. This configuration is useful
 *  in cases where the expanded menu is larger than its containing `<div>`. The specified overlay
 *  layer is usually on top of the containing `<div>` and has a larger area. By default, the menu
 *  uses relative positioning.
 *  See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
 */
OO.ui.ComboBoxInputWidget = function OoUiComboBoxInputWidget( config ) {
	// Configuration initialization
	config = $.extend( {
		autocomplete: false
	}, config );

	// See InputWidget#reusePreInfuseDOM about `config.$input`
	if ( config.$input ) {
		config.$input.removeAttr( 'list' );
	}

	// Parent constructor
	OO.ui.ComboBoxInputWidget.super.call( this, config );

	// Properties
	this.$overlay = ( config.$overlay === true ?
		OO.ui.getDefaultOverlay() : config.$overlay ) || this.$element;
	this.dropdownButton = new OO.ui.ButtonWidget( {
		classes: [ 'oo-ui-comboBoxInputWidget-dropdownButton' ],
		label: OO.ui.msg( 'ooui-combobox-button-label' ),
		indicator: 'down',
		invisibleLabel: true,
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
		remove: 'onMenuItemsChange',
		toggle: 'onMenuToggle'
	} );

	// Initialization
	this.$input.attr( {
		role: 'combobox',
		'aria-owns': this.menu.getElementId(),
		'aria-autocomplete': 'list'
	} );
	this.dropdownButton.$button.attr( {
		'aria-controls': this.menu.getElementId()
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
 * @inheritdoc
 */
OO.ui.ComboBoxInputWidget.prototype.onEdit = function ( event ) {
	// Parent method
	OO.ui.ComboBoxInputWidget.super.prototype.onEdit.apply( this, arguments );

	if ( this.menu.isVisible() || this.isDisabled() || !this.isVisible() ) {
		return;
	}

	if ( event.type === 'input' || event.type === 'mouseup' || ( event.type === 'keydown' && (
		event.keyCode === OO.ui.Keys.ENTER ||
		event.keyCode === OO.ui.Keys.UP ||
		event.keyCode === OO.ui.Keys.DOWN
	) ) ) {
		this.menu.toggle( true );
	}
};

/**
 * Handle input change events.
 *
 * @private
 * @param {string} value New value
 */
OO.ui.ComboBoxInputWidget.prototype.onInputChange = function ( value ) {
	const match = this.menu.findItemFromData( value );

	this.menu.selectItem( match );
	if ( this.menu.findHighlightedItem() ) {
		this.menu.highlightItem( match );
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
	const match = this.menu.findItemFromData( this.getValue() );
	this.menu.selectItem( match );
	if ( this.menu.findHighlightedItem() ) {
		this.menu.highlightItem( match );
	}
	this.$element.toggleClass( 'oo-ui-comboBoxInputWidget-empty', this.menu.isEmpty() );
};

/**
 * Handle menu toggle events.
 *
 * @private
 * @param {boolean} isVisible Open state of the menu
 */
OO.ui.ComboBoxInputWidget.prototype.onMenuToggle = function ( isVisible ) {
	this.$element.toggleClass( 'oo-ui-comboBoxInputWidget-open', isVisible );
};

/**
 * Update the disabled state of the controls
 *
 * @chainable
 * @protected
 * @return {OO.ui.ComboBoxInputWidget} The widget, for chaining
 */
OO.ui.ComboBoxInputWidget.prototype.updateControlsDisabled = function () {
	const disabled = this.isDisabled() || this.isReadOnly();
	if ( this.dropdownButton ) {
		this.dropdownButton.setDisabled( disabled );
	}
	if ( this.menu ) {
		this.menu.setDisabled( disabled );
	}
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.ComboBoxInputWidget.prototype.setDisabled = function () {
	// Parent method
	OO.ui.ComboBoxInputWidget.super.prototype.setDisabled.apply( this, arguments );
	this.updateControlsDisabled();
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.ComboBoxInputWidget.prototype.setReadOnly = function () {
	// Parent method
	OO.ui.ComboBoxInputWidget.super.prototype.setReadOnly.apply( this, arguments );
	this.updateControlsDisabled();
	return this;
};

/**
 * Set the options available for this input.
 *
 * @param {Object[]} options Array of menu options in the format `{ data: …, label: … }`
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.ComboBoxInputWidget.prototype.setOptions = function ( options ) {
	this.getMenu()
		.clearItems()
		.addItems( options.map( ( opt ) => new OO.ui.MenuOptionWidget( {
			data: opt.data,
			label: opt.label !== undefined ? opt.label : opt.data
		} ) ) );

	return this;
};
