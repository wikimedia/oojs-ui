/**
 * MenuSelectWidget is a {@link OO.ui.SelectWidget select widget} that contains options and
 * is used together with OO.ui.MenuOptionWidget. It is designed be used as part of another widget.
 * See {@link OO.ui.DropdownWidget DropdownWidget},
 * {@link OO.ui.ComboBoxInputWidget ComboBoxInputWidget}, and
 * {@link OO.ui.mixin.LookupElement LookupElement} for examples of widgets that contain menus.
 * MenuSelectWidgets themselves are not instantiated directly, rather subclassed
 * and customized to be opened, closed, and displayed as needed.
 *
 * By default, menus are clipped to the visible viewport and are not visible when a user presses the
 * mouse outside the menu.
 *
 * Menus also have support for keyboard interaction:
 *
 * - Enter/Return key: choose and select a menu option
 * - Up-arrow key: highlight the previous menu option
 * - Down-arrow key: highlight the next menu option
 * - Escape key: hide the menu
 *
 * Unlike most widgets, MenuSelectWidget is initially hidden and must be shown by calling #toggle.
 *
 * Please see the [OOUI documentation on MediaWiki][1] for more information.
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Selects_and_Options
 *
 * @class
 * @extends OO.ui.SelectWidget
 * @mixes OO.ui.mixin.ClippableElement
 * @mixes OO.ui.mixin.FloatableElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {OO.ui.TextInputWidget} [config.input] Text input used to implement option highlighting for menu
 *  items that match the text the user types. This config is used by
 *  {@link OO.ui.ComboBoxInputWidget ComboBoxInputWidget} and
 *  {@link OO.ui.mixin.LookupElement LookupElement}
 * @param {jQuery} [config.$input] Text input used to implement option highlighting for menu items that match
 *  the text the user types. This config is used by
 *  {@link OO.ui.TagMultiselectWidget TagMultiselectWidget}
 * @param {OO.ui.Widget} [config.widget] Widget associated with the menu's active state. If the user clicks
 *  the mouse anywhere on the page outside of this widget, the menu is hidden. For example, if
 *  there is a button that toggles the menu's visibility on click, the menu will be hidden then
 *  re-shown when the user clicks that button, unless the button (or its parent widget) is passed
 *  in here.
 * @param {boolean} [config.autoHide=true] Hide the menu when the mouse is pressed outside the menu.
 * @param {jQuery} [config.$autoCloseIgnore] If these elements are clicked, don't auto-hide the menu.
 * @param {boolean} [config.hideOnChoose=true] Hide the menu when the user chooses an option.
 * @param {boolean} [config.filterFromInput=false] Filter the displayed options from the input
 * @param {boolean} [config.highlightOnFilter=false] Highlight the first result when filtering
 * @param {string} [config.filterMode='prefix'] The mode by which the menu filters the results.
 *  Options are 'exact', 'prefix' or 'substring'. See `OO.ui.SelectWidget#getItemMatcher`
 * @param {number|string} [config.width] Width of the menu as a number of pixels or CSS string with unit
 *  suffix, used by {@link OO.ui.mixin.ClippableElement ClippableElement}
 */
OO.ui.MenuSelectWidget = function OoUiMenuSelectWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.MenuSelectWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.ClippableElement.call( this, Object.assign( { $clippable: this.$group }, config ) );
	OO.ui.mixin.FloatableElement.call( this, config );

	// Initial vertical positions other than 'center' will result in
	// the menu being flipped if there is not enough space in the container.
	// Store the original position so we know what to reset to.
	this.originalVerticalPosition = this.verticalPosition;

	// Properties
	this.autoHide = config.autoHide === undefined || !!config.autoHide;
	this.hideOnChoose = config.hideOnChoose === undefined || !!config.hideOnChoose;
	this.filterFromInput = !!config.filterFromInput;
	this.previouslySelectedValue = null;
	this.$input = config.$input ? config.$input : config.input ? config.input.$input : null;
	this.$widget = config.widget ? config.widget.$element : null;
	this.$autoCloseIgnore = config.$autoCloseIgnore || $( [] );
	this.onDocumentMouseDownHandler = this.onDocumentMouseDown.bind( this );
	this.onInputEditHandler = OO.ui.debounce( this.updateItemVisibility.bind( this ), 100 );
	this.highlightOnFilter = !!config.highlightOnFilter;
	this.lastHighlightedItem = null;
	this.width = config.width;
	this.filterMode = config.filterMode;
	this.screenReaderMode = false;

	// Initialization
	this.$element.addClass( 'oo-ui-menuSelectWidget' );
	if ( config.widget ) {
		this.setFocusOwner( config.widget.$tabIndexed );
	}

	// Initially hidden - using #toggle may cause errors if subclasses override toggle with methods
	// that reference properties not initialized at that time of parent class construction
	// TODO: Find a better way to handle post-constructor setup
	this.visible = false;
	this.$element.addClass( 'oo-ui-element-hidden' );
	this.$focusOwner.attr( 'aria-expanded', 'false' );
};

