/**
 * A ToolFactory creates tools on demand. All tools ({@link OO.ui.Tool Tools}, {@link OO.ui.PopupTool PopupTools},
 * and {@link OO.ui.ToolGroupTool ToolGroupTools}) must be registered with a tool factory. Tools are
 * registered by their symbolic name. See {@link OO.ui.Toolbar toolbars} for an example.
 *
 * For more information about toolbars in general, please see the [OOjs UI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Toolbars
 *
 * @class
 * @extends OO.Factory
 * @constructor
 */
OO.ui.ToolFactory = function OoUiToolFactory() {
	// Parent constructor
	OO.ui.ToolFactory.parent.call( this );
};

/* Setup */

OO.inheritClass( OO.ui.ToolFactory, OO.Factory );

/* Methods */

/**
 * Get tools from the factory
 *
 * @param {Array|string} [include] Included tools, see #extract for format
 * @param {Array|string} [exclude] Excluded tools, see #extract for format
 * @param {Array|string} [promote] Promoted tools, see #extract for format
 * @param {Array|string} [demote] Demoted tools, see #extract for format
 * @return {string[]} List of tools
 */
OO.ui.ToolFactory.prototype.getTools = function ( include, exclude, promote, demote ) {
	var i, len, included, promoted, demoted,
		auto = [],
		used = {};

	// Collect included and not excluded tools
	included = OO.simpleArrayDifference( this.extract( include ), this.extract( exclude ) );

	// Promotion
	promoted = this.extract( promote, used );
	demoted = this.extract( demote, used );

	// Auto
	for ( i = 0, len = included.length; i < len; i++ ) {
		if ( !used[ included[ i ] ] ) {
			auto.push( included[ i ] );
		}
	}

	return promoted.concat( auto ).concat( demoted );
};

/**
 * Get a flat list of names from a list of names or groups.
 *
 * Normally, `collection` is an array of tool specifications. Tools can be specified in the
 * following ways:
 *
 * - To include an individual tool, use the symbolic name: `{ name: 'tool-name' }` or `'tool-name'`.
 * - To include all tools in a group, use the group name: `{ group: 'group-name' }`. (To assign the
 *   tool to a group, use OO.ui.Tool.static.group.)
 *
 * Alternatively, to include all tools that are not yet assigned to any other toolgroup, use the
 * catch-all selector `'*'`.
 *
 * If `used` is passed, tool names that appear as properties in this object will be considered
 * already assigned, and will not be returned even if specified otherwise. The tool names extracted
 * by this function call will be added as new properties in the object.
 *
 * @private
 * @param {Array|string} collection List of tools, see above
 * @param {Object} [used] Object containing information about used tools, see above
 * @return {string[]} List of extracted tool names
 */
OO.ui.ToolFactory.prototype.extract = function ( collection, used ) {
	var i, len, item, name, tool,
		names = [];

	if ( collection === '*' ) {
		for ( name in this.registry ) {
			tool = this.registry[ name ];
			if (
				// Only add tools by group name when auto-add is enabled
				tool.static.autoAddToCatchall &&
				// Exclude already used tools
				( !used || !used[ name ] )
			) {
				names.push( name );
				if ( used ) {
					used[ name ] = true;
				}
			}
		}
	} else if ( Array.isArray( collection ) ) {
		for ( i = 0, len = collection.length; i < len; i++ ) {
			item = collection[ i ];
			// Allow plain strings as shorthand for named tools
			if ( typeof item === 'string' ) {
				item = { name: item };
			}
			if ( OO.isPlainObject( item ) ) {
				if ( item.group ) {
					for ( name in this.registry ) {
						tool = this.registry[ name ];
						if (
							// Include tools with matching group
							tool.static.group === item.group &&
							// Only add tools by group name when auto-add is enabled
							tool.static.autoAddToGroup &&
							// Exclude already used tools
							( !used || !used[ name ] )
						) {
							names.push( name );
							if ( used ) {
								used[ name ] = true;
							}
						}
					}
				// Include tools with matching name and exclude already used tools
				} else if ( item.name && ( !used || !used[ item.name ] ) ) {
					names.push( item.name );
					if ( used ) {
						used[ item.name ] = true;
					}
				}
			}
		}
	}
	return names;
};
