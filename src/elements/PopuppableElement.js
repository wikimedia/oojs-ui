/**
 * Popuppable element.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object} [popup] Configuration to pass to popup
 * @cfg {boolean} [autoClose=true] Popup auto-closes when it loses focus
 */
OO.ui.PopuppableElement = function OoUiPopuppableElement( config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.popup = new OO.ui.PopupWidget( $.extend(
		{ 'autoClose': true },
		config.popup,
		{ '$': this.$, '$autoCloseIgnore': this.$element }
	) );
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
