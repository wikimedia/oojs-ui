/**
 * Dialog for showing a confirmation/warning message.
 *
 * @class
 * @extends OO.ui.Dialog
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.ConfirmationDialog = function OoUiConfirmationDialog( config ) {
	// Configuration initialization
	config = $.extend( { 'size': 'small' }, config );

	// Parent constructor
	OO.ui.Dialog.call( this, config );
};

/* Inheritance */

OO.inheritClass( OO.ui.ConfirmationDialog, OO.ui.Dialog );

/* Static Properties */

OO.ui.ConfirmationDialog.static.name = 'confirm';

OO.ui.ConfirmationDialog.static.icon = 'help';

OO.ui.ConfirmationDialog.static.title = OO.ui.deferMsg( 'ooui-dialog-confirm-title' );

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.ConfirmationDialog.prototype.initialize = function () {
	// Parent method
	OO.ui.Dialog.prototype.initialize.call( this );

	// Set up the layout
	var contentLayout = new OO.ui.PanelLayout( {
		'$': this.$,
		'padded': true
	} );

	this.$promptContainer = this.$( '<div>' ).addClass( 'oo-ui-dialog-confirm-promptContainer' );

	this.cancelButton = new OO.ui.ButtonWidget();
	this.cancelButton.connect( this, { 'click': [ 'emit', 'done', 'cancel' ] } );

	this.okButton = new OO.ui.ButtonWidget();
	this.okButton.connect( this, { 'click': [ 'emit', 'done', 'ok' ] } );

	// Make the buttons
	contentLayout.$element.append( this.$promptContainer );
	this.$body.append( contentLayout.$element );

	this.$foot.append(
		this.okButton.$element,
		this.cancelButton.$element
	);

	this.connect( this, {
		'done': 'close',
		'close': [ 'emit', 'cancel' ]
	} );
};

/*
 * Open a confirmation dialog.
 *
 * @param {Object} [data] Window opening data including text of the dialog and text for the buttons
 * @param {jQuery|string} [data.prompt] Text to display or list of nodes to use as content of the dialog.
 * @param {jQuery|string|Function|null} [data.okLabel] Label of the OK button
 * @param {jQuery|string|Function|null} [data.cancelLabel] Label of the cancel button
 * @param {string|string[]} [data.okFlags="constructive"] Flags for the OK button
 * @param {string|string[]} [data.cancelFlags="destructive"] Flags for the cancel button
 */
OO.ui.ConfirmationDialog.prototype.setup = function ( data ) {
	// Parent method
	OO.ui.Dialog.prototype.setup.call( this, data );

	var prompt = data.prompt || OO.ui.deferMsg( 'ooui-dialog-confirm-default-prompt' ),
		okLabel = data.okLabel || OO.ui.deferMsg( 'ooui-dialog-confirm-default-ok' ),
		cancelLabel = data.cancelLabel || OO.ui.deferMsg( 'ooui-dialog-confirm-default-cancel' ),
		okFlags = data.okFlags || 'constructive',
		cancelFlags = data.cancelFlags || 'destructive';

	if ( typeof prompt === 'string' ) {
		this.$promptContainer.text( prompt );
	} else {
		this.$promptContainer.empty().append( prompt );
	}

	this.okButton.setLabel( okLabel ).clearFlags().setFlags( okFlags );
	this.cancelButton.setLabel( cancelLabel ).clearFlags().setFlags( cancelFlags );
};
