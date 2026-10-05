/**
 * Toolbars are complex interface components that permit users to easily access a variety
 * of {@link OO.ui.Tool tools} (e.g., formatting commands) and actions, which are additional
 * commands that are part of the toolbar, but not configured as tools.
 *
 * Individual tools are customized and then registered with a
 * {@link OO.ui.ToolFactory tool factory}, which creates the tools on demand. Each tool has a
 * symbolic name (used when registering the tool), a title (e.g., ‘Insert image’), and an icon.
 *
 * Individual tools are organized in {@link OO.ui.ToolGroup toolgroups}, which can be
 * {@link OO.ui.MenuToolGroup menus} of tools, {@link OO.ui.ListToolGroup lists} of tools, or a
 * single {@link OO.ui.BarToolGroup bar} of tools. The arrangement and order of the toolgroups is
 * customized when the toolbar is set up. Tools can be presented in any order, but each can only
 * appear once in the toolbar.
 *
 * The toolbar can be synchronized with the state of the external "application", like a text
 * editor's editing area, marking tools as active/inactive (e.g. a 'bold' tool would be shown as
 * active when the text cursor was inside bolded text) or enabled/disabled (e.g. a table caption
 * tool would be disabled while the user is not editing a table). A state change is signalled by
 * emitting the {@link OO.ui.Toolbar#event:updateState 'updateState' event}, which calls Tools'
 * {@link OO.ui.Tool#onUpdateState onUpdateState method}.
 *
 *     @example <caption>The following is an example of a basic toolbar.</caption>
 *     // Example of a toolbar
 *     // Create the toolbar
 *     const toolFactory = new OO.ui.ToolFactory();
 *     const toolGroupFactory = new OO.ui.ToolGroupFactory();
 *     const toolbar = new OO.ui.Toolbar( toolFactory, toolGroupFactory );
 *
 *     // We will be placing status text in this element when tools are used
 *     const $area = $( '<p>' ).text( 'Toolbar example' );
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
 *     // Register two more tools, nothing interesting here
 *     function SettingsTool() {
 *         SettingsTool.super.apply( this, arguments );
 *     }
 *     OO.inheritClass( SettingsTool, OO.ui.Tool );
 *     SettingsTool.static.name = 'settings';
 *     SettingsTool.static.icon = 'settings';
 *     SettingsTool.static.title = 'Change settings';
 *     SettingsTool.prototype.onSelect = function () {
 *         $area.text( 'Settings tool clicked!' );
 *         this.setActive( false );
 *     };
 *     SettingsTool.prototype.onUpdateState = function () {};
 *     toolFactory.register( SettingsTool );
 *
 *     // Register two more tools, nothing interesting here
 *     function StuffTool() {
 *         StuffTool.super.apply( this, arguments );
 *     }
 *     OO.inheritClass( StuffTool, OO.ui.Tool );
 *     StuffTool.static.name = 'stuff';
 *     StuffTool.static.icon = 'ellipsis';
 *     StuffTool.static.title = 'More stuff';
 *     StuffTool.prototype.onSelect = function () {
 *         $area.text( 'More stuff tool clicked!' );
 *         this.setActive( false );
 *     };
 *     StuffTool.prototype.onUpdateState = function () {};
 *     toolFactory.register( StuffTool );
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
 *             // 'bar' tool groups display tools' icons only, side-by-side.
 *             type: 'bar',
 *             include: [ 'search', 'help' ]
 *         },
 *         {
 *             // 'list' tool groups display both the titles and icons, in a dropdown list.
 *             type: 'list',
 *             indicator: 'down',
 *             label: 'More',
 *             include: [ 'settings', 'stuff' ]
 *         }
 *         // Note how the tools themselves are toolgroup-agnostic - the same tool can be displayed
 *         // either in a 'list' or a 'bar'. There is a 'menu' tool group too, not showcased here,
 *         // since it's more complicated to use. (See the next example snippet on this page.)
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
 *     toolbar.emit( 'updateState' );
 *
 *     @example <caption>The following example extends the previous one to illustrate 'menu' toolgroups and the usage of
 *     {@link OO.ui.Toolbar#event:updateState 'updateState' event}.</caption>
 *     // Create the toolbar
 *     const toolFactory = new OO.ui.ToolFactory();
 *     const toolGroupFactory = new OO.ui.ToolGroupFactory();
 *     const toolbar = new OO.ui.Toolbar( toolFactory, toolGroupFactory );
 *
 *     // We will be placing status text in this element when tools are used
 *     const $area = $( '<p>' ).text( 'Toolbar example' );
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
 *     // Register two more tools, nothing interesting here
 *     function SettingsTool() {
 *         SettingsTool.super.apply( this, arguments );
 *         this.reallyActive = false;
 *     }
 *     OO.inheritClass( SettingsTool, OO.ui.Tool );
 *     SettingsTool.static.name = 'settings';
 *     SettingsTool.static.icon = 'settings';
 *     SettingsTool.static.title = 'Change settings';
 *     SettingsTool.prototype.onSelect = function () {
 *         $area.text( 'Settings tool clicked!' );
 *         // Toggle the active state on each click
 *         this.reallyActive = !this.reallyActive;
 *         this.setActive( this.reallyActive );
 *         // To update the menu label
 *         this.toolbar.emit( 'updateState' );
 *     };
 *     SettingsTool.prototype.onUpdateState = function () {};
 *     toolFactory.register( SettingsTool );
 *
 *     // Register two more tools, nothing interesting here
 *     function StuffTool() {
 *         StuffTool.super.apply( this, arguments );
 *         this.reallyActive = false;
 *     }
 *     OO.inheritClass( StuffTool, OO.ui.Tool );
 *     StuffTool.static.name = 'stuff';
 *     StuffTool.static.icon = 'ellipsis';
 *     StuffTool.static.title = 'More stuff';
 *     StuffTool.prototype.onSelect = function () {
 *         $area.text( 'More stuff tool clicked!' );
 *         // Toggle the active state on each click
 *         this.reallyActive = !this.reallyActive;
 *         this.setActive( this.reallyActive );
 *         // To update the menu label
 *         this.toolbar.emit( 'updateState' );
 *     };
 *     StuffTool.prototype.onUpdateState = function () {};
 *     toolFactory.register( StuffTool );
 *
 *     // This is a PopupTool. Rather than having a custom 'onSelect' action, it will display a
 *     // little popup window (a PopupWidget). 'onUpdateState' is also already implemented.
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
 *             // 'bar' tool groups display tools' icons only, side-by-side.
 *             type: 'bar',
 *             include: [ 'search', 'help' ]
 *         },
 *         {
 *             // 'menu' tool groups display both the titles and icons, in a dropdown menu.
 *             // Menu label indicates which items are selected.
 *             type: 'menu',
 *             indicator: 'down',
 *             include: [ 'settings', 'stuff' ]
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
 *     toolbar.emit( 'updateState' );
 *
 * @class
 * @extends OO.ui.Element
 * @mixes OO.EventEmitter
 * @mixes OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {OO.ui.ToolFactory} toolFactory Factory for creating tools
 * @param {OO.ui.ToolGroupFactory} toolGroupFactory Factory for creating toolgroups
 * @param {Object} [config] Configuration options
 * @param {boolean} [config.actions] Add an actions section to the toolbar. Actions are commands that are
 *  included in the toolbar, but are not configured as tools. By default, actions are displayed on
 *  the right side of the toolbar.
 *  This feature is deprecated. It is suggested to use the ToolGroup 'align' property instead.
 * @param {string} [config.position='top'] Whether the toolbar is positioned above ('top') or below
 *  ('bottom') content.
 * @param {jQuery} [config.$overlay] An overlay for the popup.
 *  See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
 */
