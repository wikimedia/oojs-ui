( function () {
	QUnit.module( 'SelectWidget' );

	QUnit.test( 'findFirstSelectableItem', ( assert ) => {
		const optionWidget = new OO.ui.OptionWidget( {
			data: 'a',
			label: 'A'
		} );
		const selectWidget = new OO.ui.SelectWidget( {
			disabled: true,
			items: [ optionWidget ]
		} );

		assert.strictEqual(
			selectWidget.findFirstSelectableItem(),
			optionWidget,
			'#findFirstSelectableItem works even when the widget is disabled'
		);
	} );

	QUnit.test( 'selectItem selects option', ( assert ) => {
		const optionWidget = new OO.ui.OptionWidget( {
			data: 'a',
			label: 'A',
			selected: false
		} );
		const selectWidget = new OO.ui.SelectWidget( {
			items: [ optionWidget ]
		} );
		selectWidget.selectItem( optionWidget );

		assert.strictEqual( optionWidget.isSelected(), true );
	} );

	QUnit.test( 'selectItem switches option selection', ( assert ) => {
		const optionWidget1 = new OO.ui.OptionWidget( {
			data: 'a',
			label: 'A',
			selected: true
		} );
		const optionWidget2 = new OO.ui.OptionWidget( {
			data: 'b',
			label: 'B',
			selected: false
		} );
		const selectWidget = new OO.ui.SelectWidget( {
			items: [ optionWidget1, optionWidget2 ]
		} );
		selectWidget.selectItem( optionWidget2 );

		assert.strictEqual( optionWidget1.isSelected(), false );
		assert.strictEqual( optionWidget2.isSelected(), true );
	} );

	QUnit.test( 'selectItem fires select event on change', ( assert ) => {
		let eventCount = 0;

		const optionWidget = new OO.ui.OptionWidget( {
			data: 'a',
			label: 'A',
			selected: false
		} );
		const selectWidget = new OO.ui.SelectWidget( {
			items: [ optionWidget ]
		} );
		selectWidget.on( 'select', () => {
			eventCount++;
		} );
		selectWidget.selectItem( optionWidget );
		selectWidget.selectItem( optionWidget ); // 2nd selection should not trigger change event

		assert.strictEqual( eventCount, 1 );
	} );

	QUnit.test( 'selectItem ignores MenuSectionOptionWidget', ( assert ) => {
		let selectEventWasFired = false;

		const optionWidget = new OO.ui.OptionWidget( {
			data: 'a',
			label: 'A',
			selected: true
		} );
		const sectionWidget = new OO.ui.MenuSectionOptionWidget( { label: 'B' } );
		const selectWidget = new OO.ui.SelectWidget( {
			items: [ sectionWidget, optionWidget ]
		} );
		selectWidget.on( 'select', () => {
			selectEventWasFired = true;
		} );
		selectWidget.selectItem( optionWidget );

		assert.false( selectEventWasFired );
	} );

}() );
