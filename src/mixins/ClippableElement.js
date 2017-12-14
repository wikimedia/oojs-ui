/**
 * Element that can be automatically clipped to visible boundaries.
 *
 * Whenever the element's natural height changes, you have to call
 * {@link OO.ui.mixin.ClippableElement#clip} to make sure it's still
 * clipping correctly.
 *
 * The dimensions of #$clippableContainer will be compared to the boundaries of the
 * nearest scrollable container. If #$clippableContainer is too tall and/or too wide,
 * then #$clippable will be given a fixed reduced height and/or width and will be made
 * scrollable. By default, #$clippable and #$clippableContainer are the same element,
 * but you can build a static footer by setting #$clippableContainer to an element that contains
 * #$clippable and the footer.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$clippable] Node to clip, assigned to #$clippable, omit to use #$element
 * @cfg {jQuery} [$clippableContainer] Node to keep visible, assigned to #$clippableContainer,
 *   omit to use #$clippable
 */
OO.ui.mixin.ClippableElement = function OoUiMixinClippableElement( config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.$clippable = null;
	this.$clippableContainer = null;
	this.clipping = false;
	this.clippedHorizontally = false;
	this.clippedVertically = false;
	this.$clippableScrollableContainer = null;
	this.$clippableScroller = null;
	this.$clippableWindow = null;
	this.idealWidth = null;
	this.idealHeight = null;
	this.onClippableScrollHandler = this.clip.bind( this );
	this.onClippableWindowResizeHandler = this.clip.bind( this );

	// Initialization
	if ( config.$clippableContainer ) {
		this.setClippableContainer( config.$clippableContainer );
	}
	this.setClippableElement( config.$clippable || this.$element );
};

/* Methods */

/**
 * Set clippable element.
 *
 * If an element is already set, it will be cleaned up before setting up the new element.
 *
 * @param {jQuery} $clippable Element to make clippable
 */
OO.ui.mixin.ClippableElement.prototype.setClippableElement = function ( $clippable ) {
	if ( this.$clippable ) {
		this.$clippable.removeClass( 'oo-ui-clippableElement-clippable' );
		this.$clippable.css( { width: '', height: '', overflowX: '', overflowY: '' } );
		OO.ui.Element.static.reconsiderScrollbars( this.$clippable[ 0 ] );
	}

	this.$clippable = $clippable.addClass( 'oo-ui-clippableElement-clippable' );
	this.clip();
};

/**
 * Set clippable container.
 *
 * This is the container that will be measured when deciding whether to clip. When clipping,
 * #$clippable will be resized in order to keep the clippable container fully visible.
 *
 * If the clippable container is unset, #$clippable will be used.
 *
 * @param {jQuery|null} $clippableContainer Container to keep visible, or null to unset
 */
OO.ui.mixin.ClippableElement.prototype.setClippableContainer = function ( $clippableContainer ) {
	this.$clippableContainer = $clippableContainer;
	if ( this.$clippable ) {
		this.clip();
	}
};

/**
 * Toggle clipping.
 *
 * Do not turn clipping on until after the element is attached to the DOM and visible.
 *
 * @param {boolean} [clipping] Enable clipping, omit to toggle
 * @chainable
 */
OO.ui.mixin.ClippableElement.prototype.toggleClipping = function ( clipping ) {
	clipping = clipping === undefined ? !this.clipping : !!clipping;

	if ( clipping && !this.warnedUnattached && !this.isElementAttached() ) {
		OO.ui.warnDeprecation( 'ClippableElement#toggleClipping: Before calling this method, the element must be attached to the DOM.' );
		this.warnedUnattached = true;
	}

	if ( this.clipping !== clipping ) {
		this.clipping = clipping;
		if ( clipping ) {
			this.$clippableScrollableContainer = $( this.getClosestScrollableElementContainer() );
			// If the clippable container is the root, we have to listen to scroll events and check
			// jQuery.scrollTop on the window because of browser inconsistencies
			this.$clippableScroller = this.$clippableScrollableContainer.is( 'html, body' ) ?
				$( OO.ui.Element.static.getWindow( this.$clippableScrollableContainer ) ) :
				this.$clippableScrollableContainer;
			this.$clippableScroller.on( 'scroll', this.onClippableScrollHandler );
			this.$clippableWindow = $( this.getElementWindow() )
				.on( 'resize', this.onClippableWindowResizeHandler );
			// Initial clip after visible
			this.clip();
		} else {
			this.$clippable.css( {
				width: '',
				height: '',
				maxWidth: '',
				maxHeight: '',
				overflowX: '',
				overflowY: ''
			} );
			OO.ui.Element.static.reconsiderScrollbars( this.$clippable[ 0 ] );

			this.$clippableScrollableContainer = null;
			this.$clippableScroller.off( 'scroll', this.onClippableScrollHandler );
			this.$clippableScroller = null;
			this.$clippableWindow.off( 'resize', this.onClippableWindowResizeHandler );
			this.$clippableWindow = null;
		}
	}

	return this;
};

