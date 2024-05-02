/**
 * LookupElement is a mixin that creates a {@link OO.ui.MenuSelectWidget menu} of suggested
 * values for a {@link OO.ui.TextInputWidget text input widget}. Suggested values are based on
 * the characters the user types into the text input field and, in general, the menu is only
 * displayed when the user types. If a suggested value is chosen from the lookup menu, that value
 * becomes the value of the input field.
 *
 * Note that a new menu of suggested items is displayed when a value is chosen from the
 * lookup menu. If this is not the desired behavior, disable lookup menus with the
 * #setLookupsDisabled method, then set the value, then re-enable lookups.
 *
 * See the [OOUI demos][1] for an example.
 *
 * [1]: https://doc.wikimedia.org/oojs-ui/master/demos/#LookupElement-try-inputting-an-integer
 *
 * @class
 * @abstract
 * @mixes OO.ui.mixin.RequestManager
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {jQuery} [config.$overlay] Overlay for the lookup menu; defaults to relative positioning.
 *  See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
 * @param {jQuery} [config.$container=this.$element] The container element. The lookup menu is rendered
 *  beneath the specified element.
 * @param {Object} [config.menu] Configuration options to pass to
 *  {@link OO.ui.MenuSelectWidget menu select widget}
 * @param {boolean} [config.allowSuggestionsWhenEmpty=false] Request and display a lookup menu when the
 *  text input is empty.
 *  By default, the lookup menu is not generated and displayed until the user begins to type.
 * @param {boolean} [config.highlightFirst=true] Whether the first lookup result should be highlighted
 *  (so, that the user can take it over into the input with simply pressing return) automatically
 *  or not.
 * @param {boolean} [config.showSuggestionsOnFocus=true] Show suggestions when focusing the input. If this
 *  is set to false, suggestions will still be shown on a mousedown triggered focus. This matches
 *  browser autocomplete behavior.
 */
OO.ui.mixin.LookupElement = function OoUiMixinLookupElement( config ) {
	// Configuration initialization
	config = $.extend( { highlightFirst: true }, config );

	// Mixin constructors
	OO.ui.mixin.RequestManager.call( this, config );

	// Properties
	this.$overlay = ( config.$overlay === true ?
		OO.ui.getDefaultOverlay() : config.$overlay ) || this.$element;
	this.lookupMenu = new OO.ui.MenuSelectWidget( $.extend( {
		widget: this,
		input: this,
		$floatableContainer: config.$container || this.$element
	}, config.menu ) );

	this.allowSuggestionsWhenEmpty = config.allowSuggestionsWhenEmpty || false;

	this.lookupsDisabled = false;
	this.lookupInputFocused = false;
	this.lookupHighlightFirstItem = config.highlightFirst;
	this.showSuggestionsOnFocus = config.showSuggestionsOnFocus !== false;

	// Events
	this.$input.on( {
		focus: this.onLookupInputFocus.bind( this ),
		blur: this.onLookupInputBlur.bind( this ),
		mousedown: this.onLookupInputMouseDown.bind( this )
	} );
	this.connect( this, {
		change: 'onLookupInputChange'
	} );
	this.lookupMenu.connect( this, {
		toggle: 'onLookupMenuToggle',
		choose: 'onLookupMenuChoose'
	} );

	// Initialization
	this.$input.attr( {
		role: 'combobox',
		'aria-owns': this.lookupMenu.getElementId(),
		'aria-autocomplete': 'list'
	} );
	this.$element.addClass( 'oo-ui-lookupElement' );
	this.lookupMenu.$element.addClass( 'oo-ui-lookupElement-menu' );
	this.$overlay.append( this.lookupMenu.$element );
};

/* Setup */

OO.mixinClass( OO.ui.mixin.LookupElement, OO.ui.mixin.RequestManager );

/* Methods */

/**
 * Handle input focus event.
 *
 * @protected
 * @param {jQuery.Event} e Input focus event
 */
