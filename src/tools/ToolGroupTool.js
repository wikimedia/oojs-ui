/**
 * A ToolGroupTool is a special sort of tool that can contain other {@link OO.ui.Tool tools}
 * and {@link OO.ui.ToolGroup toolgroups}. The ToolGroupTool was specifically designed to be used
 * inside a {@link OO.ui.BarToolGroup bar} toolgroup to provide access to additional tools from
 * the bar item. Included tools will be displayed in a dropdown {@link OO.ui.ListToolGroup list}
 * when the ToolGroupTool is selected.
 *
 *     // Example: ToolGroupTool with two nested tools, 'setting1' and 'setting2', defined elsewhere.
 *
 *     function SettingsTool() {
 *         SettingsTool.parent.apply( this, arguments );
 *     };
 *     OO.inheritClass( SettingsTool, OO.ui.ToolGroupTool );
 *     SettingsTool.static.name = 'settings';
 *     SettingsTool.static.title = 'Change settings';
 *     SettingsTool.static.groupConfig = {
 *         icon: 'settings',
 *         label: 'ToolGroupTool',
 *         include: [  'setting1', 'setting2'  ]
 *     };
 *     toolFactory.register( SettingsTool );
 *
 * For more information, please see the [OOjs UI documentation on MediaWiki][1].
 *
 * Please note that this implementation is subject to change per [T74159] [2].
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Toolbars#ToolGroupTool
 * [2]: https://phabricator.wikimedia.org/T74159
 *
 * @abstract
 * @class
 * @extends OO.ui.Tool
 *
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
OO.ui.ToolGroupTool = function OoUiToolGroupTool( toolGroup, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( toolGroup ) && config === undefined ) {
		config = toolGroup;
		toolGroup = config.toolGroup;
	}

	// Parent constructor
	OO.ui.ToolGroupTool.parent.call( this, toolGroup, config );

	// Properties
	this.innerToolGroup = this.createGroup( this.constructor.static.groupConfig );

	// Events
	this.innerToolGroup.connect( this, { disable: 'onToolGroupDisable' } );

	// Initialization
	this.$link.remove();
	this.$element
		.addClass( 'oo-ui-toolGroupTool' )
		.append( this.innerToolGroup.$element );
};

/* Setup */

OO.inheritClass( OO.ui.ToolGroupTool, OO.ui.Tool );

/* Static Properties */

/**
 * Toolgroup configuration.
 *
 * The toolgroup configuration consists of the tools to include, as well as an icon and label
 * to use for the bar item. Tools can be included by symbolic name, group, or with the
 * wildcard selector. Please see {@link OO.ui.ToolGroup toolgroup} for more information.
 *
 * @property {Object.<string,Array>}
 */
OO.ui.ToolGroupTool.static.groupConfig = {};

/* Methods */

/**
 * Handle the tool being selected.
 *
 * @inheritdoc
 */
OO.ui.ToolGroupTool.prototype.onSelect = function () {
	this.innerToolGroup.setActive( !this.innerToolGroup.active );
	return false;
};

/**
 * Synchronize disabledness state of the tool with the inner toolgroup.
 *
 * @private
 * @param {boolean} disabled Element is disabled
 */
OO.ui.ToolGroupTool.prototype.onToolGroupDisable = function ( disabled ) {
	this.setDisabled( disabled );
};

/**
 * Handle the toolbar state being updated.
 *
 * @inheritdoc
 */
OO.ui.ToolGroupTool.prototype.onUpdateState = function () {
	this.setActive( false );
};

/**
 * Build a {@link OO.ui.ToolGroup toolgroup} from the specified configuration.
 *
 * @param {Object.<string,Array>} group Toolgroup configuration. Please see {@link OO.ui.ToolGroup toolgroup} for
 *  more information.
 * @return {OO.ui.ListToolGroup}
 */
OO.ui.ToolGroupTool.prototype.createGroup = function ( group ) {
	if ( group.include === '*' ) {
		// Apply defaults to catch-all groups
		if ( group.label === undefined ) {
			group.label = OO.ui.msg( 'ooui-toolbar-more' );
		}
	}

	return this.toolbar.getToolGroupFactory().create( 'list', this.toolbar, group );
};
