/**
 * Each Element represents a rendering in the DOM—a button or an icon, for example, or anything
 * that is visible to a user. Unlike {@link OO.ui.Widget widgets}, plain elements usually do not
 * have events connected to them and can't be interacted with.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string[]} [classes] The names of the CSS classes to apply to the element. CSS styles are
 *  added to the top level (e.g., the outermost div) of the element. See the
 *  [OOUI documentation on MediaWiki][2] for an example.
 *  [2]: https://www.mediawiki.org/wiki/OOUI/Widgets/Buttons_and_Switches#cssExample
 * @cfg {string} [id] The HTML id attribute used in the rendered tag.
 * @cfg {string} [text] Text to insert
 * @cfg {Array} [content] An array of content elements to append (after #text).
 *  Strings will be html-escaped; use an OO.ui.HtmlSnippet to append raw HTML.
 *  Instances of OO.ui.Element will have their $element appended.
 * @cfg {jQuery} [$content] Content elements to append (after #text).
 * @cfg {jQuery} [$element] Wrapper element. Defaults to a new element with #getTagName.
 * @cfg {Mixed} [data] Custom data of any type or combination of types (e.g., string, number,
 *  array, object).
 *  Data can also be specified with the #setData method.
 */
OO.ui.Element = function OoUiElement( config ) {
	if ( OO.ui.isDemo ) {
		this.initialConfig = config;
	}
	// Configuration initialization
	config = config || {};

	// Properties
	this.elementId = null;
	this.visible = true;
	this.data = config.data;
	this.$element = config.$element ||
		$( document.createElement( this.getTagName() ) );
	this.elementGroup = null;

	// Initialization
	if ( Array.isArray( config.classes ) ) {
		this.$element.addClass( config.classes );
	}
	if ( config.id ) {
		this.setElementId( config.id );
	}
	if ( config.text ) {
		this.$element.text( config.text );
	}
	if ( config.content ) {
		// The `content` property treats plain strings as text; use an
		// HtmlSnippet to append HTML content.  `OO.ui.Element`s get their
		// appropriate $element appended.
		this.$element.append( config.content.map( function ( v ) {
			if ( typeof v === 'string' ) {
				// Escape string so it is properly represented in HTML.
				// Don't create empty text nodes for empty strings.
				return v ? document.createTextNode( v ) : undefined;
			} else if ( v instanceof OO.ui.HtmlSnippet ) {
				// Bypass escaping.
				return v.toString();
			} else if ( v instanceof OO.ui.Element ) {
				return v.$element;
			}
			return v;
		} ) );
	}
	if ( config.$content ) {
		// The `$content` property treats plain strings as HTML.
		this.$element.append( config.$content );
	}
};

/* Setup */

OO.initClass( OO.ui.Element );

/* Static Properties */

/**
 * The name of the HTML tag used by the element.
 *
 * The static value may be ignored if the #getTagName method is overridden.
 *
 * @static
 * @inheritable
 * @property {string}
 */
OO.ui.Element.static.tagName = 'div';

/* Static Methods */

/**
 * Reconstitute a JavaScript object corresponding to a widget created
 * by the PHP implementation.
 *
 * @param {HTMLElement|jQuery} node
 *   A node for the widget to infuse.
 * @param {Object} [config] Configuration options
 * @return {OO.ui.Element}
 *   The `OO.ui.Element` corresponding to this (infusable) document node.
 *   For `Tag` objects emitted on the HTML side (used occasionally for content)
 *   the value returned is a newly-created Element wrapping around the existing
 *   DOM node.
 */
OO.ui.Element.static.infuse = function ( node, config ) {
	var obj = OO.ui.Element.static.unsafeInfuse( node, config, false );

	// Verify that the type matches up.
	// FIXME: uncomment after T89721 is fixed, see T90929.
	/*
	if ( !( obj instanceof this['class'] ) ) {
		throw new Error( 'Infusion type mismatch!' );
	}
	*/
	return obj;
};

/**
 * Implementation helper for `infuse`; skips the type check and has an
 * extra property so that only the top-level invocation touches the DOM.
 *
 * @private
 * @param {HTMLElement|jQuery} node
 * @param {Object} [config] Configuration options
 * @param {jQuery.Promise} [domPromise] A promise that will be resolved
 *     when the top-level widget of this infusion is inserted into DOM,
 *     replacing the original node; only used internally.
 * @return {OO.ui.Element}
 */
