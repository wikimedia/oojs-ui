/**
 * CapsuleMultiselectWidgets are something like a {@link OO.ui.ComboBoxInputWidget combo box widget}
 * that allows for selecting multiple values.
 *
 * For more information about menus and options, please see the [OOjs UI documentation on MediaWiki][1].
 *
 *     @example
 *     // Example: A CapsuleMultiselectWidget.
 *     var capsule = new OO.ui.CapsuleMultiselectWidget( {
 *         label: 'CapsuleMultiselectWidget',
 *         selected: [ 'Option 1', 'Option 3' ],
 *         menu: {
 *             items: [
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'Option 1',
 *                     label: 'Option One'
 *                 } ),
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'Option 2',
 *                     label: 'Option Two'
 *                 } ),
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'Option 3',
 *                     label: 'Option Three'
 *                 } ),
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'Option 4',
 *                     label: 'Option Four'
 *                 } ),
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'Option 5',
 *                     label: 'Option Five'
 *                 } )
 *             ]
 *         }
 *     } );
 *     $( 'body' ).append( capsule.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Selects_and_Options#Menu_selects_and_options
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.GroupElement
 * @mixins OO.ui.mixin.PopupElement
 * @mixins OO.ui.mixin.TabIndexedElement
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.IconElement
 * @uses OO.ui.CapsuleItemWidget
 * @uses OO.ui.MenuSelectWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [placeholder] Placeholder text
 * @cfg {boolean} [allowArbitrary=false] Allow data items to be added even if not present in the menu.
 * @cfg {boolean} [allowDuplicates=false] Allow duplicate items to be added.
 * @cfg {Object} [menu] (required) Configuration options to pass to the
 *  {@link OO.ui.MenuSelectWidget menu select widget}.
 * @cfg {Object} [popup] Configuration options to pass to the {@link OO.ui.PopupWidget popup widget}.
 *  If specified, this popup will be shown instead of the menu (but the menu
 *  will still be used for item labels and allowArbitrary=false). The widgets
 *  in the popup should use {@link #addItemsFromData} or {@link #addItems} as necessary.
 * @cfg {jQuery} [$overlay=this.$element] Render the menu or popup into a separate layer.
 *  This configuration is useful in cases where the expanded menu is larger than
 *  its containing `<div>`. The specified overlay layer is usually on top of
 *  the containing `<div>` and has a larger area. By default, the menu uses
 *  relative positioning.
 *  See <https://www.mediawiki.org/wiki/OOjs_UI/Concepts#Overlays>.
 */
