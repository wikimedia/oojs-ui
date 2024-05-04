Demo.DialogWithPopupAndDropdown = function DemoDialogWithPopupAndDropdown( config ) {
	Demo.DialogWithPopupAndDropdown.super.call( this, config );
};
OO.inheritClass( Demo.DialogWithPopupAndDropdown, OO.ui.ProcessDialog );
Demo.DialogWithPopupAndDropdown.static.title = 'Dialog with popup and dropdown (ClippableElement test)';
Demo.DialogWithPopupAndDropdown.static.actions = [
	{ action: 'save', label: 'Done', flags: [ 'primary', 'progressive' ] },
	{ action: 'cancel', label: 'Cancel', flags: [ 'safe', 'close' ] }
];
Demo.DialogWithPopupAndDropdown.prototype.getBodyHeight = function () {
	return 300;
};
Demo.DialogWithPopupAndDropdown.prototype.initialize = function () {
	const $spacer = $( '<div>' ).height( 240 );
	Demo.DialogWithPopupAndDropdown.super.prototype.initialize.apply( this, arguments );
	this.bookletLayout = new OO.ui.BookletLayout( {
		outlined: true
	} );
	this.pages = [
		new Demo.SamplePage( 'info', {
			label: 'Information',
			icon: 'info',
			content: [
				'Widgets that don\'t use $overlay get clipped at the bottom of their container. ',
				'This is a test of two such cases'
			]
		} ),
		new Demo.SamplePage( 'dropdownbottom', {
			label: 'DropdownWidget at bottom',
			content: [ $spacer.clone(), new OO.ui.DropdownWidget( {
				menu: {
					items: this.makeItems()
				}
			} ) ]
		} ),
		new Demo.SamplePage( 'popupbottom', {
			label: 'Popup at bottom',
			content: [ $spacer.clone(), new OO.ui.PopupButtonWidget( {
				icon: 'info',
				label: 'Popup here',
				framed: false,
				popup: {
					head: true,
					label: 'More information',
					// eslint-disable-next-line no-jquery/no-parse-html-literal
					$content: $( '<p>Extra information here.</p>' ),
					padded: true
				}
			} ) ]
		} )
	];
	this.bookletLayout.addPages( this.pages );
	this.$body.append( this.bookletLayout.$element );
};
Demo.DialogWithPopupAndDropdown.prototype.makeItems = function () {
	return [ 0, 1, 2, 3, 4 ].map( ( val ) => new OO.ui.MenuOptionWidget( {
		data: val,
		label: String( val )
	} ) );
};

Demo.DialogWithPopupAndDropdown.prototype.getActionProcess = function ( action ) {
	if ( action ) {
		return new OO.ui.Process( () => {
			this.close( { action: action } );
		} );
	}
	return Demo.DialogWithPopupAndDropdown.super.prototype.getActionProcess.call( this, action );
};