OO.ui.Toolbar = function OoUiToolbar( toolFactory, toolGroupFactory, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( toolFactory ) && config === undefined ) {
		config = toolFactory;
		toolFactory = config.toolFactory;
		toolGroupFactory = config.toolGroupFactory;
	}

	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.Toolbar.super.call( this, config );

	// Mixin constructors
	OO.EventEmitter.call( this );
	OO.ui.mixin.GroupElement.call( this, config );

	// Properties
	this.toolFactory = toolFactory;
	this.toolGroupFactory = toolGroupFactory;
	this.groupsByName = {};
	this.activeToolGroups = 0;
	this.tools = {};
	this.position = config.position || 'top';
	this.$bar = $( '<div>' );
	this.$after = $( '<div>' );
	this.$actions = $( '<div>' );
	this.$popups = $( '<div>' );
	this.initialized = false;
	this.narrow = false;
	this.narrowThreshold = null;
	this.promotionMeasurements = null;
	this.onWindowResizeHandler = this.onWindowResize.bind( this );
	this.$overlay = ( config.$overlay === true ? OO.ui.getDefaultOverlay() : config.$overlay ) ||
		this.$element;

	// Events
	this.$element
		.add( this.$bar ).add( this.$group ).add( this.$after ).add( this.$actions )
		.on( 'mousedown keydown', this.onPointerDown.bind( this ) );

	// Initialization
	this.$bar.addClass( 'oo-ui-toolbar-bar' );
	this.$group.addClass( 'oo-ui-toolbar-tools' );
	this.$after.addClass( 'oo-ui-toolbar-tools oo-ui-toolbar-after' );
	this.$popups.addClass( 'oo-ui-toolbar-popups' );

	this.$bar.append( this.$group, this.$after );
	if ( config.actions ) {
		this.$bar.append( this.$actions.addClass( 'oo-ui-toolbar-actions' ) );
	}
	this.$bar.append( $( '<div>' ).css( 'clear', 'both' ) );

	// Possible classes: oo-ui-toolbar-position-top, oo-ui-toolbar-position-bottom
	this.$element
		.addClass( 'oo-ui-toolbar oo-ui-toolbar-position-' + this.position )
		.append( this.$bar );
	this.$overlay.append( this.$popups );
};