OO.ui.Element.static.unsafeInfuse = function ( node, config, domPromise ) {
	// look for a cached result of a previous infusion.
	var error, data, cls, parts, parent, obj, top, state, infusedChildren,
		$elem = $( node ),
		id = $elem.attr( 'id' );

	if ( !$elem.length ) {
		if ( node && node.selector ) {
			error = 'Widget not found: ' + node.selector;
		} else {
			error = 'Widget not found';
		}
		throw new Error( error );
	}
	if ( $elem[ 0 ].$oouiInfused ) {
		$elem = $elem[ 0 ].$oouiInfused;
	}
	data = $elem.data( 'ooui-infused' );
	if ( data ) {
		// cached!
		if ( data === true ) {
			throw new Error( 'Circular dependency! ' + id );
		}
		if ( domPromise ) {
			// Pick up dynamic state, like focus, value of form inputs, scroll position, etc.
			state = data.constructor.static.gatherPreInfuseState( $elem, data );
			// Restore dynamic state after the new element is re-inserted into DOM under
			// infused parent.
			domPromise.done( data.restorePreInfuseState.bind( data, state ) );
			infusedChildren = $elem.data( 'ooui-infused-children' );
			if ( infusedChildren && infusedChildren.length ) {
				infusedChildren.forEach( function ( data ) {
					var state = data.constructor.static.gatherPreInfuseState( $elem, data );
					domPromise.done( data.restorePreInfuseState.bind( data, state ) );
				} );
			}
		}
		return data;
	}
	data = $elem.attr( 'data-ooui' );
	if ( !data ) {
		throw new Error( 'No infusion data found: ' + id );
	}
	try {
		data = JSON.parse( data );
	} catch ( _ ) {
		data = null;
	}
	if ( !( data && data._ ) ) {
		throw new Error( 'No valid infusion data found: ' + id );
	}
	if ( data._ === 'Tag' ) {
		// Special case: this is a raw Tag; wrap existing node, don't rebuild.
		return new OO.ui.Element( $.extend( {}, config, { $element: $elem } ) );
	}
	parts = data._.split( '.' );
	cls = OO.getProp.apply( OO, [ window ].concat( parts ) );
	if ( cls === undefined ) {
		throw new Error( 'Unknown widget type: id: ' + id + ', class: ' + data._ );
	}

	// Verify that we're creating an OO.ui.Element instance
	parent = cls.parent;

	while ( parent !== undefined ) {
		if ( parent === OO.ui.Element ) {
			// Safe
			break;
		}

		parent = parent.parent;
	}

	if ( parent !== OO.ui.Element ) {
		throw new Error( 'Unknown widget type: id: ' + id + ', class: ' + data._ );
	}

	if ( !domPromise ) {
		top = $.Deferred();
		domPromise = top.promise();
	}
	$elem.data( 'ooui-infused', true ); // prevent loops
	data.id = id; // implicit
	infusedChildren = [];
	data = OO.copy( data, null, function deserialize( value ) {
		var infused;
		if ( OO.isPlainObject( value ) ) {
			if ( value.tag && document.getElementById( value.tag ) ) {
				infused = OO.ui.Element.static.unsafeInfuse(
					document.getElementById( value.tag ), config, domPromise
				);
				infusedChildren.push( infused );
				// Flatten the structure
				infusedChildren.push.apply(
					infusedChildren,
					infused.$element.data( 'ooui-infused-children' ) || []
				);
				infused.$element.removeData( 'ooui-infused-children' );
				return infused;
			}
			if ( value.html !== undefined ) {
				return new OO.ui.HtmlSnippet( value.html );
			}
		}
	} );
	// allow widgets to reuse parts of the DOM
	data = cls.static.reusePreInfuseDOM( $elem[ 0 ], data );
	// pick up dynamic state, like focus, value of form inputs, scroll position, etc.
	state = cls.static.gatherPreInfuseState( $elem[ 0 ], data );
	// rebuild widget
	// eslint-disable-next-line new-cap
	obj = new cls( $.extend( {}, config, data ) );
	// If anyone is holding a reference to the old DOM element,
	// let's allow them to OO.ui.infuse() it and do what they expect, see T105828.
	// Do not use jQuery.data(), as using it on detached nodes leaks memory in 1.x line by design.
	$elem[ 0 ].$oouiInfused = obj.$element;
	// now replace old DOM with this new DOM.
	if ( top ) {
		// An efficient constructor might be able to reuse the entire DOM tree of the original
		// element, so only mutate the DOM if we need to.
		if ( $elem[ 0 ] !== obj.$element[ 0 ] ) {
			$elem.replaceWith( obj.$element );
		}
		top.resolve();
	}
	obj.$element.data( 'ooui-infused', obj );
	obj.$element.data( 'ooui-infused-children', infusedChildren );
	// set the 'data-ooui' attribute so we can identify infused widgets
	obj.$element.attr( 'data-ooui', '' );
	// restore dynamic state after the new element is inserted into DOM
	domPromise.done( obj.restorePreInfuseState.bind( obj, state ) );
	return obj;
};

