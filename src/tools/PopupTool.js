/**
 * Popup tools open a popup window when they are selected from the {@link OO.ui.Toolbar toolbar}. Each popup tool is configured
 * with a static name, title, and icon, as well with as any popup configurations. Unlike other tools, popup tools do not require that developers specify
 * an #onSelect or #onUpdateState method, as these methods have been implemented already.
 *
 *     // Example of a popup tool. When selected, a popup tool displays
 *     // a popup window.
 *     function HelpTool( toolGroup, config ) {
 *        OO.ui.PopupTool.call( this, toolGroup, $.extend( { popup: {
 *            padded: true,
 *            label: 'Help',
 *            head: true
 *        } }, config ) );
 *        this.popup.$body.append( '<p>I am helpful!</p>' );
 *     };
 *     OO.inheritClass( HelpTool, OO.ui.PopupTool );
 *     HelpTool.static.name = 'help';
 *     HelpTool.static.icon = 'help';
 *     HelpTool.static.title = 'Help';
 *     toolFactory.register( HelpTool );
 *
 * For an example of a toolbar that contains a popup tool, see {@link OO.ui.Toolbar toolbars}. For more information about
 * toolbars in genreral, please see the [OOjs UI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Toolbars
 *
 * @abstract
 * @class
 * @extends OO.ui.Tool
 * @mixins OO.ui.PopupElement
 *
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
OO.ui.PopupTool = function OoUiPopupTool( toolGroup, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( toolGroup ) && config === undefined ) {
		config = toolGroup;
		toolGroup = config.toolGroup;
	}

	// Parent constructor
	OO.ui.PopupTool.super.call( this, toolGroup, config );

	// Mixin constructors
	OO.ui.PopupElement.call( this, config );

	// Initialization
	this.$element
		.addClass( 'oo-ui-popupTool' )
		.append( this.popup.$element );
};

/* Setup */

OO.inheritClass( OO.ui.PopupTool, OO.ui.Tool );
OO.mixinClass( OO.ui.PopupTool, OO.ui.PopupElement );

/* Methods */

/**
 * Handle the tool being selected.
 *
 * @inheritdoc
 */
OO.ui.PopupTool.prototype.onSelect = function () {
	if ( !this.isDisabled() ) {
		this.popup.toggle();
	}
	this.setActive( false );
	return false;
};

/**
 * Handle the toolbar state being updated.
 *
 * @inheritdoc
 */
OO.ui.PopupTool.prototype.onUpdateState = function () {
	this.setActive( false );
};
