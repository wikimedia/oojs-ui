/**
 * DropdownWidgets are not menus themselves, rather they contain a menu of options created with
 * OO.ui.MenuOptionWidget. The DropdownWidget takes care of opening and displaying the menu so that
 * users can interact with it.
 *
 * If you want to use this within an HTML form, such as a OO.ui.FormLayout, use
 * OO.ui.DropdownInputWidget instead.
 *
 *     @example
 *     // A DropdownWidget with a menu that contains three options.
 *     var dropDown = new OO.ui.DropdownWidget( {
 *         label: 'Dropdown menu: Select a menu option',
 *         menu: {
 *             items: [
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'a',
 *                     label: 'First'
 *                 } ),
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'b',
 *                     label: 'Second'
 *                 } ),
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'c',
 *                     label: 'Third'
 *                 } )
 *             ]
 *         }
 *     } );
 *
 *     $( document.body ).append( dropDown.$element );
 *
 *     dropDown.getMenu().selectItemByData( 'b' );
 *
 *     dropDown.getMenu().findSelectedItem().getData(); // Returns 'b'.
 *
 * For more information, please see the [OOUI documentation on MediaWiki] [1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Selects_and_Options#Menu_selects_and_options
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.TitledElement
 * @mixins OO.ui.mixin.TabIndexedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object} [menu] Configuration options to pass to
 *  {@link OO.ui.MenuSelectWidget menu select widget}.
 * @cfg {jQuery|boolean} [$overlay] Render the menu into a separate layer. This configuration is
 *  useful in cases where the expanded menu is larger than its containing `<div>`. The specified
 *  overlay layer is usually on top of the containing `<div>` and has a larger area. By default,
 *  the menu uses relative positioning. Pass 'true' to use the default overlay.
 *  See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
 */
OO.ui.DropdownWidget = function OoUiDropdownWidget( config ) {
	// Configuration initialization
	config = $.extend( { indicator: 'down' }, config );

	// Parent constructor
	OO.ui.DropdownWidget.parent.call( this, config );

	// Properties (must be set before TabIndexedElement constructor call)
	this.$handle = $( '<span>' );
	this.$overlay = ( config.$overlay === true ?
		OO.ui.getDefaultOverlay() : config.$overlay ) || this.$element;

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.TitledElement.call( this, $.extend( {
		$titled: this.$label
	}, config ) );
	OO.ui.mixin.TabIndexedElement.call( this, $.extend( {
		$tabIndexed: this.$handle
	}, config ) );

	// Properties
	this.menu = new OO.ui.MenuSelectWidget( $.extend( {
		widget: this,
		$floatableContainer: this.$element
	}, config.menu ) );

	// Events
	this.$handle.on( {
		click: this.onClick.bind( this ),
		keydown: this.onKeyDown.bind( this ),
		// Hack? Handle type-to-search when menu is not expanded and not handling its own events.
		keypress: this.menu.onDocumentKeyPressHandler,
		blur: this.menu.clearKeyPressBuffer.bind( this.menu )
	} );
	this.menu.connect( this, {
		select: 'onMenuSelect',
		toggle: 'onMenuToggle'
	} );

	// Initialization
	this.$label
		.attr( {
			role: 'textbox',
			'aria-readonly': 'true'
		} );
	this.$handle
		.addClass( 'oo-ui-dropdownWidget-handle' )
		.append( this.$icon, this.$label, this.$indicator )
		.attr( {
			role: 'combobox',
			'aria-autocomplete': 'list',
			'aria-expanded': 'false',
			'aria-haspopup': 'true',
			'aria-owns': this.menu.getElementId()
		} );
	this.$element
		.addClass( 'oo-ui-dropdownWidget' )
		.append( this.$handle );
	this.$overlay.append( this.menu.$element );
};

/* Setup */

OO.inheritClass( OO.ui.DropdownWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.DropdownWidget, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.DropdownWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.DropdownWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.DropdownWidget, OO.ui.mixin.TitledElement );
OO.mixinClass( OO.ui.DropdownWidget, OO.ui.mixin.TabIndexedElement );

/* Methods */

/**
 * Get the menu.
 *
 * @return {OO.ui.MenuSelectWidget} Menu of widget
 */
OO.ui.DropdownWidget.prototype.getMenu = function () {
	return this.menu;
};

/**
 * Handles menu select events.
 *
 * @private
 * @param {OO.ui.MenuOptionWidget} item Selected menu item
 */
OO.ui.DropdownWidget.prototype.onMenuSelect = function ( item ) {
	var selectedLabel;

	if ( !item ) {
		this.setLabel( null );
		return;
	}

	selectedLabel = item.getLabel();

	// If the label is a DOM element, clone it, because setLabel will append() it
	if ( selectedLabel instanceof $ ) {
		selectedLabel = selectedLabel.clone();
	}

	this.setLabel( selectedLabel );
};

/**
 * Handle menu toggle events.
 *
 * @private
 * @param {boolean} isVisible Open state of the menu
 */
OO.ui.DropdownWidget.prototype.onMenuToggle = function ( isVisible ) {
	this.$element.toggleClass( 'oo-ui-dropdownWidget-open', isVisible );
};

/**
 * Handle mouse click events.
 *
 * @private
 * @param {jQuery.Event} e Mouse click event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.DropdownWidget.prototype.onClick = function ( e ) {
	if ( !this.isDisabled() && e.which === OO.ui.MouseButtons.LEFT ) {
		this.menu.toggle();
	}
	return false;
};

/**
 * Handle key down events.
 *
 * @private
 * @param {jQuery.Event} e Key down event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.DropdownWidget.prototype.onKeyDown = function ( e ) {
	if (
		!this.isDisabled() &&
		(
			e.which === OO.ui.Keys.ENTER ||
			(
				e.which === OO.ui.Keys.SPACE &&
				// Avoid conflicts with type-to-search, see SelectWidget#onKeyPress.
				// Space only closes the menu is the user is not typing to search.
				this.menu.keyPressBuffer === ''
			) ||
			(
				!this.menu.isVisible() &&
				(
					e.which === OO.ui.Keys.UP ||
					e.which === OO.ui.Keys.DOWN
				)
			)
		)
	) {
		this.menu.toggle();
		return false;
	}
};