OO.ui.mixin.LookupElement.prototype.onLookupInputFocus = function () {
	this.lookupInputFocused = true;
	if ( this.showSuggestionsOnFocus ) {
		this.populateLookupMenu();
	}
};

/**
 * Handle input blur event.
 *
 * @protected
 * @param {jQuery.Event} e Input blur event
 */
OO.ui.mixin.LookupElement.prototype.onLookupInputBlur = function () {
	this.closeLookupMenu();
	this.lookupInputFocused = false;
};

/**
 * Handle input mouse down event.
 *
 * @protected
 * @param {jQuery.Event} e Input mouse down event
 */
OO.ui.mixin.LookupElement.prototype.onLookupInputMouseDown = function () {
	if (
		!this.lookupMenu.isVisible() &&
		(
			// Open the menu if the input was already focused.
			// This way we allow the user to open the menu again after closing it with Escape (esc)
			// by clicking in the input.
			this.lookupInputFocused ||
			// If showSuggestionsOnFocus is disabled, still open the menu on mousedown.
			!this.showSuggestionsOnFocus
		)
	) {
		this.populateLookupMenu();
	}
};

/**
 * Handle input change event.
 *
 * @protected
 * @param {string} value New input value
 */
OO.ui.mixin.LookupElement.prototype.onLookupInputChange = function () {
	if ( this.lookupInputFocused ) {
		this.populateLookupMenu();
	}
};

/**
 * Handle the lookup menu being shown/hidden.
 *
 * @protected
 * @param {boolean} visible Whether the lookup menu is now visible.
 */
OO.ui.mixin.LookupElement.prototype.onLookupMenuToggle = function ( visible ) {
	if ( !visible ) {
		// When the menu is hidden, abort any active request and clear the menu.
		// This has to be done here in addition to closeLookupMenu(), because
		// MenuSelectWidget will close itself when the user presses Escape (esc).
		this.abortLookupRequest();
		this.lookupMenu.clearItems();
	}
};

/**
 * Handle menu item 'choose' event, updating the text input value to the value of the clicked item.
 *
 * @protected
 * @param {OO.ui.MenuOptionWidget} item Selected item
 */
OO.ui.mixin.LookupElement.prototype.onLookupMenuChoose = function ( item ) {
	this.setValue( item.getData() );
};

/**
 * Get lookup menu.
 *
 * @private
 * @return {OO.ui.MenuSelectWidget}
 */
OO.ui.mixin.LookupElement.prototype.getLookupMenu = function () {
	return this.lookupMenu;
};

/**
 * Disable or re-enable lookups.
 *
 * When lookups are disabled, calls to #populateLookupMenu will be ignored.
 *
 * @param {boolean} [disabled=false] Disable lookups
 */
OO.ui.mixin.LookupElement.prototype.setLookupsDisabled = function ( disabled ) {
	this.lookupsDisabled = !!disabled;
};

/**
 * Open the menu. If there are no entries in the menu, this does nothing.
 *
 * @private
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.mixin.LookupElement.prototype.openLookupMenu = function () {
	if ( !this.lookupMenu.isEmpty() ) {
		this.lookupMenu.toggle( true );
	}
	return this;
};

/**
 * Close the menu, empty it, and abort any pending request.
 *
 * @private
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.mixin.LookupElement.prototype.closeLookupMenu = function () {
	this.lookupMenu.toggle( false );
	this.abortLookupRequest();
	this.lookupMenu.clearItems();
	return this;
};

/**
 * Request menu items based on the input's current value, and when they arrive,
 * populate the menu with these items and show the menu.
 *
 * If lookups have been disabled with #setLookupsDisabled, this function does nothing.
 *
 * @private
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.mixin.LookupElement.prototype.populateLookupMenu = function () {
	const widget = this,
		value = this.getValue();

	if ( this.lookupsDisabled || this.isReadOnly() ) {
		return;
	}

	// If the input is empty, clear the menu, unless suggestions when empty are allowed.
	if ( !this.allowSuggestionsWhenEmpty && value === '' ) {
		this.closeLookupMenu();
	// Skip population if there is already a request pending for the current value
	} else if ( value !== this.lookupQuery ) {
		this.getLookupMenuItems()
			.done( function ( items ) {
				widget.lookupMenu.clearItems();
				if ( items.length ) {
					widget.lookupMenu
						.addItems( items )
						.toggle( true );
					widget.initializeLookupMenuSelection();
				} else {
					widget.lookupMenu.toggle( false );
				}
			} )
			.fail( function () {
				widget.lookupMenu.clearItems();
				widget.lookupMenu.toggle( false );
			} );
	}

	return this;
};

/**
 * Highlight the first selectable item in the menu, if configured.
 *
 * @private
 * @chainable
 */
