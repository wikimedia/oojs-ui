/**
 * ProcessDialog windows encapsulate a {@link OO.ui.Process process} and all of the code necessary
 * to complete it. If the process terminates with an error, a customizable {@link OO.ui.Error error
 * interface} alerts users to the trouble, permitting the user to dismiss the error and try again
 * when relevant. The ProcessDialog class is always extended and customized with the actions and
 * content required for each process.
 *
 * The process dialog box consists of a header that visually represents the ‘working’ state of long
 * processes with an animation. The header contains the dialog title as well as
 * two {@link OO.ui.ActionWidget action widgets}:  a ‘safe’ action on the left (e.g., ‘Cancel’) and
 * a ‘primary’ action on the right (e.g., ‘Done’).
 *
 * Like other windows, the process dialog is managed by a
 * {@link OO.ui.WindowManager window manager}.
 * Please see the [OOUI documentation on MediaWiki][1] for more information and examples.
 *
 *     @example
 *     // Example: Creating and opening a process dialog window.
 *     function MyProcessDialog( config ) {
 *         MyProcessDialog.super.call( this, config );
 *     }
 *     OO.inheritClass( MyProcessDialog, OO.ui.ProcessDialog );
 *
 *     MyProcessDialog.static.name = 'myProcessDialog';
 *     MyProcessDialog.static.title = 'Process dialog';
 *     MyProcessDialog.static.actions = [
 *         { action: 'save', label: 'Done', flags: 'primary' },
 *         { label: 'Cancel', flags: 'safe' }
 *     ];
 *
 *     MyProcessDialog.prototype.initialize = function () {
 *         MyProcessDialog.super.prototype.initialize.apply( this, arguments );
 *         this.content = new OO.ui.PanelLayout( { padded: true, expanded: false } );
 *         this.content.$element.append( '<p>This is a process dialog window. The header ' +
 *             'contains the title and two buttons: \'Cancel\' (a safe action) on the left and ' +
 *             '\'Done\' (a primary action)  on the right.</p>' );
 *         this.$body.append( this.content.$element );
 *     };
 *     MyProcessDialog.prototype.getActionProcess = function ( action ) {
 *         if ( action ) {
 *             return new OO.ui.Process( () => {
 *                 this.close( { action: action } );
 *             } );
 *         }
 *         return MyProcessDialog.super.prototype.getActionProcess.call( this, action );
 *     };
 *
 *     const windowManager = new OO.ui.WindowManager();
 *     $( document.body ).append( windowManager.$element );
 *
 *     const dialog = new MyProcessDialog();
 *     windowManager.addWindows( [ dialog ] );
 *     windowManager.openWindow( dialog );
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Windows/Process_Dialogs
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

	// Properties
	this.fitOnOpen = false;

	// Initialization
	this.$element.addClass( 'oo-ui-processDialog' );
	if ( OO.ui.isMobile() ) {
		this.$element.addClass( 'oo-ui-isMobile' );
	}
};

/* Setup */

OO.inheritClass( OO.ui.ProcessDialog, OO.ui.Dialog );

/* Methods */

/**
 * Handle dismiss button click events.
 *
 * Hides errors.
 *
 * @private
 */
OO.ui.ProcessDialog.prototype.onDismissErrorButtonClick = function () {
	this.hideErrors();
};

/**
 * Handle retry button click events.
 *
 * Hides errors and then tries again.
 *
 * @private
 */
OO.ui.ProcessDialog.prototype.onRetryButtonClick = function () {
	this.hideErrors();
	this.executeAction( this.currentAction );
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
	this.dismissButton.connect( this, {
		click: 'onDismissErrorButtonClick'
	} );
	this.retryButton.connect( this, {
		click: 'onRetryButtonClick'
	} );
	this.title.connect( this, {
		labelChange: 'fitLabel'
	} );

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
		.append(
			this.$errorsTitle,
			$( '<div>' ).addClass( 'oo-ui-processDialog-errors-actions' ).append(
				this.dismissButton.$element, this.retryButton.$element
			)
		);
	this.$content
		.addClass( 'oo-ui-processDialog-content' )
		.append( this.$errors );
	this.$navigation
		.addClass( 'oo-ui-processDialog-navigation' )
		// Note: Order of appends below is important. These are in the order
		// we want tab to go through them. Display-order is handled entirely
		// by CSS absolute-positioning. As such, primary actions like "done"
		// should go first.
		.append( this.$primaryActions, this.$location, this.$safeActions );
	this.$head.append( this.$navigation );
	this.$foot.append( this.$otherActions );
};

/**
 * @inheritdoc
 */
OO.ui.ProcessDialog.prototype.getActionWidgetConfig = function ( config ) {
	function checkFlag( flag ) {
		return config.flags === flag ||
			( Array.isArray( config.flags ) && config.flags.includes( flag ) );
	}

	config = Object.assign( { framed: true }, config );
	if ( checkFlag( 'close' ) ) {
		// Change close buttons to icon only.
		Object.assign( config, {
			icon: 'close',
			invisibleLabel: true
		} );
	} else if ( checkFlag( 'back' ) ) {
		// Change back buttons to icon only.
		Object.assign( config, {
			icon: 'previous',
			invisibleLabel: true
		} );
	}

	return config;
};

