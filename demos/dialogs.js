OO.ui.demo.dialogs = function () {
	var i, l, name, openButton, DialogClass, config,
		$demo = $( '.oo-ui-demo' ),
		fieldset = new OO.ui.FieldsetLayout( { label: 'Dialogs' } ),
		isolateSwitch = new OO.ui.ToggleSwitchWidget(),
		windows = {},
		isolatedWindows = {},
		windowManager = new OO.ui.WindowManager(),
		isolatedWindowManager = new OO.ui.WindowManager( { isolate: true } );

	function SimpleDialog( config ) {
		SimpleDialog.super.call( this, config );
	}
	OO.inheritClass( SimpleDialog, OO.ui.Dialog );
	SimpleDialog.static.title = 'Simple dialog';
	SimpleDialog.prototype.initialize = function () {
		var closeButton,
			dialog = this;

		SimpleDialog.super.prototype.initialize.apply( this, arguments );
		this.content = new OO.ui.PanelLayout( { $: this.$, padded: true, expanded: false } );
		this.content.$element.append( '<p>Dialog content</p>' );

		closeButton = new OO.ui.ButtonWidget( {
			$: this.$,
			label: OO.ui.msg( 'ooui-dialog-process-dismiss' )
		} );
		closeButton.on('click', function () {
			dialog.close();
		});

		this.content.$element.append( closeButton.$element );
		this.$body.append( this.content.$element );
	};
	SimpleDialog.prototype.getBodyHeight = function () {
		return this.content.$element.outerHeight( true );
	};

	function ProcessDialog( config ) {
		ProcessDialog.super.call( this, config );
	}
	OO.inheritClass( ProcessDialog, OO.ui.ProcessDialog );
	ProcessDialog.static.title = 'Process dialog';
	ProcessDialog.static.actions = [
		{ action: 'save', label: 'Done', flags: 'primary' },
		{ action: 'cancel', label: 'Cancel', flags: 'safe' }
	];
	ProcessDialog.prototype.initialize = function () {
		ProcessDialog.super.prototype.initialize.apply( this, arguments );
		this.content = new OO.ui.PanelLayout( { $: this.$, padded: true, expanded: false } );
		this.content.$element.append( '<p>Dialog content</p>' );
		this.$body.append( this.content.$element );
	};
	ProcessDialog.prototype.getActionProcess = function ( action ) {
		var dialog = this;
		if ( action ) {
			return new OO.ui.Process( function () {
				dialog.close( { action: action } );
			} );
		}
		return ProcessDialog.super.prototype.getActionProcess.call( this, action );
	};
	ProcessDialog.prototype.getBodyHeight = function () {
		return this.content.$element.outerHeight( true );
	};

	function BrokenDialog( config ) {
		BrokenDialog.super.call( this, config );
		this.broken = false;
	}
	OO.inheritClass( BrokenDialog, OO.ui.ProcessDialog );
	BrokenDialog.static.title = 'Broken dialog';
	BrokenDialog.static.actions = [
		{ action: 'save', label: 'Save', flags: [ 'primary', 'constructive' ] },
		{ action: 'delete', label: 'Delete', flags: 'destructive' },
		{ action: 'cancel', label: 'Cancel', flags: 'safe' }
	];
	BrokenDialog.prototype.getBodyHeight = function () {
		return 250;
	};
	BrokenDialog.prototype.initialize = function () {
		BrokenDialog.super.prototype.initialize.apply( this, arguments );
		this.content = new OO.ui.PanelLayout( { $: this.$, padded: true } );
		this.fieldset = new OO.ui.FieldsetLayout( {
			$: this.$, label: 'Dialog with error handling', icon: 'alert'
		} );
		this.description = new OO.ui.LabelWidget( {
			$: this.$, label: 'Deleting will fail and will not be recoverable. ' +
				'Saving will fail the first time, but succeed the second time.'
		} );
		this.fieldset.addItems( [ this.description ] );
		this.content.$element.append( this.fieldset.$element );
		this.$body.append( this.content.$element );
	};
	BrokenDialog.prototype.getSetupProcess = function ( data ) {
		return BrokenDialog.super.prototype.getSetupProcess.call( this, data )
			.next( function () {
				this.broken = true;
			}, this );
	};
	BrokenDialog.prototype.getActionProcess = function ( action ) {
		return BrokenDialog.super.prototype.getActionProcess.call( this, action )
			.next( function () {
				if ( action === 'save' ) {
					return 1000;
				}
			}, this )
			.next( function () {
				var closing;
				if ( this.broken ) {
					if ( action === 'save' ) {
						this.broken = false;
						return new OO.ui.Error( 'Server did not respond' );
					} else if ( action === 'delete' ) {
						return new OO.ui.Error( 'Permission denied', { recoverable: false } );
					}
				}
				closing = this.close( { action: action } );
				if ( action === 'save' ) {
					// Return a promise to remaing pending while closing
					return closing;
				}
				return BrokenDialog.super.prototype.getActionProcess.call( this, action );
			}, this );
	};

	function SamplePage( name, config ) {
		config = $.extend( { label: 'Sample page', icon: 'Sample icon' }, config );
		OO.ui.PageLayout.call( this, name, config );
		this.label = config.label;
		this.icon = config.icon;
		this.$element.text( this.label );
	}
	OO.inheritClass( SamplePage, OO.ui.PageLayout );
	SamplePage.prototype.setupOutlineItem = function ( outlineItem ) {
		SamplePage.super.prototype.setupOutlineItem.call( this, outlineItem );
		this.outlineItem
			.setIcon( this.icon )
			.setLabel( this.label );
	};

	function BookletDialog( config ) {
		BookletDialog.super.call( this, config );
	}
	OO.inheritClass( BookletDialog, OO.ui.ProcessDialog );
	BookletDialog.static.title = 'Booklet dialog';
	BookletDialog.static.actions = [
		{ action: 'save', label: 'Done', flags: 'primary' },
		{ action: 'cancel', label: 'Cancel', flags: 'safe' }
	];
	BookletDialog.prototype.getBodyHeight = function () {
		return 250;
	};
	BookletDialog.prototype.initialize = function () {
		BookletDialog.super.prototype.initialize.apply( this, arguments );
		this.bookletLayout = new OO.ui.BookletLayout( { $: this.$, outlined: true } );
		this.pages = [
			new SamplePage( 'small', { $: this.$, label: 'Small', icon: 'window' } ),
			new SamplePage( 'medium', { $: this.$, label: 'Medium', icon: 'window' } ),
			new SamplePage( 'large', { $: this.$, label: 'Large', icon: 'window' } ),
			new SamplePage( 'full', { $: this.$, label: 'Full', icon: 'window' } )
		];
		this.bookletLayout.addPages( this.pages );
		this.bookletLayout.connect( this, { set: 'onBookletLayoutSet' } );
		this.$body.append( this.bookletLayout.$element );
	};
	BookletDialog.prototype.getActionProcess = function ( action ) {
		if ( action ) {
			return new OO.ui.Process( function () {
				this.close( { action: action } );
			}, this );
		}
		return BookletDialog.super.prototype.getActionProcess.call( this, action );
	};
	BookletDialog.prototype.onBookletLayoutSet = function ( page ) {
		this.setSize( page.getName() );
	};
	BookletDialog.prototype.getSetupProcess = function ( data ) {
		return BookletDialog.super.prototype.getSetupProcess.call( this, data )
			.next( function () {
				this.bookletLayout.setPage( this.getSize() );
			}, this );
	};

	config = [
		{
			name: 'Simple dialog (small)',
			config: {
				size: 'small'
			},
			data: {
				title: 'Sample dialog with very long title that does not fit'
			}
		},
		{
			name: 'Simple dialog (medium)',
			config: {
				size: 'medium'
			}
		},
		{
			name: 'Simple dialog (large)',
			config: {
				size: 'large'
			}
		},
		{
			name: 'Simple dialog (full)',
			config: {
				size: 'full'
			}
		},
		{
			name: 'Process dialog (medium)',
			dialogClass: ProcessDialog,
			config: {
				size: 'medium'
			}
		},
		{
			name: 'Process dialog (full)',
			dialogClass: ProcessDialog,
			config: {
				size: 'full'
			}
		},
		{
			name: 'Broken dialog (error handling)',
			dialogClass: BrokenDialog,
			config: {
				size: 'medium'
			}
		},
		{
			name: 'Booklet dialog',
			dialogClass: BookletDialog,
			config: {
				size: 'medium'
			}
		},
		{
			name: 'Message dialog (generic)',
			dialogClass: OO.ui.MessageDialog,
			data: {
				title: 'Continue?',
				message: 'It may be risky'
			}
		},
		{
			name: 'Message dialog (verbose)',
			dialogClass: OO.ui.MessageDialog,
			data: {
				title: 'Continue?',
				message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque quis laoreet elit. Nam eu velit ullamcorper, volutpat elit sed, viverra massa. Aenean congue aliquam lorem, et laoreet risus condimentum vel. Praesent nec imperdiet mauris. Nunc eros magna, iaculis sit amet ante id, dapibus tristique lorem. Praesent in feugiat lorem, sit amet porttitor eros. Donec sapien turpis, pretium eget ligula id, scelerisque tincidunt diam. Pellentesque a venenatis tortor, at luctus nisl. Quisque vel urna a enim mattis rutrum. Morbi eget consequat nisl. Nam tristique molestie diam ac consequat. Nam varius adipiscing mattis. Praesent sodales volutpat nulla lobortis iaculis. Quisque vel odio eget diam posuere imperdiet. Fusce et iaculis odio. Donec in nibh ut dui accumsan vehicula quis et massa.',
				verbose: true
			}
		},
		{
			name: 'Message dialog (1 action)',
			dialogClass: OO.ui.MessageDialog,
			data: {
				title: 'Storage limit reached',
				message: 'You are out of disk space',
				actions: [
					{
						action: 'accept',
						label: 'Dismiss',
						flags: 'primary'
					}
				]
			}
		},
		{
			name: 'Message dialog (2 actions)',
			dialogClass: OO.ui.MessageDialog,
			data: {
				title: 'Cannot save data',
				message: 'The server is not responding',
				actions: [
					{
						action: 'reject',
						label: 'Cancel',
						flags: 'safe'
					},
					{
						action: 'repeat',
						label: 'Try again',
						flags: [ 'primary', 'constructive' ]
					}
				]
			}
		},
		{
			name: 'Message dialog (3 actions)',
			dialogClass: OO.ui.MessageDialog,
			data: {
				title: 'Delete file?',
				message: 'The file will be irreversably obliterated. Proceed with caution.',
				actions: [
					{ action: 'reject', label: 'Cancel', flags: 'safe' },
					{ action: 'reject', label: 'Move file to trash' },
					{
						action: 'accept',
						label: 'Obliterate',
						flags: [ 'primary', 'destructive' ]
					}
				]
			}
		}
	];

	function openDialog( name, data ) {
		if ( isolateSwitch.getValue() ) {
			isolatedWindowManager.openWindow( name, data );
		} else {
			windowManager.openWindow( name, data );
		}
	}

	fieldset.addItems( [ new OO.ui.FieldLayout( isolateSwitch, { label: 'Isolate dialogs', align: 'top' } ) ] );
	for ( i = 0, l = config.length; i < l; i++ ) {
		name = 'window_' + i;
		DialogClass = config[i].dialogClass || SimpleDialog;
		windows[name] = new DialogClass( config[i].config );
		isolatedWindows[name] = new DialogClass( config[i].config );
		openButton = new OO.ui.ButtonWidget( {
			framed: false,
			icon: 'window',
			label: config[i].name
		} );
		openButton.on(
			'click', OO.ui.bind( openDialog, this, name, config[i].data )
		);
		fieldset.addItems( [ new OO.ui.FieldLayout( openButton, { align: 'inline' } ) ] );
	}
	windowManager.addWindows( windows );
	isolatedWindowManager.addWindows( isolatedWindows );

	$demo.append( $( '<div class="oo-ui-demo-container"></div>' ).append(
		fieldset.$element, windowManager.$element, isolatedWindowManager.$element
	) );
};
