Demo.OutlinedBookletDialog = function DemoOutlinedBookletDialog( config ) {
	Demo.OutlinedBookletDialog.super.call( this, config );
};
OO.inheritClass( Demo.OutlinedBookletDialog, OO.ui.ProcessDialog );
Demo.OutlinedBookletDialog.static.title = 'Outlined booklet dialog';
Demo.OutlinedBookletDialog.static.actions = [
	{ action: 'save', label: 'Done', flags: [ 'primary', 'progressive' ] },
	{ action: 'cancel', label: 'Cancel', flags: [ 'safe', 'close' ] },
	{ action: 'toggle', label: 'Toggle menu' }
];
Demo.OutlinedBookletDialog.prototype.getBodyHeight = function () {
	return 250;
};
Demo.OutlinedBookletDialog.prototype.initialize = function () {
	Demo.OutlinedBookletDialog.super.prototype.initialize.apply( this, arguments );
	this.bookletLayout = new OO.ui.BookletLayout( {
		outlined: true
	} );
	this.pages = [
		new Demo.SamplePage( 'small', { label: 'Small', icon: 'window' } ),
		new Demo.SamplePage( 'medium', { label: 'Medium', icon: 'window' } ),
		new Demo.SamplePage( 'large', { label: 'Large', icon: 'window' } ),
		new Demo.SamplePage( 'larger', { label: 'Larger', icon: 'window' } ),
		new Demo.SamplePage( 'full', { label: 'Full', icon: 'window' } )
	];

	this.bookletLayout.addPages( this.pages );
	this.bookletLayout.connect( this, {
		set: 'onBookletLayoutSet'
	} );
	this.$body.append( this.bookletLayout.$element );
};
Demo.OutlinedBookletDialog.prototype.getActionProcess = function ( action ) {
	if ( action === 'toggle' ) {
		this.bookletLayout.toggleOutline();
	} else if ( action ) {
		return new OO.ui.Process( () => {
			this.close( { action: action } );
		} );
	}
	return Demo.OutlinedBookletDialog.super.prototype.getActionProcess.call( this, action );
};
Demo.OutlinedBookletDialog.prototype.onBookletLayoutSet = function ( page ) {
	this.setSize( page.getName() );
};
Demo.OutlinedBookletDialog.prototype.getSetupProcess = function ( data ) {
	return Demo.OutlinedBookletDialog.super.prototype.getSetupProcess.call( this, data )
		.next( () => {
			this.bookletLayout.setPage( this.getSize() );
		} );
};
