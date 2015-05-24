/**
 * ToolGroupFactories create {@link OO.ui.ToolGroup toolgroups} on demand. The toolgroup classes must
 * specify a symbolic name and be registered with the factory. The following classes are registered by
 * default:
 *
 * - {@link OO.ui.BarToolGroup BarToolGroups} (‘bar’)
 * - {@link OO.ui.MenuToolGroup MenuToolGroups} (‘menu’)
 * - {@link OO.ui.ListToolGroup ListToolGroups} (‘list’)
 *
 * See {@link OO.ui.Toolbar toolbars} for an example.
 *
 * For more information about toolbars in general, please see the [OOjs UI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Toolbars
 * @class
 * @extends OO.Factory
 * @constructor
 */
OO.ui.ToolGroupFactory = function OoUiToolGroupFactory() {
	// Parent constructor
	OO.Factory.call( this );

	var i, l,
		defaultClasses = this.constructor.static.getDefaultClasses();

	// Register default toolgroups
	for ( i = 0, l = defaultClasses.length; i < l; i++ ) {
		this.register( defaultClasses[ i ] );
	}
};

/* Setup */

OO.inheritClass( OO.ui.ToolGroupFactory, OO.Factory );

/* Static Methods */

/**
 * Get a default set of classes to be registered on construction.
 *
 * @return {Function[]} Default classes
 */
OO.ui.ToolGroupFactory.static.getDefaultClasses = function () {
	return [
		OO.ui.BarToolGroup,
		OO.ui.ListToolGroup,
		OO.ui.MenuToolGroup
	];
};