/* Setup */

OO.inheritClass( OO.ui.Toolbar, OO.ui.Element );
OO.mixinClass( OO.ui.Toolbar, OO.EventEmitter );
OO.mixinClass( OO.ui.Toolbar, OO.ui.mixin.GroupElement );

/* Events */

/**
 * An 'updateState' event must be emitted on the Toolbar (by calling
 * `toolbar.emit( 'updateState' )`) every time the state of the application using the toolbar
 * changes, and an update to the state of tools is required.
 *
 * @event OO.ui.Toolbar#updateState
 * @param {...any} data Application-defined parameters
 */

/**
 * An 'active' event is emitted when the number of active toolgroups increases from 0, or
 * returns to 0.
 *
 * @event OO.ui.Toolbar#active
 * @param {boolean} There are active toolgroups in this toolbar
 */

/**
 * Toolbar has resized to a point where narrow mode has changed
 *
 * @event OO.ui.Toolbar#resize
 */

/* Methods */

/**
 * Get the tool factory.
 *
 * @return {OO.ui.ToolFactory} Tool factory
 */
OO.ui.Toolbar.prototype.getToolFactory = function () {
	return this.toolFactory;
};

/**
 * Get the toolgroup factory.
 *
 * @return {OO.Factory} Toolgroup factory
 */
OO.ui.Toolbar.prototype.getToolGroupFactory = function () {
	return this.toolGroupFactory;
};

/**
 * @inheritdoc {OO.ui.mixin.GroupElement}
 */
OO.ui.Toolbar.prototype.insertItemElements = function ( item ) {
	// Mixin method
	OO.ui.mixin.GroupElement.prototype.insertItemElements.apply( this, arguments );

	if ( item.align === 'after' ) {
		// Toolbar only ever appends ToolGroups to the end, so we can ignore 'index'
		this.$after.append( item.$element );
	}
};

