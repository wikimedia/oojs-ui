/**
 * Element that will stick adjacent to a specified container, even when it is inserted elsewhere
 * in the document (for example, in an OO.ui.Window's $overlay).
 *
 * The elements's position is automatically calculated and maintained when window is resized or the
 * page is scrolled. If you reposition the container manually, you have to call #position to make
 * sure the element is still placed correctly.
 *
 * As positioning is only possible when both the element and the container are attached to the DOM
 * and visible, it's only done after you call #togglePositioning. You might want to do this inside
 * the #toggle method to display a floating popup, for example.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$floatable] Node to position, assigned to #$floatable, omit to use #$element
 * @cfg {jQuery} [$floatableContainer] Node to position adjacent to
 * @cfg {string} [verticalPosition='below'] Where to position $floatable vertically:
 *  'below': Directly below $floatableContainer, aligning f's top edge with fC's bottom edge
 *  'above': Directly above $floatableContainer, aligning f's bottom edge with fC's top edge
 *  'top': Align the top edge with $floatableContainer's top edge
 *  'bottom': Align the bottom edge with $floatableContainer's bottom edge
 *  'center': Vertically align the center with $floatableContainer's center
 * @cfg {string} [horizontalPosition='start'] Where to position $floatable horizontally:
 *  'before': Directly before $floatableContainer, aligning f's end edge with fC's start edge
 *  'after': Directly after $floatableContainer, algining f's start edge with fC's end edge
 *  'start': Align the start (left in LTR, right in RTL) edge with $floatableContainer's start edge
 *  'end': Align the end (right in LTR, left in RTL) edge with $floatableContainer's end edge
 *  'center': Horizontally align the center with $floatableContainer's center
 * @cfg {boolean} [hideWhenOutOfView=true] Whether to hide the floatable element if the container
 *  is out of view
 */
OO.ui.mixin.FloatableElement = function OoUiMixinFloatableElement( config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.$floatable = null;
	this.$floatableContainer = null;
	this.$floatableWindow = null;
	this.$floatableClosestScrollable = null;
	this.onFloatableScrollHandler = this.position.bind( this );
	this.onFloatableWindowResizeHandler = this.position.bind( this );

	// Initialization
	this.setFloatableContainer( config.$floatableContainer );
	this.setFloatableElement( config.$floatable || this.$element );
	this.setVerticalPosition( config.verticalPosition || 'below' );
	this.setHorizontalPosition( config.horizontalPosition || 'start' );
	this.hideWhenOutOfView = config.hideWhenOutOfView === undefined ? true : !!config.hideWhenOutOfView;
};

/* Methods */

/**
 * Set floatable element.
 *
 * If an element is already set, it will be cleaned up before setting up the new element.
 *
 * @param {jQuery} $floatable Element to make floatable
 */
OO.ui.mixin.FloatableElement.prototype.setFloatableElement = function ( $floatable ) {
	if ( this.$floatable ) {
		this.$floatable.removeClass( 'oo-ui-floatableElement-floatable' );
		this.$floatable.css( { left: '', top: '' } );
	}

	this.$floatable = $floatable.addClass( 'oo-ui-floatableElement-floatable' );
	this.position();
};

/**
 * Set floatable container.
 *
 * The element will be positioned relative to the specified container.
 *
 * @param {jQuery|null} $floatableContainer Container to keep visible, or null to unset
 */
OO.ui.mixin.FloatableElement.prototype.setFloatableContainer = function ( $floatableContainer ) {
	this.$floatableContainer = $floatableContainer;
	if ( this.$floatable ) {
		this.position();
	}
};

/**
 * Change how the element is positioned vertically.
 *
 * @param {string} position 'below', 'above', 'top', 'bottom' or 'center'
 */
OO.ui.mixin.FloatableElement.prototype.setVerticalPosition = function ( position ) {
	if ( [ 'below', 'above', 'top', 'bottom', 'center' ].indexOf( position ) === -1 ) {
		throw new Error( 'Invalid value for vertical position: ' + position );
	}
	if ( this.verticalPosition !== position ) {
		this.verticalPosition = position;
		if ( this.$floatable ) {
			this.position();
		}
	}
};

