/* eslint-disable no-unused-vars */
/**
 * ActionSets manage the behavior of the {@link OO.ui.ActionWidget action widgets} that
 * comprise them.
 * Actions can be made available for specific contexts (modes) and circumstances
 * (abilities). Action sets are primarily used with {@link OO.ui.Dialog Dialogs}.
 *
 * ActionSets contain two types of actions:
 *
 * - Special: Special actions are the first visible actions with special flags, such as 'safe' and
 *  'primary', the default special flags. Additional special flags can be configured in subclasses
 *  with the static #specialFlags property.
 * - Other: Other actions include all non-special visible actions.
 *
 * See the [OOUI documentation on MediaWiki][1] for more information.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Windows/Process_Dialogs#Action_sets
 *
 *     @example
 *     // Example: An action set used in a process dialog
 *     function MyProcessDialog( config ) {
 *         MyProcessDialog.super.call( this, config );
 *     }
 *     OO.inheritClass( MyProcessDialog, OO.ui.ProcessDialog );
 *     MyProcessDialog.static.title = 'An action set in a process dialog';
 *     MyProcessDialog.static.name = 'myProcessDialog';
 *     // An action set that uses modes ('edit' and 'help' mode, in this example).
 *     MyProcessDialog.static.actions = [
 *         {
 *           action: 'continue',
 *           modes: 'edit',
 *           label: 'Continue',
 *           flags: [ 'primary', 'progressive' ]
 *         },
 *         { action: 'help', modes: 'edit', label: 'Help' },
 *         { modes: 'edit', label: 'Cancel', flags: 'safe' },
 *         { action: 'back', modes: 'help', label: 'Back', flags: 'safe' }
 *     ];
 *
 *     MyProcessDialog.prototype.initialize = function () {
 *         MyProcessDialog.super.prototype.initialize.apply( this, arguments );
 *         this.panel1 = new OO.ui.PanelLayout( { padded: true, expanded: false } );
 *         this.panel1.$element.append( '<p>This dialog uses an action set (continue, help, ' +
 *             'cancel, back) configured with modes. This is edit mode. Click \'help\' to see ' +
 *             'help mode.</p>' );
 *         this.panel2 = new OO.ui.PanelLayout( { padded: true, expanded: false } );
 *         this.panel2.$element.append( '<p>This is help mode. Only the \'back\' action widget ' +
 *              'is configured to be visible here. Click \'back\' to return to \'edit\' mode.' +
 *              '</p>' );
 *         this.stackLayout = new OO.ui.StackLayout( {
 *             items: [ this.panel1, this.panel2 ]
 *         } );
 *         this.$body.append( this.stackLayout.$element );
 *     };
 *     MyProcessDialog.prototype.getSetupProcess = function ( data ) {
 *         return MyProcessDialog.super.prototype.getSetupProcess.call( this, data )
 *             .next( () => {
 *                 this.actions.setMode( 'edit' );
 *             } );
 *     };
 *     MyProcessDialog.prototype.getActionProcess = function ( action ) {
 *         if ( action === 'help' ) {
 *             this.actions.setMode( 'help' );
 *             this.stackLayout.setItem( this.panel2 );
 *         } else if ( action === 'back' ) {
 *             this.actions.setMode( 'edit' );
 *             this.stackLayout.setItem( this.panel1 );
 *         } else if ( action === 'continue' ) {
 *             return new OO.ui.Process( () => {
 *                 this.close();
 *             } );
 *         }
 *         return MyProcessDialog.super.prototype.getActionProcess.call( this, action );
 *     };
 *     MyProcessDialog.prototype.getBodyHeight = function () {
 *         return this.panel1.$element.outerHeight( true );
 *     };
 *     const windowManager = new OO.ui.WindowManager();
 *     $( document.body ).append( windowManager.$element );
 *     const dialog = new MyProcessDialog( {
 *         size: 'medium'
 *     } );
 *     windowManager.addWindows( [ dialog ] );
 *     windowManager.openWindow( dialog );
 *
 * @abstract
 * @class
 * @mixes OO.EventEmitter
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.ActionSet = function OoUiActionSet( config ) {
	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
	this.list = [];
	this.categories = {
		actions: 'getAction',
		flags: 'getFlags',
		modes: 'getModes'
	};
	this.categorized = {};
	this.special = {};
	this.others = [];
	this.organized = false;
	this.changing = false;
	this.changed = false;
};
/* eslint-enable no-unused-vars */

