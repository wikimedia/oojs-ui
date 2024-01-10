'use strict';

/**
 * Reattach documentation of static properties and methods that use OOjs's peculiar convention of
 * a `.static` property of the class containing all of the actual static properties and methods.
 * For example, OO.ui.Dialog.static.name is shown in the documentation of the OO.ui.Dialog class.
 *
 * We modify 'memberof', but not 'longname', so that the property/method is still shown using its
 * real name with `.static` in the generated documentation, and the same name can be used for @link
 * annotations.
 *
 * I couldn't find a way to make this happen using normal '@memberof' annotations.
 */
exports.handlers = {
	newDoclet: function ( e ) {
		if ( e.doclet.memberof ) {
			e.doclet.memberof = e.doclet.memberof.replace( /\.static\b/, '' );
		}
	}
};
