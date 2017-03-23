/**
 * PopupTagMultiselectWidget is a {@link OO.ui.TagMultiselectWidget OO.ui.TagMultiselectWidget} intended
 * to use a popup. The popup can be configured to have a default input to insert values into the widget.
 *
 * For more information about menus and options, please see the [OOjs UI documentation on MediaWiki][1].
 *
 *     @example
 *     // Example: A basic PopupTagMultiselectWidget.
 *     var widget = new OO.ui.PopupTagMultiselectWidget();
 *     $( 'body' ).append( widget.$element );
 *
 *     // Example: A PopupTagMultiselectWidget with an external popup.
 *     var popupInput = new OO.ui.TextInputWidget(),
 *         widget = new OO.ui.PopupTagMultiselectWidget( {
 *            popupInput: popupInput,
 *            popup: {
 *               $content: popupInput.$element
 *            }
 *         } );
 *     $( 'body' ).append( widget.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Selects_and_Options#Menu_selects_and_options
 *
 * @class
 * @extends OO.ui.TagMultiselectWidget
 * @mixins OO.ui.mixin.PopupElement
 *
 * @param {Object} config Configuration object
 * @cfg {jQuery} [$overlay] An overlay for the popup
 * @cfg {Object} [popup] Configuration options for the popup
 * @cfg {OO.ui.InputWidget} [popupInput] An input widget inside the popup that will be
 *  focused when the popup is opened and will be used as replacement for the
 *  general input in the widget.
 */
OO.ui.PopupTagMultiselectWidget = function OoUiPopupTagMultiselectWidget( config ) {
	var defaultInput,
		defaultConfig = { popup: {} };

	config = config || {};

	// Parent constructor
	OO.ui.PopupTagMultiselectWidget.parent.call( this, $.extend( { inputPosition: 'none' }, config ) );

	this.$overlay = config.$overlay || this.$element;

	if ( !config.popup ) {
		// For the default base implementation, we give a popup
		// with an input widget inside it. For any other use cases
		// the popup needs to be populated externally and the
		// event handled to add tags separately and manually
		defaultInput = new OO.ui.TextInputWidget();

		defaultConfig.popupInput = defaultInput;
		defaultConfig.popup.$content = defaultInput.$element;

		this.$element.addClass( 'oo-ui-popupTagMultiselectWidget-defaultPopup' );
	}

	// Add overlay, and add that to the autoCloseIgnore
	defaultConfig.popup.$overlay = this.$overlay;
	defaultConfig.popup.$autoCloseIgnore = this.hasInput ?
		this.input.$element.add( this.$overlay ) : this.$overlay;

	// Allow extending any of the above
	config = $.extend( defaultConfig, config );

	// Mixin constructors
	OO.ui.mixin.PopupElement.call( this, config );

	if ( this.hasInput ) {
		this.input.$input.on( 'focus', this.popup.toggle.bind( this.popup, true ) );
	}

	// Configuration options
	this.popupInput = config.popupInput;
	if ( this.popupInput ) {
		this.popupInput.connect( this, {
			enter: 'onPopupInputEnter'
		} );
	}

	// Events
	this.popup.connect( this, { toggle: 'onPopupToggle' } );
	this.$tabIndexed
		.on( 'focus', this.focus.bind( this ) );

	// Initialize
	this.$element
		.append( this.popup.$element )
		.addClass( 'oo-ui-popupTagMultiselectWidget' );
};

/* Initialization */

OO.inheritClass( OO.ui.PopupTagMultiselectWidget, OO.ui.TagMultiselectWidget );
OO.mixinClass( OO.ui.PopupTagMultiselectWidget, OO.ui.mixin.PopupElement );

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.PopupTagMultiselectWidget.prototype.focus = function () {
	// Since the parent deals with input focus, only
	// call the parent method if our input isn't in the
	// popup
	if ( !this.popupInput ) {
		// Parent method
		OO.ui.PopupTagMultiselectWidget.parent.prototype.focus.call( this );
	}

	this.popup.toggle( true );
};

/**
 * Respond to popup toggle event
 *
 * @param {boolean} isVisible Popup is visible
 */
OO.ui.PopupTagMultiselectWidget.prototype.onPopupToggle = function ( isVisible ) {
	if ( isVisible && this.popupInput ) {
		this.popupInput.focus();
	}
};

/**
 * Respond to popup input enter event
 */
OO.ui.PopupTagMultiselectWidget.prototype.onPopupInputEnter = function () {
	if ( this.popupInput ) {
		this.addTagByPopupValue( this.popupInput.getValue() );
		this.popupInput.setValue( '' );
	}
};

/**
 * @inheritdoc
 */
OO.ui.PopupTagMultiselectWidget.prototype.onTagSelect = function ( item ) {
	if ( this.popupInput && this.allowEditTags ) {
		this.popupInput.setValue( item.getData() );
		this.removeItems( [ item ] );

		this.popup.toggle( true );
		this.popupInput.focus();
	} else {
		// Parent
		OO.ui.PopupTagMultiselectWidget.parent.prototype.onTagSelect.call( this, item );
	}
};

/**
 * Add a tag by the popup value.
 * Whatever is responsible for setting the value in the popup should call
 * this method to add a tag, or use the regular methods like #addTag or
 * #setValue directly.
 *
 * @param {string} data The value of item
 * @param {string} [label] The label of the tag. If not given, the data is used.
 */
OO.ui.PopupTagMultiselectWidget.prototype.addTagByPopupValue = function ( data, label ) {
	this.addTag( data, label );
};
