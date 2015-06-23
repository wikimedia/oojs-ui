/**
 * Tools, together with {@link OO.ui.ToolGroup toolgroups}, constitute {@link OO.ui.Toolbar toolbars}.
 * Each tool is configured with a static name, title, and icon and is customized with the command to carry
 * out when the tool is selected. Tools must also be registered with a {@link OO.ui.ToolFactory tool factory},
 * which creates the tools on demand.
 *
 * Tools are added to toolgroups ({@link OO.ui.ListToolGroup ListToolGroup},
 * {@link OO.ui.BarToolGroup BarToolGroup}, or {@link OO.ui.MenuToolGroup MenuToolGroup}), which determine how
 * the tool is displayed in the toolbar. See {@link OO.ui.Toolbar toolbars} for an example.
 *
 * For more information, please see the [OOjs UI documentation on MediaWiki][1].
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Toolbars
 *
 * @abstract
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.FlaggedElement
 * @mixins OO.ui.mixin.TabIndexedElement
 *
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 * @cfg {string|Function} [title] Title text or a function that returns text. If this config is omitted, the value of
 *  the {@link #static-title static title} property is used.
 *
 *  The title is used in different ways depending on the type of toolgroup that contains the tool. The
 *  title is used as a tooltip if the tool is part of a {@link OO.ui.BarToolGroup bar} toolgroup, or as the label text if the tool is
 *  part of a {@link OO.ui.ListToolGroup list} or {@link OO.ui.MenuToolGroup menu} toolgroup.
 *
 *  For bar toolgroups, a description of the accelerator key is appended to the title if an accelerator key
 *  is associated with an action by the same name as the tool and accelerator functionality has been added to the application.
 *  To add accelerator key functionality, you must subclass OO.ui.Toolbar and override the {@link OO.ui.Toolbar#getToolAccelerator getToolAccelerator} method.
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
	OO.ui.Tool.parent.call( this, config );

	// Properties
	this.toolGroup = toolGroup;
	this.toolbar = this.toolGroup.getToolbar();
	this.active = false;
	this.$title = $( '<span>' );
	this.$accel = $( '<span>' );
	this.$link = $( '<a>' );
	this.title = null;

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.TabIndexedElement.call( this, $.extend( {}, config, { $tabIndexed: this.$link } ) );

	// Events
	this.toolbar.connect( this, { updateState: 'onUpdateState' } );

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
		.append( this.$icon, this.$title, this.$accel )
		.attr( 'role', 'button' );
	this.$element
		.data( 'oo-ui-tool', this )
		.addClass(
			'oo-ui-tool ' + 'oo-ui-tool-name-' +
			this.constructor.static.name.replace( /^([^\/]+)\/([^\/]+).*$/, '$1-$2' )
		)
		.toggleClass( 'oo-ui-tool-with-label', this.constructor.static.displayBothIconAndLabel )
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
 * The symbolic name is used internally to register the tool with a {@link OO.ui.ToolFactory ToolFactory}. It can
 * also be used when adding tools to toolgroups.
 *
 * @abstract
 * @static
 * @inheritable
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
 * @inheritable
 * @property {string}
 */
OO.ui.Tool.static.group = '';

/**
 * Tool title text or a function that returns title text. The value of the static property is overridden if the #title config option is used.
 *
 * @abstract
 * @static
 * @inheritable
 * @property {string|Function}
 */
OO.ui.Tool.static.title = '';

/**
 * Display both icon and label when the tool is used in a {@link OO.ui.BarToolGroup bar} toolgroup.
 * Normally only the icon is displayed, or only the label if no icon is given.
 *
 * @static
 * @inheritable
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
 * @inheritable
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
 * @inheritable
 */
OO.ui.Tool.static.autoAddToGroup = true;

/**
 * Check if this tool is compatible with given data.
 *
 * This is a stub that can be overriden to provide support for filtering tools based on an
 * arbitrary piece of information  (e.g., where the cursor is in a document). The implementation
 * must also call this method so that the compatibility check can be performed.
 *
 * @static
 * @inheritable
 * @param {Mixed} data Data to check
 * @return {boolean} Tool can be used with data
 */
OO.ui.Tool.static.isCompatibleWith = function () {
	return false;
};

/* Methods */

/**
 * Handle the toolbar state being updated.
 *
 * This is an abstract method that must be overridden in a concrete subclass.
 *
 * @protected
 * @abstract
 */
OO.ui.Tool.prototype.onUpdateState = function () {
	throw new Error(
		'OO.ui.Tool.onUpdateState not implemented in this subclass:' + this.constructor
	);
};

/**
 * Handle the tool being selected.
 *
 * This is an abstract method that must be overridden in a concrete subclass.
 *
 * @protected
 * @abstract
 */
OO.ui.Tool.prototype.onSelect = function () {
	throw new Error(
		'OO.ui.Tool.onSelect not implemented in this subclass:' + this.constructor
	);
};

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
 * @param {boolean} state Make tool appear active
 */
OO.ui.Tool.prototype.setActive = function ( state ) {
	this.active = !!state;
	if ( this.active ) {
		this.$element.addClass( 'oo-ui-tool-active' );
	} else {
		this.$element.removeClass( 'oo-ui-tool-active' );
	}
};

/**
 * Set the tool #title.
 *
 * @param {string|Function} title Title text or a function that returns text
 * @chainable
 */
OO.ui.Tool.prototype.setTitle = function ( title ) {
	this.title = OO.ui.resolveMsg( title );
	this.updateTitle();
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
 * Update the title.
 */
OO.ui.Tool.prototype.updateTitle = function () {
	var titleTooltips = this.toolGroup.constructor.static.titleTooltips,
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
 * Destroy tool.
 *
 * Destroying the tool removes all event handlers and the tool’s DOM elements.
 * Call this method whenever you are done using a tool.
 */
OO.ui.Tool.prototype.destroy = function () {
	this.toolbar.disconnect( this );
	this.$element.remove();
};