/* Setup */

OO.inheritClass( OO.ui.MenuSelectWidget, OO.ui.SelectWidget );
OO.mixinClass( OO.ui.MenuSelectWidget, OO.ui.mixin.ClippableElement );
OO.mixinClass( OO.ui.MenuSelectWidget, OO.ui.mixin.FloatableElement );

/* Events */

/**
 * The menu is ready: it is visible and has been positioned and clipped.
 *
 * @event OO.ui.MenuSelectWidget#ready
 */

/* Static properties */

OO.ui.MenuSelectWidget.static.handleNavigationKeys = true;

OO.ui.MenuSelectWidget.static.listWrapsAround = false;

/**
 * Positions to flip to if there isn't room in the container for the
 * menu in a specific direction.
 *
 * @property {Object.<string,string>}
 */
OO.ui.MenuSelectWidget.static.flippedPositions = {
	below: 'above',
	above: 'below',
	top: 'bottom',
	bottom: 'top'
};

/* Methods */

/**
 * Handles document mouse down events.
 *
 * @protected
 * @param {MouseEvent} e Mouse down event
 */
OO.ui.MenuSelectWidget.prototype.onDocumentMouseDown = function ( e ) {
	if (
		this.isVisible() &&
		!OO.ui.contains(
			this.$element.add( this.$widget ).add( this.$autoCloseIgnore ).get(),
			e.target,
			true
		)
	) {
		this.toggle( false );
	}
};

/**
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.onDocumentKeyDown = function ( e ) {
	let handled = false;

	const currentItem = this.findHighlightedItem() || this.findFirstSelectedItem();

	if ( !this.isDisabled() && this.getVisibleItems().length ) {
		switch ( e.keyCode ) {
			case OO.ui.Keys.ENTER:
				if ( this.isVisible() ) {
					OO.ui.MenuSelectWidget.super.prototype.onDocumentKeyDown.call( this, e );
				}
				break;
			case OO.ui.Keys.TAB:
				if ( this.isVisible() ) {
					if ( currentItem && !currentItem.isSelected() ) {
						// Was only highlighted, now let's select it. No-op if already selected.
						this.chooseItem( currentItem );
						handled = true;
					}
					this.toggle( false );
				}
				break;
			case OO.ui.Keys.LEFT:
			case OO.ui.Keys.RIGHT:
			case OO.ui.Keys.HOME:
			case OO.ui.Keys.END:
				// Do nothing if a text field is associated, these keys will be handled by the
				// text input
				if ( !this.$input ) {
					OO.ui.MenuSelectWidget.super.prototype.onDocumentKeyDown.call( this, e );
				}
				break;
			case OO.ui.Keys.ESCAPE:
				if ( this.isVisible() ) {
					if ( currentItem && !this.multiselect ) {
						currentItem.setHighlighted( false );
					}
					this.toggle( false );
					handled = true;
				}
				break;
			default:
				return OO.ui.MenuSelectWidget.super.prototype.onDocumentKeyDown.call( this, e );
		}
		if ( handled ) {
			e.preventDefault();
			e.stopPropagation();
		}
	}
};

/**
 * Return the visible items in the menu.
 *
 * @return {OO.ui.MenuOptionWidget[]} Visible items
 */
OO.ui.MenuSelectWidget.prototype.getVisibleItems = function () {
	return this.getItems().filter( ( item ) => item.isVisible() );
};

/**
 * Update menu item visibility and clipping after input changes (if filterFromInput is enabled)
 * or after items were added/removed (always).
 *
 * @protected
 */