/**
 * Pick out parts of `node`'s DOM to be reused when infusing a widget.
 *
 * This method **must not** make any changes to the DOM, only find interesting pieces and add them
 * to `config` (which should then be returned). Actual DOM juggling should then be done by the
 * constructor, which will be given the enhanced config.
 *
 * @protected
 * @param {HTMLElement} node
 * @param {Object} config
 * @return {Object}
 */
OO.ui.Element.static.reusePreInfuseDOM = function ( node, config ) {
	return config;
};

/**
 * Gather the dynamic state (focus, value of form inputs, scroll position, etc.) of an HTML DOM
 * node (and its children) that represent an Element of the same class and the given configuration,
 * generated by the PHP implementation.
 *
 * This method is called just before `node` is detached from the DOM. The return value of this
 * function will be passed to #restorePreInfuseState after the newly created widget's #$element
 * is inserted into DOM to replace `node`.
 *
 * @protected
 * @param {HTMLElement} node
 * @param {Object} config
 * @return {Object}
 */
OO.ui.Element.static.gatherPreInfuseState = function () {
	return {};
};

/**
 * Get the document of an element.
 *
 * @static
 * @param {jQuery|HTMLElement|HTMLDocument|Window} obj Object to get the document for
 * @return {HTMLDocument|null} Document object
 */
OO.ui.Element.static.getDocument = function ( obj ) {
	// jQuery - selections created "offscreen" won't have a context, so .context isn't reliable
	return ( obj[ 0 ] && obj[ 0 ].ownerDocument ) ||
		// Empty jQuery selections might have a context
		obj.context ||
		// HTMLElement
		obj.ownerDocument ||
		// Window
		obj.document ||
		// HTMLDocument
		( obj.nodeType === Node.DOCUMENT_NODE && obj ) ||
		null;
};

/**
 * Get the window of an element or document.
 *
 * @static
 * @param {jQuery|HTMLElement|HTMLDocument|Window} obj Context to get the window for
 * @return {Window} Window object
 */
OO.ui.Element.static.getWindow = function ( obj ) {
	var doc = this.getDocument( obj );
	return doc.defaultView;
};

/**
 * Get the direction of an element or document.
 *
 * @static
 * @param {jQuery|HTMLElement|HTMLDocument|Window} obj Context to get the direction for
 * @return {string} Text direction, either 'ltr' or 'rtl'
 */
OO.ui.Element.static.getDir = function ( obj ) {
	var isDoc, isWin;

	if ( obj instanceof $ ) {
		obj = obj[ 0 ];
	}
	isDoc = obj.nodeType === Node.DOCUMENT_NODE;
	isWin = obj.document !== undefined;
	if ( isDoc || isWin ) {
		if ( isWin ) {
			obj = obj.document;
		}
		obj = obj.body;
	}
	return $( obj ).css( 'direction' );
};

/**
 * Get the offset between two frames.
 *
 * TODO: Make this function not use recursion.
 *
 * @static
 * @param {Window} from Window of the child frame
 * @param {Window} [to=window] Window of the parent frame
 * @param {Object} [offset] Offset to start with, used internally
 * @return {Object} Offset object, containing left and top properties
 */
OO.ui.Element.static.getFrameOffset = function ( from, to, offset ) {
	var i, len, frames, frame, rect;

	if ( !to ) {
		to = window;
	}
	if ( !offset ) {
		offset = { top: 0, left: 0 };
	}
	if ( from.parent === from ) {
		return offset;
	}

	// Get iframe element
	frames = from.parent.document.getElementsByTagName( 'iframe' );
	for ( i = 0, len = frames.length; i < len; i++ ) {
		if ( frames[ i ].contentWindow === from ) {
			frame = frames[ i ];
			break;
		}
	}

	// Recursively accumulate offset values
	if ( frame ) {
		rect = frame.getBoundingClientRect();
		offset.left += rect.left;
		offset.top += rect.top;
		if ( from !== to ) {
			this.getFrameOffset( from.parent, offset );
		}
	}
	return offset;
};

/**
 * Get the offset between two elements.
 *
 * The two elements may be in a different frame, but in that case the frame $element is in must
 * be contained in the frame $anchor is in.
 *
 * @static
 * @param {jQuery} $element Element whose position to get
 * @param {jQuery} $anchor Element to get $element's position relative to
 * @return {Object} Translated position coordinates, containing top and left properties
 */
