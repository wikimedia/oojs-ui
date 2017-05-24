( function () {
	QUnit.module( 'MenuTagMultiselectWidget' );

	QUnit.test( 'isAllowedData', function ( assert ) {
		var widget;

		widget = new OO.ui.MenuTagMultiselectWidget( {
			options: [
				{ data: 'foo', label: 'Foo' },
				{ data: 'bar', label: 'Bar' },
				{ data: 'baz', label: 'Baz' }
			]
		} );

		assert.ok(
			widget.isAllowedData( 'foo' ),
			'Data in menu items is allowed'
		);

		widget.addTag( 'foo' );
		assert.ok(
			!widget.isAllowedData( 'foo' ),
			'Data in menu but also duplicate is not allowed (for allowDuplicates: false)'
		);
		assert.ok(
			!widget.isAllowedData( 'blip' ),
			'Data not in menu is not allowed'
		);

		widget = new OO.ui.MenuTagMultiselectWidget( {
			options: [
				{ data: 'foo', label: 'Foo' },
				{ data: 'bar', label: 'Bar' },
				{ data: 'baz', label: 'Baz' }
			],
			allowedValues: [ 'something', 'else' ]
		} );
		assert.ok(
			widget.isAllowedData( 'something' ),
			'Data from allowed values is allowed'
		);
	} );

	QUnit.test( 'selected', function ( assert ) {
		var widget;

		widget = new OO.ui.MenuTagMultiselectWidget( {
			options: [
				{ data: 'foo', label: 'Foo' },
				{ data: 'bar', label: 'Bar' },
				{ data: 'baz', label: 'Baz' }
			],
			selected: [
				{ data: 'foo', label: 'Foo' },
				{ data: 'bar', label: 'Bar' }
			]
		} );

		assert.deepEqual(
			widget.getValue(),
			[ 'foo', 'bar' ],
			'`selected` config option is respected with preset options'
		);

		widget = new OO.ui.MenuTagMultiselectWidget( {
			allowArbitrary: true,
			selected: [ 'foo', 'bar' ]
		} );

		assert.deepEqual(
			widget.getValue(),
			[ 'foo', 'bar' ],
			'`selected` config option is respected with arbitrary options'
		);
	} );
}() );
