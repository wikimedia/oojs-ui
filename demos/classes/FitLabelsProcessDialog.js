Demo.FitLabelsProcessDialog = function DemoLongProcessDialog( config ) {
	Demo.FitLabelsProcessDialog.parent.call( this, config );
};
OO.inheritClass( Demo.FitLabelsProcessDialog, OO.ui.ProcessDialog );
Demo.FitLabelsProcessDialog.static.actions = [
	{ action: 'save', modes: [ 'short' ], label: 'Apply changes', flags: [ 'primary', 'progressive' ] },
	{ action: 'save', modes: [ 'long' ], label: 'Apply changes (demo of a long action label)', flags: [ 'primary', 'progressive' ] },
	{ action: 'cancel', modes: [ 'short', 'long' ], label: 'Cancel', flags: [ 'safe', 'back' ] }
];
Demo.FitLabelsProcessDialog.prototype.initialize = function () {
	var shortTitle = 'Process dialog',
		longTitle = 'Process dialog (demo of a long title label)';

	Demo.FitLabelsProcessDialog.parent.prototype.initialize.apply( this, arguments );

	this.longActionToggle = new OO.ui.ToggleSwitchWidget();
	this.longTitleToggle = new OO.ui.ToggleSwitchWidget();

	this.longActionToggle.on( 'change', function ( isLong ) {
		this.actions.setMode( isLong ? 'long' : 'short' );
	}.bind( this ) );
	this.longTitleToggle.on( 'change', function ( isLong ) {
		this.title.setLabel( isLong ? longTitle : shortTitle );
	}.bind( this ) );

	this.fieldset = new OO.ui.FieldsetLayout( {
		items: [
			new OO.ui.FieldLayout( this.longActionToggle, {
				label: 'Use long action label'
			} ),
			new OO.ui.FieldLayout( this.longTitleToggle, {
				label: 'Use long title label'
			} )
		]
	} );

	this.content = new OO.ui.PanelLayout( { padded: true, expanded: false } );
	this.content.$element.append( this.fieldset.$element );
	this.$body.append( this.content.$element );
};
Demo.FitLabelsProcessDialog.prototype.getSetupProcess = function ( data ) {
	return Demo.FitLabelsProcessDialog.parent.prototype.getSetupProcess.call( this, data )
		.next( function () {
			this.longActionToggle.setValue( false );
			this.longTitleToggle.setValue( false );
			this.actions.setMode( 'short' );
			this.title.setLabel( 'Process dialog' );
		}, this );
};
Demo.FitLabelsProcessDialog.prototype.getActionProcess = function ( action ) {
	var dialog = this;
	if ( action ) {
		return new OO.ui.Process( function () {
			dialog.close( { action: action } );
		} );
	}
	return Demo.FitLabelsProcessDialog.parent.prototype.getActionProcess.call( this, action );
};

Demo.FitLabelsProcessDialog.prototype.getBodyHeight = function () {
	return this.content.$element.outerHeight( true );
};
