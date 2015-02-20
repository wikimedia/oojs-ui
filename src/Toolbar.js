/**
 * Collection of tool groups.
 *
 * @class
 * @extends OO.ui.Element
 * @mixins OO.EventEmitter
 * @mixins OO.ui.GroupElement
 *
 * @constructor
 * @param {OO.ui.ToolFactory} toolFactory Factory for creating tools
 * @param {OO.ui.ToolGroupFactory} toolGroupFactory Factory for creating tool groups
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [actions] Add an actions section opposite to the tools
 * @cfg {boolean} [shadow] Add a shadow below the toolbar
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
	OO.ui.GroupElement.call( this, config );

	// Properties
	this.toolFactory = toolFactory;
	this.toolGroupFactory = toolGroupFactory;
	this.groups = [];
	this.tools = {};
	this.$bar = $( '<div>' );
	this.$actions = $( '<div>' );
	this.initialized = false;

	// Events
	this.$element
		.add( this.$bar ).add( this.$group ).add( this.$actions )
		.on( 'mousedown touchstart', this.onPointerDown.bind( this ) );

	// Initialization
	this.$group.addClass( 'oo-ui-toolbar-tools' );
	if ( config.actions ) {
		this.$bar.append( this.$actions.addClass( 'oo-ui-toolbar-actions' ) );
	}
	this.$bar
		.addClass( 'oo-ui-toolbar-bar' )
		.append( this.$group, '<div style="clear:both"></div>' );
	if ( config.shadow ) {
		this.$bar.append( '<div class="oo-ui-toolbar-shadow"></div>' );
	}
	this.$element.addClass( 'oo-ui-toolbar' ).append( this.$bar );
};

/* Setup */

OO.inheritClass( OO.ui.Toolbar, OO.ui.Element );
OO.mixinClass( OO.ui.Toolbar, OO.EventEmitter );
OO.mixinClass( OO.ui.Toolbar, OO.ui.GroupElement );

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
 * Get the tool group factory.
 *
 * @return {OO.Factory} Tool group factory
 */
OO.ui.Toolbar.prototype.getToolGroupFactory = function () {
	return this.toolGroupFactory;
};

/**
 * Handles mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.Toolbar.prototype.onPointerDown = function ( e ) {
	var $closestWidgetToEvent = $( e.target ).closest( '.oo-ui-widget' ),
		$closestWidgetToToolbar = this.$element.closest( '.oo-ui-widget' );
	if ( !$closestWidgetToEvent.length || $closestWidgetToEvent[ 0 ] === $closestWidgetToToolbar[ 0 ] ) {
		return false;
	}
};

/**
 * Sets up handles and preloads required information for the toolbar to work.
 * This must be called after it is attached to a visible document and before doing anything else.
 */
OO.ui.Toolbar.prototype.initialize = function () {
	this.initialized = true;
};

/**
 * Setup toolbar.
 *
 * Tools can be specified in the following ways:
 *
 * - A specific tool: `{ name: 'tool-name' }` or `'tool-name'`
 * - All tools in a group: `{ group: 'group-name' }`
 * - All tools: `'*'` - Using this will make the group a list with a "More" label by default
 *
 * @param {Object.<string,Array>} groups List of tool group configurations
 * @param {Array|string} [groups.include] Tools to include
 * @param {Array|string} [groups.exclude] Tools to exclude
 * @param {Array|string} [groups.promote] Tools to promote to the beginning
 * @param {Array|string} [groups.demote] Tools to demote to the end
 */
OO.ui.Toolbar.prototype.setup = function ( groups ) {
	var i, len, type, group,
		items = [],
		defaultType = 'bar';

	// Cleanup previous groups
	this.reset();

	// Build out new groups
	for ( i = 0, len = groups.length; i < len; i++ ) {
		group = groups[ i ];
		if ( group.include === '*' ) {
			// Apply defaults to catch-all groups
			if ( group.type === undefined ) {
				group.type = 'list';
			}
			if ( group.label === undefined ) {
				group.label = OO.ui.msg( 'ooui-toolbar-more' );
			}
		}
		// Check type has been registered
		type = this.getToolGroupFactory().lookup( group.type ) ? group.type : defaultType;
		items.push(
			this.getToolGroupFactory().create( type, this, group )
		);
	}
	this.addItems( items );
};

/**
 * Remove all tools and groups from the toolbar.
 */
OO.ui.Toolbar.prototype.reset = function () {
	var i, len;

	this.groups = [];
	this.tools = {};
	for ( i = 0, len = this.items.length; i < len; i++ ) {
		this.items[ i ].destroy();
	}
	this.clearItems();
};

/**
 * Destroys toolbar, removing event handlers and DOM elements.
 *
 * Call this whenever you are done using a toolbar.
 */
OO.ui.Toolbar.prototype.destroy = function () {
	this.reset();
	this.$element.remove();
};

/**
 * Check if tool has not been used yet.
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
 * This is a stub that should be overridden to provide access to accelerator information.
 *
 * @param {string} name Symbolic name of tool
 * @return {string|undefined} Tool accelerator label if available
 */
OO.ui.Toolbar.prototype.getToolAccelerator = function () {
	return undefined;
};
