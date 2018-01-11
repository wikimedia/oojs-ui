/**
 * ToolGroups are collections of {@link OO.ui.Tool tools} that are used in a {@link OO.ui.Toolbar toolbar}.
 * The type of toolgroup ({@link OO.ui.ListToolGroup list}, {@link OO.ui.BarToolGroup bar}, or {@link OO.ui.MenuToolGroup menu})
 * to which a tool belongs determines how the tool is arranged and displayed in the toolbar. Toolgroups
 * themselves are created on demand with a {@link OO.ui.ToolGroupFactory toolgroup factory}.
 *
 * Toolgroups can contain individual tools, groups of tools, or all available tools, as specified
 * using the `include` config option. See OO.ui.ToolFactory#extract on documentation of the format.
 * The options `exclude`, `promote`, and `demote` support the same formats.
 *
 * See {@link OO.ui.Toolbar toolbars} for a full example. For more information about toolbars in general,
 * please see the [OOUI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Toolbars
 *
 * @abstract
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 * @cfg {Array|string} [include] List of tools to include in the toolgroup, see above.
 * @cfg {Array|string} [exclude] List of tools to exclude from the toolgroup, see above.
 * @cfg {Array|string} [promote] List of tools to promote to the beginning of the toolgroup, see above.
 * @cfg {Array|string} [demote] List of tools to demote to the end of the toolgroup, see above.
 *  This setting is particularly useful when tools have been added to the toolgroup
 *  en masse (e.g., via the catch-all selector).
 */
OO.ui.ToolGroup = function OoUiToolGroup( toolbar, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( toolbar ) && config === undefined ) {
		config = toolbar;
		toolbar = config.toolbar;
	}

	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.ToolGroup.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.GroupElement.call( this, config );

	// Properties
	this.toolbar = toolbar;
	this.tools = {};
	this.pressed = null;
	this.autoDisabled = false;
	this.include = config.include || [];
	this.exclude = config.exclude || [];
	this.promote = config.promote || [];
	this.demote = config.demote || [];
	this.onCapturedMouseKeyUpHandler = this.onCapturedMouseKeyUp.bind( this );

	// Events
	this.$element.on( {
		mousedown: this.onMouseKeyDown.bind( this ),
		mouseup: this.onMouseKeyUp.bind( this ),
		keydown: this.onMouseKeyDown.bind( this ),
		keyup: this.onMouseKeyUp.bind( this ),
		focus: this.onMouseOverFocus.bind( this ),
		blur: this.onMouseOutBlur.bind( this ),
		mouseover: this.onMouseOverFocus.bind( this ),
		mouseout: this.onMouseOutBlur.bind( this )
	} );
	this.toolbar.getToolFactory().connect( this, { register: 'onToolFactoryRegister' } );
	this.aggregate( { disable: 'itemDisable' } );
	this.connect( this, { itemDisable: 'updateDisabled' } );

	// Initialization
	this.$group.addClass( 'oo-ui-toolGroup-tools' );
	this.$element
		.addClass( 'oo-ui-toolGroup' )
		.append( this.$group );
	this.populate();
};

/* Setup */

OO.inheritClass( OO.ui.ToolGroup, OO.ui.Widget );
OO.mixinClass( OO.ui.ToolGroup, OO.ui.mixin.GroupElement );

/* Events */

/**
 * @event update
 */

/* Static Properties */

/**
 * Show labels in tooltips.
 *
 * @static
 * @inheritable
 * @property {boolean}
 */
OO.ui.ToolGroup.static.titleTooltips = false;

/**
 * Show acceleration labels in tooltips.
 *
 * Note: The OOUI library does not include an accelerator system, but does contain
 * a hook for one. To use an accelerator system, subclass the {@link OO.ui.Toolbar toolbar} and
 * override the {@link OO.ui.Toolbar#getToolAccelerator getToolAccelerator} method, which is
 * meant to return a label that describes the accelerator keys for a given tool (e.g., 'Ctrl + M').
 *
 * @static
 * @inheritable
 * @property {boolean}
 */
OO.ui.ToolGroup.static.accelTooltips = false;

/**
 * Automatically disable the toolgroup when all tools are disabled
 *
 * @static
 * @inheritable
 * @property {boolean}
 */
OO.ui.ToolGroup.static.autoDisable = true;

/**
 * @abstract
 * @static
 * @inheritable
 * @property {string}
 */
OO.ui.ToolGroup.static.name = null;

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.ToolGroup.prototype.isDisabled = function () {
	return this.autoDisabled || OO.ui.ToolGroup.parent.prototype.isDisabled.apply( this, arguments );
};

/**
 * @inheritdoc
 */
OO.ui.ToolGroup.prototype.updateDisabled = function () {
	var i, item, allDisabled = true;

	if ( this.constructor.static.autoDisable ) {
		for ( i = this.items.length - 1; i >= 0; i-- ) {
			item = this.items[ i ];
			if ( !item.isDisabled() ) {
				allDisabled = false;
				break;
			}
		}
		this.autoDisabled = allDisabled;
	}
	OO.ui.ToolGroup.parent.prototype.updateDisabled.apply( this, arguments );
};

/**
 * Handle mouse down and key down events.
 *
 * @protected
 * @param {jQuery.Event} e Mouse down or key down event
 */
OO.ui.ToolGroup.prototype.onMouseKeyDown = function ( e ) {
	if (
		!this.isDisabled() &&
		( e.which === OO.ui.MouseButtons.LEFT || e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER )
	) {
		this.pressed = this.findTargetTool( e );
		if ( this.pressed ) {
			this.pressed.setActive( true );
			this.getElementDocument().addEventListener( 'mouseup', this.onCapturedMouseKeyUpHandler, true );
			this.getElementDocument().addEventListener( 'keyup', this.onCapturedMouseKeyUpHandler, true );
			return false;
		}
	}
};

