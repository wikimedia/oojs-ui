/**
 * MessageDialogs display a confirmation or alert message. By default, the rendered dialog box
 * consists of a header that contains the dialog title, a body with the message, and a footer that
 * contains any {@link OO.ui.ActionWidget action widgets}. The MessageDialog class is the only type
 * of {@link OO.ui.Dialog dialog} that is usually instantiated directly.
 *
 * There are two basic types of message dialogs, confirmation and alert:
 *
 * - **confirmation**: the dialog title describes what a progressive action will do and the message
 *   provides more details about the consequences.
 * - **alert**: the dialog title describes which event occurred and the message provides more
 *   information about why the event occurred.
 *
 * The MessageDialog class specifies two actions: ‘accept’, the primary
 * action (e.g., ‘ok’) and ‘reject,’ the safe action (e.g., ‘cancel’). Both will close the window,
 * passing along the selected action.
 *
 * For more information and examples, please see the [OOUI documentation on MediaWiki][1].
 *
 *     @example
 *     // Example: Creating and opening a message dialog window.
 *     const messageDialog = new OO.ui.MessageDialog();
 *
 *     // Create and append a window manager.
 *     const windowManager = new OO.ui.WindowManager();
 *     $( document.body ).append( windowManager.$element );
 *     windowManager.addWindows( [ messageDialog ] );
 *     // Open the window.
 *     windowManager.openWindow( messageDialog, {
 *         title: 'Basic message dialog',
 *         message: 'This is the message'
 *     } );
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Windows/Message_Dialogs
 *
 * @class
 * @extends OO.ui.Dialog
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.MessageDialog = function OoUiMessageDialog( config ) {
	// Parent constructor
	OO.ui.MessageDialog.super.call( this, config );

	// Properties
	this.verticalActionLayout = null;

	// Initialization
	this.$element.addClass( 'oo-ui-messageDialog' );
};

/* Setup */

OO.inheritClass( OO.ui.MessageDialog, OO.ui.Dialog );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.MessageDialog.static.name = 'message';

/**
 * @static
 * @inheritdoc
 */
OO.ui.MessageDialog.static.size = 'small';

/**
 * Dialog title.
 *
 * The title of a confirmation dialog describes what a progressive action will do. The
 * title of an alert dialog describes which event occurred.
 *
 * @static
 * @property {jQuery|string|Function|null}
 */
OO.ui.MessageDialog.static.title = null;

/**
 * The message displayed in the dialog body.
 *
 * A confirmation message describes the consequences of a progressive action. An alert
 * message describes why an event occurred.
 *
 * @static
 * @property {jQuery|string|Function|null}
 */
OO.ui.MessageDialog.static.message = null;

/**
 * @static
 * @inheritdoc
 */
OO.ui.MessageDialog.static.actions = [
	// Note that OO.ui.alert() and OO.ui.confirm() rely on these.
	{ action: 'accept', label: OO.ui.deferMsg( 'ooui-dialog-message-accept' ), flags: 'primary' },
	{ action: 'reject', label: OO.ui.deferMsg( 'ooui-dialog-message-reject' ), flags: 'safe' }
];

/* Methods */

/**
 * Toggle action layout between vertical and horizontal.
 *
 * @private
 * @param {boolean} [value] Layout actions vertically, omit to toggle
 * @chainable
 * @return {OO.ui.MessageDialog} The dialog, for chaining
 */
