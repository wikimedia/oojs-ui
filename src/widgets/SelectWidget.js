/**
 * A SelectWidget is of a generic selection of options. The OOjs UI library contains several types of
 * select widgets, including {@link OO.ui.ButtonSelectWidget button selects},
 * {@link OO.ui.RadioSelectWidget radio selects}, and {@link OO.ui.MenuSelectWidget
 * menu selects}.
 *
 * This class should be used together with OO.ui.OptionWidget or OO.ui.DecoratedOptionWidget. For more
 * information, please see the [OOjs UI documentation on MediaWiki][1].
 *
 *     @example
 *     // Example of a select widget with three options
 *     var select = new OO.ui.SelectWidget( {
 *         items: [
 *             new OO.ui.OptionWidget( {
 *                 data: 'a',
 *                 label: 'Option One',
 *             } ),
 *             new OO.ui.OptionWidget( {
 *                 data: 'b',
 *                 label: 'Option Two',
 *             } ),
 *             new OO.ui.OptionWidget( {
 *                 data: 'c',
 *                 label: 'Option Three',
 *             } )
 *         ]
 *     } );
 *     $( 'body' ).append( select.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Selects_and_Options
 *
 * @abstract
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.GroupWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {OO.ui.OptionWidget[]} [items] An array of options to add to the select.
 *  Options are created with {@link OO.ui.OptionWidget OptionWidget} classes. See
 *  the [OOjs UI documentation on MediaWiki] [2] for examples.
 *  [2]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Selects_and_Options
 */
OO.ui.SelectWidget = function OoUiSelectWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.SelectWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.GroupWidget.call( this, $.extend( {}, config, { $group: this.$element } ) );

	// Properties
	this.pressed = false;
	this.selecting = null;
	this.onMouseUpHandler = this.onMouseUp.bind( this );
	this.onMouseMoveHandler = this.onMouseMove.bind( this );
	this.onKeyDownHandler = this.onKeyDown.bind( this );
	this.onKeyPressHandler = this.onKeyPress.bind( this );
	this.keyPressBuffer = '';
	this.keyPressBufferTimer = null;

	// Events
	this.connect( this, {
		toggle: 'onToggle'
	} );
	this.$element.on( {
		mousedown: this.onMouseDown.bind( this ),
		mouseover: this.onMouseOver.bind( this ),
		mouseleave: this.onMouseLeave.bind( this )
	} );

	// Initialization
	this.$element
		.addClass( 'oo-ui-selectWidget oo-ui-selectWidget-depressed' )
		.attr( 'role', 'listbox' );
	if ( Array.isArray( config.items ) ) {
		this.addItems( config.items );
	}
};

/* Setup */

OO.inheritClass( OO.ui.SelectWidget, OO.ui.Widget );

// Need to mixin base class as well
OO.mixinClass( OO.ui.SelectWidget, OO.ui.mixin.GroupElement );
OO.mixinClass( OO.ui.SelectWidget, OO.ui.mixin.GroupWidget );

/* Static */
OO.ui.SelectWidget.static.passAllFilter = function () {
	return true;
};

/* Events */

/**
 * @event highlight
 *
 * A `highlight` event is emitted when the highlight is changed with the #highlightItem method.
 *
 * @param {OO.ui.OptionWidget|null} item Highlighted item
 */

/**
 * @event press
 *
 * A `press` event is emitted when the #pressItem method is used to programmatically modify the
 * pressed state of an option.
 *
 * @param {OO.ui.OptionWidget|null} item Pressed item
 */

/**
 * @event select
 *
 * A `select` event is emitted when the selection is modified programmatically with the #selectItem method.
 *
 * @param {OO.ui.OptionWidget|null} item Selected item
 */

/**
 * @event choose
 * A `choose` event is emitted when an item is chosen with the #chooseItem method.
 * @param {OO.ui.OptionWidget} item Chosen item
 */

/**
 * @event add
 *
 * An `add` event is emitted when options are added to the select with the #addItems method.
 *
 * @param {OO.ui.OptionWidget[]} items Added items
 * @param {number} index Index of insertion point
 */

