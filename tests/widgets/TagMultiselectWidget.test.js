( function () {
	QUnit.module( 'TagMultiselectWidget' );

	QUnit.test( 'Input positioning', ( assert ) => {
		let widget;

		widget = new OO.ui.TagMultiselectWidget();
		assert.strictEqual(
			widget.$element.find( 'input' ).length,
			1,
			'Basic widget (inputPosition:inline) has an input'
		);
		assert.true(
			widget.$element.hasClass( 'oo-ui-tagMultiselectWidget-inlined' ),
			'Basic widget (inputPosition:inline) has an inline input class'
		);
		assert.true(
			widget.$group.children( 'input' ).length > 0,
			'Basic widget (inputPosition:inline) has its input placed inside the group'
		);

		widget = new OO.ui.TagMultiselectWidget( { inputPosition: 'outline' } );
		assert.strictEqual(
			widget.$element.find( 'input' ).length,
			1,
			'Widget with inputPosition:outline has an input'
		);
		assert.true(
			widget.$element.hasClass( 'oo-ui-tagMultiselectWidget-outlined' ),
			'Widget with inputPosition:outline has the correct class'
		);
		assert.true(
			widget.$element.children( '.oo-ui-textInputWidget' ).length > 0,
			'Widget with inputPosition:outline has its input placed in the widget\'s element itself'
		);

		widget = new OO.ui.TagMultiselectWidget( { inputPosition: 'none' } );
		assert.strictEqual(
			widget.$element.find( 'input' ).length,
			0,
			'Widget with inputPosition:none does not have an input'
		);
	} );

	QUnit.test( 'isAllowedData', ( assert ) => {
		let widget;

		widget = new OO.ui.TagMultiselectWidget( {
			allowArbitrary: true
		} );
		assert.strictEqual(
			widget.isAllowedData( '123foobar' ),
			true,
			'isAllowedData: allowArbitrary:true, random options are valid'
		);

		widget = new OO.ui.TagMultiselectWidget( {
			allowArbitrary: false,
			allowedValues: [ 'foo', 'bar' ]
		} );

		assert.strictEqual(
			widget.isAllowedData( '123foobar' ),
			false,
			'isAllowedData: allowArbitrary:false, data not in allowedValues is invalid'
		);
		assert.strictEqual(
			widget.isAllowedData( 'foo' ),
			true,
			'isAllowedData: allowArbitrary:false, data in allowedValues valid'
		);

		widget.addTag( 'foo' );
		assert.strictEqual(
			widget.isAllowedData( 'foo' ),
			false,
			'isAllowedData: allowDuplicates:false, duplicate values are invalid even if they are in allowedValues'
		);

		widget = new OO.ui.TagMultiselectWidget( {
			allowArbitrary: false,
			allowedValues: [ 'foo', 'bar' ],
			allowDuplicates: true
		} );

		widget.addTag( 'foo' );
		assert.strictEqual(
			widget.isAllowedData( 'foo' ),
			true,
			'isAllowedData: allowDuplicates:true allows duplicate values'
		);
	} );

	QUnit.test( 'addTag', ( assert ) => {
		let widget;
		const getItemDatas = function ( items ) {
			return items.map( ( item ) => item.getData() );
		};

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: true, allowedValues: [ 'foo', 'bar' ] } );
		widget.addTag( 'foo' ); // In allowed list
		widget.addTag( 'blip' ); // Not in allowed list
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo', 'blip' ],
			'addTag: allowArbitrary:true Allows adding values outside the allowed list.'
		);
		assert.strictEqual(
			widget.isValid(),
			true,
			'addTag: allowArbitrary:true The widget is still valid even with values outside the allowed list.'
		);

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: false, allowedValues: [ 'foo', 'bar' ] } );
		widget.addTag( 'foo' ); // In allowed list
		widget.addTag( 'blip' ); // Not in allowed list
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo' ],
			'addTag: allowArbitrary:false Prevents adding values outside the allowed list.'
		);
		assert.strictEqual(
			widget.isValid(),
			true,
			'addTag: allowArbitrary:false The widget is always valid because non-allowed values are unacceptable.'
		);

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: false, allowDisplayInvalidTags: true, allowedValues: [ 'foo', 'bar' ] } );
		widget.addTag( 'foo' ); // In allowed list
		widget.addTag( 'blip' ); // Not in allowed list
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo', 'blip' ],
			'addTag: allowArbitrary:false with allowDisplayInvalidTags:true Allows adding values outside the allowed list.'
		);
		assert.deepEqual(
			widget.getValue(),
			[ 'foo' ],
			'addTag: allowArbitrary:false with allowDisplayInvalidTags:true The value of the widget is only the tags with allowed values.'
		);
		assert.strictEqual(
			widget.isValid(),
			false,
			'addTag: allowArbitrary:false with allowDisplayInvalidTags:true The widget is invalid if it has non-allowed values.'
		);

		widget = new OO.ui.TagMultiselectWidget( { allowReordering: false, allowArbitrary: true, allowedValues: [ 'foo', 'bar' ] } );
		widget.addTag( 'blip' ); // Not in allowed list
		widget.addTag( 'bar' ); // In allowed list
		widget.addTag( 'blop' ); // Not in allowed list
		widget.addTag( 'foo' ); // In allowed list
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo', 'bar', 'blip', 'blop' ],
			'addTag: allowReordering:false Forces the predefined order of allowed values'
		);
	} );

	QUnit.test( 'setValue', ( assert ) => {
		let widget;
		const getItemDatas = function ( items ) {
			return items.map( ( item ) => item.getData() );
		};

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: true } );
		widget.setValue( [ 'foo', 'bar', 'baz' ] );
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo', 'bar', 'baz' ],
			'setValue with string array adds the tags to the widget.'
		);

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: false, allowedValues: [ 'foo', 'bar' ] } );
		widget.setValue( [ 'foo', 'bar', 'foo' ] );
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo', 'bar' ],
			'setValue with string array and allowArbitrary:false ignores duplicates.'
		);
		widget.setValue( [ 'foo', 'bar', 'baz' ] );
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo', 'bar' ],
			'setValue with string array and allowArbitrary:false adds only allowed tags to the widget.'
		);

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: false, allowDuplicates: true, allowedValues: [ 'foo', 'bar' ] } );
		widget.setValue( [ 'foo', 'bar', 'foo' ] );
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo', 'bar', 'foo' ],
			'setValue with string array and allowArbitrary:false with allowDuplicates:true adds duplicates.'
		);

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: false, allowDisplayInvalidTags: true, allowedValues: [ 'foo', 'bar' ] } );
		widget.setValue( [ 'foo', 'bar', 'baz' ] );
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo', 'bar', 'baz' ],
			'setValue with string array and allowArbitrary:false with allowDisplayInvalidTags:true adds all tags to the widget.'
		);

		// Objects
		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: true } );
		widget.setValue( 'foo' );
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo' ],
			'setValue with a single string adds the tag by its attributes.'
		);

		widget.setValue( { data: 'foo' } );
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo' ],
			'setValue with a single object adds the tag by its attributes.'
		);

		widget.setValue( [ { data: 'foo' }, { data: 'bar' } ] );
		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo', 'bar' ],
			'setValue with an array of objects adds the tags by their attributes.'
		);
	} );

	QUnit.test( 'getValue', ( assert ) => {
		let widget;

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: true } );
		widget.setValue( [ 'foo', 'bar', 'baz' ] );
		assert.deepEqual(
			widget.getValue(),
			[ 'foo', 'bar', 'baz' ],
			'getValue with allowArbitrary:true outputs all inserted items\' datas'
		);

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: false, allowedValues: [ 'foo', 'bar' ] } );
		widget.setValue( [ 'foo', 'bar', 'baz' ] );
		assert.deepEqual(
			widget.getValue(),
			[ 'foo', 'bar' ],
			'getValue with allowArbitrary:false and allowedValues, outputs only the legal items\' datas'
		);
	} );

	QUnit.test( 'getNextItem', ( assert ) => {
		let items, widget;

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: true } );
		widget.setValue( [ 'foo', 'bar', 'baz' ] );
		items = widget.getItems();

		assert.deepEqual(
			widget.getNextItem( items[ 0 ] ).getData(),
			items[ 1 ].getData(),
			'Getting the next item from the first item.'
		);

		assert.strictEqual(
			widget.getNextItem( items[ items.length - 1 ] ),
			widget.input,
			'Getting the next item from the last item, returns the input.$input element (if inputPosition:inline or inputPosition:outline)'
		);

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: true, inputPosition: 'none' } );
		widget.setValue( [ 'foo', 'bar', 'baz' ] );
		items = widget.getItems();

		assert.deepEqual(
			widget.getNextItem( items[ items.length - 1 ] ).getData(),
			items[ 0 ].getData(),
			'Getting the next item from the last item, returns the first item (if inputPosition:none)'
		);
	} );

	QUnit.test( 'getPreviousItem', ( assert ) => {
		let items, widget;

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: true } );
		widget.setValue( [ 'foo', 'bar', 'baz' ] );
		items = widget.getItems();

		assert.strictEqual(
			widget.getPreviousItem( items[ 0 ] ),
			widget.input,
			'Getting the previous item from the first item returns the input.$input element (if inputPosition:inline or inputPosition:outline)'
		);
		assert.strictEqual(
			widget.getPreviousItem( items[ items.length - 1 ] ),
			items[ items.length - 2 ],
			'Getting the previous item from the last item'
		);

		widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: true, inputPosition: 'none' } );
		widget.setValue( [ 'foo', 'bar', 'baz' ] );
		items = widget.getItems();

		assert.strictEqual(
			widget.getPreviousItem( items[ 0 ] ),
			items[ items.length - 1 ],
			'Getting the previous item from the first item returns the last item (if inputPosition:none)'
		);
	} );

	QUnit.test( 'doInputBackspace', ( assert ) => {
		const getItemDatas = function ( items ) {
			return items.map( ( item ) => item.getData() );
		};

		const widget = new OO.ui.TagMultiselectWidget( { allowArbitrary: true } );
		/* eslint-disable no-jquery/no-parse-html-literal */
		widget.addTag( 'foo', $( '<span>foo</span>' ) );
		widget.addTag( 'baz', $( '<span>baz</span>' ) );
		widget.doInputBackspace( null, false );

		assert.deepEqual(
			getItemDatas( widget.getItems() ),
			[ 'foo' ],
			'Removing the last tag from the items array'
		);
		assert.strictEqual(
			widget.getTagInfoFromInput().label,
			'baz',
			'Retrieving last introduced item label from input'
		);
	} );
}() );
