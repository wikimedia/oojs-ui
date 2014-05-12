/**
 * Horizontal bar layout of tools as icon buttons.
 *
 * @class
 * @extends OO.ui.ToolGroup
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 */
OO.ui.BarToolGroup = function OoUiBarToolGroup( toolbar, config ) {
	// Parent constructor
	OO.ui.BarToolGroup.super.call( this, toolbar, config );

	// Initialization
	this.$element.addClass( 'oo-ui-barToolGroup' );
};

/* Setup */

OO.inheritClass( OO.ui.BarToolGroup, OO.ui.ToolGroup );

/* Static Properties */

OO.ui.BarToolGroup.static.titleTooltips = true;

OO.ui.BarToolGroup.static.accelTooltips = true;

OO.ui.BarToolGroup.static.name = 'bar';
