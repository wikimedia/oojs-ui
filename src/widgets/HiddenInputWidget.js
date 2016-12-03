/**
 * Data widget intended for creating 'hidden'-type inputs.
 *
 * @class
 * @extends OO.ui.Widget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [value=''] The value of the input.
 * @cfg {string} [name=''] The value of the input’s HTML `name` attribute.
 */
OO.ui.HiddenInputWidget = function OoUiHiddenInputWidget( config ) {
	// Configuration initialization
	config = $.extend( { value: '', name: '' }, config );

	// Parent constructor
	OO.ui.HiddenInputWidget.parent.call( this, config );

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
