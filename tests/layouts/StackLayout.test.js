{
	QUnit.module( 'StackLayout' );

	const makeItem = ( data ) => new OO.ui.Layout( { data } ),
		makeItems = ( count ) => [ ...Array( count ) ].map( ( _, i ) => makeItem( i ) );

	QUnit.assert.itemOrder = function ( layout, expected, message ) {
		this.deepEqual( layout.getItems().map( ( item ) => item.getData() ), expected, message );
	};

	QUnit.assert.currentItem = function ( layout, expected, message ) {
		this.strictEqual(
			typeof expected === 'object' ? layout.getCurrentItem() : layout.getCurrentItem().getData(),
			expected,
			message
		);
	};

	QUnit.test( 'setting, getting and clearing the current item', ( assert ) => {
		var item = makeItem(),
			layout = new OO.ui.StackLayout( { items: [ item ] } );

		assert.currentItem( layout, item, 'constructor initializes current item' );

		layout.setItem( null );
		assert.currentItem( layout, null, 'can unset current item' );

		layout.setItem( item );
		assert.currentItem( layout, item, 'can set current item' );

		layout.setItem( makeItem() );
		assert.currentItem( layout, null, 'cannot use unused item' );

		layout.setItem( item );
		layout.clearItems();
		assert.currentItem( layout, null, 'clears current item as well' );
	} );

	QUnit.test( 'removing the current item', ( assert ) => {
		var items = makeItems( 5 ),
			layout = new OO.ui.StackLayout( { items } );

		layout.setItem( items[ 1 ] );
		assert.itemOrder( layout, [ 0, 1, 2, 3, 4 ], 'precondition' );
		assert.currentItem( layout, 1, 'precondition' );

		layout.removeItems( [ items[ 1 ] ] );
		assert.itemOrder( layout, [ 0, 2, 3, 4 ], 'one item is removed' );
		assert.currentItem( layout, 2, 'next item is selected' );

		layout.removeItems( [ items[ 0 ], items[ 2 ] ] );
		assert.itemOrder( layout, [ 3, 4 ], 'multiple items are removed' );
		assert.currentItem( layout, 3, 'next item is selected' );

		layout.removeItems( [ items[ 3 ], items[ 4 ] ] );
		assert.itemOrder( layout, [], 'all items are removed' );
		assert.currentItem( layout, null, 'current item is cleared' );
	} );
}
