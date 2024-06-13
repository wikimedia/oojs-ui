/**
 * PopupTagMultiselectWidget is a {@link OO.ui.TagMultiselectWidget OO.ui.TagMultiselectWidget}
 * intended to use a popup. The popup can be configured to have a default input to insert values
 * into the widget.
 *
 *     @example
 *     // A PopupTagMultiselectWidget.
 *     const widget = new OO.ui.PopupTagMultiselectWidget();
 *     $( document.body ).append( widget.$element );
 *
 *     // Example: A PopupTagMultiselectWidget with an external popup.
 *     const popupInput = new OO.ui.TextInputWidget(),
 *         widget = new OO.ui.PopupTagMultiselectWidget( {
 *            popupInput: popupInput,
 *            popup: {
 *               $content: popupInput.$element
 *            }
 *         } );
 *     $( document.body ).append( widget.$element );
 *
 * @class
 * @extends OO.ui.TagMultiselectWidget
 * @mixes OO.ui.mixin.PopupElement
 *
 * @param {Object} config Configuration object
 * @param {jQuery} [config.$overlay] An overlay for the popup.
 *  See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
 * @param {Object} [config.popup] Configuration options for the popup
 * @param {OO.ui.InputWidget} [config.popupInput] An input widget inside the popup that will be
 *  focused when the popup is opened and will be used as replacement for the
 *  general input in the widget.
 * @deprecated
 */
OO.ui.PopupTagMultiselectWidget = function OoUiPopupTagMultiselectWidget( config ) {
	const defaultConfig = { popup: {} };

	config = config || {};

	// Parent constructor
	OO.ui.PopupTagMultiselectWidget.super.call( this, Object.assign( {
		inputPosition: 'none'
	}, config ) );

	this.$overlay = ( config.$overlay === true ?
		OO.ui.getDefaultOverlay() : config.$overlay ) || this.$element;

	if ( !config.popup ) {
		// For the default base implementation, we give a popup
		// with an input widget inside it. For any other use cases
		// the popup needs to be populated externally and the
		// event handled to add tags separately and manually
		const defaultInput = new OO.ui.TextInputWidget();

		defaultConfig.popupInput = defaultInput;
		defaultConfig.popup.$content = defaultInput.$element;
		defaultConfig.popup.padded = true;

		this.$element.addClass( 'oo-ui-popupTagMultiselectWidget-defaultPopup' );
	}

	// Add overlay, and add that to the autoCloseIgnore
	defaultConfig.popup.$overlay = this.$overlay;
	defaultConfig.popup.$autoCloseIgnore = this.hasInput ?
		this.input.$element.add( this.$overlay ) : this.$overlay;

	// Allow extending any of the above
	config = Object.assign( defaultConfig, config );

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
	this.on( 'resize', this.popup.updateDimensions.bind( this.popup ) );
	this.popup.connect( this, {
		toggle: 'onPopupToggle'
	} );
	this.$tabIndexed.on( 'focus', this.onFocus.bind( this ) );

	// Initialize
	this.$element
		.append( this.popup.$element )
		.addClass( 'oo-ui-popupTagMultiselectWidget' );

	// Deprecation warning
	OO.ui.warnDeprecation( 'PopupTagMultiselectWidget: Deprecated widget. Use MenuTagMultiselectWidget instead. See T208821.' );
};

/* Initialization */

OO.inheritClass( OO.ui.PopupTagMultiselectWidget, OO.ui.TagMultiselectWidget );
OO.mixinClass( OO.ui.PopupTagMultiselectWidget, OO.ui.mixin.PopupElement );

/* Methods */

/**
 * Focus event handler.
 *
 * @private
 */
OO.ui.PopupTagMultiselectWidget.prototype.onFocus = function () {
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
		OO.ui.PopupTagMultiselectWidget.super.prototype.onTagSelect.call( this, item );
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