OO.ui.Element.static.getRelativePosition = function ( $element, $anchor ) {
	var iframe, iframePos,
		pos = $element.offset(),
		anchorPos = $anchor.offset(),
		elementDocument = this.getDocument( $element ),
		anchorDocument = this.getDocument( $anchor );

	// If $element isn't in the same document as $anchor, traverse up
	while ( elementDocument !== anchorDocument ) {
		iframe = elementDocument.defaultView.frameElement;
		if ( !iframe ) {
			throw new Error( '$element frame is not contained in $anchor frame' );
		}
		iframePos = $( iframe ).offset();
		pos.left += iframePos.left;
		pos.top += iframePos.top;
		elementDocument = iframe.ownerDocument;
	}
	pos.left -= anchorPos.left;
	pos.top -= anchorPos.top;
	return pos;
};

/**
 * Get element border sizes.
 *
 * @static
 * @param {HTMLElement} el Element to measure
 * @return {Object} Dimensions object with `top`, `left`, `bottom` and `right` properties
 */
OO.ui.Element.static.getBorders = function ( el ) {
	var doc = el.ownerDocument,
		win = doc.defaultView,
		style = win.getComputedStyle( el, null ),
		$el = $( el ),
		top = parseFloat( style ? style.borderTopWidth : $el.css( 'borderTopWidth' ) ) || 0,
		left = parseFloat( style ? style.borderLeftWidth : $el.css( 'borderLeftWidth' ) ) || 0,
		bottom = parseFloat( style ? style.borderBottomWidth : $el.css( 'borderBottomWidth' ) ) || 0,
		right = parseFloat( style ? style.borderRightWidth : $el.css( 'borderRightWidth' ) ) || 0;

	return {
		top: top,
		left: left,
		bottom: bottom,
		right: right
	};
};

/**
 * Get dimensions of an element or window.
 *
 * @static
 * @param {HTMLElement|Window} el Element to measure
 * @return {Object} Dimensions object with `borders`, `scroll`, `scrollbar` and `rect` properties
 */
OO.ui.Element.static.getDimensions = function ( el ) {
	var $el, $win,
		doc = el.ownerDocument || el.document,
		win = doc.defaultView;

	if ( win === el || el === doc.documentElement ) {
		$win = $( win );
		return {
			borders: { top: 0, left: 0, bottom: 0, right: 0 },
			scroll: {
				top: $win.scrollTop(),
				left: OO.ui.Element.static.getScrollLeft( win )
			},
			scrollbar: { right: 0, bottom: 0 },
			rect: {
				top: 0,
				left: 0,
				bottom: $win.innerHeight(),
				right: $win.innerWidth()
			}
		};
	} else {
		$el = $( el );
		return {
			borders: this.getBorders( el ),
			scroll: {
				top: $el.scrollTop(),
				left: OO.ui.Element.static.getScrollLeft( el )
			},
			scrollbar: {
				right: $el.innerWidth() - el.clientWidth,
				bottom: $el.innerHeight() - el.clientHeight
			},
			rect: el.getBoundingClientRect()
		};
	}
};