/**
 * @event remove
 *
 * A `remove` event is emitted when options are removed from the select with the #clearItems
 * or #removeItems methods.
 *
 * @param {OO.ui.OptionWidget[]} items Removed items
 */

/* Methods */

/**
 * Handle mouse down events.
 *
 * @private
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.SelectWidget.prototype.onMouseDown = function ( e ) {
	var item;

	if ( !this.isDisabled() && e.which === 1 ) {
		this.togglePressed( true );
		item = this.getTargetItem( e );
		if ( item && item.isSelectable() ) {
			this.pressItem( item );
			this.selecting = item;
			OO.ui.addCaptureEventListener(
				this.getElementDocument(),
				'mouseup',
				this.onMouseUpHandler
			);
			OO.ui.addCaptureEventListener(
				this.getElementDocument(),
				'mousemove',
				this.onMouseMoveHandler
			);
		}
	}
	return false;
};

/**
 * Handle mouse up events.
 *
 * @private
 * @param {jQuery.Event} e Mouse up event
 */
OO.ui.SelectWidget.prototype.onMouseUp = function ( e ) {
	var item;

	this.togglePressed( false );
	if ( !this.selecting ) {
		item = this.getTargetItem( e );
		if ( item && item.isSelectable() ) {
			this.selecting = item;
		}
	}
	if ( !this.isDisabled() && e.which === 1 && this.selecting ) {
		this.pressItem( null );
		this.chooseItem( this.selecting );
		this.selecting = null;
	}

	OO.ui.removeCaptureEventListener( this.getElementDocument(), 'mouseup',
		this.onMouseUpHandler );
	OO.ui.removeCaptureEventListener( this.getElementDocument(), 'mousemove',
		this.onMouseMoveHandler );

	return false;
};

/**
 * Handle mouse move events.
 *
 * @private
 * @param {jQuery.Event} e Mouse move event
 */
OO.ui.SelectWidget.prototype.onMouseMove = function ( e ) {
	var item;

	if ( !this.isDisabled() && this.pressed ) {
		item = this.getTargetItem( e );
		if ( item && item !== this.selecting && item.isSelectable() ) {
			this.pressItem( item );
			this.selecting = item;
		}
	}
	return false;
};

/**
 * Handle mouse over events.
 *
 * @private
 * @param {jQuery.Event} e Mouse over event
 */
OO.ui.SelectWidget.prototype.onMouseOver = function ( e ) {
	var item;

	if ( !this.isDisabled() ) {
		item = this.getTargetItem( e );
		this.highlightItem( item && item.isHighlightable() ? item : null );
	}
	return false;
};

/**
 * Handle mouse leave events.
 *
 * @private
 * @param {jQuery.Event} e Mouse over event
 */
OO.ui.SelectWidget.prototype.onMouseLeave = function () {
	if ( !this.isDisabled() ) {
		this.highlightItem( null );
	}
	return false;
};

/**
 * Handle key down events.
 *
 * @protected
 * @param {jQuery.Event} e Key down event
 */
OO.ui.SelectWidget.prototype.onKeyDown = function ( e ) {
	var nextItem,
		handled = false,
		currentItem = this.getHighlightedItem() || this.getSelectedItem();

	if ( !this.isDisabled() && this.isVisible() ) {
		switch ( e.keyCode ) {
			case OO.ui.Keys.ENTER:
				if ( currentItem && currentItem.constructor.static.highlightable ) {
					// Was only highlighted, now let's select it. No-op if already selected.
					this.chooseItem( currentItem );
					handled = true;
				}
				break;
			case OO.ui.Keys.UP:
			case OO.ui.Keys.LEFT:
				this.clearKeyPressBuffer();
				nextItem = this.getRelativeSelectableItem( currentItem, -1 );
				handled = true;
				break;
			case OO.ui.Keys.DOWN:
			case OO.ui.Keys.RIGHT:
				this.clearKeyPressBuffer();
				nextItem = this.getRelativeSelectableItem( currentItem, 1 );
				handled = true;
				break;
			case OO.ui.Keys.ESCAPE:
			case OO.ui.Keys.TAB:
				if ( currentItem && currentItem.constructor.static.highlightable ) {
					currentItem.setHighlighted( false );
				}
				this.unbindKeyDownListener();
				this.unbindKeyPressListener();
				// Don't prevent tabbing away / defocusing
				handled = false;
				break;
		}

		if ( nextItem ) {
			if ( nextItem.constructor.static.highlightable ) {
				this.highlightItem( nextItem );
			} else {
				this.chooseItem( nextItem );
			}
			nextItem.scrollElementIntoView();
		}

		if ( handled ) {
			// Can't just return false, because e is not always a jQuery event
			e.preventDefault();
			e.stopPropagation();
		}
	}
};

