( function () {
	const input = new OO.ui.TextInputWidget( {
			placeholder: 'Add a ToDo item'
		} ),
		list = new OO.ui.SelectWidget( {
			classes: [ 'todo-list' ]
		} ),
		info = new OO.ui.LabelWidget( {
			label: 'Information',
			classes: [ 'todo-info' ]
		} );

	// Respond to 'enter' keypress
	input.on( 'enter', () => {
		// Check for duplicates and prevent empty input
		if ( list.findItemFromData( input.getValue() ) ||
				input.getValue() === '' ) {
			input.$element.addClass( 'todo-error' );
			return;
		}
		input.$element.removeClass( 'todo-error' );

		// Add the item
		list.addItems( [
			new Widgets.ToDoItemWidget3( {
				data: input.getValue(),
				label: input.getValue(),
				creationTime: Date.now()
			} )
		] );
		input.setValue( '' );
	} );

	list.on( 'choose', ( item ) => {
		info.setLabel( item.getData() + ' (' +
			item.getPrettyCreationTime() + ')' );
	} );

	// eslint-disable-next-line no-jquery/no-global-selector
	$( '.tutorials-embed-app4' ).append(
		new OO.ui.FieldsetLayout( {
			id: 'tutorials-basics2-app4',
			label: 'Demo #4',
			items: [
				input,
				list,
				info
			]
		} ).$element
	);
}() );
