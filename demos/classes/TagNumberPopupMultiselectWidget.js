Demo.TagNumberPopupMultiselectWidget = function DemoTagNumberPopupMultiselectWidget( config ) {
	// Properties
	this.tagPopupWidget = new OO.ui.NumberInputWidget( {
		isInteger: true
	} );

	// Parent constructor
	Demo.TagNumberPopupMultiselectWidget.super.call( this, Object.assign( {
		allowArbitrary: true,
		popup: {}
	}, config ) );

	// Events
	this.tagPopupWidget.connect( this, { enter: 'onPopupEnter' } );

	// Initialization
	this.popup.$body.append( this.tagPopupWidget.$element );
};

OO.inheritClass( Demo.TagNumberPopupMultiselectWidget, OO.ui.PopupTagMultiselectWidget );

Demo.TagNumberPopupMultiselectWidget.prototype.onPopupEnter = function () {
	const value = this.tagPopupWidget.getNumericValue();
	if ( !isNaN( value ) ) {
		this.addTag( value, String( value ) );
		this.tagPopupWidget.setValue( '' );
	}
};
