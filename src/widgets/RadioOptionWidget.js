/**
 * Option widget that looks like a radio button.
 *
 * Use together with OO.ui.RadioSelectWidget.
 *
 * @class
 * @extends OO.ui.OptionWidget
 * @mixins OO.ui.ButtonElement
 *
 * @constructor
 * @param {Mixed} data Option data
 * @param {Object} [config] Configuration options
 */
OO.ui.RadioOptionWidget = function OoUiRadioOptionWidget( data, config ) {
	// Parent constructor
	OO.ui.RadioOptionWidget.super.call( this, data, config );

	// Properties
	this.radio = new OO.ui.RadioInputWidget( { value: data } );

	// Initialization
	this.$element
		.addClass( 'oo-ui-radioOptionWidget' )
		.prepend( this.radio.$element );
};

/* Setup */

OO.inheritClass( OO.ui.RadioOptionWidget, OO.ui.OptionWidget );

/* Static Properties */

OO.ui.RadioOptionWidget.static.highlightable = false;

OO.ui.RadioOptionWidget.static.pressable = false;

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.RadioOptionWidget.prototype.setSelected = function ( state ) {
	OO.ui.RadioOptionWidget.super.prototype.setSelected.call( this, state );

	this.radio.setSelected( state );

	return this;
};
