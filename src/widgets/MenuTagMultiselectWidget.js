/**
 * MenuTagMultiselectWidget is a {@link OO.ui.TagMultiselectWidget OO.ui.TagMultiselectWidget} intended
 * to use a menu of selectable options.
 *
 * For more information about menus and options, please see the [OOjs UI documentation on MediaWiki][1].
 *
 *     @example
 *     // Example: A basic MenuTagMultiselectWidget.
 *     var widget = new OO.ui.MenuTagMultiselectWidget( {
 *         inputPosition: 'outline',
 *         options: [
 *            { data: 'option1', label: 'Option 1' },
 *            { data: 'option2', label: 'Option 2' },
 *            { data: 'option3', label: 'Option 3' },
 *         ],
 *         selected: [ 'option1', 'option2' ]
 *     } );
 *     $( 'body' ).append( widget.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Selects_and_Options#Menu_selects_and_options
 *
 * @class
 * @extends OO.ui.TagMultiselectWidget
 *
 * @constructor
 * @param {Object} [config] Configuration object
 * @cfg {Object} [menu] Configuration object for the menu widget
 * @cfg {jQuery} [$overlay] An overlay for the menu.
 *  See <https://www.mediawiki.org/wiki/OOjs_UI/Concepts#Overlays>.
 * @cfg {Object[]} [options=[]] Array of menu options in the format `{ data: …, label: … }`
 */
OO.ui.MenuTagMultiselectWidget = function OoUiMenuTagMultiselectWidget( config ) {
	config = config || {};

	// Parent constructor
	OO.ui.MenuTagMultiselectWidget.parent.call( this, config );

	this.$overlay = config.$overlay || this.$element;

	this.menu = this.createMenuWidget( $.extend( {
		widget: this,
		input: this.hasInput ? this.input : null,
		$input: this.hasInput ? this.input.$input : null,
		filterFromInput: !!this.hasInput,
		$autoCloseIgnore: this.hasInput ?
			this.input.$element.add( this.$overlay ) : this.$overlay,
		$floatableContainer: this.hasInput && this.inputPosition === 'outline' ?
			this.input.$element : this.$element,
		$overlay: this.$overlay,
		disabled: this.isDisabled()
	}, config.menu ) );
	this.addOptions( config.options || [] );

	// Events
	this.menu.connect( this, {
		choose: 'onMenuChoose',
		toggle: 'onMenuToggle'
	} );
	if ( this.hasInput ) {
		this.input.connect( this, { change: 'onInputChange' } );
	}
	this.connect( this, { resize: 'onResize' } );

	// Initialization
	this.$overlay
		.append( this.menu.$element );
	this.$element
		.addClass( 'oo-ui-menuTagMultiselectWidget' );
	// TagMultiselectWidget already does this, but it doesn't work right because this.menu is not yet
	// set up while the parent constructor runs, and #getAllowedValues rejects everything.
	if ( config.selected ) {
		this.setValue( config.selected );
	}
};

/* Initialization */

OO.inheritClass( OO.ui.MenuTagMultiselectWidget, OO.ui.TagMultiselectWidget );

/* Methods */

/**
 * Respond to resize event
 */
OO.ui.MenuTagMultiselectWidget.prototype.onResize = function () {
	// Reposition the menu
	this.menu.position();
};

/**
 * @inheritdoc
 */
OO.ui.MenuTagMultiselectWidget.prototype.onInputFocus = function () {
	// Parent method
	OO.ui.MenuTagMultiselectWidget.parent.prototype.onInputFocus.call( this );

	this.menu.toggle( true );
};

/**
 * Respond to input change event
 */
OO.ui.MenuTagMultiselectWidget.prototype.onInputChange = function () {
	this.menu.toggle( true );
};

/**
 * Respond to menu choose event
 *
 * @param {OO.ui.OptionWidget} menuItem Chosen menu item
 */
OO.ui.MenuTagMultiselectWidget.prototype.onMenuChoose = function ( menuItem ) {
	// Add tag
	this.addTag( menuItem.getData(), menuItem.getLabel() );
};