/**
 * Bind key down listener.
 *
 * @protected
 */
OO.ui.SelectWidget.prototype.bindKeyDownListener = function () {
	OO.ui.addCaptureEventListener( this.getElementWindow(), 'keydown', this.onKeyDownHandler );
};

/**
 * Unbind key down listener.
 *
 * @protected
 */
OO.ui.SelectWidget.prototype.unbindKeyDownListener = function () {
	OO.ui.removeCaptureEventListener( this.getElementWindow(), 'keydown', this.onKeyDownHandler );
};

/**
 * Clear the key-press buffer
 *
 * @protected
 */
OO.ui.SelectWidget.prototype.clearKeyPressBuffer = function () {
	if ( this.keyPressBufferTimer ) {
		clearTimeout( this.keyPressBufferTimer );
		this.keyPressBufferTimer = null;
	}
	this.keyPressBuffer = '';
};

/**
 * Handle key press events.
 *
 * @protected
 * @param {jQuery.Event} e Key press event
 */
OO.ui.SelectWidget.prototype.onKeyPress = function ( e ) {
	var c, filter, item;

	if ( !e.charCode ) {
		if ( e.keyCode === OO.ui.Keys.BACKSPACE && this.keyPressBuffer !== '' ) {
			this.keyPressBuffer = this.keyPressBuffer.substr( 0, this.keyPressBuffer.length - 1 );
			return false;
		}
		return;
	}
	if ( String.fromCodePoint ) {
		c = String.fromCodePoint( e.charCode );
	} else {
		c = String.fromCharCode( e.charCode );
	}

	if ( this.keyPressBufferTimer ) {
		clearTimeout( this.keyPressBufferTimer );
	}
	this.keyPressBufferTimer = setTimeout( this.clearKeyPressBuffer.bind( this ), 1500 );

	item = this.getHighlightedItem() || this.getSelectedItem();

	if ( this.keyPressBuffer === c ) {
		// Common (if weird) special case: typing "xxxx" will cycle through all
		// the items beginning with "x".
		if ( item ) {
			item = this.getRelativeSelectableItem( item, 1 );
		}
	} else {
		this.keyPressBuffer += c;
	}

	filter = this.getItemMatcher( this.keyPressBuffer, false );
	if ( !item || !filter( item ) ) {
		item = this.getRelativeSelectableItem( item, 1, filter );
	}
	if ( item ) {
		if ( item.constructor.static.highlightable ) {
			this.highlightItem( item );
		} else {
			this.chooseItem( item );
		}
		item.scrollElementIntoView();
	}

	return false;
};

/**
 * Get a matcher for the specific string
 *
 * @protected
 * @param {string} s String to match against items
 * @param {boolean} [exact=false] Only accept exact matches
 * @return {Function} function ( OO.ui.OptionItem ) => boolean
 */
OO.ui.SelectWidget.prototype.getItemMatcher = function ( s, exact ) {
	var re;

	if ( s.normalize ) {
		s = s.normalize();
	}
	s = exact ? s.trim() : s.replace( /^\s+/, '' );
	re = '^\\s*' + s.replace( /([\\{}()|.?*+\-\^$\[\]])/g, '\\$1' ).replace( /\s+/g, '\\s+' );
	if ( exact ) {
		re += '\\s*$';
	}
	re = new RegExp( re, 'i' );
	return function ( item ) {
		var l = item.getLabel();
		if ( typeof l !== 'string' ) {
			l = item.$label.text();
		}
		if ( l.normalize ) {
			l = l.normalize();
		}
		return re.test( l );
	};
};

