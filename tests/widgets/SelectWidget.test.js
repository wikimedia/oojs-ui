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
}() );