/**
 * Change how the element is positioned horizontally.
 *
 * @param {string} position 'before', 'after', 'start', 'end' or 'center'
 */
OO.ui.mixin.FloatableElement.prototype.setHorizontalPosition = function ( position ) {
	if ( [ 'before', 'after', 'start', 'end', 'center' ].indexOf( position ) === -1 ) {
		throw new Error( 'Invalid value for horizontal position: ' + position );
	}
	if ( this.horizontalPosition !== position ) {
		this.horizontalPosition = position;
		if ( this.$floatable ) {
			this.position();
		}
	}
};

/**
 * Toggle positioning.
 *
 * Do not turn positioning on until after the element is attached to the DOM and visible.
 *
 * @param {boolean} [positioning] Enable positioning, omit to toggle
 * @chainable
 */
OO.ui.mixin.FloatableElement.prototype.togglePositioning = function ( positioning ) {
	var closestScrollableOfContainer;

	if ( !this.$floatable || !this.$floatableContainer ) {
		return this;
	}

	positioning = positioning === undefined ? !this.positioning : !!positioning;

	if ( positioning && !this.warnedUnattached && !this.isElementAttached() ) {
		OO.ui.warnDeprecation( 'FloatableElement#togglePositioning: Before calling this method, the element must be attached to the DOM.' );
		this.warnedUnattached = true;
	}

	if ( this.positioning !== positioning ) {
		this.positioning = positioning;

		this.needsCustomPosition =
			this.verticalPostion !== 'below' ||
			this.horizontalPosition !== 'start' ||
			!OO.ui.contains( this.$floatableContainer[ 0 ], this.$floatable[ 0 ] );

		closestScrollableOfContainer = OO.ui.Element.static.getClosestScrollableContainer( this.$floatableContainer[ 0 ] );
		// If the scrollable is the root, we have to listen to scroll events
		// on the window because of browser inconsistencies.
		if ( $( closestScrollableOfContainer ).is( 'html, body' ) ) {
			closestScrollableOfContainer = OO.ui.Element.static.getWindow( closestScrollableOfContainer );
		}

		if ( positioning ) {
			this.$floatableWindow = $( this.getElementWindow() );
			this.$floatableWindow.on( 'resize', this.onFloatableWindowResizeHandler );

			this.$floatableClosestScrollable = $( closestScrollableOfContainer );
			this.$floatableClosestScrollable.on( 'scroll', this.onFloatableScrollHandler );

			// Initial position after visible
			this.position();
		} else {
			if ( this.$floatableWindow ) {
				this.$floatableWindow.off( 'resize', this.onFloatableWindowResizeHandler );
				this.$floatableWindow = null;
			}

			if ( this.$floatableClosestScrollable ) {
				this.$floatableClosestScrollable.off( 'scroll', this.onFloatableScrollHandler );
				this.$floatableClosestScrollable = null;
			}

			this.$floatable.css( { left: '', right: '', top: '' } );
		}
	}

	return this;
};

/**
 * Check whether the bottom edge of the given element is within the viewport of the given container.
 *
 * @private
 * @param {jQuery} $element
 * @param {jQuery} $container
 * @return {boolean}
 */
