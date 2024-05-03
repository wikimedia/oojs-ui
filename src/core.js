/**
 * Namespace for all classes, static methods and static properties.
 *
 * @namespace
 */
OO.ui = {};

OO.ui.bind = $.proxy;

/**
 * @property {Object}
 */
OO.ui.Keys = {
	UNDEFINED: 0,
	BACKSPACE: 8,
	DELETE: 46,
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40,
	ENTER: 13,
	END: 35,
	HOME: 36,
	TAB: 9,
	PAGEUP: 33,
	PAGEDOWN: 34,
	ESCAPE: 27,
	SHIFT: 16,
	SPACE: 32
};

/**
 * Constants for MouseEvent.which
 *
 * @property {Object}
 */
OO.ui.MouseButtons = {
	LEFT: 1,
	MIDDLE: 2,
	RIGHT: 3
};

/**
 * @property {number}
 * @private
 */
OO.ui.elementId = 0;

/**
 * Generate a unique ID for element
 *
 * @return {string} ID
 */
OO.ui.generateElementId = function () {
	OO.ui.elementId++;
	return 'ooui-' + OO.ui.elementId;
};

/**
 * Check if an element is focusable.
 * Inspired by :focusable in jQueryUI v1.11.4 - 2015-04-14
 *
 * @param {jQuery} $element Element to test
 * @return {boolean} Element is focusable
 */
OO.ui.isFocusableElement = function ( $element ) {
	const element = $element[ 0 ];

	// Anything disabled is not focusable
	if ( element.disabled ) {
		return false;
	}

	// Check if the element is visible
	if ( !(
		// This is quicker than calling $element.is( ':visible' )
		$.expr.pseudos.visible( element ) &&
		// Check that all parents are visible
		!$element.parents().addBack().filter( function () {
			return $.css( this, 'visibility' ) === 'hidden';
		} ).length
	) ) {
		return false;
	}

	// Check if the element is ContentEditable, which is the string 'true'
	if ( element.contentEditable === 'true' ) {
		return true;
	}

	// Anything with a non-negative numeric tabIndex is focusable.
	// Use .prop to avoid browser bugs
	if ( $element.prop( 'tabIndex' ) >= 0 ) {
		return true;
	}

	// Some element types are naturally focusable
	// (indexOf is much faster than regex in Chrome and about the
	// same in FF: https://jsperf.com/regex-vs-indexof-array2)
	const nodeName = element.nodeName.toLowerCase();
	if ( [ 'input', 'select', 'textarea', 'button', 'object' ].indexOf( nodeName ) !== -1 ) {
		return true;
	}

	// Links and areas are focusable if they have an href
	if ( ( nodeName === 'a' || nodeName === 'area' ) && $element.attr( 'href' ) !== undefined ) {
		return true;
	}

	return false;
};

/**
 * Find a focusable child.
 *
 * @param {jQuery} $container Container to search in
 * @param {boolean} [backwards=false] Search backwards
 * @return {jQuery} Focusable child, or an empty jQuery object if none found
 */
OO.ui.findFocusable = function ( $container, backwards ) {
	let $focusable = $( [] ),
		// $focusableCandidates is a superset of things that
		// could get matched by isFocusableElement
		$focusableCandidates = $container
			.find( 'input, select, textarea, button, object, a, area, [contenteditable], [tabindex]' );

	if ( backwards ) {
		$focusableCandidates = Array.prototype.reverse.call( $focusableCandidates );
	}

	$focusableCandidates.each( function () {
		const $this = $( this );
		if ( OO.ui.isFocusableElement( $this ) ) {
			$focusable = $this;
			return false;
		}
	} );
	return $focusable;
};

/**
 * Get the user's language and any fallback languages.
 *
 * These language codes are used to localize user interface elements in the user's language.
 *
 * In environments that provide a localization system, this function should be overridden to
 * return the user's language(s). The default implementation returns English (en) only.
 *
 * @return {string[]} Language codes, in descending order of priority
 */
OO.ui.getUserLanguages = function () {
	return [ 'en' ];
};

