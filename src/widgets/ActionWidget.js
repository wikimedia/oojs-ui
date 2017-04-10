/**
 * An ActionWidget is a {@link OO.ui.ButtonWidget button widget} that executes an action.
 * Action widgets are used with OO.ui.ActionSet, which manages the behavior and availability
 * of the actions.
 *
 * Both actions and action sets are primarily used with {@link OO.ui.Dialog Dialogs}.
 * Please see the [OOjs UI documentation on MediaWiki] [1] for more information
 * and examples.
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Windows/Process_Dialogs#Action_sets
 *
 * @class
 * @extends OO.ui.ButtonWidget
 * @mixins OO.ui.mixin.PendingElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [action] Symbolic name of the action (e.g., ‘continue’ or ‘cancel’).
 * @cfg {string[]} [modes] Symbolic names of the modes (e.g., ‘edit’ or ‘read’) in which the action
 *  should be made available. See the action set's {@link OO.ui.ActionSet#setMode setMode} method
 *  for more information about setting modes.
 * @cfg {boolean} [framed=false] Render the action button with a frame
 */
OO.ui.ActionWidget = function OoUiActionWidget( config ) {
	// Configuration initialization
	config = $.extend( { framed: false }, config );

	// Parent constructor
	OO.ui.ActionWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.PendingElement.call( this, config );

	// Properties
	this.action = config.action || '';
	this.modes = config.modes || [];
	this.width = 0;
	this.height = 0;

	// Initialization
	this.$element.addClass( 'oo-ui-actionWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.ActionWidget, OO.ui.ButtonWidget );
OO.mixinClass( OO.ui.ActionWidget, OO.ui.mixin.PendingElement );

/* Methods */

/**
 * Check if the action is configured to be available in the specified `mode`.
 *
 * @param {string} mode Name of mode
 * @return {boolean} The action is configured with the mode
 */
OO.ui.ActionWidget.prototype.hasMode = function ( mode ) {
	return this.modes.indexOf( mode ) !== -1;
};

/**
 * Get the symbolic name of the action (e.g., ‘continue’ or ‘cancel’).
 *
 * @return {string}
 */
OO.ui.ActionWidget.prototype.getAction = function () {
	return this.action;
};

/**
 * Get the symbolic name of the mode or modes for which the action is configured to be available.
 *
 * The current mode is set with the action set's {@link OO.ui.ActionSet#setMode setMode} method.
 * Only actions that are configured to be avaiable in the current mode will be visible. All other actions
 * are hidden.
 *
 * @return {string[]}
 */
OO.ui.ActionWidget.prototype.getModes = function () {
	return this.modes.slice();
};
