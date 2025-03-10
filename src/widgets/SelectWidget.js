/**
 * A SelectWidget is of a generic selection of options. The OOUI library contains several types of
 * select widgets, including {@link OO.ui.ButtonSelectWidget button selects},
 * {@link OO.ui.RadioSelectWidget radio selects}, and {@link OO.ui.MenuSelectWidget
 * menu selects}.
 *
 * This class should be used together with OO.ui.OptionWidget or OO.ui.DecoratedOptionWidget. For
 * more information, please see the [OOUI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Selects_and_Options
 *
 *     @example
 *     // A select widget with three options.
 *     const select = new OO.ui.SelectWidget( {
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
 *     $( document.body ).append( select.$element );
 *
 * @abstract
 * @class
 * @extends OO.ui.Widget
 * @mixes OO.ui.mixin.GroupWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {OO.ui.OptionWidget[]} [config.items] An array of options to add to the select.
 *  Options are created with {@link OO.ui.OptionWidget OptionWidget} classes. See
 *  the [OOUI documentation on MediaWiki][2] for examples.
 *  [2]: https://www.mediawiki.org/wiki/OOUI/Widgets/Selects_and_Options
 * @param {boolean} [config.multiselect=false] Allow for multiple selections
 */
OO.ui.SelectWidget = function OoUiSelectWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.SelectWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.GroupWidget.call( this, Object.assign( {
		$group: this.$element
	}, config ) );

	// Properties
	this.pressed = false;
	this.selecting = null;
	this.multiselect = !!config.multiselect;
	this.onDocumentMouseUpHandler = this.onDocumentMouseUp.bind( this );
	this.onDocumentMouseMoveHandler = this.onDocumentMouseMove.bind( this );
	this.onDocumentKeyDownHandler = this.onDocumentKeyDown.bind( this );
	this.onDocumentKeyPressHandler = this.onDocumentKeyPress.bind( this );
	this.keyPressBuffer = '';
	this.keyPressBufferTimer = null;
	this.blockMouseOverEvents = 0;

	// Events
	this.connect( this, {
		toggle: 'onToggle'
	} );
	this.$element.on( {
		focusin: this.onFocus.bind( this ),
		mousedown: this.onMouseDown.bind( this ),
		mouseover: this.onMouseOver.bind( this ),
		mouseleave: this.onMouseLeave.bind( this )
	} );

	// Initialization
	this.$element
		.addClass( 'oo-ui-selectWidget oo-ui-selectWidget-unpressed' )
		.attr( {
			role: 'listbox',
			'aria-multiselectable': this.multiselect.toString()
		} );
	this.setFocusOwner( this.$element );
	this.addItems( config.items || [] );
};

/* Setup */

OO.inheritClass( OO.ui.SelectWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.SelectWidget, OO.ui.mixin.GroupWidget );

/* Events */

/**
 * A `highlight` event is emitted when the highlight is changed with the #highlightItem method.
 *
 * @event OO.ui.SelectWidget#highlight
 * @param {OO.ui.OptionWidget|null} item Highlighted item
 */

/**
 * A `press` event is emitted when the #pressItem method is used to programmatically modify the
 * pressed state of an option.
 *
 * @event OO.ui.SelectWidget#press
 * @param {OO.ui.OptionWidget|null} item Pressed item
 */

/**
 * A `select` event is emitted when the selection is modified programmatically with the #selectItem
 * method.
 *
 * @event OO.ui.SelectWidget#select
 * @param {OO.ui.OptionWidget[]|OO.ui.OptionWidget|null} items Currently selected items
 */

/**
 * A `choose` event is emitted when an item is chosen with the #chooseItem method.
 *
 * @event OO.ui.SelectWidget#choose
 * @param {OO.ui.OptionWidget} item Chosen item
 * @param {boolean} selected Item is selected
 */

/**
 * An `add` event is emitted when options are added to the select with the #addItems method.
 *
 * @event OO.ui.SelectWidget#add
 * @param {OO.ui.OptionWidget[]} items Added items
 * @param {number} index Index of insertion point
 */

/**
 * A `remove` event is emitted when options are removed from the select with the #clearItems
 * or #removeItems methods.
 *
 * @event OO.ui.SelectWidget#remove
 * @param {OO.ui.OptionWidget[]} items Removed items
 */