/**
 * Get a value in an object keyed by language code.
 *
 * @param {Object.<string,any>} obj Object keyed by language code
 * @param {string|null} [lang] Language code, if omitted or null defaults to any user language
 * @param {string} [fallback] Fallback code, used if no matching language can be found
 * @return {any} Local value
 */
OO.ui.getLocalValue = function ( obj, lang, fallback ) {
	// Requested language
	if ( obj[ lang ] ) {
		return obj[ lang ];
	}
	// Known user language
	const langs = OO.ui.getUserLanguages();
	for ( let i = 0, len = langs.length; i < len; i++ ) {
		lang = langs[ i ];
		if ( obj[ lang ] ) {
			return obj[ lang ];
		}
	}
	// Fallback language
	if ( obj[ fallback ] ) {
		return obj[ fallback ];
	}
	// First existing language
	// eslint-disable-next-line no-unreachable-loop
	for ( lang in obj ) {
		return obj[ lang ];
	}

	return undefined;
};

/**
 * Check if a node is contained within another node.
 *
 * Similar to jQuery#contains except a list of containers can be supplied
 * and a boolean argument allows you to include the container in the match list
 *
 * @param {HTMLElement|HTMLElement[]} containers Container node(s) to search in
 * @param {HTMLElement} contained Node to find
 * @param {boolean} [matchContainers] Include the container(s) in the list of nodes to match,
 *  otherwise only match descendants
 * @return {boolean} The node is in the list of target nodes
 */
OO.ui.contains = function ( containers, contained, matchContainers ) {
	if ( !Array.isArray( containers ) ) {
		containers = [ containers ];
	}
	for ( let i = containers.length - 1; i >= 0; i-- ) {
		if (
			( matchContainers && contained === containers[ i ] ) ||
			$.contains( containers[ i ], contained )
		) {
			return true;
		}
	}
	return false;
};

/**
 * Return a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * Ported from: http://underscorejs.org/underscore.js
 *
 * @param {Function} func Function to debounce
 * @param {number} [wait=0] Wait period in milliseconds
 * @param {boolean} [immediate] Trigger on leading edge
 * @return {Function} Debounced function
 */
OO.ui.debounce = function ( func, wait, immediate ) {
	let timeout;
	return function () {
		const context = this,
			args = arguments,
			later = function () {
				timeout = null;
				if ( !immediate ) {
					func.apply( context, args );
				}
			};
		if ( immediate && !timeout ) {
			func.apply( context, args );
		}
		if ( !timeout || wait ) {
			clearTimeout( timeout );
			timeout = setTimeout( later, wait );
		}
	};
};

/**
 * Puts a console warning with provided message.
 *
 * @param {string} message Message
 */
OO.ui.warnDeprecation = function ( message ) {
	if ( OO.getProp( window, 'console', 'warn' ) !== undefined ) {
		// eslint-disable-next-line no-console
		console.warn( message );
	}
};

/**
 * Returns a function, that, when invoked, will only be triggered at most once
 * during a given window of time. If called again during that window, it will
 * wait until the window ends and then trigger itself again.
 *
 * As it's not knowable to the caller whether the function will actually run
 * when the wrapper is called, return values from the function are entirely
 * discarded.
 *
 * @param {Function} func Function to throttle
 * @param {number} wait Throttle window length, in milliseconds
 * @return {Function} Throttled function
 */
OO.ui.throttle = function ( func, wait ) {
	let context, args, timeout,
		previous = Date.now() - wait;

	const run = function () {
		timeout = null;
		previous = Date.now();
		func.apply( context, args );
	};

	return function () {
		// Check how long it's been since the last time the function was
		// called, and whether it's more or less than the requested throttle
		// period. If it's less, run the function immediately. If it's more,
		// set a timeout for the remaining time -- but don't replace an
		// existing timeout, since that'd indefinitely prolong the wait.
		const remaining = Math.max( wait - ( Date.now() - previous ), 0 );
		context = this;
		args = arguments;
		if ( !timeout ) {
			// If time is up, do setTimeout( run, 0 ) so the function
			// always runs asynchronously, just like Promise#then .
			timeout = setTimeout( run, remaining );
		}
	};
};

