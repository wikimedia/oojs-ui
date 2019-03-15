/**
 * MenuTagMultiselectWidget is a {@link OO.ui.TagMultiselectWidget OO.ui.TagMultiselectWidget}
 * intended to use a menu of selectable options.
 *
 *     @example
 *     // A basic MenuTagMultiselectWidget.
 *     var widget = new OO.ui.MenuTagMultiselectWidget( {
 *         inputPosition: 'outline',
 *         options: [
 *            { data: 'option1', label: 'Option 1', icon: 'tag' },
 *            { data: 'option2', label: 'Option 2' },
 *            { data: 'option3', label: 'Option 3' },
 *         ],
 *         selected: [ 'option1', 'option2' ]
 *     } );
 *     $( document.body ).append( widget.$element );
 *
 * @class
 * @extends OO.ui.TagMultiselectWidget
 *
 * @constructor
 * @param {Object} [config] Configuration object
 * @cfg {boolean} [clearInputOnChoose=true] Clear the text input value when a menu option is chosen
 * @cfg {Object} [menu] Configuration object for the menu widget
 * @cfg {jQuery} [$overlay] An overlay for the menu.
 *  See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
 * @cfg {Object[]} [options=[]] Array of menu options in the format `{ data: …, label: … }`
 */
OO.ui.MenuTagMultiselectWidget = function OoUiMenuTagMultiselectWidget( config ) {
	var $autoCloseIgnore = $( [] );
	config = config || {};

	// Parent constructor
	OO.ui.MenuTagMultiselectWidget.parent.call( this, config );

	$autoCloseIgnore = $autoCloseIgnore.add( this.$group );
	if ( this.hasInput ) {
		$autoCloseIgnore = $autoCloseIgnore.add( this.input.$element );
	}

	this.$overlay = ( config.$overlay === true ?
		OO.ui.getDefaultOverlay() : config.$overlay ) || this.$element;
	this.clearInputOnChoose = config.clearInputOnChoose === undefined ||
		!!config.clearInputOnChoose;
	this.menu = this.createMenuWidget( $.extend( {
		widget: this,
		hideOnChoose: false,
		input: this.hasInput ? this.input : null,
		$input: this.hasInput ? this.input.$input : null,
		filterFromInput: !!this.hasInput,
		highlightOnFilter: !this.allowArbitrary,
		multiselect: true,
		$autoCloseIgnore: $autoCloseIgnore,
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
		this.input.connect( this, {
			change: 'onInputChange'
		} );
	}
	this.connect( this, {
		resize: 'onResize'
	} );

	// Initialization
	this.$overlay.append( this.menu.$element );
	this.$element.addClass( 'oo-ui-menuTagMultiselectWidget' );
	// Remove MenuSelectWidget's generic focus owner ARIA attribute
	// TODO: Should this widget have a `role` that is compatible with this attribute?
	this.menu.$focusOwner.removeAttr( 'aria-expanded' );
	// TagMultiselectWidget already does this, but it doesn't work right because this.menu is
	// not yet set up while the parent constructor runs, and #getAllowedValues rejects everything.
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
 * Respond to menu choose event, which is intentional by the user.
 *
 * @param {OO.ui.OptionWidget} menuItem Selected menu items
 * @param {boolean} selected Item is selected
 */
OO.ui.MenuTagMultiselectWidget.prototype.onMenuChoose = function ( menuItem, selected ) {
	if ( this.hasInput && this.clearInputOnChoose ) {
		this.input.setValue( '' );
	}

	if ( selected && !this.findItemFromData( menuItem.getData() ) ) {
		// The menu item is selected, add it to the tags
		this.addTag( menuItem.getData(), menuItem.getLabel() );
	} else {
		// The menu item was unselected, remove the tag
		this.removeTagByData( menuItem.getData() );
	}
};

/**
 * Respond to menu toggle event. Reset item highlights on hide.
 *
 * @param {boolean} isVisible The menu is visible
 */
OO.ui.MenuTagMultiselectWidget.prototype.onMenuToggle = function ( isVisible ) {
	if ( !isVisible ) {
		this.menu.highlightItem( null );
		this.menu.scrollToTop();
	}
	setTimeout( function () {
		// Remove MenuSelectWidget's generic focus owner ARIA attribute
		// TODO: Should this widget have a `role` that is compatible with this attribute?
		this.menu.$focusOwner.removeAttr( 'aria-expanded' );
	}.bind( this ) );
};

/**
 * @inheritdoc
 */
OO.ui.MenuTagMultiselectWidget.prototype.onTagSelect = function ( tagItem ) {
	var menuItem = this.menu.findItemFromData( tagItem.getData() );
	if ( !this.allowArbitrary ) {
		// Override the base behavior from TagMultiselectWidget; the base behavior
		// in TagMultiselectWidget is to remove the tag to edit it in the input,
		// but in our case, we want to utilize the menu selection behavior, and
		// definitely not remove the item.

		// If there is an input that is used for filtering, erase the value so we don't filter
		if ( this.hasInput && this.menu.filterFromInput ) {
			this.input.setValue( '' );
		}

		this.focus();

		// Highlight the menu item
		this.menu.highlightItem( menuItem );
		this.menu.scrollItemIntoView( menuItem );

	} else {
		// Use the default
		OO.ui.MenuTagMultiselectWidget.parent.prototype.onTagSelect.call( this, tagItem );
	}
};

/**
 * @inheritdoc
 */
OO.ui.MenuTagMultiselectWidget.prototype.removeItems = function ( items ) {
	var widget = this;

	// Parent
	OO.ui.MenuTagMultiselectWidget.parent.prototype.removeItems.call( this, items );

	items.forEach( function ( tagItem ) {
		var menuItem = widget.menu.findItemFromData( tagItem.getData() );
		if ( menuItem ) {
			// Synchronize the menu selection - unselect the removed tag
			widget.menu.unselectItem( menuItem );
		}
	} );
};

/**
 * @inheritdoc
 */
OO.ui.MenuTagMultiselectWidget.prototype.setValue = function ( valueObject ) {
	valueObject = Array.isArray( valueObject ) ? valueObject : [ valueObject ];

	// We override this method from the parent, to make sure we are adding proper
	// menu items, and are accounting for cases where we have this widget with
	// a menu but also 'allowArbitrary'
	if ( !this.menu ) {
		return;
	}

	this.clearItems();
	valueObject.forEach( function ( obj ) {
		var data, label, menuItem;

		if ( typeof obj === 'string' ) {
			data = label = obj;
		} else {
			data = obj.data;
			label = obj.label;
		}

		// Check if the item is in the menu
		menuItem = this.menu.getItemFromLabel( label ) || this.menu.findItemFromData( data );
		if ( menuItem ) {
			// Menu item found, add the menu item
			this.addTag( menuItem.getData(), menuItem.getLabel() );
			// Make sure that item is also selected
			this.menu.selectItem( menuItem );
		} else if ( this.allowArbitrary ) {
			// If the item isn't in the menu, only add it if we
			// allow for arbitrary values
			this.addTag( data, label );
		}
	}.bind( this ) );
};

/**
 * @inheritdoc
 */
OO.ui.MenuTagMultiselectWidget.prototype.setDisabled = function ( isDisabled ) {
	// Parent method
	OO.ui.MenuTagMultiselectWidget.parent.prototype.setDisabled.call( this, isDisabled );

	if ( this.menu ) {
		// Protect against calling setDisabled() before the menu was initialized
		this.menu.setDisabled( isDisabled );
	}
};

/**
 * Highlight the first selectable item in the menu, if configured.
 *
 * @private
 * @chainable
 */
OO.ui.MenuTagMultiselectWidget.prototype.initializeMenuSelection = function () {
	var highlightedItem;
	this.menu.highlightItem(
		this.allowArbitrary ?
			null :
			this.menu.findFirstSelectableItem()
	);

	highlightedItem = this.menu.findHighlightedItem();
	// Scroll to the highlighted item, if it exists
	if ( highlightedItem ) {
		this.menu.scrollItemIntoView( highlightedItem );
	}
};

/**
 * @inheritdoc
 */
OO.ui.MenuTagMultiselectWidget.prototype.addTagFromInput = function () {
	var val = this.input.getValue(),
		// Look for a highlighted item first
		// Then look for the element that fits the data
		item = this.menu.findHighlightedItem() || this.menu.findItemFromData( val ),
		data = item ? item.getData() : val,
		isValid = this.isAllowedData( data );

	// Override the parent method so we add from the menu
	// rather than directly from the input

	if ( !val ) {
		return;
	}

	if ( isValid || this.allowDisplayInvalidTags ) {
		this.clearInput();
		if ( item ) {
			this.addTag( data, item.getLabel() );
		} else {
			this.addTag( val );
		}
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
			return widget.createMenuOptionWidget( obj.data, obj.label, obj.icon );
		} );

	this.menu.addItems( items );
};

/**
 * Create a menu option widget.
 *
 * @param {string} data Item data
 * @param {string} [label] Item label
 * @param {string} [icon] Symbolic icon name
 * @return {OO.ui.OptionWidget} Option widget
 */
OO.ui.MenuTagMultiselectWidget.prototype.createMenuOptionWidget = function ( data, label, icon ) {
	return new OO.ui.MenuOptionWidget( {
		data: data,
		label: label || data,
		icon: icon
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
