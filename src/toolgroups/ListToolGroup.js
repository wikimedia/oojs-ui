/**
 * ListToolGroups are one of three types of {@link OO.ui.ToolGroup toolgroups} that are used to
 * create {@link OO.ui.Toolbar toolbars} (the other types of groups are {@link OO.ui.MenuToolGroup MenuToolGroup}
 * and {@link OO.ui.BarToolGroup BarToolGroup}). The {@link OO.ui.Tool tools} in a ListToolGroup are displayed
 * by label in a dropdown menu. The title of the tool is used as the label text. The menu itself can be configured
 * with a label, icon, indicator, header, and title.
 *
 * ListToolGroups can be configured to be expanded and collapsed. Collapsed lists will have a ‘More’ option that
 * users can select to see the full list of tools. If a collapsed toolgroup is expanded, a ‘Fewer’ option permits
 * users to collapse the list again.
 *
 * ListToolGroups are created by a {@link OO.ui.ToolGroupFactory toolgroup factory} when the toolbar is set up. The factory
 * requires the ListToolGroup's symbolic name, 'list', which is specified along with the other configurations. For more
 * information about how to add tools to a ListToolGroup, please see {@link OO.ui.ToolGroup toolgroup}.
 *
 *     @example
 *     // Example of a ListToolGroup
 *     var toolFactory = new OO.ui.ToolFactory();
 *     var toolGroupFactory = new OO.ui.ToolGroupFactory();
 *     var toolbar = new OO.ui.Toolbar( toolFactory, toolGroupFactory );
 *
 *     // Configure and register two tools
 *     function SettingsTool() {
 *         SettingsTool.parent.apply( this, arguments );
 *     }
 *     OO.inheritClass( SettingsTool, OO.ui.Tool );
 *     SettingsTool.static.name = 'settings';
 *     SettingsTool.static.icon = 'settings';
 *     SettingsTool.static.title = 'Change settings';
 *     SettingsTool.prototype.onSelect = function () {
 *         this.setActive( false );
 *     };
 *     SettingsTool.prototype.onUpdateState = function () {};
 *     toolFactory.register( SettingsTool );
 *     // Register two more tools, nothing interesting here
 *     function StuffTool() {
 *         StuffTool.parent.apply( this, arguments );
 *     }
 *     OO.inheritClass( StuffTool, OO.ui.Tool );
 *     StuffTool.static.name = 'stuff';
 *     StuffTool.static.icon = 'search';
 *     StuffTool.static.title = 'Change the world';
 *     StuffTool.prototype.onSelect = function () {
 *         this.setActive( false );
 *     };
 *     StuffTool.prototype.onUpdateState = function () {};
 *     toolFactory.register( StuffTool );
 *     toolbar.setup( [
 *         {
 *             // Configurations for list toolgroup.
 *             type: 'list',
 *             label: 'ListToolGroup',
 *             indicator: 'down',
 *             icon: 'ellipsis',
 *             title: 'This is the title, displayed when user moves the mouse over the list toolgroup',
 *             header: 'This is the header',
 *             include: [ 'settings', 'stuff' ],
 *             allowCollapse: ['stuff']
 *         }
 *     ] );
 *
 *     // Create some UI around the toolbar and place it in the document
 *     var frame = new OO.ui.PanelLayout( {
 *         expanded: false,
 *         framed: true
 *     } );
 *     frame.$element.append(
 *         toolbar.$element
 *     );
 *     $( 'body' ).append( frame.$element );
 *     // Build the toolbar. This must be done after the toolbar has been appended to the document.
 *     toolbar.initialize();
 *
 * For more information about toolbars in general, please see the [OOjs UI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Toolbars
 *
 * @class
 * @extends OO.ui.PopupToolGroup
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 * @cfg {Array} [allowCollapse] Allow the specified tools to be collapsed. By default, collapsible tools
 *  will only be displayed if users click the ‘More’ option displayed at the bottom of the list. If
 *  the list is expanded, a ‘Fewer’ option permits users to collapse the list again. Any tools that
 *  are included in the toolgroup, but are not designated as collapsible, will always be displayed.
 *  To open a collapsible list in its expanded state, set #expanded to 'true'.
 * @cfg {Array} [forceExpand] Expand the specified tools. All other tools will be designated as collapsible.
 *  Unless #expanded is set to true, the collapsible tools will be collapsed when the list is first opened.
 * @cfg {boolean} [expanded=false] Expand collapsible tools. This config is only relevant if tools have
 *  been designated as collapsible. When expanded is set to true, all tools in the group will be displayed
 *  when the list is first opened. Users can collapse the list with a ‘Fewer’ option at the bottom.
 */
