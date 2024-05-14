/**
 * ListToolGroups are one of three types of {@link OO.ui.ToolGroup toolgroups} that are used to
 * create {@link OO.ui.Toolbar toolbars} (the other types of groups are
 * {@link OO.ui.MenuToolGroup MenuToolGroup} and {@link OO.ui.BarToolGroup BarToolGroup}).
 * The {@link OO.ui.Tool tools} in a ListToolGroup are displayed by label in a dropdown menu.
 * The title of the tool is used as the label text. The menu itself can be configured with a label,
 * icon, indicator, header, and title.
 *
 * ListToolGroups can be configured to be expanded and collapsed. Collapsed lists will have a
 * ‘More’ option that users can select to see the full list of tools. If a collapsed toolgroup is
 * expanded, a ‘Fewer’ option permits users to collapse the list again.
 *
 * ListToolGroups are created by a {@link OO.ui.ToolGroupFactory toolgroup factory} when the
 * toolbar is set up. The factory requires the ListToolGroup's symbolic name, 'list', which is
 * specified along with the other configurations. For more information about how to add tools to a
 * ListToolGroup, please see {@link OO.ui.ToolGroup toolgroup}.
 *
 * For more information about toolbars in general, please see the
 * [OOUI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Toolbars
 *
 *     @example
 *     // Example of a ListToolGroup
 *     const toolFactory = new OO.ui.ToolFactory();
 *     const toolGroupFactory = new OO.ui.ToolGroupFactory();
 *     const toolbar = new OO.ui.Toolbar( toolFactory, toolGroupFactory );
 *
 *     // Configure and register two tools
 *     function SettingsTool() {
 *         SettingsTool.super.apply( this, arguments );
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
 *         StuffTool.super.apply( this, arguments );
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
 *             icon: 'ellipsis',
 *             title: 'This is the title, displayed when user moves the mouse over the list ' +
 *                 'toolgroup',
 *             header: 'This is the header',
 *             include: [ 'settings', 'stuff' ],
 *             allowCollapse: ['stuff']
 *         }
 *     ] );
 *
 *     // Create some UI around the toolbar and place it in the document
 *     const frame = new OO.ui.PanelLayout( {
 *         expanded: false,
 *         framed: true
 *     } );
 *     frame.$element.append(
 *         toolbar.$element
 *     );
 *     $( document.body ).append( frame.$element );
 *     // Build the toolbar. This must be done after the toolbar has been appended to the document.
 *     toolbar.initialize();
 *
 * @class
 * @extends OO.ui.PopupToolGroup
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 * @param {Array} [config.allowCollapse] Allow the specified tools to be collapsed. By default, collapsible
 *  tools will only be displayed if users click the ‘More’ option displayed at the bottom of the
 *  list. If the list is expanded, a ‘Fewer’ option permits users to collapse the list again.
 *  Any tools that are included in the toolgroup, but are not designated as collapsible, will always
 *  be displayed.
 *  To open a collapsible list in its expanded state, set #expanded to 'true'.
 * @param {Array} [config.forceExpand] Expand the specified tools. All other tools will be designated as
 *  collapsible. Unless #expanded is set to true, the collapsible tools will be collapsed when the
 *  list is first opened.
 * @param {boolean} [config.expanded=false] Expand collapsible tools. This config is only relevant if tools
 *  have been designated as collapsible. When expanded is set to true, all tools in the group will
 *  be displayed when the list is first opened. Users can collapse the list with a ‘Fewer’ option at
 *  the bottom.
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
	this.expanded = !!config.expanded;
	this.collapsibleTools = [];

	// Parent constructor
	OO.ui.ListToolGroup.super.call( this, toolbar, config );

	// Initialization
	this.$element.addClass( 'oo-ui-listToolGroup' );
	this.$group.addClass( 'oo-ui-listToolGroup-tools' );
};

/* Setup */

OO.inheritClass( OO.ui.ListToolGroup, OO.ui.PopupToolGroup );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.ListToolGroup.static.name = 'list';

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.ListToolGroup.prototype.populate = function () {
	OO.ui.ListToolGroup.super.prototype.populate.call( this );

	let allowCollapse = [];
	// Update the list of collapsible tools
	if ( this.allowCollapse !== undefined ) {
		allowCollapse = this.allowCollapse;
	} else if ( this.forceExpand !== undefined ) {
		allowCollapse = OO.simpleArrayDifference( Object.keys( this.tools ), this.forceExpand );
	}

	this.collapsibleTools = [];
	for ( let i = 0, len = allowCollapse.length; i < len; i++ ) {
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
	if ( this.expandCollapseTool === undefined ) {
		const ExpandCollapseTool = function () {
			ExpandCollapseTool.super.apply( this, arguments );
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
		$( e.target ).closest( '.oo-ui-tool-name-more-fewer' ).length && (
			e.which === OO.ui.MouseButtons.LEFT ||
			e.which === OO.ui.Keys.SPACE ||
			e.which === OO.ui.Keys.ENTER
		)
	) {
		// HACK: Prevent the popup list from being hidden. Skip the PopupToolGroup implementation
		// (which hides the popup list when a tool is selected) and call ToolGroup's implementation
		// directly.
		return OO.ui.ListToolGroup.super.super.prototype.onMouseKeyUp.call( this, e );
	} else {
		return OO.ui.ListToolGroup.super.prototype.onMouseKeyUp.call( this, e );
	}
};

OO.ui.ListToolGroup.prototype.updateCollapsibleState = function () {
	const inverted = this.toolbar.position === 'bottom',
		icon = this.expanded === inverted ? 'expand' : 'collapse';

	this.getExpandCollapseTool()
		.setIcon( icon )
		.setTitle( OO.ui.msg( this.expanded ? 'ooui-toolgroup-collapse' : 'ooui-toolgroup-expand' ) );

	for ( let i = 0; i < this.collapsibleTools.length; i++ ) {
		this.collapsibleTools[ i ].toggle( this.expanded );
	}

	// Re-evaluate clipping, because our height has changed
	this.clip();
};