/* Setup */

OO.mixinClass( OO.ui.ActionSet, OO.EventEmitter );

/* Static Properties */

/**
 * Symbolic name of the flags used to identify special actions. Special actions are displayed in the
 *  header of a {@link OO.ui.ProcessDialog process dialog}.
 *  See the [OOUI documentation on MediaWiki][2] for more information and examples.
 *
 *  [2]:https://www.mediawiki.org/wiki/OOUI/Windows/Process_Dialogs
 *
 * @abstract
 * @static
 * @property {string}
 */
OO.ui.ActionSet.static.specialFlags = [ 'safe', 'primary' ];

/* Events */

/**
 * A 'click' event is emitted when an action is clicked.
 *
 * @event OO.ui.ActionSet#click
 * @param {OO.ui.ActionWidget} action Action that was clicked
 */

/**
 * An 'add' event is emitted when actions are {@link OO.ui.ActionSet#add added} to the action set.
 *
 * @event OO.ui.ActionSet#add
 * @param {OO.ui.ActionWidget[]} added Actions added
 */

/**
 * A 'remove' event is emitted when actions are {@link OO.ui.ActionSet#remove removed}
 * or {@link OO.ui.ActionSet#clear cleared}.
 *
 * @event OO.ui.ActionSet#remove
 * @param {OO.ui.ActionWidget[]} added Actions removed
 */

/**
 * A 'change' event is emitted when actions are {@link OO.ui.ActionSet#add added}, {@link OO.ui.ActionSet#clear cleared},
 * or {@link OO.ui.ActionSet#remove removed} from the action set or when the {@link OO.ui.ActionSet#setMode mode}
 * is changed.
 *
 * @event OO.ui.ActionSet#change
 */

/* Methods */

/**
 * Handle action change events.
 *
 * @private
 * @fires OO.ui.ActionSet#change
 */
OO.ui.ActionSet.prototype.onActionChange = function () {
	this.organized = false;
	if ( this.changing ) {
		this.changed = true;
	} else {
		this.emit( 'change' );
	}
};

/**
 * Check if an action is one of the special actions.
 *
 * @param {OO.ui.ActionWidget} action Action to check
 * @return {boolean} Action is special
 */
OO.ui.ActionSet.prototype.isSpecial = function ( action ) {
	for ( const flag in this.special ) {
		if ( action === this.special[ flag ] ) {
			return true;
		}
	}

	return false;
};

/**
 * Get action widgets based on the specified filter: ‘actions’, ‘flags’, ‘modes’, ‘visible’,
 *  or ‘disabled’.
 *
 * @param {Object} [filters] Filters to use, omit to get all actions
 * @param {string|string[]} [filters.actions] Actions that action widgets must have
 * @param {string|string[]} [filters.flags] Flags that action widgets must have (e.g., 'safe')
 * @param {string|string[]} [filters.modes] Modes that action widgets must have
 * @param {boolean} [filters.visible] Visibility that action widgets must have, omit to get both
 *  visible and invisible
 * @param {boolean} [filters.disabled] Disabled state that action widgets must have, omit to get
 *  both enabled and disabled
 * @return {OO.ui.ActionWidget[]} Action widgets matching all criteria
 */
