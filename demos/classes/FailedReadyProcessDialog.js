Demo.FailedReadyProcessDialog = function DemoFailedReadyProcessDialog( config ) {
	Demo.FailedReadyProcessDialog.super.call( this, config );
};
OO.inheritClass( Demo.FailedReadyProcessDialog, Demo.SimpleDialog );
Demo.FailedReadyProcessDialog.prototype.getReadyProcess = function () {
	return Demo.FailedReadyProcessDialog.super.prototype.getReadyProcess
		.call( this )
		.next( () => $.Deferred().reject().promise() );
};