OO.ui.CapsuleMultiselectWidget = function OoUiCapsuleMultiselectWidget( config ) {
	var $tabFocus;

	// Parent constructor
	OO.ui.CapsuleMultiselectWidget.parent.call( this, config );

	// Configuration initialization
	config = $.extend( {
		allowArbitrary: false,
		allowDuplicates: false,
		$overlay: this.$element
	}, config );

	// Properties (must be set before mixin constructor calls)
	this.$handle = $( '<div>' );
	this.$input = config.popup ? null : $( '<input>' );
	if ( config.placeholder !== undefined && config.placeholder !== '' ) {
		this.$input.attr( 'placeholder', config.placeholder );
	}

	// Mixin constructors
	OO.ui.mixin.GroupElement.call( this, config );
	if ( config.popup ) {
		config.popup = $.extend( {}, config.popup, {
			align: 'forwards',
			anchor: false
		} );
		OO.ui.mixin.PopupElement.call( this, config );
		$tabFocus = $( '<span>' );
		OO.ui.mixin.TabIndexedElement.call( this, $.extend( {}, config, { $tabIndexed: $tabFocus } ) );
	} else {
		this.popup = null;
		$tabFocus = null;
		OO.ui.mixin.TabIndexedElement.call( this, $.extend( {}, config, { $tabIndexed: this.$input } ) );
	}
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.IconElement.call( this, config );

	// Properties
	this.$content = $( '<div>' );
	this.allowArbitrary = config.allowArbitrary;
	this.allowDuplicates = config.allowDuplicates;
	this.$overlay = config.$overlay;
	this.menu = new OO.ui.MenuSelectWidget( $.extend(
		{
			widget: this,
			$input: this.$input,
			$floatableContainer: this.$element,
			filterFromInput: true,
			disabled: this.isDisabled()
		},
		config.menu
	) );

	// Events
	if ( this.popup ) {
		$tabFocus.on( {
			focus: this.focus.bind( this )
		} );
		this.popup.$element.on( 'focusout', this.onPopupFocusOut.bind( this ) );
		if ( this.popup.$autoCloseIgnore ) {
			this.popup.$autoCloseIgnore.on( 'focusout', this.onPopupFocusOut.bind( this ) );
		}
		this.popup.connect( this, {
			toggle: function ( visible ) {
				$tabFocus.toggle( !visible );
			}
		} );
	} else {
		this.$input.on( {
			focus: this.onInputFocus.bind( this ),
			blur: this.onInputBlur.bind( this ),
			'propertychange change click mouseup keydown keyup input cut paste select focus':
				OO.ui.debounce( this.updateInputSize.bind( this ) ),
			keydown: this.onKeyDown.bind( this ),
			keypress: this.onKeyPress.bind( this )
		} );
	}
	this.menu.connect( this, {
		choose: 'onMenuChoose',
		toggle: 'onMenuToggle',
		add: 'onMenuItemsChange',
		remove: 'onMenuItemsChange'
	} );
	this.$handle.on( {
		mousedown: this.onMouseDown.bind( this )
	} );

	// Initialization
	if ( this.$input ) {
		this.$input.prop( 'disabled', this.isDisabled() );
		this.$input.attr( {
			role: 'combobox',
			'aria-owns': this.menu.getElementId(),
			'aria-autocomplete': 'list'
		} );
	}
	if ( config.data ) {
		this.setItemsFromData( config.data );
	}
	this.$content.addClass( 'oo-ui-capsuleMultiselectWidget-content' )
		.append( this.$group );
	this.$group.addClass( 'oo-ui-capsuleMultiselectWidget-group' );
	this.$handle.addClass( 'oo-ui-capsuleMultiselectWidget-handle' )
		.append( this.$indicator, this.$icon, this.$content );
	this.$element.addClass( 'oo-ui-capsuleMultiselectWidget' )
		.append( this.$handle );
	if ( this.popup ) {
		this.popup.$element.addClass( 'oo-ui-capsuleMultiselectWidget-popup' );
		this.$content.append( $tabFocus );
		this.$overlay.append( this.popup.$element );
	} else {
		this.$content.append( this.$input );
		this.$overlay.append( this.menu.$element );
	}
	if ( $tabFocus ) {
		$tabFocus.addClass( 'oo-ui-capsuleMultiselectWidget-focusTrap' );
	}

	// Input size needs to be calculated after everything else is rendered
	setTimeout( function () {
		if ( this.$input ) {
			this.updateInputSize();
		}
	}.bind( this ) );

	this.onMenuItemsChange();
};

/* Setup */

OO.inheritClass( OO.ui.CapsuleMultiselectWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.CapsuleMultiselectWidget, OO.ui.mixin.GroupElement );
OO.mixinClass( OO.ui.CapsuleMultiselectWidget, OO.ui.mixin.PopupElement );
OO.mixinClass( OO.ui.CapsuleMultiselectWidget, OO.ui.mixin.TabIndexedElement );
OO.mixinClass( OO.ui.CapsuleMultiselectWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.CapsuleMultiselectWidget, OO.ui.mixin.IconElement );

/* Static Properties */

OO.ui.CapsuleMultiselectWidget.static.supportsSimpleLabel = true;

/* Events */

/**
 * @event change
 *
 * A change event is emitted when the set of selected items changes.
 *
 * @param {Mixed[]} datas Data of the now-selected items
 */

/**
 * @event resize
 *
 * A resize event is emitted when the widget's dimensions change to accomodate newly added items or
 * current user input.
 */

/* Methods */