OO.ui.ActionSet.prototype.get = function ( filters ) {
	if ( filters ) {
		this.organize();

		let i, len;
		// Collect candidates for the 3 categories "actions", "flags" and "modes"
		const matches = [];
		for ( const category in this.categorized ) {
			let list = filters[ category ];
			if ( list ) {
				if ( !Array.isArray( list ) ) {
					list = [ list ];
				}
				for ( i = 0, len = list.length; i < len; i++ ) {
					const actions = this.categorized[ category ][ list[ i ] ];
					if ( Array.isArray( actions ) ) {
						matches.push.apply( matches, actions );
					}
				}
			}
		}
		let match;
		// Remove by boolean filters
		for ( i = 0, len = matches.length; i < len; i++ ) {
			match = matches[ i ];
			if (
				( filters.visible !== undefined && match.isVisible() !== filters.visible ) ||
				( filters.disabled !== undefined && match.isDisabled() !== filters.disabled )
			) {
				matches.splice( i, 1 );
				len--;
				i--;
			}
		}
		// Remove duplicates
		for ( i = 0, len = matches.length; i < len; i++ ) {
			match = matches[ i ];
			let index = matches.lastIndexOf( match );
			while ( index !== i ) {
				matches.splice( index, 1 );
				len--;
				index = matches.lastIndexOf( match );
			}
		}
		return matches;
	}
	return this.list.slice();
};

/**
 * Get 'special' actions.
 *
 * Special actions are the first visible action widgets with special flags, such as 'safe' and
 * 'primary'.
 * Special flags can be configured in subclasses by changing the static #specialFlags property.
 *
 * @return {OO.ui.ActionWidget[]|null} 'Special' action widgets.
 */
OO.ui.ActionSet.prototype.getSpecial = function () {
	this.organize();
	return Object.assign( {}, this.special );
};

/**
 * Get 'other' actions.
 *
 * Other actions include all non-special visible action widgets.
 *
 * @return {OO.ui.ActionWidget[]} 'Other' action widgets
 */
OO.ui.ActionSet.prototype.getOthers = function () {
	this.organize();
	return this.others.slice();
};

/**
 * Set the mode  (e.g., ‘edit’ or ‘view’). Only {@link OO.ui.ActionWidget#modes actions} configured
 * to be available in the specified mode will be made visible. All other actions will be hidden.
 *
 * @param {string} mode The mode. Only actions configured to be available in the specified
 *  mode will be made visible.
 * @chainable
 * @return {OO.ui.ActionSet} The widget, for chaining
 * @fires OO.ui.Widget#toggle
 * @fires OO.ui.ActionSet#change
 */
OO.ui.ActionSet.prototype.setMode = function ( mode ) {
	this.changing = true;
	for ( let i = 0, len = this.list.length; i < len; i++ ) {
		const action = this.list[ i ];
		action.toggle( action.hasMode( mode ) );
	}

	this.organized = false;
	this.changing = false;
	this.emit( 'change' );

	return this;
};

/**
 * Set the abilities of the specified actions.
 *
 * Action widgets that are configured with the specified actions will be enabled
 * or disabled based on the boolean values specified in the `actions`
 * parameter.
 *
 * @param {Object.<string,boolean>} actions A list keyed by action name with boolean
 *  values that indicate whether or not the action should be enabled.
 * @chainable
 * @return {OO.ui.ActionSet} The widget, for chaining
 */
OO.ui.ActionSet.prototype.setAbilities = function ( actions ) {
	for ( let i = 0, len = this.list.length; i < len; i++ ) {
		const item = this.list[ i ];
		const action = item.getAction();
		if ( actions[ action ] !== undefined ) {
			item.setDisabled( !actions[ action ] );
		}
	}

	return this;
};

/**
 * Executes a function once per action.
 *
 * When making changes to multiple actions, use this method instead of iterating over the actions
 * manually to defer emitting a #change event until after all actions have been changed.
 *
 * @param {Object|null} filter Filters to use to determine which actions to iterate over; see #get
 * @param {Function} callback Callback to run for each action; callback is invoked with three
 *   arguments: the action, the action's index, the list of actions being iterated over
 * @chainable
 * @return {OO.ui.ActionSet} The widget, for chaining
 */
OO.ui.ActionSet.prototype.forEach = function ( filter, callback ) {
	this.changed = false;
	this.changing = true;
	this.get( filter ).forEach( callback );
	this.changing = false;
	if ( this.changed ) {
		this.emit( 'change' );
	}

	return this;
};

/**
 * Add action widgets to the action set.
 *
 * @param {OO.ui.ActionWidget[]} actions Action widgets to add
 * @chainable
 * @return {OO.ui.ActionSet} The widget, for chaining
 * @fires OO.ui.ActionSet#add
 * @fires OO.ui.ActionSet#change
 */
