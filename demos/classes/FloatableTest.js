Demo.FloatableTest = function DemoFloatableTest( config ) {
	// Parent constructor
	Demo.FloatableTest.super.call( this, config );
	// Properties
	// Must be equal to dialog width and height
	this.viewportSize = 500;
	// Width and height of scrollable area
	this.outerSize = 1000;
	// Width and height of scrollable container
	this.innerSize = 400;
};
OO.inheritClass( Demo.FloatableTest, OO.ui.ProcessDialog );
Demo.FloatableTest.static.title = 'FloatableElement test';
Demo.FloatableTest.static.actions = [
	{ action: '', label: 'Cancel', flags: [ 'safe', 'close' ] },
	{ action: 'center', label: 'Center view' }
];
Demo.FloatableTest.prototype.getBodyHeight = function () {
	return this.viewportSize;
};
Demo.FloatableTest.prototype.initialize = function () {
	Demo.FloatableTest.super.prototype.initialize.apply( this, arguments );

	this.$container = $( '<div>' ).css( { width: this.outerSize, height: this.outerSize } );
	this.selectWidget = new Demo.PositionSelectWidget();
	this.toggleOverlayWidget = new OO.ui.ToggleSwitchWidget( { value: true } );
	this.toggleClippingWidget = new OO.ui.ToggleSwitchWidget( { value: false } );
	this.toggleSpacingWidget = new OO.ui.ToggleSwitchWidget( { value: false } );

	this.$floatableContainer = $( '<div>' ).css( { width: this.innerSize, height: this.innerSize } );
	this.floatable = new Demo.FloatableWidget( { $floatableContainer: this.$floatableContainer } );
	this.floatable.toggle( false );

	this.floatable.$element.addClass( 'demo-floatableTest-floatable' );
	this.$floatableContainer.addClass( 'demo-floatableTest-container' );

	this.selectWidget.connect( this, {
		select: 'onSelectPosition'
	} );
	this.toggleOverlayWidget.connect( this, {
		change: 'onToggleOverlay'
	} );
	this.toggleClippingWidget.connect( this, {
		change: 'onToggleClipping'
	} );
	this.toggleSpacingWidget.connect( this, {
		change: 'onToggleSpacing'
	} );

	this.fieldset = new OO.ui.FieldsetLayout( {
		items: [
			new OO.ui.FieldLayout( this.selectWidget, {
				align: 'top',
				label: 'Floatable position'
			} ),
			new OO.ui.FieldLayout( this.toggleClippingWidget, {
				align: 'inline',
				label: 'Enable clipping'
			} ),
			new OO.ui.FieldLayout( this.toggleOverlayWidget, {
				align: 'inline',
				label: 'Use overlay'
			} ),
			new OO.ui.FieldLayout( this.toggleSpacingWidget, {
				align: 'inline',
				label: '5px outside spacing'
			} )
		]
	} );

	this.$body.append(
		this.$container.append(
			this.$floatableContainer.append( this.fieldset.$element )
		)
	);
	this.$overlay.append( this.floatable.$element );
};
Demo.FloatableTest.prototype.onSelectPosition = function ( option ) {
	this.floatable.setHorizontalPosition( option.getData().horizontalPosition );
	this.floatable.setVerticalPosition( option.getData().verticalPosition );
};
Demo.FloatableTest.prototype.onToggleOverlay = function ( useOverlay ) {
	this.floatable.togglePositioning( false );
	this.floatable.toggleClipping( false );
	( useOverlay ? this.$overlay : this.$container ).append( this.floatable.$element );
	this.floatable.togglePositioning( true );
	this.floatable.toggleClipping( this.toggleClippingWidget.getValue() );
};
Demo.FloatableTest.prototype.onToggleClipping = function ( useClipping ) {
	this.floatable.toggleClipping( useClipping );
};
Demo.FloatableTest.prototype.onToggleSpacing = function ( useSpacing ) {
	this.floatable.spacing = useSpacing ? 5 : 0;
	this.floatable.position();
};
Demo.FloatableTest.prototype.centerView = function () {
	const offset = ( this.outerSize - this.viewportSize ) / 2,
		dir = this.getDir() === 'rtl' ? -1 : 1;
	this.$body[ 0 ].scrollTop = offset;
	OO.ui.Element.static.setScrollLeft( this.$body[ 0 ], offset * dir );
};
Demo.FloatableTest.prototype.getSetupProcess = function () {
	return Demo.FloatableTest.super.prototype.getSetupProcess.call( this ).next( () => {
		const offset = ( this.outerSize - this.innerSize ) / 2;
		const side = this.getDir() === 'rtl' ? 'right' : 'left';
		this.$floatableContainer.css( 'top', offset );
		this.$floatableContainer.css( side, offset );

		this.selectWidget.selectItemByData( {
			horizontalPosition: 'start',
			verticalPosition: 'below'
		} );
	} );
};
Demo.FloatableTest.prototype.getReadyProcess = function () {
	return new OO.ui.Process( () => {
		this.centerView();
		this.floatable.toggle( true );
		this.floatable.togglePositioning( true );
		this.floatable.toggleClipping( this.toggleClippingWidget.getValue() );
	} );
};
Demo.FloatableTest.prototype.getHoldProcess = function () {
	return new OO.ui.Process( () => {
		this.floatable.toggleClipping( false );
		this.floatable.togglePositioning( false );
		this.floatable.toggle( false );
	} );
};
Demo.FloatableTest.prototype.getActionProcess = function ( action ) {
	if ( action === 'center' ) {
		return new OO.ui.Process( () => {
			this.centerView();
		} );
	}
	return Demo.FloatableTest.super.prototype.getActionProcess.call( this, action );
};
