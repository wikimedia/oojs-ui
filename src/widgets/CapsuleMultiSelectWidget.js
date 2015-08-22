/**
 * CapsuleMultiSelectWidgets are something like a {@link OO.ui.ComboBoxWidget combo box widget}
 * that allows for selecting multiple values.
 *
 * For more information about menus and options, please see the [OOjs UI documentation on MediaWiki][1].
 *
 *     @example
 *     // Example: A CapsuleMultiSelectWidget.
 *     var capsule = new OO.ui.CapsuleMultiSelectWidget( {
 *         label: 'CapsuleMultiSelectWidget',
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
 * @mixins OO.ui.mixin.TabIndexedElement
 * @mixins OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [allowArbitrary=false] Allow data items to be added even if not present in the menu.
 * @cfg {Object} [menu] Configuration options to pass to the {@link OO.ui.MenuSelectWidget menu select widget}.
 * @cfg {Object} [popup] Configuration options to pass to the {@link OO.ui.PopupWidget popup widget}.
 *  If specified, this popup will be shown instead of the menu (but the menu
 *  will still be used for item labels and allowArbitrary=false). The widgets
 *  in the popup should use this.addItemsFromData() or this.addItems() as necessary.
 * @cfg {jQuery} [$overlay] Render the menu or popup into a separate layer.
 *  This configuration is useful in cases where the expanded menu is larger than
 *  its containing `<div>`. The specified overlay layer is usually on top of
 *  the containing `<div>` and has a larger area. By default, the menu uses
 *  relative positioning.
 */
OO.ui.CapsuleMultiSelectWidget = function OoUiCapsuleMultiSelectWidget( config ) {
	var $tabFocus;

	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.CapsuleMultiSelectWidget.parent.call( this, config );

	// Properties (must be set before mixin constructor calls)
	this.$input = config.popup ? null : $( '<input>' );
	this.$handle = $( '<div>' );

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
	this.allowArbitrary = !!config.allowArbitrary;
	this.$overlay = config.$overlay || this.$element;
	this.menu = new OO.ui.FloatingMenuSelectWidget( $.extend(
		{
			widget: this,
			$input: this.$input,
			$container: this.$element,
			filterFromInput: true,
			disabled: this.isDisabled()
		},
		config.menu
	) );

	// Events
	if ( this.popup ) {
		$tabFocus.on( {
			focus: this.onFocusForPopup.bind( this )
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
			'propertychange change click mouseup keydown keyup input cut paste select': this.onInputChange.bind( this ),
			keydown: this.onKeyDown.bind( this ),
			keypress: this.onKeyPress.bind( this )
		} );
	}
	this.menu.connect( this, {
		choose: 'onMenuChoose',
		add: 'onMenuItemsChange',
		remove: 'onMenuItemsChange'
	} );
	this.$handle.on( {
		click: this.onClick.bind( this )
	} );

	// Initialization
	if ( this.$input ) {
		this.$input.prop( 'disabled', this.isDisabled() );
		this.$input.attr( {
			role: 'combobox',
			'aria-autocomplete': 'list'
		} );
		this.$input.width( '1em' );
	}
	if ( config.data ) {
		this.setItemsFromData( config.data );
	}
	this.$group.addClass( 'oo-ui-capsuleMultiSelectWidget-group' );
	this.$handle.addClass( 'oo-ui-capsuleMultiSelectWidget-handle' )
		.append( this.$indicator, this.$icon, this.$group );
	this.$element.addClass( 'oo-ui-capsuleMultiSelectWidget' )
		.append( this.$handle );
	if ( this.popup ) {
		this.$handle.append( $tabFocus );
		this.$overlay.append( this.popup.$element );
	} else {
		this.$handle.append( this.$input );
		this.$overlay.append( this.menu.$element );
	}
	this.onMenuItemsChange();
};

/* Setup */

OO.inheritClass( OO.ui.CapsuleMultiSelectWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.CapsuleMultiSelectWidget, OO.ui.mixin.GroupElement );
OO.mixinClass( OO.ui.CapsuleMultiSelectWidget, OO.ui.mixin.PopupElement );
OO.mixinClass( OO.ui.CapsuleMultiSelectWidget, OO.ui.mixin.TabIndexedElement );
OO.mixinClass( OO.ui.CapsuleMultiSelectWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.CapsuleMultiSelectWidget, OO.ui.mixin.IconElement );

