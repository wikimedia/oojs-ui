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

	this.$promptContainer = this.$( '<div>' ).addClass( 'oo-ui-dialog-confirmation-container' );

	this.cancelButton = new OO.ui.ButtonWidget( {
		'flags': [ 'destructive' ]
	} );
	this.cancelButton.connect( this, { 'click': [ 'emit', 'cancel' ] } );

	this.okButton = new OO.ui.ButtonWidget( {
		'flags': [ 'constructive' ]
	} );
	this.okButton.connect( this, { 'click': [ 'emit', 'ok' ] } );

	// Make the buttons
	contentLayout.$element.append( this.$promptContainer );
	this.$body.append( contentLayout.$element );

	this.$foot.append(
		this.cancelButton.$element,
		this.okButton.$element
	);

	this.connect( this, {
		'ok': 'close',
		'cancel': 'close',
		'close': [ 'emit', 'cancel' ]
	} );
};

/*
 * Open a confirmation dialog.
 *
 * @param {object} [data] Window opening data including text of the dialog and text for the buttons
 * @param {jQuery|string} [data.prompt] The text of the dialog.
 * @param {jQuery|string|Function|null} [data.okLabel] The text used on the OK button
 * @param {jQuery|string|Function|null} [data.cancelLabel] The text used on the cancel button
 */
OO.ui.ConfirmationDialog.prototype.setup = function ( data ) {
	// Parent method
	OO.ui.Dialog.prototype.setup.call( this, data );

	var prompt = data.prompt || OO.ui.deferMsg( 'ooui-dialog-confirm-default-prompt' ),
		okLabel = data.okLabel || OO.ui.deferMsg( 'ooui-dialog-confirm-default-ok' ),
		cancelLabel = data.cancelLabel || OO.ui.deferMsg( 'ooui-dialog-confirm-default-cancel' );

	if ( typeof prompt === 'string' ) {
		this.$promptContainer.text( prompt );
	} else {
		this.$promptContainer.empty().append( prompt );
	}

	this.okButton.setLabel( okLabel );
	this.cancelButton.setLabel( cancelLabel );
};