( function () {
	var rtlScrollType = null;

	// Adapted from <https://github.com/othree/jquery.rtl-scroll-type>.
	// Original code copyright 2012 Wei-Ko Kao, licensed under the MIT License.
	function rtlScrollTypeTest() {
		var $definer = $( '<div>' ).attr( {
				dir: 'rtl',
				style: 'font-size: 14px; width: 4px; height: 1px; position: absolute; top: -1000px; overflow: scroll;'
			} ).text( 'ABCD' ),
			definer = $definer[ 0 ];

		$definer.appendTo( 'body' );
		if ( definer.scrollLeft > 0 ) {
			// Safari, Chrome
			rtlScrollType = 'default';
		} else {
			definer.scrollLeft = 1;
			if ( definer.scrollLeft === 0 ) {
				// Firefox, old Opera
				rtlScrollType = 'negative';
			} else {
				// Internet Explorer, Edge
				rtlScrollType = 'reverse';
			}
		}
		$definer.remove();
	}

	function isRoot( el ) {
		return el.window === el ||
			el === el.ownerDocument.body ||
			el === el.ownerDocument.documentElement;
	}

	/**
	 * Convert native `scrollLeft` value to a value consistent between browsers. See #getScrollLeft.
	 * @param {number} nativeOffset Native `scrollLeft` value
	 * @param {HTMLElement|Window} el Element from which the value was obtained
	 * @return {number}
	 */
	OO.ui.Element.static.computeNormalizedScrollLeft = function ( nativeOffset, el ) {
		// All browsers use the correct scroll type ('negative') on the root, so don't
		// do any fixups when looking at the root element
		var direction = isRoot( el ) ? 'ltr' : $( el ).css( 'direction' );

		if ( direction === 'rtl' ) {
			if ( rtlScrollType === null ) {
				rtlScrollTypeTest();
			}
			if ( rtlScrollType === 'reverse' ) {
				return -nativeOffset;
			} else if ( rtlScrollType === 'default' ) {
				return nativeOffset - el.scrollWidth + el.clientWidth;
			}
		}

		return nativeOffset;
	};

	/**
	 * Convert our normalized `scrollLeft` value to a value for current browser. See #getScrollLeft.
	 * @param {number} normalizedOffset Normalized `scrollLeft` value
	 * @param {HTMLElement|Window} el Element on which the value will be set
	 * @return {number}
	 */
	OO.ui.Element.static.computeNativeScrollLeft = function ( normalizedOffset, el ) {
		// All browsers use the correct scroll type ('negative') on the root, so don't
		// do any fixups when looking at the root element
		var direction = isRoot( el ) ? 'ltr' : $( el ).css( 'direction' );

		if ( direction === 'rtl' ) {
			if ( rtlScrollType === null ) {
				rtlScrollTypeTest();
			}
			if ( rtlScrollType === 'reverse' ) {
				return -normalizedOffset;
			} else if ( rtlScrollType === 'default' ) {
				return normalizedOffset + el.scrollWidth - el.clientWidth;
			}
		}

		return normalizedOffset;
	};

	/**
	 * Get the number of pixels that an element's content is scrolled to the left.
	 *
	 * This function smooths out browser inconsistencies (nicely described in the README at
	 * <https://github.com/othree/jquery.rtl-scroll-type>) and produces a result consistent
	 * with Firefox's 'scrollLeft', which seems the sanest.
	 *
	 * (Firefox's scrollLeft handling is nice because it increases from left to right, consistently
	 * with `getBoundingClientRect().left` and related APIs; because initial value is zero, so
	 * resetting it is easy; because adapting a hardcoded scroll position to a symmetrical RTL
	 * interface requires just negating it, rather than involving `clientWidth` and `scrollWidth`;
	 * and because if you mess up and don't adapt your code to RTL, it will scroll to the beginning
	 * rather than somewhere randomly in the middle but not where you wanted.)
	 *
	 * @static
	 * @method
	 * @param {HTMLElement|Window} el Element to measure
	 * @return {number} Scroll position from the left.
	 *  If the element's direction is LTR, this is a positive number between `0` (initial scroll
	 *  position) and `el.scrollWidth - el.clientWidth` (furthest possible scroll position).
	 *  If the element's direction is RTL, this is a negative number between `0` (initial scroll
	 *  position) and `-el.scrollWidth + el.clientWidth` (furthest possible scroll position).
	 */
	OO.ui.Element.static.getScrollLeft = function ( el ) {
		var scrollLeft = isRoot( el ) ? $( window ).scrollLeft() : el.scrollLeft;
		scrollLeft = OO.ui.Element.static.computeNormalizedScrollLeft( scrollLeft, el );
		return scrollLeft;
	};

	/**
	 * Set the number of pixels that an element's content is scrolled to the left.
	 *
	 * See #getScrollLeft.
	 *
	 * @static
	 * @method
	 * @param {HTMLElement|Window} el Element to scroll (and to use in calculations)
	 * @param {number} scrollLeft Scroll position from the left.
	 *  If the element's direction is LTR, this must be a positive number between
	 *  `0` (initial scroll position) and `el.scrollWidth - el.clientWidth`
	 *  (furthest possible scroll position).
	 *  If the element's direction is RTL, this must be a negative number between
	 *  `0` (initial scroll position) and `-el.scrollWidth + el.clientWidth`
	 *  (furthest possible scroll position).
	 */
	OO.ui.Element.static.setScrollLeft = function ( el, scrollLeft ) {
		scrollLeft = OO.ui.Element.static.computeNativeScrollLeft( scrollLeft, el );
		if ( isRoot( el ) ) {
			$( window ).scrollLeft( scrollLeft );
		} else {
			el.scrollLeft = scrollLeft;
		}
	};
}() );

