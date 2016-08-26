/**
 * Element that will stick under a specified container, even when it is inserted elsewhere in the
 * document (for example, in a OO.ui.Window's $overlay).
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
 * @cfg {jQuery} [$floatableContainer] Node to position below
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
 * The element will be always positioned under the specified container.
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
 * Toggle positioning.
 *
 * Do not turn positioning on until after the element is attached to the DOM and visible.
 *
 * @param {boolean} [positioning] Enable positioning, omit to toggle
 * @chainable
 */
OO.ui.mixin.FloatableElement.prototype.togglePositioning = function ( positioning ) {
	var closestScrollableOfContainer, closestScrollableOfFloatable;

	positioning = positioning === undefined ? !this.positioning : !!positioning;

	if ( this.positioning !== positioning ) {
		this.positioning = positioning;

		closestScrollableOfContainer = OO.ui.Element.static.getClosestScrollableContainer( this.$floatableContainer[ 0 ] );
		closestScrollableOfFloatable = OO.ui.Element.static.getClosestScrollableContainer( this.$floatable[ 0 ] );
		this.needsCustomPosition = closestScrollableOfContainer !== closestScrollableOfFloatable;
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

			this.$floatable.css( { left: '', top: '' } );
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
	var elemRect, contRect,
		leftEdgeInBounds = false,
		bottomEdgeInBounds = false,
		rightEdgeInBounds = false;

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

	// For completeness, if we still cared about topEdgeInBounds, that'd be:
	// elemRect.top >= contRect.top && elemRect.top <= contRect.bottom
	if ( elemRect.left >= contRect.left && elemRect.left <= contRect.right ) {
		leftEdgeInBounds = true;
	}
	if ( elemRect.bottom >= contRect.top && elemRect.bottom <= contRect.bottom ) {
		bottomEdgeInBounds = true;
	}
	if ( elemRect.right >= contRect.left && elemRect.right <= contRect.right ) {
		rightEdgeInBounds = true;
	}

	// We only care that any part of the bottom edge is visible
	return bottomEdgeInBounds && ( leftEdgeInBounds || rightEdgeInBounds );
};

/**
 * Position the floatable below its container.
 *
 * This should only be done when both of them are attached to the DOM and visible.
 *
 * @chainable
 */
OO.ui.mixin.FloatableElement.prototype.position = function () {
	var pos;

	if ( !this.positioning ) {
		return this;
	}

	if ( !this.isElementInViewport( this.$floatableContainer, this.$floatableClosestScrollable ) ) {
		this.$floatable.addClass( 'oo-ui-floatableElement-hidden' );
		return;
	} else {
		this.$floatable.removeClass( 'oo-ui-floatableElement-hidden' );
	}

	if ( !this.needsCustomPosition ) {
		return;
	}

	pos = OO.ui.Element.static.getRelativePosition( this.$floatableContainer, this.$floatable.offsetParent() );

	// Position under container
	pos.top += this.$floatableContainer.height();
	this.$floatable.css( pos );

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
