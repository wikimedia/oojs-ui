/**
 * Mixin for widgets with a boolean state.
 *
 * @class
 * @abstract
 *
 * @constructor
 * @cfg {boolean} [value=false] Initial value
 * @cfg {string} [label] Label for on and off states
 * @cfg {string} [onLabel='On'] Label for on state
 * @cfg {string} [offLabel='Off'] Label for off state
 */
OO.ui.ToggleWidget = function OoUiToggleWidget( config ) {
	// Configuration initialization
	config = $.extend( {
		'onLabel': OO.ui.msg( 'ooui-toggle-on' ),
		'offLabel': OO.ui.msg( 'ooui-toggle-off' )
	}, config );

	// Properties
	this.value = null;
	this.$onLabel = this.$( '<span>' );
	this.$offLabel = this.$( '<span>' );

	// Initialization
	this.$element.addClass( 'oo-ui-toggleWidget' );
	this.$onLabel
		.addClass( 'oo-ui-toggleWidget-label oo-ui-toggleWidget-label-on' )
		.text( config.label || config.onLabel || '' );
	this.$offLabel
		.addClass( 'oo-ui-toggleWidget-label oo-ui-toggleWidget-label-off' )
		.text( config.label || config.offLabel || '' );
	this.setValue( !!config.value );
};

/* Events */

/**
 * @event change
 * @param {boolean} value Changed value
 */

/* Methods */

/**
 * Get the value of the toggle.
 *
 * @method
 * @returns {boolean} Toggle value
 */
OO.ui.ToggleWidget.prototype.getValue = function () {
	return this.value;
};

/**
 * Set the value of the toggle.
 *
 * @method
 * @param {boolean} value New value
 * @fires change
 * @chainable
 */
OO.ui.ToggleWidget.prototype.setValue = function ( value ) {
	value = !!value;
	if ( this.value !== value ) {
		this.value = value;
		this.$element
			.toggleClass( 'oo-ui-toggleWidget-on', value )
			.toggleClass( 'oo-ui-toggleWidget-off', !value );
		this.emit( 'change', value );
	}
	return this;
};