OO.ui.ListToolGroup = function OoUiListToolGroup( toolbar, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( toolbar ) && config === undefined ) {
		config = toolbar;
		toolbar = config.toolbar;
	}

	// Configuration initialization
	config = config || {};

	// Properties (must be set before parent constructor, which calls #populate)
	this.allowCollapse = config.allowCollapse;
	this.forceExpand = config.forceExpand;
	this.expanded = config.expanded !== undefined ? config.expanded : false;
	this.collapsibleTools = [];

	// Parent constructor
	OO.ui.ListToolGroup.parent.call( this, toolbar, config );

	// Initialization
	this.$element.addClass( 'oo-ui-listToolGroup' );
};

/* Setup */

OO.inheritClass( OO.ui.ListToolGroup, OO.ui.PopupToolGroup );

/* Static Properties */

OO.ui.ListToolGroup.static.name = 'list';

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.ListToolGroup.prototype.populate = function () {
	var i, len, allowCollapse = [];

	OO.ui.ListToolGroup.parent.prototype.populate.call( this );

	// Update the list of collapsible tools
	if ( this.allowCollapse !== undefined ) {
		allowCollapse = this.allowCollapse;
	} else if ( this.forceExpand !== undefined ) {
		allowCollapse = OO.simpleArrayDifference( Object.keys( this.tools ), this.forceExpand );
	}

	this.collapsibleTools = [];
	for ( i = 0, len = allowCollapse.length; i < len; i++ ) {
		if ( this.tools[ allowCollapse[ i ] ] !== undefined ) {
			this.collapsibleTools.push( this.tools[ allowCollapse[ i ] ] );
		}
	}

	// Keep at the end, even when tools are added
	this.$group.append( this.getExpandCollapseTool().$element );

	this.getExpandCollapseTool().toggle( this.collapsibleTools.length !== 0 );
	this.updateCollapsibleState();
};

/**
 * Get the expand/collapse tool for this group
 *
 * @return {OO.ui.Tool} Expand collapse tool
 */
OO.ui.ListToolGroup.prototype.getExpandCollapseTool = function () {
	var ExpandCollapseTool;
	if ( this.expandCollapseTool === undefined ) {
		ExpandCollapseTool = function () {
			ExpandCollapseTool.parent.apply( this, arguments );
		};

		OO.inheritClass( ExpandCollapseTool, OO.ui.Tool );

		ExpandCollapseTool.prototype.onSelect = function () {
			this.toolGroup.expanded = !this.toolGroup.expanded;
			this.toolGroup.updateCollapsibleState();
			this.setActive( false );
		};
		ExpandCollapseTool.prototype.onUpdateState = function () {
			// Do nothing. Tool interface requires an implementation of this function.
		};

		ExpandCollapseTool.static.name = 'more-fewer';

		this.expandCollapseTool = new ExpandCollapseTool( this );
	}
	return this.expandCollapseTool;
};

/**
 * @inheritdoc
 */
OO.ui.ListToolGroup.prototype.onMouseKeyUp = function ( e ) {
	// Do not close the popup when the user wants to show more/fewer tools
	if (
		$( e.target ).closest( '.oo-ui-tool-name-more-fewer' ).length &&
		( e.which === OO.ui.MouseButtons.LEFT || e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER )
	) {
		// HACK: Prevent the popup list from being hidden. Skip the PopupToolGroup implementation (which
		// hides the popup list when a tool is selected) and call ToolGroup's implementation directly.
		return OO.ui.ListToolGroup.parent.parent.prototype.onMouseKeyUp.call( this, e );
	} else {
		return OO.ui.ListToolGroup.parent.prototype.onMouseKeyUp.call( this, e );
	}
};

OO.ui.ListToolGroup.prototype.updateCollapsibleState = function () {
	var i, len;

	this.getExpandCollapseTool()
		.setIcon( this.expanded ? 'collapse' : 'expand' )
		.setTitle( OO.ui.msg( this.expanded ? 'ooui-toolgroup-collapse' : 'ooui-toolgroup-expand' ) );

	for ( i = 0, len = this.collapsibleTools.length; i < len; i++ ) {
		this.collapsibleTools[ i ].toggle( this.expanded );
	}
};