/**
 * Handles mouse down events.
 *
 * @private
 * @param {jQuery.Event} e Mouse down event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.Toolbar.prototype.onPointerDown = function ( e ) {
	const $closestWidgetToEvent = $( e.target ).closest( '.oo-ui-widget' ),
		$closestWidgetToToolbar = this.$element.closest( '.oo-ui-widget' );
	if (
		!$closestWidgetToEvent.length ||
		$closestWidgetToEvent[ 0 ] ===
		$closestWidgetToToolbar[ 0 ]
	) {
		return false;
	}
};

/**
 * Handle window resize event.
 *
 * @private
 * @param {jQuery.Event} e Window resize event
 */
OO.ui.Toolbar.prototype.onWindowResize = function () {
	this.setNarrow( this.$bar[ 0 ].clientWidth <= this.getNarrowThreshold() );
	this.updatePromotedTools();
};

/**
 * Check if the toolbar is in narrow mode
 *
 * @return {boolean} Toolbar is in narrow mode
 */
OO.ui.Toolbar.prototype.isNarrow = function () {
	return this.narrow;
};

/**
 * Set the narrow mode flag
 *
 * @param {boolean} narrow Toolbar is in narrow mode
 */
OO.ui.Toolbar.prototype.setNarrow = function ( narrow ) {
	if ( narrow !== this.narrow ) {
		this.narrow = narrow;
		this.$element.add( this.$popups ).toggleClass(
			'oo-ui-toolbar-narrow',
			this.narrow
		);
		this.emit( 'resize' );
	}
};

/**
 * Get the (lazily-computed) width threshold for applying the oo-ui-toolbar-narrow
 * class.
 *
 * @private
 * @return {number} Width threshold in pixels
 */
OO.ui.Toolbar.prototype.getNarrowThreshold = function () {
	if ( this.narrowThreshold === null ) {
		this.narrowThreshold = this.$group[ 0 ].offsetWidth + this.$after[ 0 ].offsetWidth +
			this.$actions[ 0 ].offsetWidth;
	}
	return this.narrowThreshold;
};

/**
 * Get the sets of tools that can be promoted out of popup toolgroups, in priority order.
 *
 * Sets are ordered by toolgroup, in the order the toolgroups were set up, then by the order
 * given in each toolgroup's `promoteToBar` config option. The tools in each set are only
 * promoted together.
 *
 * @return {OO.ui.Tool[][]} Sets of promotable tools
 */
OO.ui.Toolbar.prototype.getPromotableToolSets = function () {
	let sets = [];
	this.items.forEach( ( toolGroup ) => {
		if ( toolGroup instanceof OO.ui.PopupToolGroup ) {
			sets = sets.concat( toolGroup.getPromotableToolSets() );
		}
	} );
	return sets;
};

/**
 * Get the tools that can be promoted out of popup toolgroups, in priority order.
 *
 * See #getPromotableToolSets.
 *
 * @return {OO.ui.Tool[]} Promotable tools
 */
OO.ui.Toolbar.prototype.getPromotableTools = function () {
	return [].concat( ...this.getPromotableToolSets() );
};

/**
 * Update which tools are promoted out of popup toolgroups, based on the available room.
 *
 * This is called automatically when the window is resized.
 */
OO.ui.Toolbar.prototype.updatePromotedTools = function () {
	const sets = this.getPromotableToolSets();
	if ( !sets.length ) {
		return;
	}
	const count = this.getPromotedToolCount( [].concat( ...sets ) );

	// Promote whole sets, in order, while they fit in the count
	let promotedTools = [];
	sets.every( ( set ) => {
		if ( promotedTools.length + set.length > count ) {
			return false;
		}
		promotedTools = promotedTools.concat( set );
		return true;
	} );
	this.setPromotedTools( promotedTools );
};

/**
 * Promote tools out of their popup toolgroups, and demote all others.
 *
 * @private
 * @param {OO.ui.Tool[]} tools Tools to promote
 */