/**
 * Check if the element will be clipped to fit the visible area of the nearest scrollable container.
 *
 * @return {boolean} Element will be clipped to the visible area
 */
OO.ui.mixin.ClippableElement.prototype.isClipping = function () {
	return this.clipping;
};

/**
 * Check if the bottom or right of the element is being clipped by the nearest scrollable container.
 *
 * @return {boolean} Part of the element is being clipped
 */
OO.ui.mixin.ClippableElement.prototype.isClipped = function () {
	return this.clippedHorizontally || this.clippedVertically;
};

/**
 * Check if the right of the element is being clipped by the nearest scrollable container.
 *
 * @return {boolean} Part of the element is being clipped
 */
OO.ui.mixin.ClippableElement.prototype.isClippedHorizontally = function () {
	return this.clippedHorizontally;
};

/**
 * Check if the bottom of the element is being clipped by the nearest scrollable container.
 *
 * @return {boolean} Part of the element is being clipped
 */
OO.ui.mixin.ClippableElement.prototype.isClippedVertically = function () {
	return this.clippedVertically;
};

/**
 * Set the ideal size. These are the dimensions #$clippable will have when it's not being clipped.
 *
 * @param {number|string} [width] Width as a number of pixels or CSS string with unit suffix
 * @param {number|string} [height] Height as a number of pixels or CSS string with unit suffix
 */
OO.ui.mixin.ClippableElement.prototype.setIdealSize = function ( width, height ) {
	this.idealWidth = width;
	this.idealHeight = height;

	if ( !this.clipping ) {
		// Update dimensions
		this.$clippable.css( { width: width, height: height } );
	}
	// While clipping, idealWidth and idealHeight are not considered
};

/**
 * Return the side of the clippable on which it is "anchored" (aligned to something else).
 * ClippableElement will clip the opposite side when reducing element's width.
 *
 * Classes that mix in ClippableElement should override this to return 'right' if their
 * clippable is absolutely positioned and using 'right: Npx' (and not using 'left').
 * If your class also mixes in FloatableElement, this is handled automatically.
 *
 * (This can't be guessed from the actual CSS because the computed values for 'left'/'right' are
 * always in pixels, even if they were unset or set to 'auto'.)
 *
 * When in doubt, 'left' (or 'right' in RTL) is a sane fallback.
 *
 * @return {string} 'left' or 'right'
 */
OO.ui.mixin.ClippableElement.prototype.getHorizontalAnchorEdge = function () {
	if ( this.computePosition && this.positioning && this.computePosition().right !== '' ) {
		return 'right';
	}
	return 'left';
};

/**
 * Return the side of the clippable on which it is "anchored" (aligned to something else).
 * ClippableElement will clip the opposite side when reducing element's width.
 *
 * Classes that mix in ClippableElement should override this to return 'bottom' if their
 * clippable is absolutely positioned and using 'bottom: Npx' (and not using 'top').
 * If your class also mixes in FloatableElement, this is handled automatically.
 *
 * (This can't be guessed from the actual CSS because the computed values for 'left'/'right' are
 * always in pixels, even if they were unset or set to 'auto'.)
 *
 * When in doubt, 'top' is a sane fallback.
 *
 * @return {string} 'top' or 'bottom'
 */
OO.ui.mixin.ClippableElement.prototype.getVerticalAnchorEdge = function () {
	if ( this.computePosition && this.positioning && this.computePosition().bottom !== '' ) {
		return 'bottom';
	}
	return 'top';
};

/**
 * Clip element to visible boundaries and allow scrolling when needed. You should call this method
 * when the element's natural height changes.
 *
 * Element will be clipped the bottom or right of the element is within 10px of the edge of, or
 * overlapped by, the visible area of the nearest scrollable container.
 *
 * Because calling clip() when the natural height changes isn't always possible, we also set
 * max-height when the element isn't being clipped. This means that if the element tries to grow
 * beyond the edge, something reasonable will happen before clip() is called.
 *
 * @chainable
 */
