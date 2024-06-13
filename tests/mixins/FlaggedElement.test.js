( function () {
	QUnit.module( 'FlaggedElement' );

	function TestElement( config ) {
		TestElement.super.call( this, config );
		OO.ui.mixin.FlaggedElement.call( this, config );
	}
	OO.inheritClass( TestElement, OO.ui.Widget );
	OO.mixinClass( TestElement, OO.ui.mixin.FlaggedElement );

	QUnit.test( 'constructor', ( assert ) => {
		let element;

		element = new TestElement();
		assert.deepEqual( element.getFlags(), [], 'No flags by default' );

		element = new TestElement( {
			flags: [ 'foo' ]
		} );
		assert.deepEqual( element.getFlags(), [ 'foo' ], 'Config option "flags"' );
	} );

	QUnit.test( 'getFlags', ( assert ) => {
		const element = new TestElement();

		element.setFlags( 'foo' );
		assert.deepEqual( element.getFlags(), [ 'foo' ], 'Flag was set' );

		element.clearFlags();
		assert.deepEqual( element.getFlags(), [], 'Flag was removed' );
	} );

	QUnit.test( 'hasFlag', ( assert ) => {
		const element = new TestElement();
		assert.deepEqual( element.hasFlag( 'foo' ), false, 'Flag absent by default' );

		element.setFlags( 'foo' );
		assert.deepEqual( element.hasFlag( 'foo' ), true, 'Flag was set' );

		element.clearFlags();
		assert.deepEqual( element.hasFlag( 'foo' ), false, 'Flag was removed' );
	} );

	QUnit.test( 'clearFlags', ( assert ) => {
		const element = new TestElement();
		element.setFlags( 'foo' );
		element.clearFlags();
		assert.deepEqual( element.hasFlag( 'foo' ), false, 'Flag was removed' );
	} );

	QUnit.test( 'setFlags', ( assert ) => {
		const element = new TestElement();
		element.setFlags( 'foo' );
		assert.deepEqual( element.hasFlag( 'foo' ), true, 'string' );

		element.setFlags( [ 'bar', 'qux' ] );
		assert.deepEqual( element.hasFlag( 'bar' ), true, 'array[ 0 ]' );
		assert.deepEqual( element.hasFlag( 'qux' ), true, 'array[ 1 ]' );

		element.setFlags( { bar: false, quux: true } );
		assert.deepEqual( element.hasFlag( 'bar' ), false, 'object set' );
		assert.deepEqual( element.hasFlag( 'quux' ), true, 'object remove' );
	} );
}() );
