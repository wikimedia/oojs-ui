/**
 * Label widget.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.LabelElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.LabelWidget = function OoUiLabelWidget( config ) {
	// Config intialization
	config = config || {};

	// Parent constructor
	OO.ui.LabelWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.LabelElement.call( this, $.extend( {}, config, { $label: this.$element } ) );
	OO.ui.TitledElement.call( this, config );

	// Properties
	this.input = config.input;

	// Events
	if ( this.input instanceof OO.ui.InputWidget ) {
		this.$element.on( 'click', OO.ui.bind( this.onClick, this ) );
	}

	// Initialization
	this.$element.addClass( 'oo-ui-labelWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.LabelWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.LabelWidget, OO.ui.LabelElement );
OO.mixinClass( OO.ui.LabelWidget, OO.ui.TitledElement );

/* Static Properties */

OO.ui.LabelWidget.static.tagName = 'span';

/* Methods */

/**
 * Handles label mouse click events.
 *
 * @param {jQuery.Event} e Mouse click event
 */
OO.ui.LabelWidget.prototype.onClick = function () {
	this.input.simulateLabelClick();
	return false;
};
