/**
 * Label widget.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.LabeledElement
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
	OO.ui.LabeledElement.call( this, this.$element, config );

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
OO.mixinClass( OO.ui.LabelWidget, OO.ui.LabeledElement );

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