OO.ui.mixin.ClippableElement.prototype.clip = function () {
	var extraHeight, extraWidth, viewportSpacing,
		desiredWidth, desiredHeight, allotedWidth, allotedHeight,
		naturalWidth, naturalHeight, clipWidth, clipHeight,
		$item, itemRect, $viewport, viewportRect, availableRect,
		direction, vertScrollbarWidth, horizScrollbarHeight,
		// Extra tolerance so that the sloppy code below doesn't result in results that are off
		// by one or two pixels. (And also so that we have space to display drop shadows.)
		// Chosen by fair dice roll.
		buffer = 7;

	if ( !this.clipping ) {
		// this.$clippableScrollableContainer and this.$clippableWindow are null, so the below will fail
		return this;
	}

	function rectIntersection( a, b ) {
		var out = {};
		out.top = Math.max( a.top, b.top );
		out.left = Math.max( a.left, b.left );
		out.bottom = Math.min( a.bottom, b.bottom );
		out.right = Math.min( a.right, b.right );
		return out;
	}

	viewportSpacing = OO.ui.getViewportSpacing();

	if ( this.$clippableScrollableContainer.is( 'html, body' ) ) {
		$viewport = $( this.$clippableScrollableContainer[ 0 ].ownerDocument.body );
		// Dimensions of the browser window, rather than the element!
		viewportRect = {
			top: 0,
			left: 0,
			right: document.documentElement.clientWidth,
			bottom: document.documentElement.clientHeight
		};
		viewportRect.top += viewportSpacing.top;
		viewportRect.left += viewportSpacing.left;
		viewportRect.right -= viewportSpacing.right;
		viewportRect.bottom -= viewportSpacing.bottom;
	} else {
		$viewport = this.$clippableScrollableContainer;
		viewportRect = $viewport[ 0 ].getBoundingClientRect();
		// Convert into a plain object
		viewportRect = $.extend( {}, viewportRect );
	}

	// Account for scrollbar gutter
	direction = $viewport.css( 'direction' );
	vertScrollbarWidth = $viewport.innerWidth() - $viewport.prop( 'clientWidth' );
	horizScrollbarHeight = $viewport.innerHeight() - $viewport.prop( 'clientHeight' );
	viewportRect.bottom -= horizScrollbarHeight;
	if ( direction === 'rtl' ) {
		viewportRect.left += vertScrollbarWidth;
	} else {
		viewportRect.right -= vertScrollbarWidth;
	}

	// Add arbitrary tolerance
	viewportRect.top += buffer;
	viewportRect.left += buffer;
	viewportRect.right -= buffer;
	viewportRect.bottom -= buffer;

	$item = this.$clippableContainer || this.$clippable;

	extraHeight = $item.outerHeight() - this.$clippable.outerHeight();
	extraWidth = $item.outerWidth() - this.$clippable.outerWidth();

	itemRect = $item[ 0 ].getBoundingClientRect();
	// Convert into a plain object
	itemRect = $.extend( {}, itemRect );

	// Item might already be clipped, so we can't just use its dimensions (in case we might need to
	// make it larger than before). Extend the rectangle to the maximum size we are allowed to take.
	if ( this.getHorizontalAnchorEdge() === 'right' ) {
		itemRect.left = viewportRect.left;
	} else {
		itemRect.right = viewportRect.right;
	}
	if ( this.getVerticalAnchorEdge() === 'bottom' ) {
		itemRect.top = viewportRect.top;
	} else {
		itemRect.bottom = viewportRect.bottom;
	}

	availableRect = rectIntersection( viewportRect, itemRect );

	desiredWidth = Math.max( 0, availableRect.right - availableRect.left );
	desiredHeight = Math.max( 0, availableRect.bottom - availableRect.top );
	// It should never be desirable to exceed the dimensions of the browser viewport... right?
	desiredWidth = Math.min( desiredWidth,
		document.documentElement.clientWidth - viewportSpacing.left - viewportSpacing.right );
	desiredHeight = Math.min( desiredHeight,
		document.documentElement.clientHeight - viewportSpacing.top - viewportSpacing.right );
	allotedWidth = Math.ceil( desiredWidth - extraWidth );
	allotedHeight = Math.ceil( desiredHeight - extraHeight );
	naturalWidth = this.$clippable.prop( 'scrollWidth' );
	naturalHeight = this.$clippable.prop( 'scrollHeight' );
	clipWidth = allotedWidth < naturalWidth;
	clipHeight = allotedHeight < naturalHeight;

	if ( clipWidth ) {
		// The order matters here. If overflow is not set first, Chrome displays bogus scrollbars. See T157672.
		// Forcing a reflow is a smaller workaround than calling reconsiderScrollbars() for this case.
		this.$clippable.css( 'overflowX', 'scroll' );
		void this.$clippable[ 0 ].offsetHeight; // Force reflow
		this.$clippable.css( {
			width: Math.max( 0, allotedWidth ),
			maxWidth: ''
		} );
	} else {
		this.$clippable.css( {
			overflowX: '',
			width: this.idealWidth || '',
			maxWidth: Math.max( 0, allotedWidth )
		} );
	}
	if ( clipHeight ) {
		// The order matters here. If overflow is not set first, Chrome displays bogus scrollbars. See T157672.
		// Forcing a reflow is a smaller workaround than calling reconsiderScrollbars() for this case.
		this.$clippable.css( 'overflowY', 'scroll' );
		void this.$clippable[ 0 ].offsetHeight; // Force reflow
		this.$clippable.css( {
			height: Math.max( 0, allotedHeight ),
			maxHeight: ''
		} );
	} else {
		this.$clippable.css( {
			overflowY: '',
			height: this.idealHeight || '',
			maxHeight: Math.max( 0, allotedHeight )
		} );
	}

	// If we stopped clipping in at least one of the dimensions
	if ( ( this.clippedHorizontally && !clipWidth ) || ( this.clippedVertically && !clipHeight ) ) {
		OO.ui.Element.static.reconsiderScrollbars( this.$clippable[ 0 ] );
	}

	this.clippedHorizontally = clipWidth;
	this.clippedVertically = clipHeight;

	return this;
};