OO.ui.MenuSelectWidget.prototype.updateItemVisibility = function () {
	if ( !this.filterFromInput || !this.$input ) {
		this.clip();
		return;
	}

	let anyVisible = false;

	const showAll = !this.isVisible() || this.previouslySelectedValue === this.$input.val(),
		filter = showAll ? null : this.getItemMatcher( this.$input.val(), this.filterMode );
	// Hide non-matching options, and also hide section headers if all options
	// in their section are hidden.
	let item;
	let section, sectionEmpty;
	for ( let i = 0; i < this.items.length; i++ ) {
		item = this.items[ i ];
		if ( item instanceof OO.ui.MenuSectionOptionWidget ) {
			if ( section ) {
				// If the previous section was empty, hide its header
				section.toggle( showAll || !sectionEmpty );
			}
			section = item;
			sectionEmpty = true;
		} else if ( item instanceof OO.ui.OptionWidget ) {
			const visible = !filter || filter( item );
			anyVisible = anyVisible || visible;
			sectionEmpty = sectionEmpty && !visible;
			item.toggle( visible );
		}
	}
	// Process the final section
	if ( section ) {
		section.toggle( showAll || !sectionEmpty );
	}

	if ( !anyVisible ) {
		this.highlightItem( null );
	}

	this.$element.toggleClass( 'oo-ui-menuSelectWidget-invisible', !anyVisible );

	if ( this.highlightOnFilter &&
		!( this.lastHighlightedItem && this.lastHighlightedItem.isSelectable() ) &&
		this.isVisible()
	) {
		// Highlight the first selectable item in the list
		item = this.findFirstSelectableItem();
		this.highlightItem( item );
		this.lastHighlightedItem = item;
	}

	// Reevaluate clipping
	this.clip();
};

/**
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.bindDocumentKeyDownListener = function () {
	if ( this.$input ) {
		this.$input.on( 'keydown', this.onDocumentKeyDownHandler );
	} else {
		OO.ui.MenuSelectWidget.super.prototype.bindDocumentKeyDownListener.call( this );
	}
};

/**
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.unbindDocumentKeyDownListener = function () {
	if ( this.$input ) {
		this.$input.off( 'keydown', this.onDocumentKeyDownHandler );
	} else {
		OO.ui.MenuSelectWidget.super.prototype.unbindDocumentKeyDownListener.call( this );
	}
};

/**
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.bindDocumentKeyPressListener = function () {
	if ( this.$input ) {
		if ( this.filterFromInput ) {
			this.$input.on(
				'keydown mouseup cut paste change input select',
				this.onInputEditHandler
			);
			this.$input.one( 'keypress', () => {
				this.previouslySelectedValue = null;
			} );
			this.previouslySelectedValue = this.$input.val();
			this.updateItemVisibility();
		}
	} else {
		OO.ui.MenuSelectWidget.super.prototype.bindDocumentKeyPressListener.call( this );
	}
};

/**
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.unbindDocumentKeyPressListener = function () {
	if ( this.$input ) {
		if ( this.filterFromInput ) {
			this.$input.off(
				'keydown mouseup cut paste change input select',
				this.onInputEditHandler
			);
			this.updateItemVisibility();
		}
	} else {
		OO.ui.MenuSelectWidget.super.prototype.unbindDocumentKeyPressListener.call( this );
	}
};

/**
 * Select an item or toggle an item's selection when multiselect is enabled.
 *
 * When a user chooses an item, the menu is closed, unless the hideOnChoose config option is
 * set to false.
 *
 * Note that ‘choose’ should never be modified programmatically. A user can choose an option with
 * the keyboard or mouse and it becomes selected. To select an item programmatically,
 * use the #selectItem method.
 *
 * @param {OO.ui.OptionWidget} item Item to choose
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.MenuSelectWidget.prototype.chooseItem = function ( item ) {
	OO.ui.MenuSelectWidget.super.prototype.chooseItem.call( this, item );
	if ( this.hideOnChoose ) {
		this.toggle( false );
	}
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.addItems = function ( items, index ) {
	if ( !items || items.length === 0 ) {
		return this;
	}

	// Parent method
	OO.ui.MenuSelectWidget.super.prototype.addItems.call( this, items, index );

	this.updateItemVisibility();

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.removeItems = function ( items ) {
	// Parent method
	OO.ui.MenuSelectWidget.super.prototype.removeItems.call( this, items );

	this.updateItemVisibility();

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.clearItems = function () {
	// Parent method
	OO.ui.MenuSelectWidget.super.prototype.clearItems.call( this );

	this.updateItemVisibility();

	return this;
};

/**
 * Toggle visibility of the menu for screen readers.
 *
 * @param {boolean} [screenReaderMode=false]
 */
OO.ui.MenuSelectWidget.prototype.toggleScreenReaderMode = function ( screenReaderMode ) {
	screenReaderMode = !!screenReaderMode;
	this.screenReaderMode = screenReaderMode;

	this.$element.toggleClass( 'oo-ui-menuSelectWidget-screenReaderMode', this.screenReaderMode );

	if ( screenReaderMode ) {
		this.bindDocumentKeyDownListener();
		this.bindDocumentKeyPressListener();
	} else {
		this.$focusOwner.removeAttr( 'aria-activedescendant' );
		this.unbindDocumentKeyDownListener();
		this.unbindDocumentKeyPressListener();
	}
};

