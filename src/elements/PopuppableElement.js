/**
 * Popuppable element.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {number} [popupWidth=320] Width of popup
 * @cfg {number} [popupHeight] Height of popup
 * @cfg {Object} [popup] Configuration to pass to popup
 */
OO.ui.PopuppableElement = function OoUiPopuppableElement( config ) {
	// Configuration initialization
	config = $.extend( { 'popupWidth': 320 }, config );

	// Properties
	this.popup = new OO.ui.PopupWidget( $.extend(
		{ 'align': 'center', 'autoClose': true },
		config.popup,
		{ '$': this.$, '$autoCloseIgnore': this.$element }
	) );
	this.popupWidth = config.popupWidth;
	this.popupHeight = config.popupHeight;
};

/* Methods */

/**
 * Get popup.
 *
 * @return {OO.ui.PopupWidget} Popup widget
 */
OO.ui.PopuppableElement.prototype.getPopup = function () {
	return this.popup;
};

/**
 * Show popup.
 */
OO.ui.PopuppableElement.prototype.showPopup = function () {
	this.popup.show().display( this.popupWidth, this.popupHeight );
};

/**
 * Hide popup.
 */
OO.ui.PopuppableElement.prototype.hidePopup = function () {
	this.popup.hide();
};