/**
 * Construct a OO.ui.CapsuleItemWidget (or a subclass thereof) from given label and data.
 * May return `null` if the given label and data are not valid.
 *
 * @protected
 * @param {Mixed} data Custom data of any type.
 * @param {string} label The label text.
 * @return {OO.ui.CapsuleItemWidget|null}
 */
OO.ui.CapsuleMultiselectWidget.prototype.createItemWidget = function ( data, label ) {
	if ( label === '' ) {
		return null;
	}
	return new OO.ui.CapsuleItemWidget( { data: data, label: label } );
};

/**
 * Get the widget's input's id, or generate one, if it has an input.
 *
 * @return {string}
 */
OO.ui.CapsuleMultiselectWidget.prototype.getInputId = function () {
	var id;
	if ( !this.$input ) {
		return false;
	}

	id = this.$input.attr( 'id' );
	if ( id === undefined ) {
		id = OO.ui.generateElementId();
		this.$input.attr( 'id', id );
	}

	return id;
};

/**
 * Get the data of the items in the capsule
 *
 * @return {Mixed[]}
 */
OO.ui.CapsuleMultiselectWidget.prototype.getItemsData = function () {
	return this.getItems().map( function ( item ) {
		return item.data;
	} );
};

/**
 * Set the items in the capsule by providing data
 *
 * @chainable
 * @param {Mixed[]} datas
 * @return {OO.ui.CapsuleMultiselectWidget}
 */
OO.ui.CapsuleMultiselectWidget.prototype.setItemsFromData = function ( datas ) {
	var widget = this,
		menu = this.menu,
		items = this.getItems();

	$.each( datas, function ( i, data ) {
		var j, label,
			item = menu.getItemFromData( data );

		if ( item ) {
			label = item.label;
		} else if ( widget.allowArbitrary ) {
			label = String( data );
		} else {
			return;
		}

		item = null;
		for ( j = 0; j < items.length; j++ ) {
			if ( items[ j ].data === data && items[ j ].label === label ) {
				item = items[ j ];
				items.splice( j, 1 );
				break;
			}
		}
		if ( !item ) {
			item = widget.createItemWidget( data, label );
		}
		if ( item ) {
			widget.addItems( [ item ], i );
		}
	} );

	if ( items.length ) {
		widget.removeItems( items );
	}

	return this;
};

/**
 * Add items to the capsule by providing their data
 *
 * @chainable
 * @param {Mixed[]} datas
 * @return {OO.ui.CapsuleMultiselectWidget}
 */
OO.ui.CapsuleMultiselectWidget.prototype.addItemsFromData = function ( datas ) {
	var widget = this,
		menu = this.menu,
		items = [];

	$.each( datas, function ( i, data ) {
		var item;

		if ( !widget.getItemFromData( data ) || widget.allowDuplicates ) {
			item = menu.getItemFromData( data );
			if ( item ) {
				item = widget.createItemWidget( data, item.label );
			} else if ( widget.allowArbitrary ) {
				item = widget.createItemWidget( data, String( data ) );
			}
			if ( item ) {
				items.push( item );
			}
		}
	} );

	if ( items.length ) {
		this.addItems( items );
	}

	return this;
};

/**
 * Add items to the capsule by providing a label
 *
 * @param {string} label
 * @return {boolean} Whether the item was added or not
 */
OO.ui.CapsuleMultiselectWidget.prototype.addItemFromLabel = function ( label ) {
	var item, items;
	item = this.menu.getItemFromLabel( label, true );
	if ( item ) {
		this.addItemsFromData( [ item.data ] );
		return true;
	} else if ( this.allowArbitrary ) {
		items = this.getItems();
		this.addItemsFromData( [ label ] );
		return !OO.compare( this.getItems(), items );
	}
	return false;
};

/**
 * Remove items by data
 *
 * @chainable
 * @param {Mixed[]} datas
 * @return {OO.ui.CapsuleMultiselectWidget}
 */