/**
 * Get the root scrollable element of given element's document.
 *
 * On Blink-based browsers (Chrome etc.), `document.documentElement` can't be used to get or set
 * the scrollTop property; instead we have to use `document.body`. Changing and testing the value
 * lets us use 'body' or 'documentElement' based on what is working.
 *
 * https://code.google.com/p/chromium/issues/detail?id=303131
 *
 * @static
 * @param {HTMLElement} el Element to find root scrollable parent for
 * @return {HTMLElement} Scrollable parent, `document.body` or `document.documentElement`
 *     depending on browser
 */
OO.ui.Element.static.getRootScrollableElement = function ( el ) {
	var scrollTop, body;

	if ( OO.ui.scrollableElement === undefined ) {
		body = el.ownerDocument.body;
		scrollTop = body.scrollTop;
		body.scrollTop = 1;

		// In some browsers (observed in Chrome 56 on Linux Mint 18.1),
		// body.scrollTop doesn't become exactly 1, but a fractional value like 0.76
		if ( Math.round( body.scrollTop ) === 1 ) {
			body.scrollTop = scrollTop;
			OO.ui.scrollableElement = 'body';
		} else {
			OO.ui.scrollableElement = 'documentElement';
		}
	}

	return el.ownerDocument[ OO.ui.scrollableElement ];
};

/**
 * Get closest scrollable container.
 *
 * Traverses up until either a scrollable element or the root is reached, in which case the root
 * scrollable element will be returned (see #getRootScrollableElement).
 *
 * @static
 * @param {HTMLElement} el Element to find scrollable container for
 * @param {string} [dimension] Dimension of scrolling to look for; `x`, `y` or omit for either
 * @return {HTMLElement} Closest scrollable container
 */
OO.ui.Element.static.getClosestScrollableContainer = function ( el, dimension ) {
	var i, val,
		// Browsers do not correctly return the computed value of 'overflow' when 'overflow-x' and
		// 'overflow-y' have different values, so we need to check the separate properties.
		props = [ 'overflow-x', 'overflow-y' ],
		$parent = $( el ).parent();

	if ( dimension === 'x' || dimension === 'y' ) {
		props = [ 'overflow-' + dimension ];
	}

	// Special case for the document root (which doesn't really have any scrollable container,
	// since it is the ultimate scrollable container, but this is probably saner than null or
	// exception).
	if ( $( el ).is( 'html, body' ) ) {
		return this.getRootScrollableElement( el );
	}

	while ( $parent.length ) {
		if ( $parent[ 0 ] === this.getRootScrollableElement( el ) ) {
			return $parent[ 0 ];
		}
		i = props.length;
		while ( i-- ) {
			val = $parent.css( props[ i ] );
			// We assume that elements with 'overflow' (in any direction) set to 'hidden' will
			// never be scrolled in that direction, but they can actually be scrolled
			// programatically. The user can unintentionally perform a scroll in such case even if
			// the application doesn't scroll programatically, e.g. when jumping to an anchor, or
			// when using built-in find functionality.
			// This could cause funny issues...
			if ( val === 'auto' || val === 'scroll' ) {
				return $parent[ 0 ];
			}
		}
		$parent = $parent.parent();
	}
	// The element is unattached... return something mostly sane
	return this.getRootScrollableElement( el );
};

/**
 * Scroll element into view.
 *
 * @static
 * @param {HTMLElement|Object} elOrPosition Element to scroll into view
 * @param {Object} [config] Configuration options
 * @param {string} [config.animate=true] Animate to the new scroll offset.
 * @param {string} [config.duration='fast'] jQuery animation duration value
 * @param {string} [config.direction] Scroll in only one direction, e.g. 'x' or 'y', omit
 *  to scroll in both directions
 * @param {Object} [config.padding] Additional padding on the container to scroll past.
 *  Object containing any of 'top', 'bottom', 'left', or 'right' as numbers.
 * @param {Object} [config.scrollContainer] Scroll container. Defaults to
 *  getClosestScrollableContainer of the element.
 * @return {jQuery.Promise} Promise which resolves when the scroll is complete
 */
