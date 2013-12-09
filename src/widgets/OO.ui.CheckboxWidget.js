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
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.CheckboxInputWidget.call( this, config );

	// Mixin constructors
	OO.ui.LabeledElement.call( this, this.$( '<span>' ) , config );

	// Initialization
	this.$element
		.addClass( 'oo-ui-checkboxWidget' )
		.append( this.$( '<label>' ).append( this.$input, this.$label ) );
};

/* Inheritance */

OO.inheritClass( OO.ui.CheckboxWidget, OO.ui.CheckboxInputWidget );

OO.mixinClass( OO.ui.CheckboxWidget, OO.ui.LabeledElement );