OO.ui.CapsuleMultiselectWidget.prototype.removeItemsFromData = function ( datas ) {
	var widget = this,
		items = [];

	$.each( datas, function ( i, data ) {
		var item = widget.getItemFromData( data );
		if ( item ) {
			items.push( item );
		}
	} );

	if ( items.length ) {
		this.removeItems( items );
	}

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.CapsuleMultiselectWidget.prototype.addItems = function ( items ) {
	var same, i, l,
		oldItems = this.items.slice();

	OO.ui.mixin.GroupElement.prototype.addItems.call( this, items );

	if ( this.items.length !== oldItems.length ) {
		same = false;
	} else {
		same = true;
		for ( i = 0, l = oldItems.length; same && i < l; i++ ) {
			same = same && this.items[ i ] === oldItems[ i ];
		}
	}
	if ( !same ) {
		this.emit( 'change', this.getItemsData() );
		this.updateInputSize();
	}

	return this;
};

/**
 * Removes the item from the list and copies its label to `this.$input`.
 *
 * @param {Object} item
 */
OO.ui.CapsuleMultiselectWidget.prototype.editItem = function ( item ) {
	this.addItemFromLabel( this.$input.val() );
	this.clearInput();
	this.$input.val( item.label );
	this.updateInputSize();
	this.focus();
	this.menu.updateItemVisibility(); // Hack, we shouldn't be calling this method directly
	this.removeItems( [ item ] );
};

/**
 * @inheritdoc
 */
OO.ui.CapsuleMultiselectWidget.prototype.removeItems = function ( items ) {
	var same, i, l,
		oldItems = this.items.slice();

	OO.ui.mixin.GroupElement.prototype.removeItems.call( this, items );

	if ( this.items.length !== oldItems.length ) {
		same = false;
	} else {
		same = true;
		for ( i = 0, l = oldItems.length; same && i < l; i++ ) {
			same = same && this.items[ i ] === oldItems[ i ];
		}
	}
	if ( !same ) {
		this.emit( 'change', this.getItemsData() );
		this.updateInputSize();
	}

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.CapsuleMultiselectWidget.prototype.clearItems = function () {
	if ( this.items.length ) {
		OO.ui.mixin.GroupElement.prototype.clearItems.call( this );
		this.emit( 'change', this.getItemsData() );
		this.updateInputSize();
	}
	return this;
};

/**
 * Given an item, returns the item after it. If its the last item,
 * returns `this.$input`. If no item is passed, returns the very first
 * item.
 *
 * @param {OO.ui.CapsuleItemWidget} [item]
 * @return {OO.ui.CapsuleItemWidget|jQuery|boolean}
 */
OO.ui.CapsuleMultiselectWidget.prototype.getNextItem = function ( item ) {
	var itemIndex;

	if ( item === undefined ) {
		return this.items[ 0 ];
	}

	itemIndex = this.items.indexOf( item );
	if ( itemIndex < 0 ) { // Item not in list
		return false;
	} else if ( itemIndex === this.items.length - 1 ) { // Last item
		return this.$input;
	} else {
		return this.items[ itemIndex + 1 ];
	}
};

/**
 * Given an item, returns the item before it. If its the first item,
 * returns `this.$input`. If no item is passed, returns the very last
 * item.
 *
 * @param {OO.ui.CapsuleItemWidget} [item]
 * @return {OO.ui.CapsuleItemWidget|jQuery|boolean}
 */
OO.ui.CapsuleMultiselectWidget.prototype.getPreviousItem = function ( item ) {
	var itemIndex;

	if ( item === undefined ) {
		return this.items[ this.items.length - 1 ];
	}

	itemIndex = this.items.indexOf( item );
	if ( itemIndex < 0 ) { // Item not in list
		return false;
	} else if ( itemIndex === 0 ) { // First item
		return this.$input;
	} else {
		return this.items[ itemIndex - 1 ];
	}
};

/**
 * Get the capsule widget's menu.
 *
 * @return {OO.ui.MenuSelectWidget} Menu widget
 */
OO.ui.CapsuleMultiselectWidget.prototype.getMenu = function () {
	return this.menu;
};

/**
 * Handle focus events
 *
 * @private
 * @param {jQuery.Event} event
 */
OO.ui.CapsuleMultiselectWidget.prototype.onInputFocus = function () {
	if ( !this.isDisabled() ) {
		this.menu.toggle( true );
	}
};

/**
 * Handle blur events
 *
 * @private
 * @param {jQuery.Event} event
 */
OO.ui.CapsuleMultiselectWidget.prototype.onInputBlur = function () {
	this.addItemFromLabel( this.$input.val() );
	this.clearInput();
};

/**
 * Handles popup focus out events.
 *
 * @private
 * @param {jQuery.Event} e Focus out event
 */
OO.ui.CapsuleMultiselectWidget.prototype.onPopupFocusOut = function () {
	var widget = this.popup;

	setTimeout( function () {
		if (
			widget.isVisible() &&
			!OO.ui.contains( widget.$element.add( widget.$autoCloseIgnore ).get(), document.activeElement, true )
		) {
			widget.toggle( false );
		}
	} );
};

/**
 * Handle mouse down events.
 *
 * @private
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.CapsuleMultiselectWidget.prototype.onMouseDown = function ( e ) {
	if ( e.which === OO.ui.MouseButtons.LEFT ) {
		this.focus();
		return false;
	} else {
		this.updateInputSize();
	}
};

/**
 * Handle key press events.
 *
 * @private
 * @param {jQuery.Event} e Key press event
 */
OO.ui.CapsuleMultiselectWidget.prototype.onKeyPress = function ( e ) {
	if ( !this.isDisabled() ) {
		if ( e.which === OO.ui.Keys.ESCAPE ) {
			this.clearInput();
			return false;
		}

		if ( !this.popup ) {
			this.menu.toggle( true );
			if ( e.which === OO.ui.Keys.ENTER ) {
				if ( this.addItemFromLabel( this.$input.val() ) ) {
					this.clearInput();
				}
				return false;
			}

			// Make sure the input gets resized.
			setTimeout( this.updateInputSize.bind( this ), 0 );
		}
	}
};

/**
 * Handle key down events.
 *
 * @private
 * @param {jQuery.Event} e Key down event
 */
OO.ui.CapsuleMultiselectWidget.prototype.onKeyDown = function ( e ) {
	if (
		!this.isDisabled() &&
		this.$input.val() === '' &&
		this.items.length
	) {
		// 'keypress' event is not triggered for Backspace
		if ( e.keyCode === OO.ui.Keys.BACKSPACE ) {
			if ( e.metaKey || e.ctrlKey ) {
				this.removeItems( this.items.slice( -1 ) );
			} else {
				this.editItem( this.items[ this.items.length - 1 ] );
			}
			return false;
		} else if ( e.keyCode === OO.ui.Keys.LEFT ) {
			this.getPreviousItem().focus();
		} else if ( e.keyCode === OO.ui.Keys.RIGHT ) {
			this.getNextItem().focus();
		}
	}
};

/**
 * Update the dimensions of the text input field to encompass all available area.
 *
 * @private
 * @param {jQuery.Event} e Event of some sort
 */
OO.ui.CapsuleMultiselectWidget.prototype.updateInputSize = function () {
	var $lastItem, direction, contentWidth, currentWidth, bestWidth;
	if ( this.$input && !this.isDisabled() ) {
		this.$input.css( 'width', '1em' );
		$lastItem = this.$group.children().last();
		direction = OO.ui.Element.static.getDir( this.$handle );

		// Get the width of the input with the placeholder text as
		// the value and save it so that we don't keep recalculating
		if (
			this.contentWidthWithPlaceholder === undefined &&
			this.$input.val() === '' &&
			this.$input.attr( 'placeholder' ) !== undefined
		) {
			this.$input.val( this.$input.attr( 'placeholder' ) );
			this.contentWidthWithPlaceholder = this.$input[ 0 ].scrollWidth;
			this.$input.val( '' );

		}

		// Always keep the input wide enough for the placeholder text
		contentWidth = Math.max(
			this.$input[ 0 ].scrollWidth,
			// undefined arguments in Math.max lead to NaN
			( this.contentWidthWithPlaceholder === undefined ) ?
				0 : this.contentWidthWithPlaceholder
		);
		currentWidth = this.$input.width();

		if ( contentWidth < currentWidth ) {
			this.updateIfHeightChanged();
			// All is fine, don't perform expensive calculations
			return;
		}

		if ( $lastItem.length === 0 ) {
			bestWidth = this.$content.innerWidth();
		} else {
			bestWidth = direction === 'ltr' ?
				this.$content.innerWidth() - $lastItem.position().left - $lastItem.outerWidth() :
				$lastItem.position().left;
		}

		// Some safety margin for sanity, because I *really* don't feel like finding out where the few
		// pixels this is off by are coming from.
		bestWidth -= 10;
		if ( contentWidth > bestWidth ) {
			// This will result in the input getting shifted to the next line
			bestWidth = this.$content.innerWidth() - 10;
		}
		this.$input.width( Math.floor( bestWidth ) );
		this.updateIfHeightChanged();
	} else {
		this.updateIfHeightChanged();
	}
};

/**
 * Determine if widget height changed, and if so, update menu position and emit 'resize' event.
 *
 * @private
 */
OO.ui.CapsuleMultiselectWidget.prototype.updateIfHeightChanged = function () {
	var height = this.$element.height();
	if ( height !== this.height ) {
		this.height = height;
		this.menu.position();
		if ( this.popup ) {
			this.popup.updateDimensions();
		}
		this.emit( 'resize' );
	}
};

/**
 * Handle menu choose events.
 *
 * @private
 * @param {OO.ui.OptionWidget} item Chosen item
 */
OO.ui.CapsuleMultiselectWidget.prototype.onMenuChoose = function ( item ) {
	if ( item && item.isVisible() ) {
		this.addItemsFromData( [ item.getData() ] );
		this.clearInput();
	}
};

/**
 * Handle menu toggle events.
 *
 * @private
 * @param {boolean} isVisible Menu toggle event
 */
OO.ui.CapsuleMultiselectWidget.prototype.onMenuToggle = function ( isVisible ) {
	this.$element.toggleClass( 'oo-ui-capsuleMultiselectWidget-open', isVisible );
};

/**
 * Handle menu item change events.
 *
 * @private
 */
OO.ui.CapsuleMultiselectWidget.prototype.onMenuItemsChange = function () {
	this.setItemsFromData( this.getItemsData() );
	this.$element.toggleClass( 'oo-ui-capsuleMultiselectWidget-empty', this.menu.isEmpty() );
};

/**
 * Clear the input field
 *
 * @private
 */
OO.ui.CapsuleMultiselectWidget.prototype.clearInput = function () {
	if ( this.$input ) {
		this.$input.val( '' );
		this.updateInputSize();
	}
	if ( this.popup ) {
		this.popup.toggle( false );
	}
	this.menu.toggle( false );
	this.menu.selectItem();
	this.menu.highlightItem();
};

/**
 * @inheritdoc
 */
OO.ui.CapsuleMultiselectWidget.prototype.setDisabled = function ( disabled ) {
	var i, len;

	// Parent method
	OO.ui.CapsuleMultiselectWidget.parent.prototype.setDisabled.call( this, disabled );

	if ( this.$input ) {
		this.$input.prop( 'disabled', this.isDisabled() );
	}
	if ( this.menu ) {
		this.menu.setDisabled( this.isDisabled() );
	}
	if ( this.popup ) {
		this.popup.setDisabled( this.isDisabled() );
	}

	if ( this.items ) {
		for ( i = 0, len = this.items.length; i < len; i++ ) {
			this.items[ i ].updateDisabled();
		}
	}

	return this;
};

/**
 * Focus the widget
 *
 * @chainable
 * @return {OO.ui.CapsuleMultiselectWidget}
 */
OO.ui.CapsuleMultiselectWidget.prototype.focus = function () {
	if ( !this.isDisabled() ) {
		if ( this.popup ) {
			this.popup.setSize( this.$handle.outerWidth() );
			this.popup.toggle( true );
			OO.ui.findFocusable( this.popup.$element ).focus();
		} else {
			this.updateInputSize();
			this.menu.toggle( true );
			this.$input.focus();
		}
	}
	return this;
};
