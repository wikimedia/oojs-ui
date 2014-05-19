$( function () {
	var i, l,
		openButton,
		fieldset,
		dialogs,
		$demo = $( '.oo-ui-demo' );

	function SimpleDialog( config ) {
		config = $.extend( { 'title': 'Title' }, config );
		SimpleDialog.super.call( this, config );
	}

	OO.inheritClass( SimpleDialog, OO.ui.Dialog );

	SimpleDialog.prototype.initialize = function () {
		SimpleDialog.super.prototype.initialize.apply( this, arguments );

		this.$body.html( '<p>Dialog content</p>' );
		this.$foot.html( 'Footer' );
	};

	function GridDialog( config ) {
		config = $.extend( { 'title': 'Grid dialog' }, config );
		GridDialog.super.call( this, config );
	}

	OO.inheritClass( GridDialog, OO.ui.Dialog );

	GridDialog.prototype.initialize = function () {
		GridDialog.super.prototype.initialize.apply( this, arguments );

		this.panels = new OO.ui.StackLayout( { '$': this.$ } );
		this.$body.append( this.panels.$element );

		this.bookletLayout = new OO.ui.BookletLayout( { '$': this.$, 'outlined': true } );

		this.fooBarPage = new OO.ui.PageLayout(
			'fooBar',
			{ '$': this.$ }
		);

		this.panels.addItems( [ this.bookletLayout ] );
		this.bookletLayout.addPages( [
			this.fooBarPage
		] );
	};

	function openDialog( DialogClass, config, data ) {
		var dialog = new DialogClass( config );
		$( 'body' ).append( dialog.$element );
		dialog.open( data );
	}

	dialogs = [
		{
			'name': 'Simple dialog (small)',
			'config': {
				'size': 'small'
			}
		},
		{
			'name': 'Simple dialog (medium)',
			'config': {
				'size': 'medium'
			}
		},
		{
			'name': 'Simple dialog (large)',
			'config': {
				'size': 'large'
			}
		},
		{
			'name': 'Simple dialog (medium, footless)',
			'config': {
				'size': 'medium',
				'footless': true
			}
		},
		{
			'name': 'Confirmation dialog',
			'dialogClass': OO.ui.ConfirmationDialog,
			'data': {
				'prompt': 'Prompt text',
				'okLabel': 'Custom ok text',
				'cancelLabel': 'Custom cancel text'
			}
		},
		{
			'name': 'Grid dialog (medium)',
			'dialogClass': GridDialog,
			'config': {
				'size': 'medium'
			}
		}
	];
	fieldset = new OO.ui.FieldsetLayout( { 'label': 'Dialogs' } );
	for ( i = 0, l = dialogs.length; i < l; i++ ) {
		openButton = new OO.ui.ButtonWidget( { 'label': 'Open' } );
		openButton.on( 'click', OO.ui.bind(
			openDialog, this,
			dialogs[i].dialogClass || SimpleDialog,
			dialogs[i].config,
			dialogs[i].data
		) );
		fieldset.addItems( [
			new OO.ui.FieldLayout(
				openButton,
				{ 'label': dialogs[i].name }
			)
		] );
	}

	$demo.append( fieldset.$element );
} );