/**
 * Toggle visibility of the menu. The menu is initially hidden and must be shown by calling
 * `.toggle( true )` after its #$element is attached to the DOM.
 *
 * Do not show the menu while it is not attached to the DOM. The calculations required to display
 * it in the right place and with the right dimensions only work correctly while it is attached.
 * Side-effects may include broken interface and exceptions being thrown. This wasn't always
 * strictly enforced, so currently it only generates a warning in the browser console.
 *
 * @fires OO.ui.MenuSelectWidget#ready
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.toggle = function ( visible ) {
	visible = ( visible === undefined ? !this.visible : !!visible ) && !!this.items.length;
	const change = visible !== this.isVisible();

	if ( visible && !this.warnedUnattached && !this.isElementAttached() ) {
		OO.ui.warnDeprecation( 'MenuSelectWidget#toggle: Before calling this method, the menu must be attached to the DOM.' );
		this.warnedUnattached = true;
	}

	if ( change && visible ) {
		// Reset position before showing the popup again. It's possible we no longer need to flip
		// (e.g. if the user scrolled).
		this.setVerticalPosition( this.originalVerticalPosition );
	}

	// Parent method
	OO.ui.MenuSelectWidget.super.prototype.toggle.call( this, visible );

	if ( change ) {
		if ( visible ) {

			if ( this.width ) {
				this.setIdealSize( this.width );
			} else if ( this.$floatableContainer ) {
				this.$clippable.css( 'width', 'auto' );
				this.setIdealSize(
					this.$floatableContainer[ 0 ].offsetWidth > this.$clippable[ 0 ].offsetWidth ?
						// Dropdown is smaller than handle so expand to width
						this.$floatableContainer[ 0 ].offsetWidth :
						// Dropdown is larger than handle so auto size
						'auto'
				);
				this.$clippable.css( 'width', '' );
			}

			this.togglePositioning( !!this.$floatableContainer );
			this.toggleClipping( true );

			if ( !this.screenReaderMode ) {
				this.bindDocumentKeyDownListener();
				this.bindDocumentKeyPressListener();
			}

			if (
				( this.isClippedVertically() || this.isFloatableOutOfView() ) &&
				this.originalVerticalPosition !== 'center'
			) {
				// If opening the menu in one direction causes it to be clipped, flip it
				const originalHeight = this.$element.height();
				this.setVerticalPosition(
					this.constructor.static.flippedPositions[ this.originalVerticalPosition ]
				);
				if ( this.isClippedVertically() || this.isFloatableOutOfView() ) {
					// If flipping also causes it to be clipped, open in whichever direction
					// we have more space
					const flippedHeight = this.$element.height();
					if ( originalHeight > flippedHeight ) {
						this.setVerticalPosition( this.originalVerticalPosition );
					}
				}
			}
			// Note that we do not flip the menu's opening direction if the clipping changes
			// later (e.g. after the user scrolls), that seems like it would be annoying

			this.$focusOwner.attr( 'aria-expanded', 'true' );
			this.$focusOwner.attr( 'aria-owns', this.getElementId() );

			const selectedItem = !this.multiselect && this.findSelectedItem();
			if ( selectedItem ) {
				// TODO: Verify if this is even needed; This is already done on highlight changes
				// in SelectWidget#highlightItem, so we should just need to highlight the item
				// we need to highlight here and not bother with attr or checking selections.
				this.$focusOwner.attr( 'aria-activedescendant', selectedItem.getElementId() );
				selectedItem.scrollElementIntoView( { duration: 0 } );
			}

			// Auto-hide
			if ( this.autoHide ) {
				this.getElementDocument().addEventListener( 'mousedown', this.onDocumentMouseDownHandler, true );
			}

			this.emit( 'ready' );
		} else {
			this.$focusOwner.removeAttr( 'aria-activedescendant' );
			if ( !this.screenReaderMode ) {
				this.unbindDocumentKeyDownListener();
				this.unbindDocumentKeyPressListener();
			}
			this.$focusOwner.attr( 'aria-expanded', 'false' );
			this.$focusOwner.removeAttr( 'aria-owns' );
			this.getElementDocument().removeEventListener( 'mousedown', this.onDocumentMouseDownHandler, true );
			this.togglePositioning( false );
			this.toggleClipping( false );
			this.lastHighlightedItem = null;
		}
	}

	return this;
};

/**
 * Scroll to the top of the menu
 */
OO.ui.MenuSelectWidget.prototype.scrollToTop = function () {
	this.$element.scrollTop( 0 );
};