OO.ui.mixin.FloatableElement.prototype.isElementInViewport = function ( $element, $container ) {
	var elemRect, contRect, topEdgeInBounds, bottomEdgeInBounds, leftEdgeInBounds, rightEdgeInBounds,
		startEdgeInBounds, endEdgeInBounds,
		direction = $element.css( 'direction' );

	elemRect = $element[ 0 ].getBoundingClientRect();
	if ( $container[ 0 ] === window ) {
		contRect = {
			top: 0,
			left: 0,
			right: document.documentElement.clientWidth,
			bottom: document.documentElement.clientHeight
		};
	} else {
		contRect = $container[ 0 ].getBoundingClientRect();
	}

	topEdgeInBounds = elemRect.top >= contRect.top && elemRect.top <= contRect.bottom;
	bottomEdgeInBounds = elemRect.bottom >= contRect.top && elemRect.bottom <= contRect.bottom;
	leftEdgeInBounds = elemRect.left >= contRect.left && elemRect.left <= contRect.right;
	rightEdgeInBounds = elemRect.right >= contRect.left && elemRect.right <= contRect.right;
	if ( direction === 'rtl' ) {
		startEdgeInBounds = rightEdgeInBounds;
		endEdgeInBounds = leftEdgeInBounds;
	} else {
		startEdgeInBounds = leftEdgeInBounds;
		endEdgeInBounds = rightEdgeInBounds;
	}

	if ( this.verticalPosition === 'below' && !bottomEdgeInBounds ) {
		return false;
	}
	if ( this.verticalPosition === 'above' && !topEdgeInBounds ) {
		return false;
	}
	if ( this.horizontalPosition === 'before' && !startEdgeInBounds ) {
		return false;
	}
	if ( this.horizontalPosition === 'after' && !endEdgeInBounds ) {
		return false;
	}

	// The other positioning values are all about being inside the container,
	// so in those cases all we care about is that any part of the container is visible.
	return elemRect.top <= contRect.bottom && elemRect.bottom >= contRect.top &&
		elemRect.left <= contRect.right && elemRect.right >= contRect.left;
};

/**
 * Position the floatable below its container.
 *
 * This should only be done when both of them are attached to the DOM and visible.
 *
 * @chainable
 */
OO.ui.mixin.FloatableElement.prototype.position = function () {
	if ( !this.positioning ) {
		return this;
	}

	if ( !(
		// To continue, some things need to be true:
		// The element must actually be in the DOM
		this.isElementAttached() && (
			// The closest scrollable is the current window
			this.$floatableClosestScrollable[ 0 ] === this.getElementWindow() ||
			// OR is an element in the element's DOM
			$.contains( this.getElementDocument(), this.$floatableClosestScrollable )
		)
	) ) {
		// Abort early if important parts of the widget are no longer attached to the DOM
		return this;
	}

	if ( this.hideWhenOutOfView && !this.isElementInViewport( this.$floatableContainer, this.$floatableClosestScrollable ) ) {
		this.$floatable.addClass( 'oo-ui-element-hidden' );
		return this;
	} else {
		this.$floatable.removeClass( 'oo-ui-element-hidden' );
	}

	if ( !this.needsCustomPosition ) {
		return this;
	}

	this.$floatable.css( this.computePosition() );

	// We updated the position, so re-evaluate the clipping state.
	// (ClippableElement does not listen to 'scroll' events on $floatableContainer's parent, and so
	// will not notice the need to update itself.)
	// TODO: This is terrible, we shouldn't need to know about ClippableElement at all here. Why does
	// it not listen to the right events in the right places?
	if ( this.clip ) {
		this.clip();
	}

	return this;
};

/**
 * Compute how #$floatable should be positioned based on the position of #$floatableContainer
 * and the positioning settings. This is a helper for #position that shouldn't be called directly,
 * but may be overridden by subclasses if they want to change or add to the positioning logic.
 *
 * @return {Object} New position to apply with .css(). Keys are 'top', 'left', 'bottom' and 'right'.
 */