OO.ui.mixin.LookupElement.prototype.initializeLookupMenuSelection = function () {
	if ( this.lookupHighlightFirstItem && !this.lookupMenu.findSelectedItem() ) {
		this.lookupMenu.highlightItem( this.lookupMenu.findFirstSelectableItem() );
	}
};

/**
 * Get lookup menu items for the current query.
 *
 * @private
 * @return {jQuery.Promise} Promise object which will be passed menu items as the first argument of
 *   the done event. If the request was aborted to make way for a subsequent request, this promise
 *   will not be rejected: it will remain pending forever.
 */
OO.ui.mixin.LookupElement.prototype.getLookupMenuItems = function () {
	return this.getRequestData().then( function ( data ) {
		return this.getLookupMenuOptionsFromData( data );
	}.bind( this ) );
};

/**
 * Abort the currently pending lookup request, if any.
 *
 * @private
 */
OO.ui.mixin.LookupElement.prototype.abortLookupRequest = function () {
	this.abortRequest();
};

/**
 * Get a new request object of the current lookup query value.
 *
 * @protected
 * @method
 * @abstract
 * @return {jQuery.Promise} jQuery AJAX object, or promise object with an .abort() method
 */
OO.ui.mixin.LookupElement.prototype.getLookupRequest = null;

/**
 * Pre-process data returned by the request from #getLookupRequest.
 *
 * The return value of this function will be cached, and any further queries for the given value
 * will use the cache rather than doing API requests.
 *
 * @protected
 * @method
 * @abstract
 * @param {any} response Response from server
 * @return {any} Cached result data
 */
OO.ui.mixin.LookupElement.prototype.getLookupCacheDataFromResponse = null;

/**
 * Get a list of menu option widgets from the (possibly cached) data returned by
 * #getLookupCacheDataFromResponse.
 *
 * @protected
 * @method
 * @abstract
 * @param {any} data Cached result data, usually an array
 * @return {OO.ui.MenuOptionWidget[]} Menu items
 */
OO.ui.mixin.LookupElement.prototype.getLookupMenuOptionsFromData = null;

/**
 * Set the read-only state of the widget.
 *
 * This will also disable/enable the lookups functionality.
 *
 * @param {boolean} [readOnly=false] Make input read-only
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.mixin.LookupElement.prototype.setReadOnly = function ( readOnly ) {
	// Parent method
	// Note: Calling #setReadOnly this way assumes this is mixed into an OO.ui.TextInputWidget
	OO.ui.TextInputWidget.prototype.setReadOnly.call( this, readOnly );

	// During construction, #setReadOnly is called before the OO.ui.mixin.LookupElement constructor.
	if ( this.isReadOnly() && this.lookupMenu ) {
		this.closeLookupMenu();
	}

	return this;
};

/**
 * @inheritdoc OO.ui.mixin.RequestManager
 */
OO.ui.mixin.LookupElement.prototype.getRequestQuery = function () {
	return this.getValue();
};

/**
 * @inheritdoc OO.ui.mixin.RequestManager
 */
OO.ui.mixin.LookupElement.prototype.getRequest = function () {
	return this.getLookupRequest();
};

/**
 * @inheritdoc OO.ui.mixin.RequestManager
 */
OO.ui.mixin.LookupElement.prototype.getRequestCacheDataFromResponse = function ( response ) {
	return this.getLookupCacheDataFromResponse( response );
};