OO.ui.Element.static.scrollIntoView = function ( elOrPosition, config ) {
	var position, animations, container, $container, elementPosition, containerDimensions,
		$window, padding, animate, method,
		deferred = $.Deferred();

	// Configuration initialization
	config = config || {};

	padding = $.extend( {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	}, config.padding );

	animate = config.animate !== false;

	animations = {};
	elementPosition = elOrPosition instanceof HTMLElement ?
		this.getDimensions( elOrPosition ).rect :
		elOrPosition;
	container = config.scrollContainer || (
		elOrPosition instanceof HTMLElement ?
			this.getClosestScrollableContainer( elOrPosition, config.direction ) :
			// No scrollContainer or element
			this.getClosestScrollableContainer( document.body )
	);
	$container = $( container );
	containerDimensions = this.getDimensions( container );
	$window = $( this.getWindow( container ) );

	// Compute the element's position relative to the container
	if ( $container.is( 'html, body' ) ) {
		// If the scrollable container is the root, this is easy
		position = {
			top: elementPosition.top,
			bottom: $window.innerHeight() - elementPosition.bottom,
			left: elementPosition.left,
			right: $window.innerWidth() - elementPosition.right
		};
	} else {
		// Otherwise, we have to subtract el's coordinates from container's coordinates
		position = {
			top: elementPosition.top -
				( containerDimensions.rect.top + containerDimensions.borders.top ),
			bottom: containerDimensions.rect.bottom - containerDimensions.borders.bottom -
				containerDimensions.scrollbar.bottom - elementPosition.bottom,
			left: elementPosition.left -
				( containerDimensions.rect.left + containerDimensions.borders.left ),
			right: containerDimensions.rect.right - containerDimensions.borders.right -
				containerDimensions.scrollbar.right - elementPosition.right
		};
	}

	if ( !config.direction || config.direction === 'y' ) {
		if ( position.top < padding.top ) {
			animations.scrollTop = containerDimensions.scroll.top + position.top - padding.top;
		} else if ( position.bottom < padding.bottom ) {
			animations.scrollTop = containerDimensions.scroll.top +
				// Scroll the bottom into view, but not at the expense
				// of scrolling the top out of view
				Math.min( position.top - padding.top, -position.bottom + padding.bottom );
		}
	}
	if ( !config.direction || config.direction === 'x' ) {
		if ( position.left < padding.left ) {
			animations.scrollLeft = containerDimensions.scroll.left + position.left - padding.left;
		} else if ( position.right < padding.right ) {
			animations.scrollLeft = containerDimensions.scroll.left +
				// Scroll the right into view, but not at the expense
				// of scrolling the left out of view
				Math.min( position.left - padding.left, -position.right + padding.right );
		}
		if ( animations.scrollLeft !== undefined ) {
			animations.scrollLeft =
				OO.ui.Element.static.computeNativeScrollLeft( animations.scrollLeft, container );
		}
	}
	if ( !$.isEmptyObject( animations ) ) {
		if ( animate ) {
			// eslint-disable-next-line no-jquery/no-animate
			$container.stop( true ).animate( animations, config.duration === undefined ? 'fast' : config.duration );
			$container.queue( function ( next ) {
				deferred.resolve();
				next();
			} );
		} else {
			$container.stop( true );
			for ( method in animations ) {
				$container[ method ]( animations[ method ] );
			}
			deferred.resolve();
		}
	} else {
		deferred.resolve();
	}
	return deferred.promise();
};

/**
 * Force the browser to reconsider whether it really needs to render scrollbars inside the element
 * and reserve space for them, because it probably doesn't.
 *
 * Workaround primarily for <https://code.google.com/p/chromium/issues/detail?id=387290>, but also
 * similar bugs in other browsers. "Just" forcing a reflow is not sufficient in all cases, we need
 * to first actually detach (or hide, but detaching is simpler) all children, *then* force a
 * reflow, and then reattach (or show) them back.
 *
 * @static
 * @param {HTMLElement} el Element to reconsider the scrollbars on
 */
OO.ui.Element.static.reconsiderScrollbars = function ( el ) {
	var i, len, scrollLeft, scrollTop, nodes = [];
	// Save scroll position
	scrollLeft = el.scrollLeft;
	scrollTop = el.scrollTop;
	// Detach all children
	while ( el.firstChild ) {
		nodes.push( el.firstChild );
		el.removeChild( el.firstChild );
	}
	// Force reflow
	// eslint-disable-next-line no-void
	void el.offsetHeight;
	// Reattach all children
	for ( i = 0, len = nodes.length; i < len; i++ ) {
		el.appendChild( nodes[ i ] );
	}
	// Restore scroll position (no-op if scrollbars disappeared)
	el.scrollLeft = scrollLeft;
	el.scrollTop = scrollTop;
};

/* Methods */

/**
 * Toggle visibility of an element.
 *
 * @param {boolean} [show] Make element visible, omit to toggle visibility
 * @fires visible
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.Element.prototype.toggle = function ( show ) {
	show = show === undefined ? !this.visible : !!show;

	if ( show !== this.isVisible() ) {
		this.visible = show;
		this.$element.toggleClass( 'oo-ui-element-hidden', !this.visible );
		this.emit( 'toggle', show );
	}

	return this;
};

/**
 * Check if element is visible.
 *
 * @return {boolean} element is visible
 */