/**
 * @inheritdoc
 */
OO.ui.ProcessDialog.prototype.attachActions = function () {
	// Parent method
	OO.ui.ProcessDialog.super.prototype.attachActions.call( this );

	const special = this.actions.getSpecial();
	const others = this.actions.getOthers();
	if ( special.primary ) {
		this.$primaryActions.append( special.primary.$element );
	}
	for ( let i = 0, len = others.length; i < len; i++ ) {
		const other = others[ i ];
		this.$otherActions.append( other.$element );
	}
	if ( special.safe ) {
		this.$safeActions.append( special.safe.$element );
	}
};

/**
 * @inheritdoc
 */
OO.ui.ProcessDialog.prototype.executeAction = function ( action ) {
	return OO.ui.ProcessDialog.super.prototype.executeAction.call( this, action )
		.fail( ( errors ) => {
			this.showErrors( errors || [] );
		} );
};

/**
 * @inheritdoc
 */
OO.ui.ProcessDialog.prototype.setDimensions = function () {
	// Parent method
	OO.ui.ProcessDialog.super.prototype.setDimensions.apply( this, arguments );

	this.fitLabel();

	// If there are many actions, they might be shown on multiple lines. Their layout can change
	// when resizing the dialog and when changing the actions. Adjust the height of the footer to
	// fit them.
	this.$body.css( 'bottom', this.$foot.outerHeight( true ) );
	// Wait for CSS transition to finish and do it again :(
	setTimeout( () => {
		this.$body.css( 'bottom', this.$foot.outerHeight( true ) );
	}, 300 );
};

/**
 * Fit label between actions.
 *
 * @private
 * @chainable
 * @return {OO.ui.MessageDialog} The dialog, for chaining
 */
OO.ui.ProcessDialog.prototype.fitLabel = function () {
	const size = this.getSizeProperties();

	let navigationWidth;
	if ( typeof size.width !== 'number' ) {
		if ( this.isOpened() ) {
			navigationWidth = this.$head.width() - 20;
		} else if ( this.isOpening() ) {
			if ( !this.fitOnOpen ) {
				// Size is relative and the dialog isn't open yet, so wait.
				// FIXME: This should ideally be handled by setup somehow.
				this.manager.lifecycle.opened.done( this.fitLabel.bind( this ) );
				this.fitOnOpen = true;
			}
			return;
		} else {
			return;
		}
	} else {
		navigationWidth = size.width - 20;
	}

	const safeWidth = this.$safeActions.width();
	const primaryWidth = this.$primaryActions.width();
	const biggerWidth = Math.max( safeWidth, primaryWidth );

	const labelWidth = this.title.$element.width();

	let leftWidth, rightWidth;
	if ( !OO.ui.isMobile() && 2 * biggerWidth + labelWidth < navigationWidth ) {
		// We have enough space to center the label
		leftWidth = rightWidth = biggerWidth;
	} else {
		// Let's hope we at least have enough space not to overlap, because we can't wrap
		// the label.
		if ( this.getDir() === 'ltr' ) {
			leftWidth = safeWidth;
			rightWidth = primaryWidth;
		} else {
			leftWidth = primaryWidth;
			rightWidth = safeWidth;
		}
	}

	this.$location.css( { paddingLeft: leftWidth, paddingRight: rightWidth } );

	return this;
};

/**
 * Handle errors that occurred during accept or reject processes.
 *
 * @private
 * @param {OO.ui.Error[]|OO.ui.Error} errors Errors to be handled
 */
OO.ui.ProcessDialog.prototype.showErrors = function ( errors ) {
	const items = [],
		abilities = {};
	let recoverable = true,
		warning = false;

	if ( errors instanceof OO.ui.Error ) {
		errors = [ errors ];
	}

	for ( let i = 0, len = errors.length; i < len; i++ ) {
		if ( !errors[ i ].isRecoverable() ) {
			recoverable = false;
		}
		if ( errors[ i ].isWarning() ) {
			warning = true;
		}
		items.push( new OO.ui.MessageWidget( {
			type: errors[ i ].isWarning() ? 'warning' : 'error',
			label: errors[ i ].getMessage()
		} ).$element[ 0 ] );
	}
	this.$errorItems = $( items );
	if ( recoverable ) {
		abilities[ this.currentAction ] = true;
		// Copy the flags from the first matching action.
		const actions = this.actions.get( { actions: this.currentAction } );
		if ( actions.length ) {
			this.retryButton.clearFlags().setFlags( actions[ 0 ].getFlags() );
		}
	} else {
		abilities[ this.currentAction ] = false;
		this.actions.setAbilities( abilities );
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
 *
 * @private
 */
OO.ui.ProcessDialog.prototype.hideErrors = function () {
	this.$errors.addClass( 'oo-ui-element-hidden' );
	if ( this.$errorItems ) {
		this.$errorItems.remove();
		this.$errorItems = null;
	}
};

/**
 * @inheritdoc
 */
OO.ui.ProcessDialog.prototype.getTeardownProcess = function ( data ) {
	// Parent method
	return OO.ui.ProcessDialog.super.prototype.getTeardownProcess.call( this, data )
		.first( () => {
			// Make sure to hide errors.
			this.hideErrors();
			this.fitOnOpen = false;
		} );
};