/**
 * Handle captured mouse up and key up events.
 *
 * @protected
 * @param {MouseEvent|KeyboardEvent} e Mouse up or key up event
 */
OO.ui.ToolGroup.prototype.onCapturedMouseKeyUp = function ( e ) {
	this.getElementDocument().removeEventListener( 'mouseup', this.onCapturedMouseKeyUpHandler, true );
	this.getElementDocument().removeEventListener( 'keyup', this.onCapturedMouseKeyUpHandler, true );
	// onMouseKeyUp may be called a second time, depending on where the mouse is when the button is
	// released, but since `this.pressed` will no longer be true, the second call will be ignored.
	this.onMouseKeyUp( e );
};

/**
 * Handle mouse up and key up events.
 *
 * @protected
 * @param {MouseEvent|KeyboardEvent} e Mouse up or key up event
 */
OO.ui.ToolGroup.prototype.onMouseKeyUp = function ( e ) {
	var tool = this.findTargetTool( e );

	if (
		!this.isDisabled() && this.pressed && this.pressed === tool &&
		( e.which === OO.ui.MouseButtons.LEFT || e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER )
	) {
		this.pressed.onSelect();
		this.pressed = null;
		e.preventDefault();
		e.stopPropagation();
	}

	this.pressed = null;
};

/**
 * Handle mouse over and focus events.
 *
 * @protected
 * @param {jQuery.Event} e Mouse over or focus event
 */
OO.ui.ToolGroup.prototype.onMouseOverFocus = function ( e ) {
	var tool = this.findTargetTool( e );

	if ( this.pressed && this.pressed === tool ) {
		this.pressed.setActive( true );
	}
};

/**
 * Handle mouse out and blur events.
 *
 * @protected
 * @param {jQuery.Event} e Mouse out or blur event
 */
OO.ui.ToolGroup.prototype.onMouseOutBlur = function ( e ) {
	var tool = this.findTargetTool( e );

	if ( this.pressed && this.pressed === tool ) {
		this.pressed.setActive( false );
	}
};

/**
 * Get the closest tool to a jQuery.Event.
 *
 * Only tool links are considered, which prevents other elements in the tool such as popups from
 * triggering tool group interactions.
 *
 * @private
 * @param {jQuery.Event} e
 * @return {OO.ui.Tool|null} Tool, `null` if none was found
 */
OO.ui.ToolGroup.prototype.findTargetTool = function ( e ) {
	var tool,
		$item = $( e.target ).closest( '.oo-ui-tool-link' );

	if ( $item.length ) {
		tool = $item.parent().data( 'oo-ui-tool' );
	}

	return tool && !tool.isDisabled() ? tool : null;
};

/**
 * Handle tool registry register events.
 *
 * If a tool is registered after the group is created, we must repopulate the list to account for:
 *
 * - a tool being added that may be included
 * - a tool already included being overridden
 *
 * @protected
 * @param {string} name Symbolic name of tool
 */
OO.ui.ToolGroup.prototype.onToolFactoryRegister = function () {
	this.populate();
};

/**
 * Get the toolbar that contains the toolgroup.
 *
 * @return {OO.ui.Toolbar} Toolbar that contains the toolgroup
 */
OO.ui.ToolGroup.prototype.getToolbar = function () {
	return this.toolbar;
};

/**
 * Add and remove tools based on configuration.
 */
OO.ui.ToolGroup.prototype.populate = function () {
	var i, len, name, tool,
		toolFactory = this.toolbar.getToolFactory(),
		names = {},
		add = [],
		remove = [],
		list = this.toolbar.getToolFactory().getTools(
			this.include, this.exclude, this.promote, this.demote
		);

	// Build a list of needed tools
	for ( i = 0, len = list.length; i < len; i++ ) {
		name = list[ i ];
		if (
			// Tool exists
			toolFactory.lookup( name ) &&
			// Tool is available or is already in this group
			( this.toolbar.isToolAvailable( name ) || this.tools[ name ] )
		) {
			// Hack to prevent infinite recursion via ToolGroupTool. We need to reserve the tool before
			// creating it, but we can't call reserveTool() yet because we haven't created the tool.
			this.toolbar.tools[ name ] = true;
			tool = this.tools[ name ];
			if ( !tool ) {
				// Auto-initialize tools on first use
				this.tools[ name ] = tool = toolFactory.create( name, this );
				tool.updateTitle();
			}
			this.toolbar.reserveTool( tool );
			add.push( tool );
			names[ name ] = true;
		}
	}
	// Remove tools that are no longer needed
	for ( name in this.tools ) {
		if ( !names[ name ] ) {
			this.tools[ name ].destroy();
			this.toolbar.releaseTool( this.tools[ name ] );
			remove.push( this.tools[ name ] );
			delete this.tools[ name ];
		}
	}
	if ( remove.length ) {
		this.removeItems( remove );
	}
	// Update emptiness state
	if ( add.length ) {
		this.$element.removeClass( 'oo-ui-toolGroup-empty' );
	} else {
		this.$element.addClass( 'oo-ui-toolGroup-empty' );
	}
	// Re-add tools (moving existing ones to new locations)
	this.addItems( add );
	// Disabled state may depend on items
	this.updateDisabled();
};

/**
 * Destroy toolgroup.
 */
OO.ui.ToolGroup.prototype.destroy = function () {
	var name;

	this.clearItems();
	this.toolbar.getToolFactory().disconnect( this );
	for ( name in this.tools ) {
		this.toolbar.releaseTool( this.tools[ name ] );
		this.tools[ name ].disconnect( this ).destroy();
		delete this.tools[ name ];
	}
	this.$element.remove();
};
