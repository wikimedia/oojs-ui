/**
 * PopupButtonWidgets toggle the visibility of a contained {@link OO.ui.PopupWidget PopupWidget},
 * which is used to display additional information or options.
 *
 *     @example
 *     // Example of a popup button.
 *     var popupButton = new OO.ui.PopupButtonWidget( {
 *         label: 'Popup button with options',
 *         icon: 'menu',
 *         popup: {
 *             $content: $( '<p>Additional options here.</p>' ),
 *             padded: true,
 *             align: 'force-left'
 *         }
 *     } );
 *     // Append the button to the DOM.
 *     $( 'body' ).append( popupButton.$element );
 *
 * @class
 * @extends OO.ui.ButtonWidget
 * @mixins OO.ui.mixin.PopupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$overlay] Render the popup into a separate layer. This configuration is useful in cases where
 *  the expanded popup is larger than its containing `<div>`. The specified overlay layer is usually on top of the
 *  containing `<div>` and has a larger area. By default, the popup uses relative positioning.
 */
OO.ui.PopupButtonWidget = function OoUiPopupButtonWidget( config ) {
	// Parent constructor
	OO.ui.PopupButtonWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.PopupElement.call( this, config );

	// Properties
	this.$overlay = config.$overlay || this.$element;

	// Events
	this.connect( this, { click: 'onAction' } );

	// Initialization
	this.$element
		.addClass( 'oo-ui-popupButtonWidget' )
		.attr( 'aria-haspopup', 'true' );
	this.popup.$element
		.addClass( 'oo-ui-popupButtonWidget-popup' )
		.toggleClass( 'oo-ui-popupButtonWidget-framed-popup', this.isFramed() )
		.toggleClass( 'oo-ui-popupButtonWidget-frameless-popup', !this.isFramed() );
	this.$overlay.append( this.popup.$element );
};

/* Setup */

OO.inheritClass( OO.ui.PopupButtonWidget, OO.ui.ButtonWidget );
OO.mixinClass( OO.ui.PopupButtonWidget, OO.ui.mixin.PopupElement );

/* Methods */

/**
 * Handle the button action being triggered.
 *
 * @private
 */
OO.ui.PopupButtonWidget.prototype.onAction = function () {
	this.popup.toggle();
};