OO.ui.mixin.FloatableElement.prototype.computePosition = function () {
	var isBody, scrollableX, scrollableY, containerPos,
		horizScrollbarHeight, vertScrollbarWidth, scrollTop, scrollLeft,
		newPos = { top: '', left: '', bottom: '', right: '' },
		direction = this.$floatableContainer.css( 'direction' ),
		$offsetParent = this.$floatable.offsetParent();

	if ( $offsetParent.is( 'html' ) ) {
		// The innerHeight/Width and clientHeight/Width calculations don't work well on the
		// <html> element, but they do work on the <body>
		$offsetParent = $( $offsetParent[ 0 ].ownerDocument.body );
	}
	isBody = $offsetParent.is( 'body' );
	scrollableX = $offsetParent.css( 'overflow-x' ) === 'scroll' || $offsetParent.css( 'overflow-x' ) === 'auto';
	scrollableY = $offsetParent.css( 'overflow-y' ) === 'scroll' || $offsetParent.css( 'overflow-y' ) === 'auto';

	vertScrollbarWidth = $offsetParent.innerWidth() - $offsetParent.prop( 'clientWidth' );
	horizScrollbarHeight = $offsetParent.innerHeight() - $offsetParent.prop( 'clientHeight' );
	// We don't need to compute and add scrollTop and scrollLeft if the scrollable container is the body,
	// or if it isn't scrollable
	scrollTop = scrollableY && !isBody ? $offsetParent.scrollTop() : 0;
	scrollLeft = scrollableX && !isBody ? OO.ui.Element.static.getScrollLeft( $offsetParent[ 0 ] ) : 0;

	// Avoid passing the <body> to getRelativePosition(), because it won't return what we expect
	// if the <body> has a margin
	containerPos = isBody ?
		this.$floatableContainer.offset() :
		OO.ui.Element.static.getRelativePosition( this.$floatableContainer, $offsetParent );
	containerPos.bottom = containerPos.top + this.$floatableContainer.outerHeight();
	containerPos.right = containerPos.left + this.$floatableContainer.outerWidth();
	containerPos.start = direction === 'rtl' ? containerPos.right : containerPos.left;
	containerPos.end = direction === 'rtl' ? containerPos.left : containerPos.right;

	if ( this.verticalPosition === 'below' ) {
		newPos.top = containerPos.bottom;
	} else if ( this.verticalPosition === 'above' ) {
		newPos.bottom = $offsetParent.outerHeight() - containerPos.top;
	} else if ( this.verticalPosition === 'top' ) {
		newPos.top = containerPos.top;
	} else if ( this.verticalPosition === 'bottom' ) {
		newPos.bottom = $offsetParent.outerHeight() - containerPos.bottom;
	} else if ( this.verticalPosition === 'center' ) {
		newPos.top = containerPos.top +
			( this.$floatableContainer.height() - this.$floatable.height() ) / 2;
	}

	if ( this.horizontalPosition === 'before' ) {
		newPos.end = containerPos.start;
	} else if ( this.horizontalPosition === 'after' ) {
		newPos.start = containerPos.end;
	} else if ( this.horizontalPosition === 'start' ) {
		newPos.start = containerPos.start;
	} else if ( this.horizontalPosition === 'end' ) {
		newPos.end = containerPos.end;
	} else if ( this.horizontalPosition === 'center' ) {
		newPos.left = containerPos.left +
			( this.$floatableContainer.width() - this.$floatable.width() ) / 2;
	}

	if ( newPos.start !== undefined ) {
		if ( direction === 'rtl' ) {
			newPos.right = ( isBody ? $( $offsetParent[ 0 ].ownerDocument.documentElement ) : $offsetParent ).outerWidth() - newPos.start;
		} else {
			newPos.left = newPos.start;
		}
		delete newPos.start;
	}
	if ( newPos.end !== undefined ) {
		if ( direction === 'rtl' ) {
			newPos.left = newPos.end;
		} else {
			newPos.right = ( isBody ? $( $offsetParent[ 0 ].ownerDocument.documentElement ) : $offsetParent ).outerWidth() - newPos.end;
		}
		delete newPos.end;
	}

	// Account for scroll position
	if ( newPos.top !== '' ) {
		newPos.top += scrollTop;
	}
	if ( newPos.bottom !== '' ) {
		newPos.bottom -= scrollTop;
	}
	if ( newPos.left !== '' ) {
		newPos.left += scrollLeft;
	}
	if ( newPos.right !== '' ) {
		newPos.right -= scrollLeft;
	}

	// Account for scrollbar gutter
	if ( newPos.bottom !== '' ) {
		newPos.bottom -= horizScrollbarHeight;
	}
	if ( direction === 'rtl' ) {
		if ( newPos.left !== '' ) {
			newPos.left -= vertScrollbarWidth;
		}
	} else {
		if ( newPos.right !== '' ) {
			newPos.right -= vertScrollbarWidth;
		}
	}

	return newPos;
};
