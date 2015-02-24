/**
 * Navigation dialog window.
 *
 * Logic:
 * - Show and hide errors.
 * - Retry an action.
 *
 * User interface:
 * - Renders header with dialog title and one action widget on either side
 *   (a 'safe' button on the left, and a 'primary' button on the right, both of
 *   which close the dialog).
 * - Displays any action widgets in the footer (none by default).
 * - Ability to dismiss errors.
 *
 * Subclass responsibilities:
 * - Register a 'safe' action.
 * - Register a 'primary' action.
 * - Add content to the dialog.
 *
 * @abstract
 * @class
 * @extends OO.ui.Dialog
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.ProcessDialog = function OoUiProcessDialog( config ) {
	// Parent constructor
	OO.ui.ProcessDialog.super.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-processDialog' );
};

/* Setup */

OO.inheritClass( OO.ui.ProcessDialog, OO.ui.Dialog );

/* Methods */

/**
 * Handle dismiss button click events.
 *
 * Hides errors.
 */
OO.ui.ProcessDialog.prototype.onDismissErrorButtonClick = function () {
	this.hideErrors();
};

/**
 * Handle retry button click events.
 *
 * Hides errors and then tries again.
 */
OO.ui.ProcessDialog.prototype.onRetryButtonClick = function () {
	this.hideErrors();
	this.executeAction( this.currentAction.getAction() );
};

/**
 * @inheritdoc
 */
OO.ui.ProcessDialog.prototype.onActionResize = function ( action ) {
	if ( this.actions.isSpecial( action ) ) {
		this.fitLabel();
	}
	return OO.ui.ProcessDialog.super.prototype.onActionResize.call( this, action );
};

/**
 * @inheritdoc
 */
OO.ui.ProcessDialog.prototype.initialize = function () {
	// Parent method
	OO.ui.ProcessDialog.super.prototype.initialize.call( this );

	// Properties
	this.$navigation = $( '<div>' );
	this.$location = $( '<div>' );
	this.$safeActions = $( '<div>' );
	this.$primaryActions = $( '<div>' );
	this.$otherActions = $( '<div>' );
	this.dismissButton = new OO.ui.ButtonWidget( {
		label: OO.ui.msg( 'ooui-dialog-process-dismiss' )
	} );
	this.retryButton = new OO.ui.ButtonWidget();
	this.$errors = $( '<div>' );
	this.$errorsTitle = $( '<div>' );

	// Events
	this.dismissButton.connect( this, { click: 'onDismissErrorButtonClick' } );
	this.retryButton.connect( this, { click: 'onRetryButtonClick' } );

	// Initialization
	this.title.$element.addClass( 'oo-ui-processDialog-title' );
	this.$location
		.append( this.title.$element )
		.addClass( 'oo-ui-processDialog-location' );
	this.$safeActions.addClass( 'oo-ui-processDialog-actions-safe' );
	this.$primaryActions.addClass( 'oo-ui-processDialog-actions-primary' );
	this.$otherActions.addClass( 'oo-ui-processDialog-actions-other' );
	this.$errorsTitle
		.addClass( 'oo-ui-processDialog-errors-title' )
		.text( OO.ui.msg( 'ooui-dialog-process-error' ) );
	this.$errors
		.addClass( 'oo-ui-processDialog-errors oo-ui-element-hidden' )
		.append( this.$errorsTitle, this.dismissButton.$element, this.retryButton.$element );
	this.$content
		.addClass( 'oo-ui-processDialog-content' )
		.append( this.$errors );
	this.$navigation
		.addClass( 'oo-ui-processDialog-navigation' )
		.append( this.$safeActions, this.$location, this.$primaryActions );
	this.$head.append( this.$navigation );
	this.$foot.append( this.$otherActions );
};

/**
 * @inheritdoc
 */
OO.ui.ProcessDialog.prototype.attachActions = function () {
	var i, len, other, special, others;

	// Parent method
	OO.ui.ProcessDialog.super.prototype.attachActions.call( this );

	special = this.actions.getSpecial();
	others = this.actions.getOthers();
	if ( special.primary ) {
		this.$primaryActions.append( special.primary.$element );
		special.primary.toggleFramed( true );
	}
	for ( i = 0, len = others.length; i < len; i++ ) {
		other = others[ i ];
		this.$otherActions.append( other.$element );
		other.toggleFramed( true );
	}
	if ( special.safe ) {
		this.$safeActions.append( special.safe.$element );
		special.safe.toggleFramed( true );
	}

	this.fitLabel();
	this.$body.css( 'bottom', this.$foot.outerHeight( true ) );
};

/**
 * @inheritdoc
 */
OO.ui.ProcessDialog.prototype.executeAction = function ( action ) {
	OO.ui.ProcessDialog.super.prototype.executeAction.call( this, action )
		.fail( this.showErrors.bind( this ) );
};

/**
 * Fit label between actions.
 *
 * @chainable
 */
OO.ui.ProcessDialog.prototype.fitLabel = function () {
	var width = Math.max(
		this.$safeActions.is( ':visible' ) ? this.$safeActions.width() : 0,
		this.$primaryActions.is( ':visible' ) ? this.$primaryActions.width() : 0
	);
	this.$location.css( { paddingLeft: width, paddingRight: width } );

	return this;
};

/**
 * Handle errors that occurred during accept or reject processes.
 *
 * @param {OO.ui.Error[]} errors Errors to be handled
 */
OO.ui.ProcessDialog.prototype.showErrors = function ( errors ) {
	var i, len, $item,
		items = [],
		recoverable = true,
		warning = false;

	for ( i = 0, len = errors.length; i < len; i++ ) {
		if ( !errors[ i ].isRecoverable() ) {
			recoverable = false;
		}
		if ( errors[ i ].isWarning() ) {
			warning = true;
		}
		$item = $( '<div>' )
			.addClass( 'oo-ui-processDialog-error' )
			.append( errors[ i ].getMessage() );
		items.push( $item[ 0 ] );
	}
	this.$errorItems = $( items );
	if ( recoverable ) {
		this.retryButton.clearFlags().setFlags( this.currentAction.getFlags() );
	} else {
		this.currentAction.setDisabled( true );
	}
	if ( warning ) {
		this.retryButton.setLabel( OO.ui.msg( 'ooui-dialog-process-continue' ) );
	} else {
		this.retryButton.setLabel( OO.ui.msg( 'ooui-dialog-process-retry' ) );
	}
	this.retryButton.toggle( recoverable );
	this.$errorsTitle.after( this.$errorItems );
	this.$errors.removeClass( 'oo-ui-element-hidden' ).scrollTop( 0 );
};

/**
 * Hide errors.
 */
OO.ui.ProcessDialog.prototype.hideErrors = function () {
	this.$errors.addClass( 'oo-ui-element-hidden' );
	this.$errorItems.remove();
	this.$errorItems = null;
};
