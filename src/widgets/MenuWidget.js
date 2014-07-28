/**
 * Overlaid menu of options.
 *
 * Menus are clipped to the visible viewport. They do not provide a control for opening or closing
 * the menu.
 *
 * Use together with OO.ui.MenuItemWidget.
 *
 * @class
 * @extends OO.ui.SelectWidget
 * @mixins OO.ui.ClippableElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {OO.ui.InputWidget} [input] Input to bind keyboard handlers to
 * @cfg {OO.ui.Widget} [widget] Widget to bind mouse handlers to
 * @cfg {boolean} [autoHide=true] Hide the menu when the mouse is pressed outside the menu
 */
OO.ui.MenuWidget = function OoUiMenuWidget( config ) {
	// Config intialization
	config = config || {};

	// Parent constructor
	OO.ui.MenuWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.ClippableElement.call( this, this.$group, config );

	// Properties
	this.flashing = false;
	this.visible = false;
	this.newItems = null;
	this.autoHide = config.autoHide === undefined || !!config.autoHide;
	this.$input = config.input ? config.input.$input : null;
	this.$widget = config.widget ? config.widget.$element : null;
	this.$previousFocus = null;
	this.isolated = !config.input;
	this.onKeyDownHandler = OO.ui.bind( this.onKeyDown, this );
	this.onDocumentMouseDownHandler = OO.ui.bind( this.onDocumentMouseDown, this );

	// Initialization
	this.$element
		.hide()
		.attr( 'role', 'menu' )
		.addClass( 'oo-ui-menuWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.MenuWidget, OO.ui.SelectWidget );
OO.mixinClass( OO.ui.MenuWidget, OO.ui.ClippableElement );

/* Methods */

/**
 * Handles document mouse down events.
 *
 * @param {jQuery.Event} e Key down event
 */
OO.ui.MenuWidget.prototype.onDocumentMouseDown = function ( e ) {
	if ( !$.contains( this.$element[0], e.target ) && ( !this.$widget || !$.contains( this.$widget[0], e.target ) ) ) {
		this.toggle( false );
	}
};

/**
 * Handles key down events.
 *
 * @param {jQuery.Event} e Key down event
 */
OO.ui.MenuWidget.prototype.onKeyDown = function ( e ) {
	var nextItem,
		handled = false,
		highlightItem = this.getHighlightedItem();

	if ( !this.isDisabled() && this.isVisible() ) {
		if ( !highlightItem ) {
			highlightItem = this.getSelectedItem();
		}
		switch ( e.keyCode ) {
			case OO.ui.Keys.ENTER:
				this.chooseItem( highlightItem );
				handled = true;
				break;
			case OO.ui.Keys.UP:
				nextItem = this.getRelativeSelectableItem( highlightItem, -1 );
				handled = true;
				break;
			case OO.ui.Keys.DOWN:
				nextItem = this.getRelativeSelectableItem( highlightItem, 1 );
				handled = true;
				break;
			case OO.ui.Keys.ESCAPE:
				if ( highlightItem ) {
					highlightItem.setHighlighted( false );
				}
				this.toggle( false );
				handled = true;
				break;
		}

		if ( nextItem ) {
			this.highlightItem( nextItem );
			nextItem.scrollElementIntoView();
		}

		if ( handled ) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	}
};

/**
 * Bind key down listener.
 */
OO.ui.MenuWidget.prototype.bindKeyDownListener = function () {
	if ( this.$input ) {
		this.$input.on( 'keydown', this.onKeyDownHandler );
	} else {
		// Capture menu navigation keys
		this.getElementWindow().addEventListener( 'keydown', this.onKeyDownHandler, true );
	}
};

/**
 * Unbind key down listener.
 */
OO.ui.MenuWidget.prototype.unbindKeyDownListener = function () {
	if ( this.$input ) {
		this.$input.off( 'keydown' );
	} else {
		this.getElementWindow().removeEventListener( 'keydown', this.onKeyDownHandler, true );
	}
};

/**
 * Choose an item.
 *
 * This will close the menu when done, unlike selectItem which only changes selection.
 *
 * @param {OO.ui.OptionWidget} item Item to choose
 * @chainable
 */
OO.ui.MenuWidget.prototype.chooseItem = function ( item ) {
	var widget = this;

	// Parent method
	OO.ui.MenuWidget.super.prototype.chooseItem.call( this, item );

	if ( item && !this.flashing ) {
		this.flashing = true;
		item.flash().done( function () {
			widget.toggle( false );
			widget.flashing = false;
		} );
	} else {
		this.toggle( false );
	}

	return this;
};

/**
 * Add items.
 *
 * Adding an existing item (by value) will move it.
 *
 * @param {OO.ui.MenuItemWidget[]} items Items to add
 * @param {number} [index] Index to insert items after
 * @chainable
 */
OO.ui.MenuWidget.prototype.addItems = function ( items, index ) {
	var i, len, item;

	// Parent method
	OO.ui.MenuWidget.super.prototype.addItems.call( this, items, index );

	// Auto-initialize
	if ( !this.newItems ) {
		this.newItems = [];
	}

	for ( i = 0, len = items.length; i < len; i++ ) {
		item = items[i];
		if ( this.isVisible() ) {
			// Defer fitting label until
			item.fitLabel();
		} else {
			this.newItems.push( item );
		}
	}

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.MenuWidget.prototype.toggle = function ( visible ) {
	visible = ( visible === undefined ? !this.visible : !!visible ) && !!this.items.length;

	var i, len,
		change = visible !== this.isVisible();

	// Parent method
	OO.ui.MenuWidget.super.prototype.toggle.call( this, visible );

	if ( change ) {
		if ( visible ) {
			this.bindKeyDownListener();

			// Change focus to enable keyboard navigation
			if ( this.isolated && this.$input && !this.$input.is( ':focus' ) ) {
				this.$previousFocus = this.$( ':focus' );
				this.$input[0].focus();
			}
			if ( this.newItems && this.newItems.length ) {
				for ( i = 0, len = this.newItems.length; i < len; i++ ) {
					this.newItems[i].fitLabel();
				}
				this.newItems = null;
			}
			this.setClipping( true );

			// Auto-hide
			if ( this.autoHide ) {
				this.getElementDocument().addEventListener(
					'mousedown', this.onDocumentMouseDownHandler, true
				);
			}
		} else {
			this.unbindKeyDownListener();
			if ( this.isolated && this.$previousFocus ) {
				this.$previousFocus[0].focus();
				this.$previousFocus = null;
			}
			this.getElementDocument().removeEventListener(
				'mousedown', this.onDocumentMouseDownHandler, true
			);
			this.setClipping( false );
		}
	}

	return this;
};