/* Static Properties */

/**
 * Whether this widget will respond to the navigation keys Home, End, PageUp, PageDown.
 *
 * @static
 * @property {boolean}
 */
OO.ui.SelectWidget.static.handleNavigationKeys = false;

/**
 * Whether selecting items using arrow keys or navigation keys in this widget will wrap around after
 * the user reaches the beginning or end of the list.
 *
 * @static
 * @property {boolean}
 */
OO.ui.SelectWidget.static.listWrapsAround = true;

/* Static methods */

/**
 * Normalize text for filter matching
 *
 * @param {string} text Text
 * @return {string} Normalized text
 */
OO.ui.SelectWidget.static.normalizeForMatching = function ( text ) {
	// Replace trailing whitespace, normalize multiple spaces and make case insensitive
	let normalized = text.trim().replace( /\s+/, ' ' ).toLowerCase();

	// Normalize Unicode
	normalized = normalized.normalize();

	return normalized;
};

/* Methods */

/**
 * Handle focus events
 *
 * @private
 * @param {jQuery.Event} event
 */
OO.ui.SelectWidget.prototype.onFocus = function ( event ) {
	let item;
	if ( event.target === this.$element[ 0 ] ) {
		// This widget was focussed, e.g. by the user tabbing to it.
		// The styles for focus state depend on one of the items being selected.
		if ( !this.findFirstSelectedItem() ) {
			item = this.findFirstSelectableItem();
		}
	} else {
		if ( event.target.tabIndex === -1 ) {
			// One of the options got focussed (and the event bubbled up here).
			// They can't be tabbed to, but they can be activated using access keys.
			// OptionWidgets and focusable UI elements inside them have tabindex="-1" set.
			item = this.findTargetItem( event );
			if ( item && !( item.isHighlightable() || item.isSelectable() ) ) {
				// The item is disabled (weirdly, disabled items can be focussed in Firefox and IE,
				// but not in Chrome). Do nothing (do not highlight or select anything).
				return;
			}
		} else {
			// There is something actually user-focusable in one of the labels of the options, and
			// the user focussed it (e.g. by tabbing to it). Do nothing (especially, don't change
			// the focus).
			return;
		}
	}

	if ( item ) {
		if ( item.constructor.static.highlightable ) {
			this.highlightItem( item );
		} else {
			this.selectItem( item );
		}
	}

	if ( event.target !== this.$element[ 0 ] ) {
		this.$focusOwner.trigger( 'focus' );
	}
};

/**
 * Handle mouse down events.
 *
 * @private
 * @param {jQuery.Event} e Mouse down event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.SelectWidget.prototype.onMouseDown = function ( e ) {
	if ( !this.isDisabled() && e.which === OO.ui.MouseButtons.LEFT ) {
		this.togglePressed( true );
		const item = this.findTargetItem( e );
		if ( item && item.isSelectable() ) {
			this.pressItem( item );
			this.selecting = item;
			this.getElementDocument().addEventListener( 'mouseup', this.onDocumentMouseUpHandler, true );
			this.getElementDocument().addEventListener( 'mousemove', this.onDocumentMouseMoveHandler, true );
		}
	}
	return false;
};

/**
 * Handle document mouse up events.
 *
 * @private
 * @param {MouseEvent} e Mouse up event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.SelectWidget.prototype.onDocumentMouseUp = function ( e ) {
	this.togglePressed( false );
	if ( !this.selecting ) {
		const item = this.findTargetItem( e );
		if ( item && item.isSelectable() ) {
			this.selecting = item;
		}
	}
	if ( !this.isDisabled() && e.which === OO.ui.MouseButtons.LEFT && this.selecting ) {
		this.pressItem( null );
		this.chooseItem( this.selecting );
		this.selecting = null;
	}

	this.getElementDocument().removeEventListener( 'mouseup', this.onDocumentMouseUpHandler, true );
	this.getElementDocument().removeEventListener( 'mousemove', this.onDocumentMouseMoveHandler, true );

	return false;
};

/**
 * Handle document mouse move events.
 *
 * @private
 * @param {MouseEvent} e Mouse move event
 */
