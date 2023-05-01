/**
 * Data widget intended for creating `<input type="hidden">` inputs.
 *
 * @class
 * @extends OO.ui.Widget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {string} [config.value=''] The value of the input.
 * @param {string} [config.name=''] The value of the input’s HTML `name` attribute.
 */
OO.ui.HiddenInputWidget = function OoUiHiddenInputWidget( config ) {
	// Configuration initialization
	config = $.extend( { value: '', name: '' }, config );

	// Parent constructor
	OO.ui.HiddenInputWidget.super.call( this, config );

	// Initialization
	this.$element.attr( {
		type: 'hidden',
		value: config.value,
		name: config.name
	} );
	this.$element.removeAttr( 'aria-disabled' );
};

/* Setup */

OO.inheritClass( OO.ui.HiddenInputWidget, OO.ui.Widget );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.HiddenInputWidget.static.tagName = 'input';