/* Events */

/**
 * @event change
 *
 * A change event is emitted when the set of selected items changes.
 *
 * @param {Mixed[]} datas Data of the now-selected items
 */

/* Methods */

/**
 * Get the data of the items in the capsule
 * @return {Mixed[]}
 */
OO.ui.CapsuleMultiSelectWidget.prototype.getItemsData = function () {
	return $.map( this.getItems(), function ( e ) { return e.data; } );
};

/**
 * Set the items in the capsule by providing data
 * @chainable
 * @param {Mixed[]} datas
 * @return {OO.ui.CapsuleMultiSelectWidget}
 */
OO.ui.CapsuleMultiSelectWidget.prototype.setItemsFromData = function ( datas ) {
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
			item = new OO.ui.CapsuleItemWidget( { data: data, label: label } );
		}
		widget.addItems( [ item ], i );
	} );

	if ( items.length ) {
		widget.removeItems( items );
	}

	return this;
};

/**
 * Add items to the capsule by providing their data
 * @chainable
 * @param {Mixed[]} datas
 * @return {OO.ui.CapsuleMultiSelectWidget}
 */
OO.ui.CapsuleMultiSelectWidget.prototype.addItemsFromData = function ( datas ) {
	var widget = this,
		menu = this.menu,
		items = [];

	$.each( datas, function ( i, data ) {
		var item;

		if ( !widget.getItemFromData( data ) ) {
			item = menu.getItemFromData( data );
			if ( item ) {
				items.push( new OO.ui.CapsuleItemWidget( { data: data, label: item.label } ) );
			} else if ( widget.allowArbitrary ) {
				items.push( new OO.ui.CapsuleItemWidget( { data: data, label: String( data ) } ) );
			}
		}
	} );

	if ( items.length ) {
		this.addItems( items );
	}

	return this;
};

/**
 * Remove items by data
 * @chainable
 * @param {Mixed[]} datas
 * @return {OO.ui.CapsuleMultiSelectWidget}
 */