OO.ui.Toolbar.prototype.setPromotedTools = function ( tools ) {
	this.items.forEach( ( toolGroup ) => {
		if ( toolGroup instanceof OO.ui.PopupToolGroup ) {
			toolGroup.setPromotedTools(
				tools.filter( ( tool ) => tool.toolGroup === toolGroup )
			);
		}
	} );
};

/**
 * Get the number of tools that should be promoted out of popup toolgroups.
 *
 * Tools are promoted from the start of `tools`, one set at a time (see
 * #getPromotableToolSets).
 *
 * By default, this measures the toolbar and the promotable tools, and returns how many fit in
 * the toolbar without wrapping. No tools are promoted in narrow mode.
 *
 * This can be overridden in a subclass e.g. when the toolbar is laid out with flexbox:
 *
 *     MobileToolbar.prototype.getPromotedToolCount = function ( tools ) {
 *         // Room for 8 tools of >=45px each, 5 of which are always shown
 *         return this.$bar[ 0 ].clientWidth > 360 ? 3 : 0;
 *     };
 *
 * @param {OO.ui.Tool[]} tools Promotable tools, in priority order, see #getPromotableTools
 * @return {number} Number of tools to promote
 */
OO.ui.Toolbar.prototype.getPromotedToolCount = function ( tools ) {
	if ( this.isNarrow() ) {
		return 0;
	}
	const measurements = this.getPromotionMeasurements( tools ),
		available = this.$bar[ 0 ].clientWidth - measurements.baseWidth,
		// Width each group adds to the toolbar, and how, for the tools promoted so far
		groupStates = new Map(),
		// Only consider promoting whole sets
		lastToolsInSets = this.getPromotableToolSets().map( ( set ) => set[ set.length - 1 ] );

	let width = 0,
		count = 0;
	for ( let i = 0; i < tools.length; i++ ) {
		const tool = tools[ i ],
			toolGroup = tool.toolGroup;
		let state = groupStates.get( toolGroup );
		if ( !state ) {
			state = { count: 0, toolsWidth: 0, firstIndex: null, width: 0 };
			groupStates.set( toolGroup, state );
		}
		state.count++;
		state.toolsWidth += measurements.toolWidths[ i ];
		// Track which promoted tool will be displayed first in this group
		if (
			state.firstIndex === null ||
			toolGroup.items.indexOf( tool ) < toolGroup.items.indexOf( tools[ state.firstIndex ] )
		) {
			state.firstIndex = i;
		}

		// The first tool in the promoted tools container doesn't have the margin
		// that separates adjacent tools
		let groupWidth = state.toolsWidth - measurements.toolMargins[ state.firstIndex ] +
			measurements.containerWidths.get( toolGroup );
		if ( state.count === toolGroup.items.length ) {
			// All of this group's tools are promoted, so the group will be hidden
			groupWidth -= measurements.groupWidths.get( toolGroup );
		}
		width += groupWidth - state.width;
		state.width = groupWidth;

		if ( width < available && lastToolsInSets.includes( tool ) ) {
			count = i + 1;
		}
	}
	return count;
};

/**
 * Get the (lazily-computed) widths used to decide how many tools to promote.
 *
 * Measurements are recomputed if the list of promotable tools changes. Like the narrow threshold,
 * they are otherwise not updated if the content of the toolbar changes.
 *
 * @private
 * @param {OO.ui.Tool[]} tools Promotable tools
 * @return {Object} Measurements: `baseWidth`, the width of the toolbar contents with no tools
 *  promoted; `toolWidths`, the width of each tool in `tools` when promoted, including margins;
 *  `toolMargins`, the horizontal margins included in each of `toolWidths`; `containerWidths`,
 *  a Map of each toolgroup to the width its promoted tools container adds, excluding the tools;
 *  and `groupWidths`, a Map of each toolgroup to its own width
 */
