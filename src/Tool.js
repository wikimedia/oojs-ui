/**
 * Tools, together with {@link OO.ui.ToolGroup toolgroups}, constitute
 * {@link OO.ui.Toolbar toolbars}.
 * Each tool is configured with a static name, title, and icon and is customized with the command
 * to carry out when the tool is selected. Tools must also be registered with a
 * {@link OO.ui.ToolFactory tool factory}, which creates the tools on demand.
 *
 * Every Tool subclass must implement two methods:
 *
 * - {@link OO.ui.Tool#onUpdateState onUpdateState}
 * - {@link OO.ui.Tool#onSelect onSelect}
 *
 * Tools are added to toolgroups ({@link OO.ui.ListToolGroup ListToolGroup},
 * {@link OO.ui.BarToolGroup BarToolGroup}, or {@link OO.ui.MenuToolGroup MenuToolGroup}), which
 * determine how the tool is displayed in the toolbar. See {@link OO.ui.Toolbar toolbars} for an
 * example.
 *
 * For more information, please see the [OOUI documentation on MediaWiki][1].
 * [1]: https://www.mediawiki.org/wiki/OOUI/Toolbars
 *
 * @abstract
 * @class
 * @extends OO.ui.Widget
 * @mixes OO.ui.mixin.IconElement
 * @mixes OO.ui.mixin.FlaggedElement
 * @mixes OO.ui.mixin.TabIndexedElement
 *
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 * @param {string|Function} [config.title] Title text or a function that returns text. If this config is
 *  omitted, the value of the {@link OO.ui.Tool.static.title static title} property is used.
 * @param {boolean} [config.displayBothIconAndLabel] See static.displayBothIconAndLabel
 * @param {Object} [config.narrowConfig] See static.narrowConfig
 *
 *  The title is used in different ways depending on the type of toolgroup that contains the tool.
 *  The title is used as a tooltip if the tool is part of a {@link OO.ui.BarToolGroup bar}
 *  toolgroup, or as the label text if the tool is part of a {@link OO.ui.ListToolGroup list} or
 *  {@link OO.ui.MenuToolGroup menu} toolgroup.
 *
 *  For bar toolgroups, a description of the accelerator key is appended to the title if an
 *  accelerator key is associated with an action by the same name as the tool and accelerator
 *  functionality has been added to the application.
 *  To add accelerator key functionality, you must subclass OO.ui.Toolbar and override the
 *  {@link OO.ui.Toolbar#getToolAccelerator getToolAccelerator} method.
 */
OO.ui.Tool = function OoUiTool( toolGroup, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( toolGroup ) && config === undefined ) {
		config = toolGroup;
		toolGroup = config.toolGroup;
	}

	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.Tool.super.call( this, config );

	// Properties
	this.toolGroup = toolGroup;
	this.toolbar = this.toolGroup.getToolbar();
	this.active = false;
	this.$title = $( '<span>' );
	this.$accel = $( '<span>' );
	this.$link = $( '<a>' );
	this.title = null;
	this.checkIcon = new OO.ui.IconWidget( {
		icon: 'check',
		classes: [ 'oo-ui-tool-checkIcon' ]
	} );
	this.displayBothIconAndLabel = config.displayBothIconAndLabel !== undefined ?
		config.displayBothIconAndLabel : this.constructor.static.displayBothIconAndLabel;
	this.narrowConfig = config.narrowConfig || this.constructor.static.narrowConfig;

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.TabIndexedElement.call( this, $.extend( {
		$tabIndexed: this.$link
	}, config ) );

	// Events
	this.toolbar.connect( this, {
		updateState: 'onUpdateState',
		resize: 'onToolbarResize'
	} );

	// Initialization
	this.$title.addClass( 'oo-ui-tool-title' );
	this.$accel
		.addClass( 'oo-ui-tool-accel' )
		.prop( {
			// This may need to be changed if the key names are ever localized,
			// but for now they are essentially written in English
			dir: 'ltr',
			lang: 'en'
		} );
	this.$link
		.addClass( 'oo-ui-tool-link' )
		.append( this.checkIcon.$element, this.$icon, this.$title, this.$accel )
		.attr( 'role', 'button' );

	// Don't show keyboard shortcuts on mobile as users are unlikely to have
	// a physical keyboard, and likely to have limited screen space.
	if ( !OO.ui.isMobile() ) {
		this.$link.append( this.$accel );
	}

	this.$element
		.data( 'oo-ui-tool', this )
		.addClass( 'oo-ui-tool' )
		.addClass( 'oo-ui-tool-name-' +
			this.constructor.static.name.replace( /^([^/]+)\/([^/]+).*$/, '$1-$2' ) )
		.append( this.$link );
	this.setTitle( config.title || this.constructor.static.title );
};

