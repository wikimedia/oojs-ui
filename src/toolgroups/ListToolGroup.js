/**
 * Drop down list layout of tools as labeled icon buttons.
 *
 * This layout allows some tools to be collapsible, controlled by a "More" / "Fewer" option at the
 * bottom of the main list. These are not automatically positioned at the bottom of the list; you
 * may want to use the 'promote' and 'demote' configuration options to achieve this.
 *
 * @class
 * @extends OO.ui.PopupToolGroup
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 * @cfg {Array} [allowCollapse] List of tools that can be collapsed. Remaining tools will be always
 *  shown.
 * @cfg {Array} [forceExpand] List of tools that *may not* be collapsed. All remaining tools will be
 *  allowed to be collapsed.
 * @cfg {boolean} [expanded=false] Whether the collapsible tools are expanded by default
 */
OO.ui.ListToolGroup = function OoUiListToolGroup( toolbar, config ) {
	// Configuration initialization
	config = config || {};

	// Properties (must be set before parent constructor, which calls #populate)
	this.allowCollapse = config.allowCollapse;
	this.forceExpand = config.forceExpand;
	this.expanded = config.expanded !== undefined ? config.expanded : false;
	this.collapsibleTools = [];

	// Parent constructor
	OO.ui.ListToolGroup.super.call( this, toolbar, config );

	// Initialization
	this.$element.addClass( 'oo-ui-listToolGroup' );
};

/* Setup */

OO.inheritClass( OO.ui.ListToolGroup, OO.ui.PopupToolGroup );

/* Static Properties */

OO.ui.ListToolGroup.static.accelTooltips = true;

OO.ui.ListToolGroup.static.name = 'list';

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.ListToolGroup.prototype.populate = function () {
	var i, len, allowCollapse = [];

	OO.ui.ListToolGroup.super.prototype.populate.call( this );

	// Update the list of collapsible tools
	if ( this.allowCollapse !== undefined ) {
		allowCollapse = this.allowCollapse;
	} else if ( this.forceExpand !== undefined ) {
		allowCollapse = OO.simpleArrayDifference( Object.keys( this.tools ), this.forceExpand );
	}

	this.collapsibleTools = [];
	for ( i = 0, len = allowCollapse.length; i < len; i++ ) {
		if ( this.tools[ allowCollapse[i] ] !== undefined ) {
			this.collapsibleTools.push( this.tools[ allowCollapse[i] ] );
		}
	}

	// Keep at the end, even when tools are added
	this.$group.append( this.getExpandCollapseTool().$element );

	this.getExpandCollapseTool().toggle( this.collapsibleTools.length !== 0 );

	// Calling jQuery's .hide() and then .show() on a detached element caches the default value of its
	// 'display' attribute and restores it, and the tool uses a <span> and can be hidden and re-shown.
	// Is this a jQuery bug? http://jsfiddle.net/gtj4hu3h/
	if ( this.getExpandCollapseTool().$element.css( 'display' ) === 'inline' ) {
		this.getExpandCollapseTool().$element.css( 'display', 'block' );
	}

	this.updateCollapsibleState();
};

OO.ui.ListToolGroup.prototype.getExpandCollapseTool = function () {
	if ( this.expandCollapseTool === undefined ) {
		var ExpandCollapseTool = function () {
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
OO.ui.ListToolGroup.prototype.onPointerUp = function ( e ) {
	var ret = OO.ui.ListToolGroup.super.prototype.onPointerUp.call( this, e );

	// Do not close the popup when the user wants to show more/fewer tools
	if ( this.$( e.target ).closest( '.oo-ui-tool-name-more-fewer' ).length ) {
		// Prevent the popup list from being hidden
		this.setActive( true );
	}

	return ret;
};

OO.ui.ListToolGroup.prototype.updateCollapsibleState = function () {
	var i, len;

	this.getExpandCollapseTool()
		.setIcon( this.expanded ? 'collapse' : 'expand' )
		.setTitle( OO.ui.msg( this.expanded ? 'ooui-toolgroup-collapse' : 'ooui-toolgroup-expand' ) );

	for ( i = 0, len = this.collapsibleTools.length; i < len; i++ ) {
		this.collapsibleTools[i].toggle( this.expanded );
	}
};
