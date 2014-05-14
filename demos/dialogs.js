$( function () {
	var i, l,
		openButton,
		fieldset,
		$demo = $( '.oo-ui-demo' ),
		dialogs = [
			{
				'name': 'Small dialog',
				'config': {
					'size': 'small'
				}
			},
			{
				'name': 'Medium dialog',
				'config': {
					'size': 'medium'
				}
			},
			{
				'name': 'Large dialog',
				'config': {
					'size': 'large'
				}
			},
			{
				'name': 'Medium footless dialog',
				'config': {
					'size': 'medium',
					'footless': true
				}
			}
		];

	function SampleDialog( config ) {
		config = $.extend( { 'title': 'Title' }, config );
		SampleDialog.super.call( this, config );
	}

	OO.inheritClass( SampleDialog, OO.ui.Dialog );

	SampleDialog.prototype.initialize = function () {
		SampleDialog.super.prototype.initialize.apply( this, arguments );

		this.$body.html( '<p>Dialog content</p>' );
		this.$foot.html( 'Footer' );
	};

	function openDialog( config ) {
		var dialog = new SampleDialog( config );
		$( 'body' ).append( dialog.$element );
		dialog.open();
	}

	fieldset = new OO.ui.FieldsetLayout( { 'label': 'Dialogs' } );
	for ( i = 0, l = dialogs.length; i < l; i++ ) {
		openButton = new OO.ui.ButtonWidget( { 'label': 'Open' } );
		openButton.on( 'click', OO.ui.bind( openDialog, this, dialogs[i].config ) );
		fieldset.addItems( [
			new OO.ui.FieldLayout(
				openButton,
				{ 'label': dialogs[i].name }
			)
		] );
	}

	$demo.append( fieldset.$element );
} );