/**
 * Bind key press listener.
 *
 * @protected
 */
OO.ui.SelectWidget.prototype.bindKeyPressListener = function () {
	OO.ui.addCaptureEventListener( this.getElementWindow(), 'keypress', this.onKeyPressHandler );
};

/**
 * Unbind key down listener.
 *
 * If you override this, be sure to call this.clearKeyPressBuffer() from your
 * implementation.
 *
 * @protected
 */
OO.ui.SelectWidget.prototype.unbindKeyPressListener = function () {
	OO.ui.removeCaptureEventListener( this.getElementWindow(), 'keypress', this.onKeyPressHandler );
	this.clearKeyPressBuffer();
};

/**
 * Visibility change handler
 *
 * @protected
 * @param {boolean} visible
 */
OO.ui.SelectWidget.prototype.onToggle = function ( visible ) {
	if ( !visible ) {
		this.clearKeyPressBuffer();
	}
};

/**
 * Get the closest item to a jQuery.Event.
 *
 * @private
 * @param {jQuery.Event} e
 * @return {OO.ui.OptionWidget|null} Outline item widget, `null` if none was found
 */
OO.ui.SelectWidget.prototype.getTargetItem = function ( e ) {
	return $( e.target ).closest( '.oo-ui-optionWidget' ).data( 'oo-ui-optionWidget' ) || null;
};

/**
 * Get selected item.
 *
 * @return {OO.ui.OptionWidget|null} Selected item, `null` if no item is selected
 */
OO.ui.SelectWidget.prototype.getSelectedItem = function () {
	var i, len;

	for ( i = 0, len = this.items.length; i < len; i++ ) {
		if ( this.items[ i ].isSelected() ) {
			return this.items[ i ];
		}
	}
	return null;
};

/**
 * Get highlighted item.
 *
 * @return {OO.ui.OptionWidget|null} Highlighted item, `null` if no item is highlighted
 */
OO.ui.SelectWidget.prototype.getHighlightedItem = function () {
	var i, len;

	for ( i = 0, len = this.items.length; i < len; i++ ) {
		if ( this.items[ i ].isHighlighted() ) {
			return this.items[ i ];
		}
	}
	return null;
};

/**
 * Toggle pressed state.
 *
 * Press is a state that occurs when a user mouses down on an item, but
 * has not yet let go of the mouse. The item may appear selected, but it will not be selected
 * until the user releases the mouse.
 *
 * @param {boolean} pressed An option is being pressed
 */
OO.ui.SelectWidget.prototype.togglePressed = function ( pressed ) {
	if ( pressed === undefined ) {
		pressed = !this.pressed;
	}
	if ( pressed !== this.pressed ) {
		this.$element
			.toggleClass( 'oo-ui-selectWidget-pressed', pressed )
			.toggleClass( 'oo-ui-selectWidget-depressed', !pressed );
		this.pressed = pressed;
	}
};

/**
 * Highlight an option. If the `item` param is omitted, no options will be highlighted
 * and any existing highlight will be removed. The highlight is mutually exclusive.
 *
 * @param {OO.ui.OptionWidget} [item] Item to highlight, omit for no highlight
 * @fires highlight
 * @chainable
 */
OO.ui.SelectWidget.prototype.highlightItem = function ( item ) {
	var i, len, highlighted,
		changed = false;

	for ( i = 0, len = this.items.length; i < len; i++ ) {
		highlighted = this.items[ i ] === item;
		if ( this.items[ i ].isHighlighted() !== highlighted ) {
			this.items[ i ].setHighlighted( highlighted );
			changed = true;
		}
	}
	if ( changed ) {
		this.emit( 'highlight', item );
	}

	return this;
};

/**
 * Fetch an item by its label.
 *
 * @param {string} label Label of the item to select.
 * @param {boolean} [prefix=false] Allow a prefix match, if only a single item matches
 * @return {OO.ui.Element|null} Item with equivalent label, `null` if none exists
 */
