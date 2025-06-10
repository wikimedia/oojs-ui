/**
 * ToolGroups are collections of {@link OO.ui.Tool tools} that are used in a
 * {@link OO.ui.Toolbar toolbar}.
 * The type of toolgroup ({@link OO.ui.ListToolGroup list}, {@link OO.ui.BarToolGroup bar}, or
 * {@link OO.ui.MenuToolGroup menu}) to which a tool belongs determines how the tool is arranged
 * and displayed in the toolbar. Toolgroups themselves are created on demand with a
 * {@link OO.ui.ToolGroupFactory toolgroup factory}.
 *
 * Toolgroups can contain individual tools, groups of tools, or all available tools, as specified
 * using the `include` config option. See OO.ui.ToolFactory#extract on documentation of the format.
 * The options `exclude`, `promote`, and `demote` support the same formats.
 *
 * See {@link OO.ui.Toolbar toolbars} for a full example. For more information about toolbars in
 * general, please see the [OOUI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Toolbars
 *
 * @abstract
 * @class
 * @extends OO.ui.Widget
 * @mixes OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 * @param {Array|string} [config.include=[]] List of tools to include in the toolgroup, see above.
 * @param {Array|string} [config.exclude=[]] List of tools to exclude from the toolgroup, see above.
 * @param {Array|string} [config.promote=[]] List of tools to promote to the beginning of the toolgroup,
 *  see above.
 * @param {Array|string} [config.demote=[]] List of tools to demote to the end of the toolgroup, see above.
 *  This setting is particularly useful when tools have been added to the toolgroup
 *  en masse (e.g., via the catch-all selector).
 * @param {string} [config.align='before'] Alignment within the toolbar, either 'before' or 'after'.
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
	OO.ui.ToolGroup.super.call( this, config );

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
	this.align = config.align || 'before';
	this.onDocumentMouseKeyUpHandler = this.onDocumentMouseKeyUp.bind( this );

	// Events
	this.$group.on( {
		mousedown: this.onMouseKeyDown.bind( this ),
		mouseup: this.onMouseKeyUp.bind( this ),
		keydown: this.onMouseKeyDown.bind( this ),
		keyup: this.onMouseKeyUp.bind( this ),
		focus: this.onMouseOverFocus.bind( this ),
		blur: this.onMouseOutBlur.bind( this ),
		mouseover: this.onMouseOverFocus.bind( this ),
		mouseout: this.onMouseOutBlur.bind( this )
	} );
	this.toolbar.getToolFactory().connect( this, {
		register: 'onToolFactoryRegister'
	} );
	this.aggregate( {
		disable: 'itemDisable'
	} );
	this.connect( this, {
		itemDisable: 'updateDisabled',
		disable: 'onDisable'
	} );

	// Initialization
	this.$group.addClass( 'oo-ui-toolGroup-tools' );
	this.$element
		.addClass( 'oo-ui-toolGroup' )
		.append( this.$group );
	this.onDisable( this.isDisabled() );
	this.populate();
};

/* Setup */

OO.inheritClass( OO.ui.ToolGroup, OO.ui.Widget );
OO.mixinClass( OO.ui.ToolGroup, OO.ui.mixin.GroupElement );

/* Events */

/**
 * @event OO.ui.ToolGroup#update
 */

/**
 * An 'active' event is emitted when any popup is shown/hidden.
 *
 * @event OO.ui.ToolGroup#active
 * @param {boolean} The popup is visible
 */

/* Static Properties */

/**
 * Show labels in tooltips.
 *
 * @static
 * @property {boolean}
 */
OO.ui.ToolGroup.static.titleTooltips = false;

/**
 * Show acceleration labels in tooltips.
 *
 * Note: The OOUI library does not include an accelerator system, but does contain
 * a hook for one. To use an accelerator system, subclass the {@link OO.ui.Toolbar toolbar} and
 * override the {@link OO.ui.Toolbar#getToolAccelerator getToolAccelerator} method, which is
 * meant to return a label that describes the accelerator keys for a given tool (e.g., Control+M
 * key combination).
 *
 * @static
 * @property {boolean}
 */
OO.ui.ToolGroup.static.accelTooltips = false;

/**
 * Automatically disable the toolgroup when all tools are disabled
 *
 * @static
 * @property {boolean}
 */
OO.ui.ToolGroup.static.autoDisable = true;

/**
 * @abstract
 * @static
 * @property {string}
 */
