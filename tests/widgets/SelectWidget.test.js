( function () {
	QUnit.module( 'SelectWidget' );

	QUnit.test( 'findFirstSelectableItem', function ( assert ) {
		var optionWidget, selectWidget;

		optionWidget = new OO.ui.OptionWidget( {
			data: 'a',
			label: 'A'
		} );
		selectWidget = new OO.ui.SelectWidget( {
			disabled: true,
			items: [ optionWidget ]
		} );

		assert.strictEqual(
			selectWidget.findFirstSelectableItem(),
			optionWidget,
			'#findFirstSelectableItem works even when the widget is disabled'
		);
	} );

	QUnit.test( 'selectItem selects option', function ( assert ) {
		var optionWidget, selectWidget;

		optionWidget = new OO.ui.OptionWidget( {
			data: 'a',
			label: 'A',
			selected: false
		} );
		selectWidget = new OO.ui.SelectWidget( {
			items: [ optionWidget ]
		} );
		selectWidget.selectItem( optionWidget );

		assert.strictEqual( optionWidget.isSelected(), true );
	} );

	QUnit.test( 'selectItem switches option selection', function ( assert ) {
		var optionWidget1, optionWidget2, selectWidget;

		optionWidget1 = new OO.ui.OptionWidget( {
			data: 'a',
			label: 'A',
			selected: true
		} );
		optionWidget2 = new OO.ui.OptionWidget( {
			data: 'b',
			label: 'B',
			selected: false
		} );
		selectWidget = new OO.ui.SelectWidget( {
			items: [ optionWidget1, optionWidget2 ]
		} );
		selectWidget.selectItem( optionWidget2 );

		assert.strictEqual( optionWidget1.isSelected(), false );
		assert.strictEqual( optionWidget2.isSelected(), true );
	} );

	QUnit.test( 'selectItem fires select event on change', function ( assert ) {
		var optionWidget, selectWidget, eventCount = 0;

		optionWidget = new OO.ui.OptionWidget( {
			data: 'a',
			label: 'A',
			selected: false
		} );
		selectWidget = new OO.ui.SelectWidget( {
			items: [ optionWidget ]
		} );
		selectWidget.on( 'select', function () {
			eventCount++;
		} );
		selectWidget.selectItem( optionWidget );
		selectWidget.selectItem( optionWidget ); // 2nd selection should not trigger change event

		assert.strictEqual( eventCount, 1 );
	} );

	QUnit.test( 'selectItem ignores MenuSectionOptionWidget', function ( assert ) {
		var optionWidget, sectionWidget, selectWidget, selectEventWasFired = false;

		optionWidget = new OO.ui.OptionWidget( {
			data: 'a',
			label: 'A',
			selected: true
		} );
		sectionWidget = new OO.ui.MenuSectionOptionWidget( { label: 'B' } );
		selectWidget = new OO.ui.SelectWidget( {
			items: [ sectionWidget, optionWidget ]
		} );
		selectWidget.on( 'select', function () {
			selectEventWasFired = true;
		} );
		selectWidget.selectItem( optionWidget );

		assert.notOk( selectEventWasFired );
	} );

}() );