/**
 * Reconstitute a JavaScript object corresponding to a widget created by
 * the PHP implementation.
 *
 * This is an alias for `OO.ui.Element.static.infuse()`.
 *
 * @param {string|HTMLElement|jQuery} node A single node for the widget to infuse.
 *   String must be a selector (deprecated).
 * @param {Object} [config] Configuration options
 * @return {OO.ui.Element}
 *   The `OO.ui.Element` corresponding to this (infusable) document node.
 */
OO.ui.infuse = function ( node, config ) {
	if ( typeof node === 'string' ) {
		// Deprecate passing a selector, which was accidentally introduced in Ibf95b0dee.
		// @since 0.41.0
		OO.ui.warnDeprecation(
			'Passing a selector to infuse is deprecated. Use an HTMLElement or jQuery collection instead.'
		);
	}
	return OO.ui.Element.static.infuse( node, config );
};

/**
 * Get a localized message.
 *
 * After the message key, message parameters may optionally be passed. In the default
 * implementation, any occurrences of $1 are replaced with the first parameter, $2 with the
 * second parameter, etc.
 * Alternative implementations of OO.ui.msg may use any substitution system they like, as long
 * as they support unnamed, ordered message parameters.
 *
 * In environments that provide a localization system, this function should be overridden to
 * return the message translated in the user's language. The default implementation always
 * returns English messages. An example of doing this with
 * [jQuery.i18n](https://github.com/wikimedia/jquery.i18n) follows.
 *
 *     @example
 *     const messagePath = 'oojs-ui/dist/i18n/',
 *         languages = [ $.i18n().locale, 'ur', 'en' ],
 *         languageMap = {};
 *
 *     for ( let i = 0, iLen = languages.length; i < iLen; i++ ) {
 *         languageMap[ languages[ i ] ] = messagePath + languages[ i ].toLowerCase() + '.json';
 *     }
 *
 *     $.i18n().load( languageMap ).done( function() {
 *         // Replace the built-in `msg` only once we've loaded the internationalization.
 *         // OOUI uses `OO.ui.deferMsg` for all initially-loaded messages. So long as
 *         // you put off creating any widgets until this promise is complete, no English
 *         // will be displayed.
 *         OO.ui.msg = $.i18n;
 *
 *         // A button displaying "OK" in the default locale
 *         const button = new OO.ui.ButtonWidget( {
 *             label: OO.ui.msg( 'ooui-dialog-message-accept' ),
 *             icon: 'check'
 *         } );
 *         $( document.body ).append( button.$element );
 *
 *         // A button displaying "OK" in Urdu
 *         $.i18n().locale = 'ur';
 *         button = new OO.ui.ButtonWidget( {
 *             label: OO.ui.msg( 'ooui-dialog-message-accept' ),
 *             icon: 'check'
 *         } );
 *         $( document.body ).append( button.$element );
 *     } );
 *
 * @param {string} key Message key
 * @param {...any} [params] Message parameters
 * @return {string} Translated message with parameters substituted
 */
OO.ui.msg = function ( key, ...params ) {
	// `OO.ui.msg.messages` is defined in code generated during the build process
	const messages = OO.ui.msg.messages;

	let message = messages[ key ];
	if ( typeof message === 'string' ) {
		// Perform $1 substitution
		message = message.replace( /\$(\d+)/g, function ( unused, n ) {
			const i = parseInt( n, 10 );
			return params[ i - 1 ] !== undefined ? params[ i - 1 ] : '$' + n;
		} );
	} else {
		// Return placeholder if message not found
		message = '[' + key + ']';
	}
	return message;
};

/**
 * Package a message and arguments for deferred resolution.
 *
 * Use this when you are statically specifying a message and the message may not yet be present.
 *
 * @param {string} key Message key
 * @param {...any} [params] Message parameters
 * @return {Function} Function that returns the resolved message when executed
 */
