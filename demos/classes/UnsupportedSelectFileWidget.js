Demo.UnsupportedSelectFileWidget = function DemoUnsupportedSelectFileWidget() {
	// Parent constructor
	Demo.UnsupportedSelectFileWidget.super.apply( this, arguments );
};
OO.inheritClass( Demo.UnsupportedSelectFileWidget, OO.ui.SelectFileWidget );
Demo.UnsupportedSelectFileWidget.static.isSupported = function () {
	return false;
};
