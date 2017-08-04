( function () {
	QUnit.module( 'NumberInputWidget' );

	QUnit.test( 'validate number', function ( assert ) {
		var widget = new OO.ui.NumberInputWidget( {
			allowInteger: true,
			min: -10,
			max: 10,
			step: 1,
			required: false
		} );

		assert.expect( 7 );

		assert.ok(
			widget.validateNumber( 0 ),
			'Zero is valid as an integer.'
		);

		assert.ok(
			widget.validateNumber( 5 ),
			'Integer within range is valid.'
		);
		assert.ok(
			!widget.validateNumber( 2.5 ),
			'Non-integer within range is invalid when allowInteger:true.'
		);
		assert.ok(
			!widget.validateNumber( 11 ),
			'Integer larger than the range is invalid.'
		);
		assert.ok(
			!widget.validateNumber( -11 ),
			'Integer smaller than the range is invalid.'
		);

		assert.ok(
			widget.validateNumber( '' ),
			'Empty value is valid when required:false'
		);

		widget.setRequired( true );
		assert.ok(
			!widget.validateNumber( '' ),
			'Empty value is invalid when required:true'
		);
	} );

	QUnit.test( 'adjust value', function ( assert ) {
		var widget = new OO.ui.NumberInputWidget( {
			allowInteger: false,
			min: -10,
			max: 10,
			step: 1,
			required: false
		} );

		assert.expect( 4 );

		widget.adjustValue( 1 );
		assert.equal(
			widget.getValue(),
			1,
			'Adjusting value by 1 to an initial value (0) is 1'
		);

		widget.adjustValue( 0.5 );
		assert.equal(
			widget.getValue(),
			1.5,
			'Adjusting value by 0.5 outputs correct result'
		);

		widget.setAllowInteger( true );
		widget.setValue( 1 );

		widget.adjustValue( 0.5 );
		assert.equal(
			widget.getValue(),
			2,
			'Adjusting value by 0.5 for integer-only, rounds up the increment'
		);

		widget.setValue( 1 );
		widget.adjustValue( 1.3 );

		assert.equal(
			widget.getValue(),
			2,
			'Adjusting value by 0.3 for integer-only, rounds down the increment'
		);
	} );

}() );