OO.ui.SelectWidget.prototype.onDocumentMouseMove = function ( e ) {
	if ( !this.isDisabled() && this.pressed ) {
		const item = this.findTargetItem( e );
		if ( item && item !== this.selecting && item.isSelectable() ) {
			this.pressItem( item );
			this.selecting = item;
		}
	}
};

/**
 * Handle mouse over events.
 *
 * @private
 * @param {jQuery.Event} e Mouse over event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.SelectWidget.prototype.onMouseOver = function ( e ) {
	if ( this.blockMouseOverEvents ) {
		return;
	}
	if ( !this.isDisabled() ) {
		const item = this.findTargetItem( e );
		this.highlightItem( item && item.isHighlightable() ? item : null );
	}
	return false;
};

/**
 * Handle mouse leave events.
 *
 * @private
 * @param {jQuery.Event} e Mouse over event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.SelectWidget.prototype.onMouseLeave = function () {
	if ( !this.isDisabled() ) {
		this.highlightItem( null );
	}
	return false;
};

/**
 * Handle document key down events.
 *
 * @protected
 * @param {KeyboardEvent} e Key down event
 */
OO.ui.SelectWidget.prototype.onDocumentKeyDown = function ( e ) {
	let handled = false;

	const currentItem =
		( this.isVisible() && this.findHighlightedItem() ) ||
		( !this.multiselect && this.findSelectedItem() );

	let nextItem;
	if ( !this.isDisabled() ) {
		switch ( e.keyCode ) {
			case OO.ui.Keys.ENTER:
				if ( currentItem ) {
					// Select highlighted item or toggle when multiselect is enabled
					this.chooseItem( currentItem );
					handled = true;
				}
				break;
			case OO.ui.Keys.UP:
			case OO.ui.Keys.LEFT:
			case OO.ui.Keys.DOWN:
			case OO.ui.Keys.RIGHT:
				this.clearKeyPressBuffer();
				nextItem = this.findRelativeSelectableItem(
					currentItem,
					e.keyCode === OO.ui.Keys.UP || e.keyCode === OO.ui.Keys.LEFT ? -1 : 1,
					null,
					this.constructor.static.listWrapsAround
				);
				handled = true;
				break;
			case OO.ui.Keys.HOME:
			case OO.ui.Keys.END:
				if ( this.constructor.static.handleNavigationKeys ) {
					this.clearKeyPressBuffer();
					nextItem = this.findRelativeSelectableItem(
						null,
						e.keyCode === OO.ui.Keys.HOME ? 1 : -1,
						null,
						this.constructor.static.listWrapsAround
					);
					handled = true;
				}
				break;
			case OO.ui.Keys.PAGEUP:
			case OO.ui.Keys.PAGEDOWN:
				if ( this.constructor.static.handleNavigationKeys ) {
					this.clearKeyPressBuffer();
					nextItem = this.findRelativeSelectableItem(
						currentItem,
						e.keyCode === OO.ui.Keys.PAGEUP ? -10 : 10,
						null,
						this.constructor.static.listWrapsAround
					);
					handled = true;
				}
				break;
			case OO.ui.Keys.ESCAPE:
			case OO.ui.Keys.TAB:
				if ( currentItem ) {
					currentItem.setHighlighted( false );
				}
				this.unbindDocumentKeyDownListener();
				this.unbindDocumentKeyPressListener();
				// Don't prevent tabbing away / defocusing
				handled = false;
				break;
		}

		if ( nextItem ) {
			if ( this.isVisible() && nextItem.constructor.static.highlightable ) {
				this.highlightItem( nextItem );
			} else {
				if ( this.screenReaderMode ) {
					this.highlightItem( nextItem );
				}
				this.chooseItem( nextItem );
			}
			this.scrollItemIntoView( nextItem );
		}

		if ( handled ) {
			e.preventDefault();
			e.stopPropagation();
		}
	}
};

/**
 * Bind document key down listener.
 *
 * @protected
 */
OO.ui.SelectWidget.prototype.bindDocumentKeyDownListener = function () {
	this.getElementDocument().addEventListener( 'keydown', this.onDocumentKeyDownHandler, true );
};