OO.ui.CapsuleMultiSelectWidget.prototype.removeItemsFromData = function ( datas ) {
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
OO.ui.CapsuleMultiSelectWidget.prototype.addItems = function ( items ) {
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
	}

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.CapsuleMultiSelectWidget.prototype.removeItems = function ( items ) {
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
	}

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.CapsuleMultiSelectWidget.prototype.clearItems = function () {
	if ( this.items.length ) {
		OO.ui.mixin.GroupElement.prototype.clearItems.call( this );
		this.emit( 'change', this.getItemsData() );
	}
	return this;
};

/**
 * Get the capsule widget's menu.
 * @return {OO.ui.MenuSelectWidget} Menu widget
 */
OO.ui.CapsuleMultiSelectWidget.prototype.getMenu = function () {
	return this.menu;
};

/**
 * Handle focus events
 *
 * @private
 * @param {jQuery.Event} event
 */
OO.ui.CapsuleMultiSelectWidget.prototype.onInputFocus = function () {
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
OO.ui.CapsuleMultiSelectWidget.prototype.onInputBlur = function () {
	this.clearInput();
};

/**
 * Handle focus events
 *
 * @private
 * @param {jQuery.Event} event
 */
OO.ui.CapsuleMultiSelectWidget.prototype.onFocusForPopup = function () {
	if ( !this.isDisabled() ) {
		this.popup.setSize( this.$handle.width() );
		this.popup.toggle( true );
		this.popup.$element.find( '*' )
			.filter( function () { return OO.ui.isFocusableElement( $( this ), true ); } )
			.first()
			.focus();
	}
};

/**
 * Handles popup focus out events.
 *
 * @private
 * @param {Event} e Focus out event
 */
OO.ui.CapsuleMultiSelectWidget.prototype.onPopupFocusOut = function () {
	var widget = this.popup;

	setTimeout( function () {
		if (
			widget.isVisible() &&
			!OO.ui.contains( widget.$element[ 0 ], document.activeElement, true ) &&
			( !widget.$autoCloseIgnore || !widget.$autoCloseIgnore.has( document.activeElement ).length )
		) {
			widget.toggle( false );
		}
	} );
};

/**
 * Handle mouse click events.
 *
 * @private
 * @param {jQuery.Event} e Mouse click event
 */
OO.ui.CapsuleMultiSelectWidget.prototype.onClick = function ( e ) {
	if ( e.which === 1 ) {
		this.focus();
		return false;
	}
};

/**
 * Handle key press events.
 *
 * @private
 * @param {jQuery.Event} e Key press event
 */
OO.ui.CapsuleMultiSelectWidget.prototype.onKeyPress = function ( e ) {
	var item;

	if ( !this.isDisabled() ) {
		if ( e.which === OO.ui.Keys.ESCAPE ) {
			this.clearInput();
			return false;
		}

		if ( !this.popup ) {
			this.menu.toggle( true );
			if ( e.which === OO.ui.Keys.ENTER ) {
				item = this.menu.getItemFromLabel( this.$input.val(), true );
				if ( item ) {
					this.addItemsFromData( [ item.data ] );
					this.clearInput();
				} else if ( this.allowArbitrary && this.$input.val().trim() !== '' ) {
					this.addItemsFromData( [ this.$input.val() ] );
					this.clearInput();
				}
				return false;
			}

			// Make sure the input gets resized.
			setTimeout( this.onInputChange.bind( this ), 0 );
		}
	}
};

/**
 * Handle key down events.
 *
 * @private
 * @param {jQuery.Event} e Key down event
 */
OO.ui.CapsuleMultiSelectWidget.prototype.onKeyDown = function ( e ) {
	if ( !this.isDisabled() ) {
		// 'keypress' event is not triggered for Backspace
		if ( e.keyCode === OO.ui.Keys.BACKSPACE && this.$input.val() === '' ) {
			if ( this.items.length ) {
				this.removeItems( this.items.slice( -1 ) );
			}
			return false;
		}
	}
};

/**
 * Handle input change events.
 *
 * @private
 * @param {jQuery.Event} e Event of some sort
 */
OO.ui.CapsuleMultiSelectWidget.prototype.onInputChange = function () {
	if ( !this.isDisabled() ) {
		this.$input.width( this.$input.val().length + 'em' );
	}
};

/**
 * Handle menu choose events.
 *
 * @private
 * @param {OO.ui.OptionWidget} item Chosen item
 */
OO.ui.CapsuleMultiSelectWidget.prototype.onMenuChoose = function ( item ) {
	if ( item && item.isVisible() ) {
		this.addItemsFromData( [ item.getData() ] );
		this.clearInput();
	}
};

/**
 * Handle menu item change events.
 *
 * @private
 */
OO.ui.CapsuleMultiSelectWidget.prototype.onMenuItemsChange = function () {
	this.setItemsFromData( this.getItemsData() );
	this.$element.toggleClass( 'oo-ui-capsuleMultiSelectWidget-empty', this.menu.isEmpty() );
};

/**
 * Clear the input field
 * @private
 */
OO.ui.CapsuleMultiSelectWidget.prototype.clearInput = function () {
	if ( this.$input ) {
		this.$input.val( '' );
		this.$input.width( '1em' );
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
OO.ui.CapsuleMultiSelectWidget.prototype.setDisabled = function ( disabled ) {
	var i, len;

	// Parent method
	OO.ui.CapsuleMultiSelectWidget.parent.prototype.setDisabled.call( this, disabled );

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
 * @chainable
 * @return {OO.ui.CapsuleMultiSelectWidget}
 */
OO.ui.CapsuleMultiSelectWidget.prototype.focus = function () {
	if ( !this.isDisabled() ) {
		if ( this.popup ) {
			this.popup.setSize( this.$handle.width() );
			this.popup.toggle( true );
			this.popup.$element.find( '*' )
				.filter( function () { return OO.ui.isFocusableElement( $( this ), true ); } )
				.first()
				.focus();
		} else {
			this.menu.toggle( true );
			this.$input.focus();
		}
	}
	return this;
};