OO.ui.ActionSet.prototype.add = function ( actions ) {
	this.changing = true;
	for ( let i = 0, len = actions.length; i < len; i++ ) {
		const action = actions[ i ];
		action.connect( this, {
			click: [ 'emit', 'click', action ],
			toggle: [ 'onActionChange' ]
		} );
		this.list.push( action );
	}
	this.organized = false;
	this.emit( 'add', actions );
	this.changing = false;
	this.emit( 'change' );

	return this;
};

/**
 * Remove action widgets from the set.
 *
 * To remove all actions, you may wish to use the #clear method instead.
 *
 * @param {OO.ui.ActionWidget[]} actions Action widgets to remove
 * @chainable
 * @return {OO.ui.ActionSet} The widget, for chaining
 * @fires OO.ui.ActionSet#remove
 * @fires OO.ui.ActionSet#change
 */
OO.ui.ActionSet.prototype.remove = function ( actions ) {
	this.changing = true;
	for ( let i = 0, len = actions.length; i < len; i++ ) {
		const action = actions[ i ];
		const index = this.list.indexOf( action );
		if ( index !== -1 ) {
			action.disconnect( this );
			this.list.splice( index, 1 );
		}
	}
	this.organized = false;
	this.emit( 'remove', actions );
	this.changing = false;
	this.emit( 'change' );

	return this;
};

/**
 * Remove all action widgets from the set.
 *
 * To remove only specified actions, use the {@link OO.ui.ActionSet#remove remove} method instead.
 *
 * @chainable
 * @return {OO.ui.ActionSet} The widget, for chaining
 * @fires OO.ui.ActionSet#remove
 * @fires OO.ui.ActionSet#change
 */
OO.ui.ActionSet.prototype.clear = function () {
	const removed = this.list.slice();

	this.changing = true;
	for ( let i = 0, len = this.list.length; i < len; i++ ) {
		const action = this.list[ i ];
		action.disconnect( this );
	}

	this.list = [];

	this.organized = false;
	this.emit( 'remove', removed );
	this.changing = false;
	this.emit( 'change' );

	return this;
};

/**
 * Organize actions.
 *
 * This is called whenever organized information is requested. It will only reorganize the actions
 * if something has changed since the last time it ran.
 *
 * @private
 * @chainable
 * @return {OO.ui.ActionSet} The widget, for chaining
 */
OO.ui.ActionSet.prototype.organize = function () {
	const specialFlags = this.constructor.static.specialFlags;

	if ( !this.organized ) {
		this.categorized = {};
		this.special = {};
		this.others = [];
		for ( let i = 0, iLen = this.list.length; i < iLen; i++ ) {
			const action = this.list[ i ];
			let j, jLen;
			// Populate the 3 categories "actions", "flags" and "modes"
			for ( const category in this.categories ) {
				if ( !this.categorized[ category ] ) {
					this.categorized[ category ] = {};
				}
				/**
				 * This calls one of these getters. All return strings or arrays of strings.
				 * {@see OO.ui.ActionWidget.getAction}
				 * {@see OO.ui.FlaggedElement.getFlags}
				 * {@see OO.ui.ActionWidget.getModes}
				 */
				let list = action[ this.categories[ category ] ]();
				if ( !Array.isArray( list ) ) {
					list = [ list ];
				}
				for ( j = 0, jLen = list.length; j < jLen; j++ ) {
					const item = list[ j ];
					if ( !this.categorized[ category ][ item ] ) {
						this.categorized[ category ][ item ] = [];
					}
					this.categorized[ category ][ item ].push( action );
				}
			}
			if ( action.isVisible() ) {
				// Populate special/others
				let special = false;
				for ( j = 0, jLen = specialFlags.length; j < jLen; j++ ) {
					const flag = specialFlags[ j ];
					if ( !this.special[ flag ] && action.hasFlag( flag ) ) {
						this.special[ flag ] = action;
						special = true;
						break;
					}
				}
				if ( !special ) {
					this.others.push( action );
				}
			}
		}
		this.organized = true;
	}

	return this;
};
