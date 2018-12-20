// Display deep object structures, the default is 5
QUnit.dump.maxDepth = 100;
// By default, child nodes are not dumped
QUnit.dump.setParser( 'node', function ( item ) {
	return item.outerHTML;
} );

// Updating theme classes is normally debounced, but we need to do it immediately
// if we want the tests to be synchronous
OO.ui.Theme.prototype.queueUpdateElementClasses = OO.ui.Theme.prototype.updateElementClasses;

// Various things end up in the default overlay when infusing, but that's annoying
// because we need to compare them, so let's prevent that
OO.ui.getDefaultOverlay = function () {
	return null;
};
