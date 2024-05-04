Demo.SearchWidgetDialog = function DemoSearchWidgetDialog( config ) {
	Demo.SearchWidgetDialog.super.call( this, config );
	this.broken = false;
};
OO.inheritClass( Demo.SearchWidgetDialog, OO.ui.ProcessDialog );
Demo.SearchWidgetDialog.static.title = 'Search widget dialog';
Demo.SearchWidgetDialog.prototype.initialize = function () {
	Demo.SearchWidgetDialog.super.prototype.initialize.apply( this, arguments );
	const items = [];
	const searchWidget = new OO.ui.SearchWidget();
	for ( let i = 1; i <= 20; i++ ) {
		items.push( new OO.ui.OptionWidget( { data: i, label: 'Item ' + i } ) );
	}
	searchWidget.results.addItems( items );
	searchWidget.onQueryChange = function () {};
	this.$body.append( searchWidget.$element );
};
Demo.SearchWidgetDialog.prototype.getBodyHeight = function () {
	return 300;
};
Demo.SearchWidgetDialog.static.actions = [
	{ action: 'cancel', label: 'Cancel', flags: [ 'safe', 'close' ] }
];
Demo.SearchWidgetDialog.prototype.getActionProcess = function ( action ) {
	return new OO.ui.Process( () => {
		this.close( { action: action } );
	} );
};
