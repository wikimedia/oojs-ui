/**
 * The Dialog class serves as the base class for the other types of dialogs.
 * Unless extended to include controls, the rendered dialog box is a simple window
 * that users can close by hitting the Escape key. Dialog windows are used with OO.ui.WindowManager,
 * which opens, closes, and controls the presentation of the window. See the
 * [OOUI documentation on MediaWiki][1] for more information.
 *
 *     @example
 *     // A simple dialog window.
 *     function MyDialog( config ) {
 *         MyDialog.super.call( this, config );
 *     }
 *     OO.inheritClass( MyDialog, OO.ui.Dialog );
 *     MyDialog.static.name = 'myDialog';
 *     MyDialog.prototype.initialize = function () {
 *         MyDialog.super.prototype.initialize.call( this );
 *         this.content = new OO.ui.PanelLayout( { padded: true, expanded: false } );
 *         this.content.$element.append( '<p>A simple dialog window. Press Escape key to ' +
 *             'close.</p>' );
 *         this.$body.append( this.content.$element );
 *     };
 *     MyDialog.prototype.getBodyHeight = function () {
 *         return this.content.$element.outerHeight( true );
 *     };
 *     const myDialog = new MyDialog( {
 *         size: 'medium'
 *     } );
 *     // Create and append a window manager, which opens and closes the window.
 *     const windowManager = new OO.ui.WindowManager();
 *     $( document.body ).append( windowManager.$element );
 *     windowManager.addWindows( [ myDialog ] );
 *     // Open the window!
 *     windowManager.openWindow( myDialog );
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Windows/Dialogs
 *
 * @abstract
 * @class
 * @extends OO.ui.Window
 * @mixes OO.ui.mixin.PendingElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.Dialog = function OoUiDialog( config ) {
	// Parent constructor
	OO.ui.Dialog.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.PendingElement.call( this );

	// Properties
	this.actions = new OO.ui.ActionSet();
	this.attachedActions = [];
	this.currentAction = null;
	this.onDialogKeyDownHandler = this.onDialogKeyDown.bind( this );

	// Events
	this.actions.connect( this, {
		click: 'onActionClick',
		change: 'onActionsChange'
	} );

	// Initialization
	this.$element
		.addClass( 'oo-ui-dialog' )
		.attr( 'role', 'dialog' );
};

/* Setup */

OO.inheritClass( OO.ui.Dialog, OO.ui.Window );
OO.mixinClass( OO.ui.Dialog, OO.ui.mixin.PendingElement );

/* Static Properties */

/**
 * Symbolic name of dialog.
 *
 * The dialog class must have a symbolic name in order to be registered with OO.Factory.
 * Please see the [OOUI documentation on MediaWiki][3] for more information.
 *
 * [3]: https://www.mediawiki.org/wiki/OOUI/Windows/Window_managers
 *
 * @abstract
 * @static
 * @property {string}
 */
OO.ui.Dialog.static.name = '';

/**
 * The dialog title.
 *
 * The title can be specified as a plaintext string, a {@link OO.ui.mixin.LabelElement Label} node,
 * or a function that will produce a Label node or string. The title can also be specified with data
 * passed to the constructor (see #getSetupProcess). In this case, the static value will be
 * overridden.
 *
 * @abstract
 * @static
 * @property {jQuery|string|Function}
 */
OO.ui.Dialog.static.title = '';

/**
 * An array of configured {@link OO.ui.ActionWidget action widgets}.
 *
 * Actions can also be specified with data passed to the constructor (see #getSetupProcess). In this
 * case, the static value will be overridden.
 *
 * [2]: https://www.mediawiki.org/wiki/OOUI/Windows/Process_Dialogs#Action_sets
 *
 * @static
 * @property {Object[]}
 */
OO.ui.Dialog.static.actions = [];

/**
 * Close the dialog when the Escape key is pressed.
 *
 * @static
 * @abstract
 * @property {boolean}
 */
OO.ui.Dialog.static.escapable = true;

/* Methods */

/**
 * Handle frame document key down events.
 *
 * @private
 * @param {jQuery.Event} e Key down event
 */
OO.ui.Dialog.prototype.onDialogKeyDown = function ( e ) {
	if ( e.which === OO.ui.Keys.ESCAPE && this.constructor.static.escapable ) {
		this.executeAction( '' );
		e.preventDefault();
		e.stopPropagation();
	} else if ( e.which === OO.ui.Keys.ENTER && ( e.ctrlKey || e.metaKey ) ) {
		const actions = this.actions.get( { flags: 'primary', visible: true, disabled: false } );
		if ( actions.length > 0 ) {
			this.executeAction( actions[ 0 ].getAction() );
			e.preventDefault();
			e.stopPropagation();
		}
	}
};

/**
 * Handle action click events.
 *
 * @private
 * @param {OO.ui.ActionWidget} action Action that was clicked
 */
OO.ui.Dialog.prototype.onActionClick = function ( action ) {
	if ( !this.isPending() ) {
		this.executeAction( action.getAction() );
	}
};

/**
 * Handle actions change event.
 *
 * @private
 */
OO.ui.Dialog.prototype.onActionsChange = function () {
	this.detachActions();
	if ( !this.isClosing() ) {
		this.attachActions();
		if ( !this.isOpening() ) {
			// If the dialog is currently opening, this will be called automatically soon.
			this.updateSize();
		}
	}
};

