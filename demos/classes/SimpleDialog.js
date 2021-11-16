Demo.SimpleDialog = function DemoSimpleDialog( config ) {
	Demo.SimpleDialog.super.call( this, config );
};
OO.inheritClass( Demo.SimpleDialog, OO.ui.Dialog );
Demo.SimpleDialog.static.title = 'Simple dialog';
Demo.SimpleDialog.prototype.initialize = function () {
	var dialog = this;

	Demo.SimpleDialog.super.prototype.initialize.apply( this, arguments );
	this.content = new OO.ui.PanelLayout( { padded: true, expanded: false } );
	// eslint-disable-next-line no-jquery/no-parse-html-literal
	this.content.$element.append( '<p>Dialog content</p>' );

	var closeButton = new OO.ui.ButtonWidget( {
		label: OO.ui.msg( 'ooui-dialog-process-dismiss' )
	} );
	closeButton.on( 'click', function () {
		dialog.close();
	} );

	this.content.$element.append( closeButton.$element );
	this.$body.append( this.content.$element );
};
Demo.SimpleDialog.prototype.getBodyHeight = function () {
	return this.content.$element.outerHeight( true );
};
