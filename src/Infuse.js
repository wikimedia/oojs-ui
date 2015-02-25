/**
 * Reconstitute a JavaScript object corresponding to a widget created
 * by the PHP implementation.
 *
 * @member OO.ui
 * @param {string|HTMLElement|jQuery} idOrNode
 *   A DOM id (if a string) or node for the widget to infuse.
 * @return {OO.ui.Element}
 *   The `OO.ui.Element` corresponding to this (infusable) document node.
 *   For `Tag` objects emitted on the HTML side (used occasionally for content)
 *   the value returned is a newly-created Element wrapping around the existing
 *   DOM node.
 */
OO.ui.infuse = function ( idOrNode, dontReplace ) {
	// look for a cached result of a previous infusion.
	var id, $elem, data, cls, obj;
	if ( typeof idOrNode === 'string' ) {
		id = idOrNode;
		$elem = $( document.getElementById( id ) );
	} else {
		$elem = $( idOrNode );
		id = $elem.attr( 'id' );
	}
	data = $elem.data( 'ooui-infused' );
	if ( data ) {
		// cached!
		if ( data === true ) {
			throw new Error( 'Circular dependency! ' + id );
		}
		return data;
	}
	if ( !$elem.length ) {
		throw new Error( 'Widget not found: ' + id );
	}
	data = $elem.attr( 'data-ooui' );
	if ( !data ) {
		throw new Error( 'No infusion data found: ' + id );
	}
	try {
		data = $.parseJSON( data );
	} catch ( _ ) {
		data = null;
	}
	if ( !( data && data._ ) ) {
		throw new Error( 'No valid infusion data found: ' + id );
	}
	if ( data._ === 'Tag' ) {
		// Special case: this is a raw Tag; wrap existing node, don't rebuild.
		return new OO.ui.Element( { $element: $elem } );
	}
	cls = OO.ui[data._];
	if ( !cls ) {
		throw new Error( 'Unknown widget type: ' + id );
	}
	$elem.data( 'ooui-infused', true ); // prevent loops
	data.id = id; // implicit
	data = OO.copy( data, null, function deserialize( value ) {
		if ( OO.isPlainObject( value ) ) {
			if ( value.tag ) {
				return OO.ui.infuse( value.tag, 'rebuilding' );
			}
			if ( value.html ) {
				return new OO.ui.HtmlSnippet( value.html );
			}
		}
	} );
	// jscs:disable requireCapitalizedConstructors
	obj = new cls( data ); // rebuild widget
	// now replace old DOM with this new DOM.
	if ( !dontReplace ) {
		$elem.replaceWith( obj.$element );
	}
	obj.$element.data( 'ooui-infused', obj );
	// set the 'data-ooui' attribute so we can identify infused widgets
	obj.$element.attr( 'data-ooui', '' );
	return obj;
};
