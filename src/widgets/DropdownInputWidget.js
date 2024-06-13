/**
 * DropdownInputWidget is a {@link OO.ui.DropdownWidget DropdownWidget} intended to be used
 * within an HTML form, such as a OO.ui.FormLayout. The selected value is synchronized with the
 * value of a hidden HTML `input` tag. Please see the [OOUI documentation on MediaWiki][1] for
 * more information about input widgets.
 *
 * A DropdownInputWidget always has a value (one of the options is always selected), unless there
 * are no options. If no `value` configuration option is provided, the first option is selected.
 * If you need a state representing no value (no option being selected), use a DropdownWidget.
 *
 * This and OO.ui.RadioSelectInputWidget support similar configuration options.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Inputs
 *
 *     @example
 *     // A DropdownInputWidget with three options.
 *     const dropdownInput = new OO.ui.DropdownInputWidget( {
 *         options: [
 *             { data: 'a', label: 'First' },
 *             { data: 'b', label: 'Second', disabled: true },
 *             { optgroup: 'Group label' },
 *             { data: 'c', label: 'First sub-item)' }
 *         ]
 *     } );
 *     $( document.body ).append( dropdownInput.$element );
 *
 * @class
 * @extends OO.ui.InputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {Object[]} [config.options=[]] Array of menu options in the format described above.
 * @param {Object} [config.dropdown] Configuration options for {@link OO.ui.DropdownWidget DropdownWidget}
 * @param {jQuery|boolean} [config.$overlay] Render the menu into a separate layer. This configuration is
 *  useful in cases where the expanded menu is larger than its containing `<div>`. The specified
 *  overlay layer is usually on top of the containing `<div>` and has a larger area. By default,
 *  the menu uses relative positioning. Pass 'true' to use the default overlay.
 *  See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
 */
OO.ui.DropdownInputWidget = function OoUiDropdownInputWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Properties (must be done before parent constructor which calls #setDisabled)
	this.dropdownWidget = new OO.ui.DropdownWidget( Object.assign(
		{
			$overlay: config.$overlay
		},
		config.dropdown
	) );
	// Set up the options before parent constructor, which uses them to validate config.value.
	// Use this instead of setOptions() because this.$input is not set up yet.
	this.setOptionsData( config.options || [] );

	// Parent constructor
	OO.ui.DropdownInputWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.RequiredElement.call( this, Object.assign( {}, {
		// TODO: Display the required indicator somewhere
		indicatorElement: null
	}, config ) );

	// Events
	this.dropdownWidget.getMenu().connect( this, {
		select: 'onMenuSelect'
	} );

	// Initialization
	this.$element
		.addClass( 'oo-ui-dropdownInputWidget' )
		.append( this.dropdownWidget.$element );
	if ( OO.ui.isMobile() ) {
		this.$element.addClass( 'oo-ui-isMobile' );
	}
	this.setTabIndexedElement( this.dropdownWidget.$tabIndexed );
	this.setTitledElement( this.dropdownWidget.$handle );
};

/* Setup */

OO.inheritClass( OO.ui.DropdownInputWidget, OO.ui.InputWidget );
OO.mixinClass( OO.ui.DropdownInputWidget, OO.ui.mixin.RequiredElement );

/* Methods */

/**
 * @inheritdoc
 * @protected
 */
