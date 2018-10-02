Demo.TagNumberPopupMultiselectWidget = function DemoTagNumberPopupMultiselectWidget( config ) {
	// Properties
	this.tagPopupWidget = new OO.ui.NumberInputWidget( {
		isInteger: true
	} );

	// Parent constructor
	Demo.TagNumberPopupMultiselectWidget.parent.call( this, $.extend( {}, config, {
		allowArbitrary: true,
		popup: {}
	} ) );

	// Events
	this.tagPopupWidget.connect( this, { enter: 'onPopupEnter' } );

	// Initialization
	this.popup.$body.append( this.tagPopupWidget.$element );
};

OO.inheritClass( Demo.TagNumberPopupMultiselectWidget, OO.ui.TagMultiselectWidget );

Demo.TagNumberPopupMultiselectWidget.prototype.onPopupEnter = function () {
	if ( !isNaN( this.tagPopupWidget.getNumericValue() ) ) {
		this.addItemsFromData( [ this.tagPopupWidget.getNumericValue() ] );
		this.tagPopupWidget.setValue( '' );
	}
};