/**
 * Respond to menu toggle event. Reset item highlights on hide.
 *
 * @param {boolean} isVisible The menu is visible
 */
OO.ui.MenuTagMultiselectWidget.prototype.onMenuToggle = function ( isVisible ) {
	if ( !isVisible ) {
		this.menu.selectItem( null );
		this.menu.highlightItem( null );
	}
};

/**
 * @inheritdoc
 */
OO.ui.MenuTagMultiselectWidget.prototype.onTagSelect = function ( tagItem ) {
	var menuItem = this.menu.getItemFromData( tagItem.getData() );
	// Override the base behavior from TagMultiselectWidget; the base behavior
	// in TagMultiselectWidget is to remove the tag to edit it in the input,
	// but in our case, we want to utilize the menu selection behavior, and
	// definitely not remove the item.

	// Select the menu item
	this.menu.selectItem( menuItem );

	this.focus();
};

/**
 * @inheritdoc
 */
OO.ui.MenuTagMultiselectWidget.prototype.addTagFromInput = function () {
	var inputValue = this.input.getValue(),
		validated = false,
		highlightedItem = this.menu.getHighlightedItem(),
		item = this.menu.getItemFromData( inputValue );

	// Override the parent method so we add from the menu
	// rather than directly from the input

	// Look for a highlighted item first
	if ( highlightedItem ) {
		validated = this.addTag( highlightedItem.getData(), highlightedItem.getLabel() );
	} else if ( item ) {
		// Look for the element that fits the data
		validated = this.addTag( item.getData(), item.getLabel() );
	} else {
		// Otherwise, add the tag - the method will only add if the
		// tag is valid or if invalid tags are allowed
		validated = this.addTag( inputValue );
	}

	if ( validated ) {
		this.clearInput();
		this.focus();
	}
};

/**
 * Return the visible items in the menu. This is mainly used for when
 * the menu is filtering results.
 *
 * @return {OO.ui.MenuOptionWidget[]} Visible results
 */
OO.ui.MenuTagMultiselectWidget.prototype.getMenuVisibleItems = function () {
	return this.menu.getItems().filter( function ( menuItem ) {
		return menuItem.isVisible();
	} );
};

/**
 * Create the menu for this widget. This is in a separate method so that
 * child classes can override this without polluting the constructor with
 * unnecessary extra objects that will be overidden.
 *
 * @param {Object} menuConfig Configuration options
 * @return {OO.ui.MenuSelectWidget} Menu widget
 */
OO.ui.MenuTagMultiselectWidget.prototype.createMenuWidget = function ( menuConfig ) {
	return new OO.ui.MenuSelectWidget( menuConfig );
};

/**
 * Add options to the menu
 *
 * @param {Object[]} menuOptions Object defining options
 */
OO.ui.MenuTagMultiselectWidget.prototype.addOptions = function ( menuOptions ) {
	var widget = this,
		items = menuOptions.map( function ( obj ) {
			return widget.createMenuOptionWidget( obj.data, obj.label );
		} );

	this.menu.addItems( items );
};

/**
 * Create a menu option widget.
 *
 * @param {string} data Item data
 * @param {string} [label] Item label
 * @return {OO.ui.OptionWidget} Option widget
 */
OO.ui.MenuTagMultiselectWidget.prototype.createMenuOptionWidget = function ( data, label ) {
	return new OO.ui.MenuOptionWidget( {
		data: data,
		label: label || data
	} );
};

/**
 * Get the menu
 *
 * @return {OO.ui.MenuSelectWidget} Menu
 */
OO.ui.MenuTagMultiselectWidget.prototype.getMenu = function () {
	return this.menu;
};

/**
 * Get the allowed values list
 *
 * @return {string[]} Allowed data values
 */
OO.ui.MenuTagMultiselectWidget.prototype.getAllowedValues = function () {
	var menuDatas = [];
	if ( this.menu ) {
		// If the parent constructor is calling us, we're not ready yet, this.menu is not set up.
		menuDatas = this.menu.getItems().map( function ( menuItem ) {
			return menuItem.getData();
		} );
	}
	return this.allowedValues.concat( menuDatas );
};
