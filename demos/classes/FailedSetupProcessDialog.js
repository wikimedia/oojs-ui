Demo.FailedSetupProcessDialog = function DemoFailedSetupProcessDialog( config ) {
	Demo.FailedSetupProcessDialog.super.call( this, config );
};
OO.inheritClass( Demo.FailedSetupProcessDialog, Demo.SimpleDialog );
Demo.FailedSetupProcessDialog.prototype.getSetupProcess = function () {
	return Demo.FailedSetupProcessDialog.super.prototype.getSetupProcess
		.call( this )
		.next( () => $.Deferred().reject().promise() );
};