OO.ui.deferMsg = function () {
	// eslint-disable-next-line mediawiki/msg-doc
	return () => OO.ui.msg( ...arguments );
};

/**
 * Resolve a message.
 *
 * If the message is a function it will be executed, otherwise it will pass through directly.
 *
 * @param {Function|string|any} msg
 * @return {string|any} Resolved message when there was something to resolve, pass through
 *  otherwise
 */
OO.ui.resolveMsg = function ( msg ) {
	if ( typeof msg === 'function' ) {
		return msg();
	}
	return msg;
};

/**
 * @param {string} url
 * @return {boolean}
 */
OO.ui.isSafeUrl = function ( url ) {
	// Keep this function in sync with php/Tag.php

	function stringStartsWith( haystack, needle ) {
		return haystack.slice( 0, needle.length ) === needle;
	}

	const protocolAllowList = [
		'bitcoin', 'ftp', 'ftps', 'geo', 'git', 'gopher', 'http', 'https', 'irc', 'ircs',
		'magnet', 'mailto', 'mms', 'news', 'nntp', 'redis', 'sftp', 'sip', 'sips', 'sms', 'ssh',
		'svn', 'tel', 'telnet', 'urn', 'worldwind', 'xmpp'
	];

	if ( url === '' ) {
		return true;
	}

	for ( let i = 0; i < protocolAllowList.length; i++ ) {
		if ( stringStartsWith( url, protocolAllowList[ i ] + ':' ) ) {
			return true;
		}
	}

	// This matches '//' too
	if ( stringStartsWith( url, '/' ) || stringStartsWith( url, './' ) ) {
		return true;
	}
	if ( stringStartsWith( url, '?' ) || stringStartsWith( url, '#' ) ) {
		return true;
	}

	return false;
};

/**
 * Check if the user has a 'mobile' device.
 *
 * For our purposes this means the user is primarily using an
 * on-screen keyboard, touch input instead of a mouse and may
 * have a physically small display.
 *
 * It is left up to implementors to decide how to compute this
 * so the default implementation always returns false.
 *
 * @return {boolean} User is on a mobile device
 */
OO.ui.isMobile = function () {
	return false;
};

/**
 * Get the additional spacing that should be taken into account when displaying elements that are
 * clipped to the viewport, e.g. dropdown menus and popups. This is meant to be overridden to avoid
 * such menus overlapping any fixed headers/toolbars/navigation used by the site.
 *
 * @return {Object} Object with the properties 'top', 'right', 'bottom', 'left', each representing
 *  the extra spacing from that edge of viewport (in pixels)
 */
OO.ui.getViewportSpacing = function () {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};
};

/**
 * Get the element where elements that are positioned outside of normal flow are inserted,
 * for example dialogs and dropdown menus.
 *
 * This is meant to be overridden if the site needs to style this element in some way
 * (e.g. setting font size), and doesn't want to style the whole document.
 *
 * @return {HTMLElement}
 */
OO.ui.getTeleportTarget = function () {
	return document.body;
};

/**
 * Get the default overlay, which is used by various widgets when they are passed `$overlay: true`.
 * See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
 *
 * @return {jQuery} Default overlay node
 */
OO.ui.getDefaultOverlay = function () {
	if ( !OO.ui.$defaultOverlay ) {
		OO.ui.$defaultOverlay = $( '<div>' ).addClass( 'oo-ui-defaultOverlay' );
		$( OO.ui.getTeleportTarget() ).append( OO.ui.$defaultOverlay );
	}
	return OO.ui.$defaultOverlay;
};

// Define a custom HTML element that does nothing except to expose the `connectedCallback` callback
// as `onConnectOOUI` property. We use it in some widgets to detect when they are connected.
if ( window.customElements ) {
	window.customElements.define( 'ooui-connect-detector', class extends HTMLElement {
		connectedCallback() {
			if ( this.onConnectOOUI instanceof Function ) {
				this.onConnectOOUI();
			}
		}
	} );
}