OO.ui.SelectWidget.prototype.getItemFromLabel = function ( label, prefix ) {
	var i, item, found,
		len = this.items.length,
		filter = this.getItemMatcher( label, true );

	for ( i = 0; i < len; i++ ) {
		item = this.items[ i ];
		if ( item instanceof OO.ui.OptionWidget && item.isSelectable() && filter( item ) ) {
			return item;
		}
	}

	if ( prefix ) {
		found = null;
		filter = this.getItemMatcher( label, false );
		for ( i = 0; i < len; i++ ) {
			item = this.items[ i ];
			if ( item instanceof OO.ui.OptionWidget && item.isSelectable() && filter( item ) ) {
				if ( found ) {
					return null;
				}
				found = item;
			}
		}
		if ( found ) {
			return found;
		}
	}

	return null;
};

/**
 * Programmatically select an option by its label. If the item does not exist,
 * all options will be deselected.
 *
 * @param {string} [label] Label of the item to select.
 * @param {boolean} [prefix=false] Allow a prefix match, if only a single item matches
 * @fires select
 * @chainable
 */
OO.ui.SelectWidget.prototype.selectItemByLabel = function ( label, prefix ) {
	var itemFromLabel = this.getItemFromLabel( label, !!prefix );
	if ( label === undefined || !itemFromLabel ) {
		return this.selectItem();
	}
	return this.selectItem( itemFromLabel );
};

/**
 * Programmatically select an option by its data. If the `data` parameter is omitted,
 * or if the item does not exist, all options will be deselected.
 *
 * @param {Object|string} [data] Value of the item to select, omit to deselect all
 * @fires select
 * @chainable
 */
OO.ui.SelectWidget.prototype.selectItemByData = function ( data ) {
	var itemFromData = this.getItemFromData( data );
	if ( data === undefined || !itemFromData ) {
		return this.selectItem();
	}
	return this.selectItem( itemFromData );
};

/**
 * Programmatically select an option by its reference. If the `item` parameter is omitted,
 * all options will be deselected.
 *
 * @param {OO.ui.OptionWidget} [item] Item to select, omit to deselect all
 * @fires select
 * @chainable
 */
OO.ui.SelectWidget.prototype.selectItem = function ( item ) {
	var i, len, selected,
		changed = false;

	for ( i = 0, len = this.items.length; i < len; i++ ) {
		selected = this.items[ i ] === item;
		if ( this.items[ i ].isSelected() !== selected ) {
			this.items[ i ].setSelected( selected );
			changed = true;
		}
	}
	if ( changed ) {
		this.emit( 'select', item );
	}

	return this;
};

/**
 * Press an item.
 *
 * Press is a state that occurs when a user mouses down on an item, but has not
 * yet let go of the mouse. The item may appear selected, but it will not be selected until the user
 * releases the mouse.
 *
 * @param {OO.ui.OptionWidget} [item] Item to press, omit to depress all
 * @fires press
 * @chainable
 */
OO.ui.SelectWidget.prototype.pressItem = function ( item ) {
	var i, len, pressed,
		changed = false;

	for ( i = 0, len = this.items.length; i < len; i++ ) {
		pressed = this.items[ i ] === item;
		if ( this.items[ i ].isPressed() !== pressed ) {
			this.items[ i ].setPressed( pressed );
			changed = true;
		}
	}
	if ( changed ) {
		this.emit( 'press', item );
	}

	return this;
};

/**
 * Choose an item.
 *
 * Note that ‘choose’ should never be modified programmatically. A user can choose
 * an option with the keyboard or mouse and it becomes selected. To select an item programmatically,
 * use the #selectItem method.
 *
 * This method is identical to #selectItem, but may vary in subclasses that take additional action
 * when users choose an item with the keyboard or mouse.
 *
 * @param {OO.ui.OptionWidget} item Item to choose
 * @fires choose
 * @chainable
 */
OO.ui.SelectWidget.prototype.chooseItem = function ( item ) {
	this.selectItem( item );
	this.emit( 'choose', item );

	return this;
};

