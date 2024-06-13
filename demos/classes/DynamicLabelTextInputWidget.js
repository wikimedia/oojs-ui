Demo.DynamicLabelTextInputWidget = function DemoDynamicLabelTextInputWidget( config ) {
	// Configuration initialization
	config = Object.assign( { getLabelText: function () {} }, config );
	// Parent constructor
	Demo.DynamicLabelTextInputWidget.super.call( this, config );
	// Properties
	this.getLabelText = config.getLabelText;
	// Events
	this.connect( this, {
		change: 'onChange'
	} );
	// Initialization
	this.setLabel( this.getLabelText( this.getValue() ) );
};
OO.inheritClass( Demo.DynamicLabelTextInputWidget, OO.ui.TextInputWidget );

Demo.DynamicLabelTextInputWidget.prototype.onChange = function ( value ) {
	this.setLabel( this.getLabelText( value ) );
};
