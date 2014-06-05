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
	this.cancelButton.connect( this, { 'click': [ 'close', 'cancel' ] } );

	this.okButton = new OO.ui.ButtonWidget();
	this.okButton.connect( this, { 'click': [ 'close', 'ok' ] } );

	// Make the buttons
	contentLayout.$element.append( this.$promptContainer );
	this.$body.append( contentLayout.$element );

	this.$foot.append(
		this.okButton.$element,
		this.cancelButton.$element
	);

	this.connect( this, { 'close': [ 'close', 'cancel' ] } );
};

/*
 * Setup a confirmation dialog.
 *
 * @param {Object} [data] Window opening data including text of the dialog and text for the buttons
 * @param {jQuery|string} [data.prompt] Text to display or list of nodes to use as content of the dialog.
 * @param {jQuery|string|Function|null} [data.okLabel] Label of the OK button
 * @param {jQuery|string|Function|null} [data.cancelLabel] Label of the cancel button
 * @param {string|string[]} [data.okFlags="constructive"] Flags for the OK button
 * @param {string|string[]} [data.cancelFlags="destructive"] Flags for the cancel button
 * @return {OO.ui.Process} Setup process
 */
OO.ui.ConfirmationDialog.prototype.getSetupProcess = function ( data ) {
	// Parent method
	return OO.ui.ConfirmationDialog.super.prototype.getSetupProcess.call( this, data )
		.next( function () {
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
		}, this );
};

/**
 * @inheritdoc
 */
OO.ui.ConfirmationDialog.prototype.getTeardownProcess = function ( data ) {
	// Parent method
	return OO.ui.ConfirmationDialog.super.prototype.getTeardownProcess.call( this, data )
		.first( function () {
			if ( data === 'ok' ) {
				this.opened.resolve();
			} else if ( data === 'cancel' ) {
				this.opened.reject();
			}
		}, this );
};
