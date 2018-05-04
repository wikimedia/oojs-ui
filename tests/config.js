// Display deep object structures, the default is 5
QUnit.dump.maxDepth = 100;
// By default, child nodes are not dumped
QUnit.dump.setParser( 'node', function ( item ) {
	return item.outerHTML;
} );
