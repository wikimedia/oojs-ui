/**
 * Base class for all dialogs.
 *
 * Logic:
 * - Manage the window (open and close, etc.).
 * - Store the internal name and display title.
 * - A stack to track one or more pending actions.
 * - Manage a set of actions that can be performed.
 * - Configure and create action widgets.
 *
 * User interface:
 * - Close the dialog with Escape key.
 * - Visually lock the dialog while an action is in
 *   progress (aka "pending").
 *
 * Subclass responsibilities:
 * - Display the title somewhere.
 * - Add content to the dialog.
 * - Provide a UI to close the dialog.
 * - Display the action widgets somewhere.
 *
 * @abstract
 * @class
 * @extends OO.ui.Window
 * @mixins OO.ui.PendingElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.Dialog = function OoUiDialog( config ) {
	// Parent constructor
	OO.ui.Dialog.super.call( this, config );

	// Mixin constructors
	OO.ui.PendingElement.call( this );

	// Properties
	this.actions = new OO.ui.ActionSet();
	this.attachedActions = [];
	this.currentAction = null;
	this.onDocumentKeyDownHandler = this.onDocumentKeyDown.bind( this );

	// Events
	this.actions.connect( this, {
		click: 'onActionClick',
		resize: 'onActionResize',
		change: 'onActionsChange'
	} );

	// Initialization
	this.$element
		.addClass( 'oo-ui-dialog' )
		.attr( 'role', 'dialog' );
};

/* Setup */

OO.inheritClass( OO.ui.Dialog, OO.ui.Window );
OO.mixinClass( OO.ui.Dialog, OO.ui.PendingElement );

/* Static Properties */

/**
 * Symbolic name of dialog.
 *
 * @abstract
 * @static
 * @inheritable
 * @property {string}
 */
OO.ui.Dialog.static.name = '';

/**
 * Dialog title.
 *
 * @abstract
 * @static
 * @inheritable
 * @property {jQuery|string|Function} Label nodes, text or a function that returns nodes or text
 */
OO.ui.Dialog.static.title = '';

/**
 * List of OO.ui.ActionWidget configuration options.
 *
 * @static
 * inheritable
 * @property {Object[]}
 */
OO.ui.Dialog.static.actions = [];

/**
 * Close dialog when the escape key is pressed.
 *
 * @static
 * @abstract
 * @inheritable
 * @property {boolean}
 */
OO.ui.Dialog.static.escapable = true;

/* Methods */

/**
 * Handle frame document key down events.
 *
 * @param {jQuery.Event} e Key down event
 */
OO.ui.Dialog.prototype.onDocumentKeyDown = function ( e ) {
	if ( e.which === OO.ui.Keys.ESCAPE ) {
		this.close();
		return false;
	}
};

/**
 * Handle action resized events.
 *
 * @param {OO.ui.ActionWidget} action Action that was resized
 */
OO.ui.Dialog.prototype.onActionResize = function () {
	// Override in subclass
};

/**
 * Handle action click events.
 *
 * @param {OO.ui.ActionWidget} action Action that was clicked
 */
OO.ui.Dialog.prototype.onActionClick = function ( action ) {
	if ( !this.isPending() ) {
		this.currentAction = action;
		this.executeAction( action.getAction() );
	}
};

/**
 * Handle actions change event.
 */
OO.ui.Dialog.prototype.onActionsChange = function () {
	this.detachActions();
	if ( !this.isClosing() ) {
		this.attachActions();
	}
};

/**
 * Get set of actions.
 *
 * @return {OO.ui.ActionSet}
 */
OO.ui.Dialog.prototype.getActions = function () {
	return this.actions;
};

/**
 * Get a process for taking action.
 *
 * When you override this method, you can add additional accept steps to the process the parent
 * method provides using the 'first' and 'next' methods.
 *
 * @abstract
 * @param {string} [action] Symbolic name of action
 * @return {OO.ui.Process} Action process
 */
OO.ui.Dialog.prototype.getActionProcess = function ( action ) {
	return new OO.ui.Process()
		.next( function () {
			if ( !action ) {
				// An empty action always closes the dialog without data, which should always be
				// safe and make no changes
				this.close();
			}
		}, this );
};

/**
 * @inheritdoc
 *
 * @param {Object} [data] Dialog opening data
 * @param {jQuery|string|Function|null} [data.title] Dialog title, omit to use #static-title
 * @param {Object[]} [data.actions] List of OO.ui.ActionWidget configuration options for each
 *   action item, omit to use #static-actions
 */
OO.ui.Dialog.prototype.getSetupProcess = function ( data ) {
	data = data || {};

	// Parent method
	return OO.ui.Dialog.super.prototype.getSetupProcess.call( this, data )
		.next( function () {
			var i, len,
				items = [],
				config = this.constructor.static,
				actions = data.actions !== undefined ? data.actions : config.actions;

			this.title.setLabel(
				data.title !== undefined ? data.title : this.constructor.static.title
			);
			for ( i = 0, len = actions.length; i < len; i++ ) {
				items.push(
					new OO.ui.ActionWidget( $.extend( { $: this.$ }, actions[i] ) )
				);
			}
			this.actions.add( items );

			if ( this.constructor.static.escapable ) {
				this.$document.on( 'keydown', this.onDocumentKeyDownHandler );
			}
		}, this );
};

/**
 * @inheritdoc
 */
OO.ui.Dialog.prototype.getTeardownProcess = function ( data ) {
	// Parent method
	return OO.ui.Dialog.super.prototype.getTeardownProcess.call( this, data )
		.first( function () {
			if ( this.constructor.static.escapable ) {
				this.$document.off( 'keydown', this.onDocumentKeyDownHandler );
			}

			this.actions.clear();
			this.currentAction = null;
		}, this );
};

/**
 * @inheritdoc
 */
OO.ui.Dialog.prototype.initialize = function () {
	// Parent method
	OO.ui.Dialog.super.prototype.initialize.call( this );

	// Properties
	this.title = new OO.ui.LabelWidget( { $: this.$ } );

	// Initialization
	this.$content.addClass( 'oo-ui-dialog-content' );
	this.setPendingElement( this.$head );
};

/**
 * Attach action actions.
 */
OO.ui.Dialog.prototype.attachActions = function () {
	// Remember the list of potentially attached actions
	this.attachedActions = this.actions.get();
};

/**
 * Detach action actions.
 *
 * @chainable
 */
OO.ui.Dialog.prototype.detachActions = function () {
	var i, len;

	// Detach all actions that may have been previously attached
	for ( i = 0, len = this.attachedActions.length; i < len; i++ ) {
		this.attachedActions[i].$element.detach();
	}
	this.attachedActions = [];
};

/**
 * Execute an action.
 *
 * @param {string} action Symbolic name of action to execute
 * @return {jQuery.Promise} Promise resolved when action completes, rejected if it fails
 */
OO.ui.Dialog.prototype.executeAction = function ( action ) {
	this.pushPending();
	return this.getActionProcess( action ).execute()
		.always( this.popPending.bind( this ) );
};
