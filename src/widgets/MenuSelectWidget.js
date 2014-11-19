/**
 * Overlaid menu of options.
 *
 * Menus are clipped to the visible viewport. They do not provide a control for opening or closing
 * the menu.
 *
 * Use together with OO.ui.MenuOptionWidget.
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
OO.ui.MenuSelectWidget = function OoUiMenuSelectWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.MenuSelectWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.ClippableElement.call( this, $.extend( {}, config, { $clippable: this.$group } ) );

	// Properties
	this.flashing = false;
	this.visible = false;
	this.newItems = null;
	this.autoHide = config.autoHide === undefined || !!config.autoHide;
	this.$input = config.input ? config.input.$input : null;
	this.$widget = config.widget ? config.widget.$element : null;
	this.$previousFocus = null;
	this.isolated = !config.input;
	this.onKeyDownHandler = this.onKeyDown.bind( this );
	this.onDocumentMouseDownHandler = this.onDocumentMouseDown.bind( this );

	// Initialization
	this.$element
		.hide()
		.attr( 'role', 'menu' )
		.addClass( 'oo-ui-menuSelectWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.MenuSelectWidget, OO.ui.SelectWidget );
OO.mixinClass( OO.ui.MenuSelectWidget, OO.ui.ClippableElement );

/* Methods */

/**
 * Handles document mouse down events.
 *
 * @param {jQuery.Event} e Key down event
 */
OO.ui.MenuSelectWidget.prototype.onDocumentMouseDown = function ( e ) {
	if (
		!OO.ui.contains( this.$element[0], e.target, true ) &&
		( !this.$widget || !OO.ui.contains( this.$widget[0], e.target, true ) )
	) {
		this.toggle( false );
	}
};

/**
 * Handles key down events.
 *
 * @param {jQuery.Event} e Key down event
 */
OO.ui.MenuSelectWidget.prototype.onKeyDown = function ( e ) {
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
OO.ui.MenuSelectWidget.prototype.bindKeyDownListener = function () {
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
OO.ui.MenuSelectWidget.prototype.unbindKeyDownListener = function () {
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
OO.ui.MenuSelectWidget.prototype.chooseItem = function ( item ) {
	var widget = this;

	// Parent method
	OO.ui.MenuSelectWidget.super.prototype.chooseItem.call( this, item );

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
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.addItems = function ( items, index ) {
	var i, len, item;

	// Parent method
	OO.ui.MenuSelectWidget.super.prototype.addItems.call( this, items, index );

	// Auto-initialize
	if ( !this.newItems ) {
		this.newItems = [];
	}

	for ( i = 0, len = items.length; i < len; i++ ) {
		item = items[i];
		if ( this.isVisible() ) {
			// Defer fitting label until item has been attached
			item.fitLabel();
		} else {
			this.newItems.push( item );
		}
	}

	// Reevaluate clipping
	this.clip();

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.removeItems = function ( items ) {
	// Parent method
	OO.ui.MenuSelectWidget.super.prototype.removeItems.call( this, items );

	// Reevaluate clipping
	this.clip();

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.clearItems = function () {
	// Parent method
	OO.ui.MenuSelectWidget.super.prototype.clearItems.call( this );

	// Reevaluate clipping
	this.clip();

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.MenuSelectWidget.prototype.toggle = function ( visible ) {
	visible = ( visible === undefined ? !this.visible : !!visible ) && !!this.items.length;

	var i, len,
		change = visible !== this.isVisible(),
		elementDoc = this.getElementDocument(),
		widgetDoc = this.$widget ? this.$widget[0].ownerDocument : null;

	// Parent method
	OO.ui.MenuSelectWidget.super.prototype.toggle.call( this, visible );

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
			this.toggleClipping( true );

			// Auto-hide
			if ( this.autoHide ) {
				elementDoc.addEventListener(
					'mousedown', this.onDocumentMouseDownHandler, true
				);
				// Support $widget being in a different document
				if ( widgetDoc && widgetDoc !== elementDoc ) {
					widgetDoc.addEventListener(
						'mousedown', this.onDocumentMouseDownHandler, true
					);
				}
			}
		} else {
			this.unbindKeyDownListener();
			if ( this.isolated && this.$previousFocus ) {
				this.$previousFocus[0].focus();
				this.$previousFocus = null;
			}
			elementDoc.removeEventListener(
				'mousedown', this.onDocumentMouseDownHandler, true
			);
			// Support $widget being in a different document
			if ( widgetDoc && widgetDoc !== elementDoc ) {
				widgetDoc.removeEventListener(
					'mousedown', this.onDocumentMouseDownHandler, true
				);
			}
			this.toggleClipping( false );
		}
	}

	return this;
};