/**
 * Unbind document key down listener.
 *
 * @protected
 */
OO.ui.SelectWidget.prototype.unbindDocumentKeyDownListener = function () {
	this.getElementDocument().removeEventListener( 'keydown', this.onDocumentKeyDownHandler, true );
};

/**
 * Scroll item into view, preventing spurious mouse highlight actions from happening.
 *
 * @param {OO.ui.OptionWidget} item Item to scroll into view
 */
OO.ui.SelectWidget.prototype.scrollItemIntoView = function ( item ) {
	// Chromium's Blink engine will generate spurious 'mouseover' events during programmatic
	// scrolling and around 100-150 ms after it is finished.
	this.blockMouseOverEvents++;
	item.scrollElementIntoView().done( () => {
		setTimeout( () => {
			this.blockMouseOverEvents--;
		}, 200 );
	} );
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
 * @param {KeyboardEvent} e Key press event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.SelectWidget.prototype.onDocumentKeyPress = function ( e ) {
	if ( !e.charCode ) {
		if ( e.keyCode === OO.ui.Keys.BACKSPACE && this.keyPressBuffer !== '' ) {
			this.keyPressBuffer = this.keyPressBuffer.slice( 0, this.keyPressBuffer.length - 1 );
			return false;
		}
		return;
	}

	const c = String.fromCodePoint( e.charCode );

	if ( this.keyPressBufferTimer ) {
		clearTimeout( this.keyPressBufferTimer );
	}
	this.keyPressBufferTimer = setTimeout( this.clearKeyPressBuffer.bind( this ), 1500 );

	let item = ( this.isVisible() && this.findHighlightedItem() ) ||
		( !this.multiselect && this.findSelectedItem() );

	if ( this.keyPressBuffer === c ) {
		// Common (if weird) special case: typing "xxxx" will cycle through all
		// the items beginning with "x".
		if ( item ) {
			item = this.findRelativeSelectableItem( item, 1 );
		}
	} else {
		this.keyPressBuffer += c;
	}

	const filter = this.getItemMatcher( this.keyPressBuffer, false );
	if ( !item || !filter( item ) ) {
		item = this.findRelativeSelectableItem( item, 1, filter );
	}
	if ( item ) {
		if ( this.isVisible() && item.constructor.static.highlightable ) {
			this.highlightItem( item );
		} else {
			if ( this.screenReaderMode ) {
				this.highlightItem( item );
			}
			this.chooseItem( item );
		}
		this.scrollItemIntoView( item );
	}

	e.preventDefault();
	e.stopPropagation();
};

/**
 * Get a matcher for the specific string
 *
 * @protected
 * @param {string} query String to match against items
 * @param {string} [mode='prefix'] Matching mode: 'substring', 'prefix', or 'exact'
 * @return {Function} function ( OO.ui.OptionWidget ) => boolean
 */
OO.ui.SelectWidget.prototype.getItemMatcher = function ( query, mode ) {
	const normalizeForMatching = this.constructor.static.normalizeForMatching,
		normalizedQuery = normalizeForMatching( query );

	// Empty string matches everything, except in "exact" mode where it matches nothing
	if ( !normalizedQuery ) {
		return function () {
			return mode !== 'exact';
		};
	}

	return function ( item ) {
		const matchText = normalizeForMatching( item.getMatchText() );
		switch ( mode ) {
			case 'exact':
				return matchText === normalizedQuery;
			case 'substring':
				return matchText.includes( normalizedQuery );
			// 'prefix'
			default:
				return matchText.indexOf( normalizedQuery ) === 0;
		}
	};
};

/**
 * Bind document key press listener.
 *
 * @protected
 */
OO.ui.SelectWidget.prototype.bindDocumentKeyPressListener = function () {
	this.getElementDocument().addEventListener( 'keypress', this.onDocumentKeyPressHandler, true );
};

/**
 * Unbind document key down listener.
 *
 * If you override this, be sure to call this.clearKeyPressBuffer() from your
 * implementation.
 *
 * @protected
 */
OO.ui.SelectWidget.prototype.unbindDocumentKeyPressListener = function () {
	this.getElementDocument().removeEventListener( 'keypress', this.onDocumentKeyPressHandler, true );
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
OO.ui.SelectWidget.prototype.findTargetItem = function ( e ) {
	const $option = $( e.target ).closest( '.oo-ui-optionWidget' );
	if ( !$option.closest( '.oo-ui-selectWidget' ).is( this.$element ) ) {
		return null;
	}
	return $option.data( 'oo-ui-optionWidget' ) || null;
};

/**
 * @return {OO.ui.OptionWidget|null} The first (of possibly many) selected item, if any
 */
OO.ui.SelectWidget.prototype.findFirstSelectedItem = function () {
	for ( let i = 0; i < this.items.length; i++ ) {
		if ( this.items[ i ].isSelected() ) {
			return this.items[ i ];
		}
	}
	return null;
};

/**
 * Find all selected items, if there are any. If the widget allows for multiselect
 * it will return an array of selected options. If the widget doesn't allow for
 * multiselect, it will return the selected option or null if no item is selected.
 *
 * @return {OO.ui.OptionWidget[]|OO.ui.OptionWidget|null} If the widget is multiselect
 *  then return an array of selected items (or empty array),
 *  if the widget is not multiselect, return a single selected item, or `null`
 *  if no item is selected
 */
OO.ui.SelectWidget.prototype.findSelectedItems = function () {
	if ( !this.multiselect ) {
		return this.findFirstSelectedItem();
	}

	return this.items.filter( ( item ) => item.isSelected() );
};

/**
 * Find selected item.
 *
 * @return {OO.ui.OptionWidget[]|OO.ui.OptionWidget|null} If the widget is multiselect
 *  then return an array of selected items (or empty array),
 *  if the widget is not multiselect, return a single selected item, or `null`
 *  if no item is selected
 */
OO.ui.SelectWidget.prototype.findSelectedItem = function () {
	return this.findSelectedItems();
};

/**
 * Find highlighted item.
 *
 * @return {OO.ui.OptionWidget|null} Highlighted item, `null` if no item is highlighted
 */
OO.ui.SelectWidget.prototype.findHighlightedItem = function () {
	for ( let i = 0; i < this.items.length; i++ ) {
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
 * @param {boolean} [pressed] An option is being pressed, omit to toggle
 */
OO.ui.SelectWidget.prototype.togglePressed = function ( pressed ) {
	if ( pressed === undefined ) {
		pressed = !this.pressed;
	}
	if ( pressed !== this.pressed ) {
		this.$element
			.toggleClass( 'oo-ui-selectWidget-pressed', pressed )
			.toggleClass( 'oo-ui-selectWidget-unpressed', !pressed );
		this.pressed = pressed;
	}
};

/**
 * Highlight an option. If the `item` param is omitted, no options will be highlighted
 * and any existing highlight will be removed. The highlight is mutually exclusive.
 *
 * @param {OO.ui.OptionWidget} [item] Item to highlight, omit for no highlight
 * @fires OO.ui.SelectWidget#highlight
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.SelectWidget.prototype.highlightItem = function ( item ) {
	if ( item && item.isHighlighted() ) {
		return this;
	}

	let changed = false;

	for ( let i = 0; i < this.items.length; i++ ) {
		const highlighted = this.items[ i ] === item;
		if ( this.items[ i ].isHighlighted() !== highlighted ) {
			this.items[ i ].setHighlighted( highlighted );
			if ( changed ) {
				// This was the second change; there can only be two, a set and an unset
				break;
			}
			// Un-highlighting can't fail, but highlighting can
			changed = !highlighted || this.items[ i ].isHighlighted();
		}
	}

	if ( changed ) {
		if ( item ) {
			this.$focusOwner.attr( 'aria-activedescendant', item.getElementId() );
		} else {
			this.$focusOwner.removeAttr( 'aria-activedescendant' );
		}
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
	const len = this.items.length;

	let filter = this.getItemMatcher( label, 'exact' );

	let i, item;
	for ( i = 0; i < len; i++ ) {
		item = this.items[ i ];
		if ( item instanceof OO.ui.OptionWidget && item.isSelectable() && filter( item ) ) {
			return item;
		}
	}

	if ( prefix ) {
		let found = null;
		filter = this.getItemMatcher( label, 'prefix' );
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
 * @fires OO.ui.SelectWidget#select
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.SelectWidget.prototype.selectItemByLabel = function ( label, prefix ) {
	const itemFromLabel = this.getItemFromLabel( label, !!prefix );
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
 * @fires OO.ui.SelectWidget#select
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.SelectWidget.prototype.selectItemByData = function ( data ) {
	const itemFromData = this.findItemFromData( data );
	if ( data === undefined || !itemFromData ) {
		return this.selectItem();
	}
	return this.selectItem( itemFromData );
};

/**
 * Programmatically unselect an option by its reference. If the widget
 * allows for multiple selections, there may be other items still selected;
 * otherwise, no items will be selected.
 * If no item is given, all selected items will be unselected.
 *
 * @param {OO.ui.OptionWidget} [unselectedItem] Item to unselect, or nothing to unselect all
 * @fires OO.ui.SelectWidget#select
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.SelectWidget.prototype.unselectItem = function ( unselectedItem ) {
	if ( !unselectedItem ) {
		// Unselect all
		this.selectItem();
	} else if ( unselectedItem.isSelected() ) {
		unselectedItem.setSelected( false );
		// Other items might still be selected in multiselect mode
		this.emit( 'select', this.findSelectedItems() );
	}

	return this;
};

/**
 * Programmatically select an option by its reference. If the `item` parameter is omitted,
 * all options will be deselected.
 *
 * @param {OO.ui.OptionWidget} [item] Item to select, omit to deselect all
 * @fires OO.ui.SelectWidget#select
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.SelectWidget.prototype.selectItem = function ( item ) {
	if ( item ) {
		if ( item.isSelected() ) {
			return this;
		} else if ( this.multiselect ) {
			// We don't care about the state of the other items when multiselect is allowed
			item.setSelected( true );
			this.emit( 'select', this.findSelectedItems() );
			return this;
		}
	}

	let changed = false;

	for ( let i = 0; i < this.items.length; i++ ) {
		const selected = this.items[ i ] === item;
		if ( this.items[ i ].isSelected() !== selected ) {
			this.items[ i ].setSelected( selected );
			if ( changed && !this.multiselect ) {
				// This was the second change; there can only be two, a set and an unset
				break;
			}
			// Un-selecting can't fail, but selecting can
			changed = !selected || this.items[ i ].isSelected();
		}
	}

	if ( changed ) {
		// Fall back to the selected instead of the highlighted option (see #highlightItem) only
		// when we know highlighting is disabled. Unfortunately we can't know without an item.
		// Don't even try when an arbitrary number of options can be selected.
		if ( !this.multiselect && item && !item.constructor.static.highlightable ) {
			this.$focusOwner.attr( 'aria-activedescendant', item.getElementId() );
		}
		this.emit( 'select', this.findSelectedItems() );
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
 * @fires OO.ui.SelectWidget#press
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.SelectWidget.prototype.pressItem = function ( item ) {
	if ( item && item.isPressed() ) {
		return this;
	}

	let changed = false;

	for ( let i = 0; i < this.items.length; i++ ) {
		const pressed = this.items[ i ] === item;
		if ( this.items[ i ].isPressed() !== pressed ) {
			this.items[ i ].setPressed( pressed );
			if ( changed ) {
				// This was the second change; there can only be two, a set and an unset
				break;
			}
			// Un-pressing can't fail, but pressing can
			changed = !pressed || this.items[ i ].isPressed();
		}
	}

	if ( changed ) {
		this.emit( 'press', item );
	}

	return this;
};

/**
 * Select an item or toggle an item's selection when multiselect is enabled.
 *
 * Note that ‘choose’ should never be modified programmatically. A user can choose
 * an option with the keyboard or mouse and it becomes selected. To select an item programmatically,
 * use the #selectItem method.
 *
 * This method is not identical to #selectItem and may vary further in subclasses that take
 * additional action when users choose an item with the keyboard or mouse.
 *
 * @param {OO.ui.OptionWidget} item Item to choose
 * @fires OO.ui.SelectWidget#choose
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.SelectWidget.prototype.chooseItem = function ( item ) {
	if ( item ) {
		if ( this.multiselect && item.isSelected() ) {
			this.unselectItem( item );
		} else {
			this.selectItem( item );
		}

		this.emit( 'choose', item, item.isSelected() );
	}

	return this;
};

/**
 * Find an option by its position relative to the specified item (or to the start of the option
 * array, if item is `null`). The direction and distance in which to search through the option array
 * is specified with a number: e.g. -1 for the previous item (the default) or 1 for the next item,
 * or 15 for the 15th next item, etc. The method will return an option, or `null` if there are no
 * options in the array.
 *
 * @param {OO.ui.OptionWidget|null} item Item to describe the start position, or `null` to start at
 *  the beginning of the array.
 * @param {number} offset Relative position: negative to move backward, positive to move forward
 * @param {Function} [filter] Only consider items for which this function returns
 *  true. Function takes an OO.ui.OptionWidget and returns a boolean.
 * @param {boolean} [wrap=false] Do not wrap around after reaching the last or first item
 * @return {OO.ui.OptionWidget|null} Item at position, `null` if there are no items in the select
 */
OO.ui.SelectWidget.prototype.findRelativeSelectableItem = function ( item, offset, filter, wrap ) {
	const step = offset > 0 ? 1 : -1,
		len = this.items.length;
	if ( wrap === undefined ) {
		wrap = true;
	}

	let nextIndex;
	if ( item instanceof OO.ui.OptionWidget ) {
		nextIndex = this.items.indexOf( item );
	} else {
		// If no item is selected and moving forward, start at the beginning.
		// If moving backward, start at the end.
		nextIndex = offset > 0 ? 0 : len - 1;
		offset -= step;
	}

	const previousItem = item;
	let nextItem = null;
	for ( let i = 0; i < len; i++ ) {
		item = this.items[ nextIndex ];
		if (
			item instanceof OO.ui.OptionWidget && item.isSelectable() &&
			( !filter || filter( item ) )
		) {
			nextItem = item;
		}

		if ( offset === 0 && nextItem && nextItem !== previousItem ) {
			// We walked at least the desired number of steps *and* we've selected a different item.
			// This is to ensure that disabled items don't cause us to get stuck or return null.
			break;
		}

		nextIndex += step;
		if ( nextIndex < 0 || nextIndex >= len ) {
			if ( wrap ) {
				nextIndex = ( nextIndex + len ) % len;
			} else {
				// We ran out of the list, return whichever was the last valid item
				break;
			}
		}
		if ( offset !== 0 ) {
			offset -= step;
		}
	}
	return nextItem;
};

/**
 * Find the next selectable item or `null` if there are no selectable items.
 * Disabled options and menu-section markers and breaks are not selectable.
 *
 * @return {OO.ui.OptionWidget|null} Item, `null` if there aren't any selectable items
 */
OO.ui.SelectWidget.prototype.findFirstSelectableItem = function () {
	return this.findRelativeSelectableItem( null, 1 );
};

/**
 * Add an array of options to the select. Optionally, an index number can be used to
 * specify an insertion point.
 *
 * @param {OO.ui.OptionWidget[]} [items] Options to add
 * @param {number} [index] Index to insert items after
 * @fires OO.ui.SelectWidget#add
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.SelectWidget.prototype.addItems = function ( items, index ) {
	if ( !items || items.length === 0 ) {
		return this;
	}

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
 * @fires OO.ui.SelectWidget#remove
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.SelectWidget.prototype.removeItems = function ( items ) {
	// Deselect items being removed
	for ( let i = 0; i < items.length; i++ ) {
		const item = items[ i ];
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
 * @fires OO.ui.SelectWidget#remove
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.SelectWidget.prototype.clearItems = function () {
	const items = this.items.slice();

	// Mixin method
	OO.ui.mixin.GroupWidget.prototype.clearItems.call( this );

	// Clear selection
	this.selectItem( null );

	this.emit( 'remove', items );

	return this;
};

/**
 * Set the DOM element which has focus while the user is interacting with this SelectWidget.
 *
 * This is used to set `aria-activedescendant` and `aria-expanded` on it.
 *
 * @protected
 * @param {jQuery} $focusOwner
 */
OO.ui.SelectWidget.prototype.setFocusOwner = function ( $focusOwner ) {
	this.$focusOwner = $focusOwner;
};