OO.ui.Toolbar.prototype.getPromotionMeasurements = function ( tools ) {
	const cached = this.promotionMeasurements;
	if (
		cached && cached.tools.length === tools.length &&
		cached.tools.every( ( tool, i ) => tool === tools[ i ] )
	) {
		return cached;
	}

	const promotedTools = [];
	this.items.forEach( ( toolGroup ) => {
		if ( toolGroup instanceof OO.ui.PopupToolGroup ) {
			promotedTools.push( ...toolGroup.getPromotedTools() );
		}
	} );

	// Use unrounded widths, as rounding errors add up and can cause the toolbar to wrap
	const getWidth = ( el ) => el.getBoundingClientRect().width;
	// Width including horizontal margins
	const getOuterWidth = ( el ) => {
		const style = this.getElementWindow().getComputedStyle( el );
		return getWidth( el ) + parseFloat( style.marginLeft ) + parseFloat( style.marginRight );
	};

	this.setPromotedTools( [] );
	const baseWidth = getWidth( this.$group[ 0 ] ) + getWidth( this.$after[ 0 ] ) +
		getWidth( this.$actions[ 0 ] );
	const groupWidths = new Map();
	tools.forEach( ( tool ) => {
		groupWidths.set( tool.toolGroup, getOuterWidth( tool.toolGroup.$element[ 0 ] ) );
	} );

	this.setPromotedTools( tools );
	// Widths include margins, which separate a tool from the one before it
	const toolWidths = tools.map( ( tool ) => getOuterWidth( tool.$element[ 0 ] ) );
	const toolMargins = tools.map( ( tool, i ) => toolWidths[ i ] - getWidth( tool.$element[ 0 ] ) );
	const containerWidths = new Map();
	groupWidths.forEach( ( width, toolGroup ) => {
		let containerWidth = getOuterWidth( toolGroup.$promoted[ 0 ] );
		tools.forEach( ( tool, i ) => {
			if ( tool.toolGroup === toolGroup ) {
				containerWidth -= toolWidths[ i ];
			}
		} );
		containerWidths.set( toolGroup, containerWidth );
	} );

	// Restore the previous state, in case the caller doesn't change it
	this.setPromotedTools( promotedTools );

	this.promotionMeasurements = {
		tools, baseWidth, toolWidths, toolMargins, containerWidths, groupWidths
	};
	return this.promotionMeasurements;
};

/**
 * Sets up handles and preloads required information for the toolbar to work.
 * This must be called after it is attached to a visible document and before doing anything else.
 */
OO.ui.Toolbar.prototype.initialize = function () {
	if ( !this.initialized ) {
		this.initialized = true;
		$( this.getElementWindow() ).on( 'resize', this.onWindowResizeHandler );
		this.onWindowResize();
	}
};

/**
 * Set up the toolbar.
 *
 * The toolbar is set up with a list of toolgroup configurations that specify the type of
 * toolgroup ({@link OO.ui.BarToolGroup bar}, {@link OO.ui.MenuToolGroup menu}, or
 * {@link OO.ui.ListToolGroup list}) to add and which tools to include, exclude, promote, or demote
 * within that toolgroup. Please see {@link OO.ui.ToolGroup toolgroups} for more information about
 * including tools in toolgroups.
 *
 * @param {Object[]} groups List of toolgroup configurations
 * @param {string} groups.name Symbolic name for this toolgroup
 * @param {string} [groups.type] Toolgroup type, e.g. "bar", "list", or "menu". Should exist in the
 *  {@link OO.ui.ToolGroupFactory} provided via the constructor. Defaults to "list" for catch-all
 *  groups where `include='*'`, otherwise "bar".
 * @param {Array|string} [groups.include] Tools to include in the toolgroup, or "*" for catch-all,
 *  see {@link OO.ui.ToolFactory#extract}
 * @param {Array|string} [groups.exclude] Tools to exclude from the toolgroup
 * @param {Array|string} [groups.promote] Tools to promote to the beginning of the toolgroup
 * @param {Array|string} [groups.demote] Tools to demote to the end of the toolgroup
 */