OO.ui.MessageDialog.prototype.toggleVerticalActionLayout = function ( value ) {
	value = value === undefined ? !this.verticalActionLayout : !!value;

	if ( value !== this.verticalActionLayout ) {
		this.verticalActionLayout = value;
		this.$actions
			.toggleClass( 'oo-ui-messageDialog-actions-vertical', value )
			.toggleClass( 'oo-ui-messageDialog-actions-horizontal', !value );
	}

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.getActionProcess = function ( action ) {
	if ( action ) {
		return new OO.ui.Process( function () {
			this.close( { action: action } );
		}, this );
	}
	return OO.ui.MessageDialog.super.prototype.getActionProcess.call( this, action );
};

/**
 * @inheritdoc
 *
 * @param {Object} [data] Dialog opening data
 * @param {jQuery|string|Function|null} [data.title] Description of the action being confirmed
 * @param {jQuery|string|Function|null} [data.message] Description of the action's consequence
 * @param {string} [data.size] Symbolic name of the dialog size, see OO.ui.Window
 * @param {Object[]} [data.actions] List of OO.ui.ActionOptionWidget configuration options for each
 *  action item
 */
OO.ui.MessageDialog.prototype.getSetupProcess = function ( data ) {
	data = data || {};

	// Parent method
	return OO.ui.MessageDialog.super.prototype.getSetupProcess.call( this, data )
		.next( function () {
			this.title.setLabel(
				data.title !== undefined ? data.title : this.constructor.static.title
			);
			this.message.setLabel(
				data.message !== undefined ? data.message : this.constructor.static.message
			);
			this.size = data.size !== undefined ? data.size : this.constructor.static.size;
		}, this );
};

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.getReadyProcess = function ( data ) {
	data = data || {};

	// Parent method
	return OO.ui.MessageDialog.super.prototype.getReadyProcess.call( this, data )
		.next( function () {
			// Focus the primary action button
			let actions = this.actions.get();
			actions = actions.filter( ( action ) => action.getFlags().indexOf( 'primary' ) > -1 );
			if ( actions.length > 0 ) {
				actions[ 0 ].focus();
			}
		}, this );
};

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.getBodyHeight = function () {
	const $scrollable = this.container.$element;

	const oldOverflow = $scrollable[ 0 ].style.overflow;
	$scrollable[ 0 ].style.overflow = 'hidden';

	OO.ui.Element.static.reconsiderScrollbars( $scrollable[ 0 ] );

	const bodyHeight = this.text.$element.outerHeight( true );
	$scrollable[ 0 ].style.overflow = oldOverflow;

	return bodyHeight;
};

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.setDimensions = function ( dim ) {
	const dialog = this,
		$scrollable = this.container.$element;

	// Parent method
	OO.ui.MessageDialog.super.prototype.setDimensions.call( this, dim );

	// Twiddle the overflow property, otherwise an unnecessary scrollbar will be produced.
	// Need to do it after transition completes (250ms), add 50ms just in case.
	setTimeout( () => {
		const oldOverflow = $scrollable[ 0 ].style.overflow,
			activeElement = document.activeElement;

		$scrollable[ 0 ].style.overflow = 'hidden';

		OO.ui.Element.static.reconsiderScrollbars( $scrollable[ 0 ] );

		// Check reconsiderScrollbars didn't destroy our focus, as we
		// are doing this after the ready process.
		if ( activeElement && activeElement !== document.activeElement && activeElement.focus ) {
			activeElement.focus();
		}

		$scrollable[ 0 ].style.overflow = oldOverflow;
	}, 300 );

	dialog.fitActions();
	// Wait for CSS transition to finish and do it again :(
	setTimeout( () => {
		dialog.fitActions();
	}, 300 );

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.initialize = function () {
	// Parent method
	OO.ui.MessageDialog.super.prototype.initialize.call( this );

	// Properties
	this.$actions = $( '<div>' );
	this.container = new OO.ui.PanelLayout( {
		scrollable: true, classes: [ 'oo-ui-messageDialog-container' ]
	} );
	this.text = new OO.ui.PanelLayout( {
		padded: true, expanded: false, classes: [ 'oo-ui-messageDialog-text' ]
	} );
	this.message = new OO.ui.LabelWidget( {
		classes: [ 'oo-ui-messageDialog-message' ]
	} );

	// Initialization
	this.title.$element.addClass( 'oo-ui-messageDialog-title' );
	this.$content.addClass( 'oo-ui-messageDialog-content' );
	this.container.$element.append( this.text.$element );
	this.text.$element.append( this.title.$element, this.message.$element );
	this.$body.append( this.container.$element );
	this.$actions.addClass( 'oo-ui-messageDialog-actions' );
	this.$foot.append( this.$actions );
};

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.getActionWidgetConfig = function ( config ) {
	// Force unframed
	return $.extend( {}, config, { framed: false } );
};

/**
 * @inheritdoc
 */
OO.ui.MessageDialog.prototype.attachActions = function () {
	// Parent method
	OO.ui.MessageDialog.super.prototype.attachActions.call( this );

	const special = this.actions.getSpecial();
	const others = this.actions.getOthers();

	if ( special.safe ) {
		this.$actions.append( special.safe.$element );
		special.safe.toggleFramed( true );
	}
	for ( let i = 0, len = others.length; i < len; i++ ) {
		this.$actions.append( others[ i ].$element );
		others[ i ].toggleFramed( true );
	}
	if ( special.primary ) {
		this.$actions.append( special.primary.$element );
		special.primary.toggleFramed( true );
	}
};

/**
 * Fit action actions into columns or rows.
 *
 * Columns will be used if all labels can fit without overflow, otherwise rows will be used.
 *
 * @private
 */
OO.ui.MessageDialog.prototype.fitActions = function () {
	const previous = this.verticalActionLayout;

	// Detect clipping
	this.toggleVerticalActionLayout( false );
	if ( this.$actions[ 0 ].scrollWidth > this.$actions[ 0 ].clientWidth ) {
		this.toggleVerticalActionLayout( true );
	}

	// Move the body out of the way of the foot
	this.$body.css( 'bottom', this.$foot.outerHeight( true ) );

	if ( this.verticalActionLayout !== previous ) {
		// We changed the layout, window height might need to be updated.
		this.updateSize();
	}
};