OO.ui.Element.prototype.isVisible = function () {
	return this.visible;
};

/**
 * Get element data.
 *
 * @return {Mixed} Element data
 */
OO.ui.Element.prototype.getData = function () {
	return this.data;
};

/**
 * Set element data.
 *
 * @param {Mixed} data Element data
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.Element.prototype.setData = function ( data ) {
	this.data = data;
	return this;
};

/**
 * Set the element has an 'id' attribute.
 *
 * @param {string} id
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.Element.prototype.setElementId = function ( id ) {
	this.elementId = id;
	this.$element.attr( 'id', id );
	return this;
};

/**
 * Ensure that the element has an 'id' attribute, setting it to an unique value if it's missing,
 * and return its value.
 *
 * @return {string}
 */
OO.ui.Element.prototype.getElementId = function () {
	if ( this.elementId === null ) {
		this.setElementId( OO.ui.generateElementId() );
	}
	return this.elementId;
};

/**
 * Check if element supports one or more methods.
 *
 * @param {string|string[]} methods Method or list of methods to check
 * @return {boolean} All methods are supported
 */
OO.ui.Element.prototype.supports = function ( methods ) {
	var i, len,
		support = 0;

	methods = Array.isArray( methods ) ? methods : [ methods ];
	for ( i = 0, len = methods.length; i < len; i++ ) {
		if ( typeof this[ methods[ i ] ] === 'function' ) {
			support++;
		}
	}

	return methods.length === support;
};

/**
 * Update the theme-provided classes.
 *
 * @localdoc This is called in element mixins and widget classes any time state changes.
 *   Updating is debounced, minimizing overhead of changing multiple attributes and
 *   guaranteeing that theme updates do not occur within an element's constructor
 */
OO.ui.Element.prototype.updateThemeClasses = function () {
	OO.ui.theme.queueUpdateElementClasses( this );
};

/**
 * Get the HTML tag name.
 *
 * Override this method to base the result on instance information.
 *
 * @return {string} HTML tag name
 */
OO.ui.Element.prototype.getTagName = function () {
	return this.constructor.static.tagName;
};

/**
 * Check if the element is attached to the DOM
 *
 * @return {boolean} The element is attached to the DOM
 */
OO.ui.Element.prototype.isElementAttached = function () {
	return $.contains( this.getElementDocument(), this.$element[ 0 ] );
};

/**
 * Get the DOM document.
 *
 * @return {HTMLDocument} Document object
 */
OO.ui.Element.prototype.getElementDocument = function () {
	// Don't cache this in other ways either because subclasses could can change this.$element
	return OO.ui.Element.static.getDocument( this.$element );
};

/**
 * Get the DOM window.
 *
 * @return {Window} Window object
 */
OO.ui.Element.prototype.getElementWindow = function () {
	return OO.ui.Element.static.getWindow( this.$element );
};

/**
 * Get closest scrollable container.
 *
 * @return {HTMLElement} Closest scrollable container
 */
OO.ui.Element.prototype.getClosestScrollableElementContainer = function () {
	return OO.ui.Element.static.getClosestScrollableContainer( this.$element[ 0 ] );
};

/**
 * Get group element is in.
 *
 * @return {OO.ui.mixin.GroupElement|null} Group element, null if none
 */
OO.ui.Element.prototype.getElementGroup = function () {
	return this.elementGroup;
};

/**
 * Set group element is in.
 *
 * @param {OO.ui.mixin.GroupElement|null} group Group element, null if none
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.Element.prototype.setElementGroup = function ( group ) {
	this.elementGroup = group;
	return this;
};

/**
 * Scroll element into view.
 *
 * @param {Object} [config] Configuration options
 * @return {jQuery.Promise} Promise which resolves when the scroll is complete
 */
OO.ui.Element.prototype.scrollElementIntoView = function ( config ) {
	if (
		!this.isElementAttached() ||
		!this.isVisible() ||
		( this.getElementGroup() && !this.getElementGroup().isVisible() )
	) {
		return $.Deferred().resolve();
	}
	return OO.ui.Element.static.scrollIntoView( this.$element[ 0 ], config );
};

/**
 * Restore the pre-infusion dynamic state for this widget.
 *
 * This method is called after #$element has been inserted into DOM. The parameter is the return
 * value of #gatherPreInfuseState.
 *
 * @protected
 * @param {Object} state
 */
OO.ui.Element.prototype.restorePreInfuseState = function () {
};