OO.ui.Toolbar.prototype.setup = function ( groups ) {
	const defaultType = 'bar';

	// Cleanup previous groups
	this.reset();

	const items = [];
	// Build out new groups
	for ( let i = 0, len = groups.length; i < len; i++ ) {
		const groupConfig = groups[ i ];
		if ( groupConfig.include === '*' ) {
			// Apply defaults to catch-all groups
			if ( groupConfig.type === undefined ) {
				groupConfig.type = 'list';
			}
			if ( groupConfig.label === undefined ) {
				groupConfig.label = OO.ui.msg( 'ooui-toolbar-more' );
			}
		}
		// Check type has been registered
		const type = this.getToolGroupFactory().lookup( groupConfig.type ) ?
			groupConfig.type : defaultType;
		const toolGroup = this.getToolGroupFactory().create( type, this, groupConfig );
		items.push( toolGroup );
		this.groupsByName[ groupConfig.name ] = toolGroup;
		toolGroup.connect( this, {
			active: 'onToolGroupActive'
		} );
	}
	this.addItems( items );
	if ( this.initialized ) {
		this.updatePromotedTools();
	}
};

/**
 * Handle active events from tool groups
 *
 * @param {boolean} active Tool group has become active, inactive if false
 * @fires OO.ui.Toolbar#active
 */
OO.ui.Toolbar.prototype.onToolGroupActive = function ( active ) {
	if ( active ) {
		this.activeToolGroups++;
		if ( this.activeToolGroups === 1 ) {
			this.emit( 'active', true );
		}
	} else {
		this.activeToolGroups--;
		if ( this.activeToolGroups === 0 ) {
			this.emit( 'active', false );
		}
	}
};

/**
 * Get a toolgroup by name
 *
 * @param {string} name Group name
 * @return {OO.ui.ToolGroup|null} Tool group, or null if none found by that name
 */
OO.ui.Toolbar.prototype.getToolGroupByName = function ( name ) {
	return this.groupsByName[ name ] || null;
};

/**
 * Remove all tools and toolgroups from the toolbar.
 */
OO.ui.Toolbar.prototype.reset = function () {
	this.groupsByName = {};
	this.tools = {};
	for ( let i = 0, len = this.items.length; i < len; i++ ) {
		this.items[ i ].destroy();
	}
	this.clearItems();
};

/**
 * Destroy the toolbar.
 *
 * Destroying the toolbar removes all event handlers and DOM elements that constitute the toolbar.
 * Call this method whenever you are done using a toolbar.
 */
OO.ui.Toolbar.prototype.destroy = function () {
	$( this.getElementWindow() ).off( 'resize', this.onWindowResizeHandler );
	this.reset();
	this.$element.remove();
};

/**
 * Check if the tool is available.
 *
 * Available tools are ones that have not yet been added to the toolbar.
 *
 * @param {string} name Symbolic name of tool
 * @return {boolean} Tool is available
 */
OO.ui.Toolbar.prototype.isToolAvailable = function ( name ) {
	return !this.tools[ name ];
};

/**
 * Prevent tool from being used again.
 *
 * @param {OO.ui.Tool} tool Tool to reserve
 */
OO.ui.Toolbar.prototype.reserveTool = function ( tool ) {
	this.tools[ tool.getName() ] = tool;
};

/**
 * Allow tool to be used again.
 *
 * @param {OO.ui.Tool} tool Tool to release
 */
OO.ui.Toolbar.prototype.releaseTool = function ( tool ) {
	delete this.tools[ tool.getName() ];
};

/**
 * Get accelerator label for tool.
 *
 * The OOUI library does not contain an accelerator system, but this is the hook for one. To
 * use an accelerator system, subclass the toolbar and override this method, which is meant to
 * return a label that describes the accelerator keys for the tool passed (by symbolic name) to
 * the method.
 *
 * @param {string} name Symbolic name of tool
 * @return {string|undefined} Tool accelerator label if available
 */
OO.ui.Toolbar.prototype.getToolAccelerator = function () {
	return undefined;
};
