/**
 * Creates an OO.ui.CheckboxWidget object.
 *
 * @class
 * @extends OO.ui.CheckboxInputWidget
 * @mixins OO.ui.LabeledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [label=''] Label
 */
OO.ui.CheckboxWidget = function OoUiCheckboxWidget( config ) {
	config = config || {};

	// Parent constructors
	OO.ui.CheckboxInputWidget.call( this, config );
	OO.ui.LabeledElement.call( this, this.$( '<span>' ) , config );

	this.$( '<label>' ).append( this.$input, this.$label ).appendTo( this.$element );

	// Initialization
	this.$element.addClass( 'oo-ui-checkboxWidget' );
};

/* Inheritance */

OO.inheritClass( OO.ui.CheckboxWidget, OO.ui.CheckboxInputWidget );
OO.mixinClass( OO.ui.CheckboxWidget, OO.ui.LabeledElement );
