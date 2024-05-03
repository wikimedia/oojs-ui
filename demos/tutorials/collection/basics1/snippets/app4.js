( function () {
	const input = new OO.ui.TextInputWidget( {
			placeholder: 'Add a ToDo item'
		} ),
		list = new OO.ui.SelectWidget( {
			classes: [ 'todo-list' ],
			items: [
				new OO.ui.OptionWidget( {
					label: 'Item 1',
					data: 'Item 1'
				} ),
				new OO.ui.OptionWidget( {
					label: 'Item 2',
					data: 'Item 2'
				} ),
				new OO.ui.OptionWidget( {
					label: 'Item 3',
					data: 'Item 3'
				} )
			]
		} );

	// Respond to 'enter' keypress
	input.on( 'enter', () => {
		// Check for duplicates
		if ( list.findItemFromData( input.getValue() ) ||
				input.getValue() === '' ) {
			input.$element.addClass( 'todo-error' );
			return;
		}
		input.$element.removeClass( 'todo-error' );

		list.addItems( [
			new OO.ui.OptionWidget( {
				data: input.getValue(),
				label: input.getValue()
			} )
		] );
		input.setValue( '' );
	} );

	// eslint-disable-next-line no-jquery/no-global-selector
	$( '.tutorials-embed-app4' ).append(
		new OO.ui.FieldsetLayout( {
			id: 'tutorials-basics1-app4',
			label: 'Demo #4',
			items: [
				input,
				list
			]
		} ).$element
	);
}() );