OO.ui.ToolGroup.static.name = null;

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.ToolGroup.prototype.isDisabled = function () {
	return this.autoDisabled ||
		OO.ui.ToolGroup.super.prototype.isDisabled.apply( this, arguments );
};

/**
 * @inheritdoc
 */
OO.ui.ToolGroup.prototype.updateDisabled = function () {
	let allDisabled = true;

	if ( this.constructor.static.autoDisable ) {
		for ( let i = this.items.length - 1; i >= 0; i-- ) {
			const item = this.items[ i ];
			if ( !item.isDisabled() ) {
				allDisabled = false;
				break;
			}
		}
		this.autoDisabled = allDisabled;
	}
	OO.ui.ToolGroup.super.prototype.updateDisabled.apply( this, arguments );
};

/**
 * Handle disable events.
 *
 * @protected
 * @param {boolean} isDisabled
 */
OO.ui.ToolGroup.prototype.onDisable = function ( isDisabled ) {
	this.$group.toggleClass( 'oo-ui-toolGroup-disabled-tools', isDisabled );
	this.$group.toggleClass( 'oo-ui-toolGroup-enabled-tools', !isDisabled );
};

/**
 * Handle mouse down and key down events.
 *
 * @protected
 * @param {jQuery.Event} e Mouse down or key down event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.ToolGroup.prototype.onMouseKeyDown = function ( e ) {
	if (
		!this.isDisabled() && (
			e.which === OO.ui.MouseButtons.LEFT ||
			e.which === OO.ui.Keys.SPACE ||
			e.which === OO.ui.Keys.ENTER
		)
	) {
		this.pressed = this.findTargetTool( e );
		if ( this.pressed ) {
			this.pressed.setActive( true );
			this.getElementDocument().addEventListener(
				'mouseup',
				this.onDocumentMouseKeyUpHandler,
				true
			);
			this.getElementDocument().addEventListener(
				'keyup',
				this.onDocumentMouseKeyUpHandler,
				true
			);
			return false;
		}
	}
};

/**
 * Handle document mouse up and key up events.
 *
 * @protected
 * @param {MouseEvent|KeyboardEvent} e Mouse up or key up event
 */
OO.ui.ToolGroup.prototype.onDocumentMouseKeyUp = function ( e ) {
	if ( e.target === document.documentElement ) {
		// This means that the scrollbar was the target of the click
		return;
	}
	this.getElementDocument().removeEventListener(
		'mouseup',
		this.onDocumentMouseKeyUpHandler,
		true
	);
	this.getElementDocument().removeEventListener(
		'keyup',
		this.onDocumentMouseKeyUpHandler,
		true
	);
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
	const tool = this.findTargetTool( e );

	if (
		!this.isDisabled() && this.pressed && this.pressed === tool && (
			e.which === OO.ui.MouseButtons.LEFT ||
			e.which === OO.ui.Keys.SPACE ||
			e.which === OO.ui.Keys.ENTER
		)
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
	const tool = this.findTargetTool( e );

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
	const tool = this.findTargetTool( e );

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
	const $item = $( e.target ).closest( '.oo-ui-tool-link' );

	let tool;
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
	const toolFactory = this.toolbar.getToolFactory(),
		names = {},
		add = [],
		remove = [],
		list = this.toolbar.getToolFactory().getTools(
			this.include, this.exclude, this.promote, this.demote
		);

	let name;
	// Build a list of needed tools
	for ( let i = 0, len = list.length; i < len; i++ ) {
		name = list[ i ];
		if (
			// Tool exists
			toolFactory.lookup( name ) &&
			// Tool is available or is already in this group
			( this.toolbar.isToolAvailable( name ) || this.tools[ name ] )
		) {
			// Hack to prevent infinite recursion via ToolGroupTool. We need to reserve the tool
			// before creating it, but we can't call reserveTool() yet because we haven't created
			// the tool.
			this.toolbar.tools[ name ] = true;
			let tool = this.tools[ name ];
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
	this.$element.toggleClass( 'oo-ui-toolGroup-empty', !add.length );
	// Re-add tools (moving existing ones to new locations)
	this.addItems( add );
	// Disabled state may depend on items
	this.updateDisabled();
};

/**
 * Destroy toolgroup.
 */
OO.ui.ToolGroup.prototype.destroy = function () {
	this.clearItems();
	this.toolbar.getToolFactory().disconnect( this );
	for ( const name in this.tools ) {
		this.toolbar.releaseTool( this.tools[ name ] );
		this.tools[ name ].disconnect( this ).destroy();
		delete this.tools[ name ];
	}
	this.$element.remove();
};