/* Setup */

OO.inheritClass( OO.ui.Tool, OO.ui.Widget );
OO.mixinClass( OO.ui.Tool, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.Tool, OO.ui.mixin.FlaggedElement );
OO.mixinClass( OO.ui.Tool, OO.ui.mixin.TabIndexedElement );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.Tool.static.tagName = 'span';

/**
 * Symbolic name of tool.
 *
 * The symbolic name is used internally to register the tool with a
 * {@link OO.ui.ToolFactory ToolFactory}. It can also be used when adding tools to toolgroups.
 *
 * @abstract
 * @static
 * @property {string}
 */
OO.ui.Tool.static.name = '';

/**
 * Symbolic name of the group.
 *
 * The group name is used to associate tools with each other so that they can be selected later by
 * a {@link OO.ui.ToolGroup toolgroup}.
 *
 * @abstract
 * @static
 * @property {string}
 */
OO.ui.Tool.static.group = '';

/**
 * Tool title text or a function that returns title text. The value of the static property is
 * overridden if the #title config option is used.
 *
 * @abstract
 * @static
 * @property {string|Function}
 */
OO.ui.Tool.static.title = '';

/**
 * Display both icon and label when the tool is used in a {@link OO.ui.BarToolGroup bar} toolgroup.
 * Normally only the icon is displayed, or only the label if no icon is given.
 *
 * @static
 * @property {boolean}
 */
OO.ui.Tool.static.displayBothIconAndLabel = false;

/**
 * Add tool to catch-all groups automatically.
 *
 * A catch-all group, which contains all tools that do not currently belong to a toolgroup,
 * can be included in a toolgroup using the wildcard selector, an asterisk (*).
 *
 * @static
 * @property {boolean}
 */
OO.ui.Tool.static.autoAddToCatchall = true;

/**
 * Add tool to named groups automatically.
 *
 * By default, tools that are configured with a static ‘group’ property are added
 * to that group and will be selected when the symbolic name of the group is specified (e.g., when
 * toolgroups include tools by group name).
 *
 * @static
 * @property {boolean}
 */
OO.ui.Tool.static.autoAddToGroup = true;

/**
 * Check if this tool is compatible with given data.
 *
 * This is a stub that can be overridden to provide support for filtering tools based on an
 * arbitrary piece of information  (e.g., where the cursor is in a document). The implementation
 * must also call this method so that the compatibility check can be performed.
 *
 * @static
 * @param {any} data Data to check
 * @return {boolean} Tool can be used with data
 */
OO.ui.Tool.static.isCompatibleWith = function () {
	return false;
};

/**
 * Config options to change when toolbar is in narrow mode
 *
 * Supports `displayBothIconAndLabel`, `title` and `icon` properties.
 *
 * @static
 * @property {Object|null}
 */
OO.ui.Tool.static.narrowConfig = null;

/* Methods */

/**
 * Handle the toolbar state being updated. This method is called when the
 * {@link OO.ui.Toolbar#event-updateState 'updateState' event} is emitted on the
 * {@link OO.ui.Toolbar Toolbar} that uses this tool, and should set the state of this tool
 * depending on application state (usually by calling #setDisabled to enable or disable the tool,
 * or #setActive to mark is as currently in-use or not).
 *
 * This is an abstract method that must be overridden in a concrete subclass.
 *
 * @method
 * @protected
 * @abstract
 */
OO.ui.Tool.prototype.onUpdateState = null;

/**
 * Handle the tool being selected. This method is called when the user triggers this tool,
 * usually by clicking on its label/icon.
 *
 * This is an abstract method that must be overridden in a concrete subclass.
 *
 * @method
 * @protected
 * @abstract
 */
OO.ui.Tool.prototype.onSelect = null;

/**
 * Check if the tool is active.
 *
 * Tools become active when their #onSelect or #onUpdateState handlers change them to appear pressed
 * with the #setActive method. Additional CSS is applied to the tool to reflect the active state.
 *
 * @return {boolean} Tool is active
 */
OO.ui.Tool.prototype.isActive = function () {
	return this.active;
};