/**
 * Get the set of actions used by the dialog.
 *
 * @return {OO.ui.ActionSet}
 */
OO.ui.Dialog.prototype.getActions = function () {
	return this.actions;
};

/**
 * Get a process for taking action.
 *
 * When you override this method, you can create a new OO.ui.Process and return it, or add
 * additional accept steps to the process the parent method provides using the
 * {@link OO.ui.Process#first 'first'} and {@link OO.ui.Process#next 'next'} methods of
 * OO.ui.Process.
 *
 * @param {string} [action] Symbolic name of action
 * @return {OO.ui.Process} Action process
 */
OO.ui.Dialog.prototype.getActionProcess = function ( action ) {
	return new OO.ui.Process()
		.next( () => {
			if ( !action ) {
				// An empty action always closes the dialog without data, which should always be
				// safe and make no changes
				this.close();
			}
		} );
};

/**
 * @inheritdoc
 *
 * @param {Object} [data] Dialog opening data
 * @param {jQuery|string|Function|null} [data.title] Dialog title, omit to use
 *  the {@link OO.ui.Dialog.static.title static title}
 * @param {Object[]} [data.actions] List of configuration options for each
 *   {@link OO.ui.ActionWidget action widget}, omit to use {@link OO.ui.Dialog.static.actions static actions}.
 */
OO.ui.Dialog.prototype.getSetupProcess = function ( data ) {
	data = data || {};

	// Parent method
	return OO.ui.Dialog.super.prototype.getSetupProcess.call( this, data )
		.next( () => {
			const config = this.constructor.static,
				actions = data.actions !== undefined ? data.actions : config.actions,
				title = data.title !== undefined ? data.title : config.title;

			this.title.setLabel( title );
			this.actions.add( this.getActionWidgets( actions ) );

			this.$element.on( 'keydown', this.onDialogKeyDownHandler );
		} );
};

/**
 * @inheritdoc
 */
OO.ui.Dialog.prototype.getTeardownProcess = function ( data ) {
	// Parent method
	return OO.ui.Dialog.super.prototype.getTeardownProcess.call( this, data )
		.first( () => {
			this.$element.off( 'keydown', this.onDialogKeyDownHandler );

			this.actions.clear();
			this.currentAction = null;
		} );
};

/**
 * @inheritdoc
 */
OO.ui.Dialog.prototype.initialize = function () {
	// Parent method
	OO.ui.Dialog.super.prototype.initialize.call( this );

	// Properties
	this.title = new OO.ui.LabelWidget();

	// Initialization
	this.$content.addClass( 'oo-ui-dialog-content' );
	this.$element.attr( 'aria-labelledby', this.title.getElementId() );
	this.setPendingElement( this.$head );
};

/**
 * Get action widgets from a list of configs
 *
 * @param {Object[]} actions Action widget configs
 * @return {OO.ui.ActionWidget[]} Action widgets
 */
OO.ui.Dialog.prototype.getActionWidgets = function ( actions ) {
	const widgets = [];
	for ( let i = 0, len = actions.length; i < len; i++ ) {
		widgets.push( this.getActionWidget( actions[ i ] ) );
	}
	return widgets;
};

/**
 * Get action widget from config
 *
 * Override this method to change the action widget class used.
 *
 * @param {Object} config Action widget config
 * @return {OO.ui.ActionWidget} Action widget
 */
OO.ui.Dialog.prototype.getActionWidget = function ( config ) {
	return new OO.ui.ActionWidget( this.getActionWidgetConfig( config ) );
};

/**
 * Get action widget config
 *
 * Override this method to modify the action widget config
 *
 * @param {Object} config Initial action widget config
 * @return {Object} Action widget config
 */
OO.ui.Dialog.prototype.getActionWidgetConfig = function ( config ) {
	return config;
};

/**
 * Attach action actions.
 *
 * @protected
 */
OO.ui.Dialog.prototype.attachActions = function () {
	// Remember the list of potentially attached actions
	this.attachedActions = this.actions.get();
};

/**
 * Detach action actions.
 *
 * @protected
 * @chainable
 * @return {OO.ui.Dialog} The dialog, for chaining
 */
OO.ui.Dialog.prototype.detachActions = function () {
	// Detach all actions that may have been previously attached
	for ( let i = 0, len = this.attachedActions.length; i < len; i++ ) {
		this.attachedActions[ i ].$element.detach();
	}
	this.attachedActions = [];

	return this;
};

/**
 * Execute an action.
 *
 * @param {string} action Symbolic name of action to execute
 * @return {jQuery.Promise} Promise resolved when action completes, rejected if it fails
 */
OO.ui.Dialog.prototype.executeAction = function ( action ) {
	const actionWidgets = this.actions.get( { actions: [ action ], visible: true } );
	// If the action is shown as an ActionWidget, but is disabled, then do nothing.
	if ( actionWidgets.length && actionWidgets.every( ( widget ) => widget.isDisabled() ) ) {
		return $.Deferred().reject().promise();
	}
	this.pushPending();
	this.currentAction = action;
	return this.getActionProcess( action ).execute()
		.always( this.popPending.bind( this ) );
};
