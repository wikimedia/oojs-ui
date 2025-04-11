/**
 * BarToolGroups are one of three types of {@link OO.ui.ToolGroup toolgroups} that are used to
 * create {@link OO.ui.Toolbar toolbars} (the other types of groups are
 * {@link OO.ui.MenuToolGroup MenuToolGroup} and {@link OO.ui.ListToolGroup ListToolGroup}).
 * The {@link OO.ui.Tool tools} in a BarToolGroup are displayed by icon in a single row. The
 * title of the tool is displayed when users move the mouse over the tool.
 *
 * BarToolGroups are created by a {@link OO.ui.ToolGroupFactory tool group factory} when the toolbar
 * is set up.
 *
 * For more information about how to add tools to a bar tool group, please see
 * {@link OO.ui.ToolGroup toolgroup}.
 * For more information about toolbars in general, please see the
 * [OOUI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Toolbars
 *
 *     @example
 *     // Example of a BarToolGroup with two tools
 *     const toolFactory = new OO.ui.ToolFactory();
 *     const toolGroupFactory = new OO.ui.ToolGroupFactory();
 *     const toolbar = new OO.ui.Toolbar( toolFactory, toolGroupFactory );
 *
 *     // We will be placing status text in this element when tools are used
 *     const $area = $( '<p>' ).text( 'Example of a BarToolGroup with two tools.' );
 *
 *     // Define the tools that we're going to place in our toolbar
 *
 *     // Create a class inheriting from OO.ui.Tool
 *     function SearchTool() {
 *         SearchTool.super.apply( this, arguments );
 *     }
 *     OO.inheritClass( SearchTool, OO.ui.Tool );
 *     // Each tool must have a 'name' (used as an internal identifier, see later) and at least one
 *     // of 'icon' and 'title' (displayed icon and text).
 *     SearchTool.static.name = 'search';
 *     SearchTool.static.icon = 'search';
 *     SearchTool.static.title = 'Search...';
 *     // Defines the action that will happen when this tool is selected (clicked).
 *     SearchTool.prototype.onSelect = function () {
 *         $area.text( 'Search tool clicked!' );
 *         // Never display this tool as "active" (selected).
 *         this.setActive( false );
 *     };
 *     SearchTool.prototype.onUpdateState = function () {};
 *     // Make this tool available in our toolFactory and thus our toolbar
 *     toolFactory.register( SearchTool );
 *
 *     // This is a PopupTool. Rather than having a custom 'onSelect' action, it will display a
 *     // little popup window (a PopupWidget).
 *     function HelpTool( toolGroup, config ) {
 *         OO.ui.PopupTool.call( this, toolGroup, Object.assign( { popup: {
 *             padded: true,
 *             label: 'Help',
 *             head: true
 *         } }, config ) );
 *         this.popup.$body.append( '<p>I am helpful!</p>' );
 *     }
 *     OO.inheritClass( HelpTool, OO.ui.PopupTool );
 *     HelpTool.static.name = 'help';
 *     HelpTool.static.icon = 'help';
 *     HelpTool.static.title = 'Help';
 *     toolFactory.register( HelpTool );
 *
 *     // Finally define which tools and in what order appear in the toolbar. Each tool may only be
 *     // used once (but not all defined tools must be used).
 *     toolbar.setup( [
 *         {
 *             // 'bar' tool groups display tools by icon only
 *             type: 'bar',
 *             include: [ 'search', 'help' ]
 *         }
 *     ] );
 *
 *     // Create some UI around the toolbar and place it in the document
 *     const frame = new OO.ui.PanelLayout( {
 *         expanded: false,
 *         framed: true
 *     } );
 *     const contentFrame = new OO.ui.PanelLayout( {
 *         expanded: false,
 *         padded: true
 *     } );
 *     frame.$element.append(
 *         toolbar.$element,
 *         contentFrame.$element.append( $area )
 *     );
 *     $( document.body ).append( frame.$element );
 *
 *     // Here is where the toolbar is actually built. This must be done after inserting it into the
 *     // document.
 *     toolbar.initialize();
 *
 * @class
 * @extends OO.ui.ToolGroup
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 */
OO.ui.BarToolGroup = function OoUiBarToolGroup( toolbar, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( toolbar ) && config === undefined ) {
		config = toolbar;
		toolbar = config.toolbar;
	}

	// Parent constructor
	OO.ui.BarToolGroup.super.call( this, toolbar, config );

	// Initialization
	this.$element.addClass( 'oo-ui-barToolGroup' );
	this.$group.addClass( 'oo-ui-barToolGroup-tools' );
};

/* Setup */

OO.inheritClass( OO.ui.BarToolGroup, OO.ui.ToolGroup );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.BarToolGroup.static.titleTooltips = true;

/**
 * @static
 * @inheritdoc
 */
OO.ui.BarToolGroup.static.accelTooltips = true;

/**
 * @static
 * @inheritdoc
 */
OO.ui.BarToolGroup.static.name = 'bar';