/**
 * Make the tool appear active or inactive.
 *
 * This method should be called within #onSelect or #onUpdateState event handlers to make the tool
 * appear pressed or not.
 *
 * @param {boolean} [state=false] Make tool appear active
 */
OO.ui.Tool.prototype.setActive = function ( state ) {
	this.active = !!state;
	this.$element.toggleClass( 'oo-ui-tool-active', this.active );
	this.updateThemeClasses();
};

/**
 * Set the tool #title.
 *
 * @param {string|Function} title Title text or a function that returns text
 * @chainable
 * @return {OO.ui.Tool} The tool, for chaining
 */
OO.ui.Tool.prototype.setTitle = function ( title ) {
	this.title = OO.ui.resolveMsg( title );
	this.updateTitle();
	// Update classes
	this.setDisplayBothIconAndLabel( this.displayBothIconAndLabel );
	return this;
};

/**
 * Set the tool's displayBothIconAndLabel state.
 *
 * Update title classes if necessary
 *
 * @param {boolean} displayBothIconAndLabel
 * @chainable
 * @return {OO.ui.Tool} The tool, for chaining
 */
OO.ui.Tool.prototype.setDisplayBothIconAndLabel = function ( displayBothIconAndLabel ) {
	this.displayBothIconAndLabel = displayBothIconAndLabel;
	this.$element.toggleClass( 'oo-ui-tool-with-label', !!this.title && this.displayBothIconAndLabel );
	return this;
};

/**
 * Get the tool #title.
 *
 * @return {string} Title text
 */
OO.ui.Tool.prototype.getTitle = function () {
	return this.title;
};

/**
 * Get the tool's symbolic name.
 *
 * @return {string} Symbolic name of tool
 */
OO.ui.Tool.prototype.getName = function () {
	return this.constructor.static.name;
};

/**
 * Handle resize events from the toolbar
 */
OO.ui.Tool.prototype.onToolbarResize = function () {
	if ( !this.narrowConfig ) {
		return;
	}
	if ( this.toolbar.isNarrow() ) {
		if ( this.narrowConfig.displayBothIconAndLabel !== undefined ) {
			this.wideDisplayBothIconAndLabel = this.displayBothIconAndLabel;
			this.setDisplayBothIconAndLabel( this.narrowConfig.displayBothIconAndLabel );
		}
		if ( this.narrowConfig.title !== undefined ) {
			this.wideTitle = this.title;
			this.setTitle( this.narrowConfig.title );
		}
		if ( this.narrowConfig.icon !== undefined ) {
			this.wideIcon = this.icon;
			this.setIcon( this.narrowConfig.icon );
		}
	} else {
		if ( this.wideDisplayBothIconAndLabel !== undefined ) {
			this.setDisplayBothIconAndLabel( this.wideDisplayBothIconAndLabel );
		}
		if ( this.wideTitle !== undefined ) {
			this.setTitle( this.wideTitle );
		}
		if ( this.wideIcon !== undefined ) {
			this.setIcon( this.wideIcon );
		}
	}
};

/**
 * Update the title.
 */
OO.ui.Tool.prototype.updateTitle = function () {
	const titleTooltips = this.toolGroup.constructor.static.titleTooltips,
		accelTooltips = this.toolGroup.constructor.static.accelTooltips,
		accel = this.toolbar.getToolAccelerator( this.constructor.static.name ),
		tooltipParts = [];

	this.$title.text( this.title );
	this.$accel.text( accel );

	if ( titleTooltips && typeof this.title === 'string' && this.title.length ) {
		tooltipParts.push( this.title );
	}
	if ( accelTooltips && typeof accel === 'string' && accel.length ) {
		tooltipParts.push( accel );
	}
	if ( tooltipParts.length ) {
		this.$link.attr( 'title', tooltipParts.join( ' ' ) );
	} else {
		this.$link.removeAttr( 'title' );
	}
};

/**
 * @inheritdoc OO.ui.mixin.IconElement
 */
OO.ui.Tool.prototype.setIcon = function ( icon ) {
	// Mixin method
	OO.ui.mixin.IconElement.prototype.setIcon.call( this, icon );

	this.$element.toggleClass( 'oo-ui-tool-with-icon', !!this.icon );

	return this;
};

/**
 * Destroy tool.
 *
 * Destroying the tool removes all event handlers and the tool’s DOM elements.
 * Call this method whenever you are done using a tool.
 */
OO.ui.Tool.prototype.destroy = function () {
	this.toolbar.disconnect( this );
	this.$element.remove();
};