/**
 * Get an option by its position relative to the specified item (or to the start of the option array,
 * if item is `null`). The direction in which to search through the option array is specified with a
 * number: -1 for reverse (the default) or 1 for forward. The method will return an option, or
 * `null` if there are no options in the array.
 *
 * @param {OO.ui.OptionWidget|null} item Item to describe the start position, or `null` to start at the beginning of the array.
 * @param {number} direction Direction to move in: -1 to move backward, 1 to move forward
 * @param {Function} filter Only consider items for which this function returns
 *  true. Function takes an OO.ui.OptionWidget and returns a boolean.
 * @return {OO.ui.OptionWidget|null} Item at position, `null` if there are no items in the select
 */
OO.ui.SelectWidget.prototype.getRelativeSelectableItem = function ( item, direction, filter ) {
	var currentIndex, nextIndex, i,
		increase = direction > 0 ? 1 : -1,
		len = this.items.length;

	if ( !$.isFunction( filter ) ) {
		filter = OO.ui.SelectWidget.static.passAllFilter;
	}

	if ( item instanceof OO.ui.OptionWidget ) {
		currentIndex = $.inArray( item, this.items );
		nextIndex = ( currentIndex + increase + len ) % len;
	} else {
		// If no item is selected and moving forward, start at the beginning.
		// If moving backward, start at the end.
		nextIndex = direction > 0 ? 0 : len - 1;
	}

	for ( i = 0; i < len; i++ ) {
		item = this.items[ nextIndex ];
		if ( item instanceof OO.ui.OptionWidget && item.isSelectable() && filter( item ) ) {
			return item;
		}
		nextIndex = ( nextIndex + increase + len ) % len;
	}
	return null;
};

/**
 * Get the next selectable item or `null` if there are no selectable items.
 * Disabled options and menu-section markers and breaks are not selectable.
 *
 * @return {OO.ui.OptionWidget|null} Item, `null` if there aren't any selectable items
 */
OO.ui.SelectWidget.prototype.getFirstSelectableItem = function () {
	var i, len, item;

	for ( i = 0, len = this.items.length; i < len; i++ ) {
		item = this.items[ i ];
		if ( item instanceof OO.ui.OptionWidget && item.isSelectable() ) {
			return item;
		}
	}

	return null;
};

/**
 * Add an array of options to the select. Optionally, an index number can be used to
 * specify an insertion point.
 *
 * @param {OO.ui.OptionWidget[]} items Items to add
 * @param {number} [index] Index to insert items after
 * @fires add
 * @chainable
 */
OO.ui.SelectWidget.prototype.addItems = function ( items, index ) {
	// Mixin method
	OO.ui.mixin.GroupWidget.prototype.addItems.call( this, items, index );

	// Always provide an index, even if it was omitted
	this.emit( 'add', items, index === undefined ? this.items.length - items.length - 1 : index );

	return this;
};

/**
 * Remove the specified array of options from the select. Options will be detached
 * from the DOM, not removed, so they can be reused later. To remove all options from
 * the select, you may wish to use the #clearItems method instead.
 *
 * @param {OO.ui.OptionWidget[]} items Items to remove
 * @fires remove
 * @chainable
 */
OO.ui.SelectWidget.prototype.removeItems = function ( items ) {
	var i, len, item;

	// Deselect items being removed
	for ( i = 0, len = items.length; i < len; i++ ) {
		item = items[ i ];
		if ( item.isSelected() ) {
			this.selectItem( null );
		}
	}

	// Mixin method
	OO.ui.mixin.GroupWidget.prototype.removeItems.call( this, items );

	this.emit( 'remove', items );

	return this;
};

/**
 * Clear all options from the select. Options will be detached from the DOM, not removed,
 * so that they can be reused later. To remove a subset of options from the select, use
 * the #removeItems method.
 *
 * @fires remove
 * @chainable
 */
OO.ui.SelectWidget.prototype.clearItems = function () {
	var items = this.items.slice();

	// Mixin method
	OO.ui.mixin.GroupWidget.prototype.clearItems.call( this );

	// Clear selection
	this.selectItem( null );

	this.emit( 'remove', items );

	return this;
};