OO.ui.DropdownInputWidget.prototype.getInputElement = function () {
	return $( '<select>' ).addClass( 'oo-ui-indicator-down' );
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
	value = this.cleanUpValue( value );
	// Only allow setting values that are actually present in the dropdown
	const selected = this.dropdownWidget.getMenu().findItemFromData( value ) ||
		this.dropdownWidget.getMenu().findFirstSelectableItem();
	this.dropdownWidget.getMenu().selectItem( selected );
	value = selected ? selected.getData() : '';
	OO.ui.DropdownInputWidget.super.prototype.setValue.call( this, value );
	if ( this.optionsDirty ) {
		// We reached this from the constructor or from #setOptions.
		// We have to update the <select> element.
		this.updateOptionsInterface();
	}
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.DropdownInputWidget.prototype.setDisabled = function ( state ) {
	this.dropdownWidget.setDisabled( state );
	OO.ui.DropdownInputWidget.super.prototype.setDisabled.call( this, state );
	return this;
};

/**
 * Set the options available for this input.
 *
 * @param {Object[]} options Array of menu options in the format `{ data: …, label: … }`
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.DropdownInputWidget.prototype.setOptions = function ( options ) {
	const value = this.getValue();

	this.setOptionsData( options );

	// Re-set the value to update the visible interface (DropdownWidget and <select>).
	// In case the previous value is no longer an available option, select the first valid one.
	this.setValue( value );

	return this;
};

/**
 * Set the internal list of options, used e.g. by setValue() to see which options are allowed.
 *
 * This method may be called before the parent constructor, so various properties may not be
 * initialized yet.
 *
 * @param {Object[]} options Array of menu options (see #constructor for details).
 * @private
 */
OO.ui.DropdownInputWidget.prototype.setOptionsData = function ( options ) {
	this.optionsDirty = true;

	// Go through all the supplied option configs and create either
	// MenuSectionOption or MenuOption widgets from each.
	const optionWidgets = [];
	let previousOptgroup;
	for ( let optIndex = 0; optIndex < options.length; optIndex++ ) {
		const opt = options[ optIndex ];

		let optionWidget;
		if ( opt.optgroup !== undefined ) {
			// Create a <optgroup> menu item.
			optionWidget = this.createMenuSectionOptionWidget( opt.optgroup );
			previousOptgroup = optionWidget;

		} else {
			// Create a normal <option> menu item.
			const optValue = this.cleanUpValue( opt.data );
			optionWidget = this.createMenuOptionWidget(
				optValue,
				opt.label !== undefined ? opt.label : optValue
			);
		}

		// Disable the menu option if it is itself disabled or if its parent optgroup is disabled.
		if (
			opt.disabled !== undefined ||
			previousOptgroup instanceof OO.ui.MenuSectionOptionWidget &&
			previousOptgroup.isDisabled()
		) {
			optionWidget.setDisabled( true );
		}

		optionWidgets.push( optionWidget );
	}

	this.dropdownWidget.getMenu().clearItems().addItems( optionWidgets );
};

/**
 * Create a menu option widget.
 *
 * @protected
 * @param {string} data Item data
 * @param {string} label Item label
 * @return {OO.ui.MenuOptionWidget} Option widget
 */
OO.ui.DropdownInputWidget.prototype.createMenuOptionWidget = function ( data, label ) {
	return new OO.ui.MenuOptionWidget( {
		data: data,
		label: label
	} );
};

/**
 * Create a menu section option widget.
 *
 * @protected
 * @param {string} label Section item label
 * @return {OO.ui.MenuSectionOptionWidget} Menu section option widget
 */
OO.ui.DropdownInputWidget.prototype.createMenuSectionOptionWidget = function ( label ) {
	return new OO.ui.MenuSectionOptionWidget( {
		label: label
	} );
};

/**
 * Update the user-visible interface to match the internal list of options and value.
 *
 * This method must only be called after the parent constructor.
 *
 * @private
 */
OO.ui.DropdownInputWidget.prototype.updateOptionsInterface = function () {
	let $optionsContainer = this.$input;

	const defaultValue = this.defaultValue;

	this.$input.empty();

	this.dropdownWidget.getMenu().getItems().forEach( ( optionWidget ) => {
		let $optionNode;

		if ( !( optionWidget instanceof OO.ui.MenuSectionOptionWidget ) ) {
			$optionNode = $( '<option>' )
				.attr( 'value', optionWidget.getData() )
				.text( optionWidget.getLabel() );

			// Remember original selection state. This property can be later used to check whether
			// the selection state of the input has been changed since it was created.
			$optionNode[ 0 ].defaultSelected = ( optionWidget.getData() === defaultValue );

			$optionsContainer.append( $optionNode );
		} else {
			$optionNode = $( '<optgroup>' )
				.attr( 'label', optionWidget.getLabel() );
			this.$input.append( $optionNode );
			$optionsContainer = $optionNode;
		}

		// Disable the option or optgroup if required.
		if ( optionWidget.isDisabled() ) {
			$optionNode.prop( 'disabled', true );
		}
	} );

	this.optionsDirty = false;
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

/**
 * @inheritdoc
 */
OO.ui.DropdownInputWidget.prototype.setLabelledBy = function ( id ) {
	this.dropdownWidget.setLabelledBy( id );
};
