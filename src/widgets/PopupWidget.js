/**
 * PopupWidget is a container for content. The popup is overlaid and positioned absolutely.
 * By default, each popup has an anchor that points toward its origin.
 * Please see the [OOUI documentation on MediaWiki.org][1] for more information and examples.
 *
 * Unlike most widgets, PopupWidget is initially hidden and must be shown by calling #toggle.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Popups
 *
 *     @example
 *     // A PopupWidget.
 *     const popup = new OO.ui.PopupWidget( {
 *         $content: $( '<p>Hi there!</p>' ),
 *         padded: true,
 *         width: 300
 *     } );
 *
 *     $( document.body ).append( popup.$element );
 *     // To display the popup, toggle the visibility to 'true'.
 *     popup.toggle( true );
 *
 * @class
 * @extends OO.ui.Widget
 * @mixes OO.ui.mixin.IconElement
 * @mixes OO.ui.mixin.LabelElement
 * @mixes OO.ui.mixin.ClippableElement
 * @mixes OO.ui.mixin.FloatableElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {number|null} [config.width=320] Width of popup in pixels. Pass `null` to use automatic width.
 * @param {number|null} [config.height=null] Height of popup in pixels. Pass `null` to use automatic height.
 * @param {boolean} [config.anchor=true] Show anchor pointing to origin of popup
 * @param {string} [config.position='below'] Where to position the popup relative to $floatableContainer
 *  'above': Put popup above $floatableContainer; anchor points down to the horizontal center
 *    of $floatableContainer
 *  'below': Put popup below $floatableContainer; anchor points up to the horizontal center
 *    of $floatableContainer
 *  'before': Put popup to the left (LTR) / right (RTL) of $floatableContainer; anchor points
 *    endwards (right/left) to the vertical center of $floatableContainer
 *  'after': Put popup to the right (LTR) / left (RTL) of $floatableContainer; anchor points
 *    startwards (left/right) to the vertical center of $floatableContainer
 * @param {string} [config.align='center'] How to align the popup to $floatableContainer
 *  'forwards': If position is above/below, move the popup as far endwards (right in LTR, left in
 *    RTL) as possible while still keeping the anchor within the popup; if position is before/after,
 *    move the popup as far downwards as possible.
 *  'backwards': If position is above/below, move the popup as far startwards (left in LTR, right in
 *    RTL) as possible while still keeping the anchor within the popup; if position is before/after,
 *     move the popup as far upwards as possible.
 *  'center': Horizontally (if position is above/below) or vertically (before/after) align the
 *     center of the popup with the center of $floatableContainer.
 * 'force-left': Alias for 'forwards' in LTR and 'backwards' in RTL
 * 'force-right': Alias for 'backwards' in RTL and 'forwards' in LTR
 * @param {boolean} [config.autoFlip=true] Whether to automatically switch the popup's position between
 *  'above' and 'below', or between 'before' and 'after', if there is not enough space in the
 *  desired direction to display the popup without clipping
 * @param {jQuery} [config.$container] Constrain the popup to the boundaries of the specified container.
 *  See the [OOUI docs on MediaWiki][3] for an example.
 *  [3]: https://www.mediawiki.org/wiki/OOUI/Widgets/Popups#containerExample
 * @param {number} [config.containerPadding=10] Padding between the popup and its container, specified as a
 *  number of pixels.
 * @param {jQuery} [config.$content] Content to append to the popup's body
 * @param {jQuery} [config.$footer] Content to append to the popup's footer
 * @param {boolean} [config.autoClose=false] Automatically close the popup when it loses focus.
 * @param {jQuery} [config.$autoCloseIgnore] Elements that will not close the popup when clicked.
 *  This config option is only relevant if #autoClose is set to `true`. See the
 *  [OOUI documentation on MediaWiki][2] for an example.
 *  [2]: https://www.mediawiki.org/wiki/OOUI/Widgets/Popups#autocloseExample
 * @param {boolean} [config.head=false] Show a popup header that contains a #label (if specified) and close
 *  button.
 * @param {boolean} [config.hideCloseButton=false]
 * @param {boolean} [config.padded=false] Add padding to the popup's body
 */
OO.ui.PopupWidget = function OoUiPopupWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.PopupWidget.super.call( this, config );

	// Properties (must be set before ClippableElement constructor call)
	this.$body = $( '<div>' );
	this.$popup = $( '<div>' );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.ClippableElement.call( this, Object.assign( {
		$clippable: this.$body,
		$clippableContainer: this.$popup
	}, config ) );
	OO.ui.mixin.FloatableElement.call( this, config );

	// Properties
	this.$anchor = $( '<div>' );
	// If undefined, will be computed lazily in computePosition()
	this.$container = config.$container;
	this.containerPadding = config.containerPadding !== undefined ? config.containerPadding : 10;
	this.autoClose = !!config.autoClose;
	this.transitionTimeout = null;
	this.anchored = false;
	this.onDocumentMouseDownHandler = this.onDocumentMouseDown.bind( this );
	this.onDocumentKeyDownHandler = this.onDocumentKeyDown.bind( this );
	this.onTabKeyDownHandler = this.onTabKeyDown.bind( this );
	this.onShiftTabKeyDownHandler = this.onShiftTabKeyDown.bind( this );

	// Initialization
	this.setSize( config.width, config.height );
	this.toggleAnchor( config.anchor === undefined || config.anchor );
	this.setAlignment( config.align || 'center' );
	this.setPosition( config.position || 'below' );
	this.setAutoFlip( config.autoFlip === undefined || config.autoFlip );
	this.setAutoCloseIgnore( config.$autoCloseIgnore );
	this.$body.addClass( 'oo-ui-popupWidget-body' );
	this.$anchor.addClass( 'oo-ui-popupWidget-anchor' );
	this.$popup
		.addClass( 'oo-ui-popupWidget-popup' )
		.append( this.$body );
	this.$element
		.addClass( 'oo-ui-popupWidget' )
		.append( this.$popup, this.$anchor );
	// Move content, which was added to #$element by OO.ui.Widget, to the body
	// FIXME This is gross, we should use '$body' or something for the config
	if ( config.$content instanceof $ ) {
		this.$body.append( config.$content );
	}

	this.padded = !!config.padded;
	if ( config.padded ) {
		this.$body.addClass( 'oo-ui-popupWidget-body-padded' );
	}

	if ( config.head ) {
		if ( !config.hideCloseButton ) {
			this.closeButton = new OO.ui.ButtonWidget( {
				framed: false,
				icon: 'close',
				label: OO.ui.msg( 'ooui-popup-widget-close-button-aria-label' ),
				invisibleLabel: true
			} );
			this.closeButton.connect( this, {
				click: 'onCloseButtonClick'
			} );
		}
		this.$head = $( '<div>' )
			.addClass( 'oo-ui-popupWidget-head' )
			.append( this.$icon, this.$label, this.closeButton && this.closeButton.$element );
		this.$popup.prepend( this.$head );
	}

	if ( config.$footer ) {
		this.$footer = $( '<div>' )
			.addClass( 'oo-ui-popupWidget-footer' )
			.append( config.$footer );
		this.$popup.append( this.$footer );
	}

	// Initially hidden - using #toggle may cause errors if subclasses override toggle with methods
	// that reference properties not initialized at that time of parent class construction
	// TODO: Find a better way to handle post-constructor setup
	this.visible = false;
	this.$element.addClass( 'oo-ui-element-hidden' );
};

/* Setup */

OO.inheritClass( OO.ui.PopupWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.PopupWidget, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.PopupWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.PopupWidget, OO.ui.mixin.ClippableElement );
OO.mixinClass( OO.ui.PopupWidget, OO.ui.mixin.FloatableElement );

/* Events */

/**
 * The popup is ready: it is visible and has been positioned and clipped.
 *
 * @event OO.ui.PopupWidget#ready
 */

/**
 * The popup is no longer visible.
 *
 * @event OO.ui.PopupWidget#closing
 */

/* Methods */

/**
 * Handles document mouse down events.
 *
 * @private
 * @param {MouseEvent} e Mouse down event
 */
OO.ui.PopupWidget.prototype.onDocumentMouseDown = function ( e ) {
	if (
		this.isVisible() &&
		!OO.ui.contains( this.$element.add( this.$autoCloseIgnore ).get(), e.target, true )
	) {
		this.toggle( false );
	}
};

/**
 * Bind document mouse down listener.
 *
 * @private
 */
OO.ui.PopupWidget.prototype.bindDocumentMouseDownListener = function () {
	// Capture clicks outside popup
	this.getElementDocument().addEventListener( 'mousedown', this.onDocumentMouseDownHandler, true );
	// We add 'click' event because iOS safari needs to respond to this event.
	// We can't use 'touchstart' (as is usually the equivalent to 'mousedown') because
	// then it will trigger when scrolling. While iOS Safari has some reported behavior
	// of occasionally not emitting 'click' properly, that event seems to be the standard
	// that it should be emitting, so we add it to this and will operate the event handler
	// on whichever of these events was triggered first
	this.getElementDocument().addEventListener( 'click', this.onDocumentMouseDownHandler, true );
};

/**
 * Handles close button click events.
 *
 * @private
 */
OO.ui.PopupWidget.prototype.onCloseButtonClick = function () {
	if ( this.isVisible() ) {
		this.toggle( false );
	}
};

/**
 * Unbind document mouse down listener.
 *
 * @private
 */
OO.ui.PopupWidget.prototype.unbindDocumentMouseDownListener = function () {
	this.getElementDocument().removeEventListener( 'mousedown', this.onDocumentMouseDownHandler, true );
	this.getElementDocument().removeEventListener( 'click', this.onDocumentMouseDownHandler, true );
};

/**
 * Handles document key down events.
 *
 * @private
 * @param {KeyboardEvent} e Key down event
 */
OO.ui.PopupWidget.prototype.onDocumentKeyDown = function ( e ) {
	if (
		e.which === OO.ui.Keys.ESCAPE &&
		this.isVisible()
	) {
		this.toggle( false );
		e.preventDefault();
		e.stopPropagation();
	}
};

/**
 * Bind document key down listener.
 *
 * @private
 */
OO.ui.PopupWidget.prototype.bindDocumentKeyDownListener = function () {
	this.getElementDocument().addEventListener( 'keydown', this.onDocumentKeyDownHandler, true );
};

/**
 * Unbind document key down listener.
 *
 * @private
 */
OO.ui.PopupWidget.prototype.unbindDocumentKeyDownListener = function () {
	this.getElementDocument().removeEventListener( 'keydown', this.onDocumentKeyDownHandler, true );
};

/**
 * Handles Tab key down events.
 *
 * @private
 * @param {KeyboardEvent} e Key down event
 */
OO.ui.PopupWidget.prototype.onTabKeyDown = function ( e ) {
	if ( !e.shiftKey && e.which === OO.ui.Keys.TAB ) {
		e.preventDefault();
		this.toggle( false );
	}
};

/**
 * Handles Shift + Tab key down events.
 *
 * @private
 * @param {KeyboardEvent} e Key down event
 */
OO.ui.PopupWidget.prototype.onShiftTabKeyDown = function ( e ) {
	if ( e.shiftKey && e.which === OO.ui.Keys.TAB ) {
		e.preventDefault();
		this.toggle( false );
	}
};

/**
 * Show, hide, or toggle the visibility of the anchor.
 *
 * @param {boolean} [show] Show anchor, omit to toggle
 */
OO.ui.PopupWidget.prototype.toggleAnchor = function ( show ) {
	show = show === undefined ? !this.anchored : !!show;

	if ( this.anchored !== show ) {
		this.$element.toggleClass( 'oo-ui-popupWidget-anchored oo-ui-popupWidget-anchored-' + this.anchorEdge, show );
		this.anchored = show;
	}
};

/**
 * Change which edge the anchor appears on.
 *
 * @param {string} edge 'top', 'bottom', 'start' or 'end'
 */
OO.ui.PopupWidget.prototype.setAnchorEdge = function ( edge ) {
	if ( [ 'top', 'bottom', 'start', 'end' ].indexOf( edge ) === -1 ) {
		throw new Error( 'Invalid value for edge: ' + edge );
	}
	if ( this.anchorEdge !== null ) {
		this.$element.removeClass( 'oo-ui-popupWidget-anchored-' + this.anchorEdge );
	}
	this.anchorEdge = edge;
	if ( this.anchored ) {
		this.$element.addClass( 'oo-ui-popupWidget-anchored-' + edge );
	}
};

/**
 * Check if the anchor is visible.
 *
 * @return {boolean} Anchor is visible
 */
OO.ui.PopupWidget.prototype.hasAnchor = function () {
	return this.anchored;
};

/**
 * Toggle visibility of the popup. The popup is initially hidden and must be shown by calling
 * `.toggle( true )` after its #$element is attached to the DOM.
 *
 * Do not show the popup while it is not attached to the DOM. The calculations required to display
 * it in the right place and with the right dimensions only work correctly while it is attached.
 * Side-effects may include broken interface and exceptions being thrown. This wasn't always
 * strictly enforced, so currently it only generates a warning in the browser console.
 *
 * @fires OO.ui.PopupWidget#ready
 * @inheritdoc
 */
OO.ui.PopupWidget.prototype.toggle = function ( show ) {
	show = show === undefined ? !this.isVisible() : !!show;

	const change = show !== this.isVisible();

	if ( show && !this.warnedUnattached && !this.isElementAttached() ) {
		OO.ui.warnDeprecation( 'PopupWidget#toggle: Before calling this method, the popup must be attached to the DOM.' );
		this.warnedUnattached = true;
	}
	if ( show && !this.$floatableContainer && this.isElementAttached() ) {
		// Fall back to the parent node if the floatableContainer is not set
		this.setFloatableContainer( this.$element.parent() );
	}

	if ( change && show && this.autoFlip ) {
		// Reset auto-flipping before showing the popup again. It's possible we no longer need to
		// flip (e.g. if the user scrolled).
		this.isAutoFlipped = false;
	}

	// Parent method
	OO.ui.PopupWidget.super.prototype.toggle.call( this, show );

	if ( change ) {
		this.togglePositioning( show && !!this.$floatableContainer );

		// Find the first and last focusable element in the popup widget
		const $lastFocusableElement = OO.ui.findFocusable( this.$element, true );
		const $firstFocusableElement = OO.ui.findFocusable( this.$element, false );

		if ( show ) {
			if ( this.autoClose ) {
				this.bindDocumentMouseDownListener();
				this.bindDocumentKeyDownListener();

				// Bind a keydown event to the first and last focusable element
				// If user presses the tab key on this item, dismiss the popup and
				// take focus back to the caller, ideally the caller implements this functionality
				// This is to prevent illogical focus order, a common accessibility pitfall.
				// Alternative Fix: Implement focus trap for popup widget.
				$lastFocusableElement.on( 'keydown', this.onTabKeyDownHandler );
				$firstFocusableElement.on( 'keydown', this.onShiftTabKeyDownHandler );
			}
			this.updateDimensions();
			this.toggleClipping( true );

			if ( this.autoFlip ) {
				if ( this.popupPosition === 'above' || this.popupPosition === 'below' ) {
					if ( this.isClippedVertically() || this.isFloatableOutOfView() ) {
						// If opening the popup in the normal direction causes it to be clipped,
						// open in the opposite one instead
						const normalHeight = this.$element.height();
						this.isAutoFlipped = !this.isAutoFlipped;
						this.position();
						if ( this.isClippedVertically() || this.isFloatableOutOfView() ) {
							// If that also causes it to be clipped, open in whichever direction
							// we have more space
							const oppositeHeight = this.$element.height();
							if ( oppositeHeight < normalHeight ) {
								this.isAutoFlipped = !this.isAutoFlipped;
								this.position();
							}
						}
					}
				}
				if ( this.popupPosition === 'before' || this.popupPosition === 'after' ) {
					if ( this.isClippedHorizontally() || this.isFloatableOutOfView() ) {
						// If opening the popup in the normal direction causes it to be clipped,
						// open in the opposite one instead
						const normalWidth = this.$element.width();
						this.isAutoFlipped = !this.isAutoFlipped;
						// Due to T180173 horizontally clipped PopupWidgets have messed up
						// dimensions, which causes positioning to be off. Toggle clipping back and
						// forth to work around.
						this.toggleClipping( false );
						this.position();
						this.toggleClipping( true );
						if ( this.isClippedHorizontally() || this.isFloatableOutOfView() ) {
							// If that also causes it to be clipped, open in whichever direction
							// we have more space
							const oppositeWidth = this.$element.width();
							if ( oppositeWidth < normalWidth ) {
								this.isAutoFlipped = !this.isAutoFlipped;
								// Due to T180173, horizontally clipped PopupWidgets have messed up
								// dimensions, which causes positioning to be off. Toggle clipping
								// back and forth to work around.
								this.toggleClipping( false );
								this.position();
								this.toggleClipping( true );
							}
						}
					}
				}
			}

			this.emit( 'ready' );
		} else {
			this.toggleClipping( false );
			if ( this.autoClose ) {
				// Remove binded keydown event from the first and last focusable elements
				// when popup closes
				$lastFocusableElement.off( 'keydown', this.onTabKeyDownHandler );
				$firstFocusableElement.off( 'keydown', this.onShiftTabKeyDownHandler );

				this.unbindDocumentMouseDownListener();
				this.unbindDocumentKeyDownListener();
			}

			// This is so we can restore focus to the parent when the pop widget dismisses
			// Also, we're emitting an event
			// so we don't have to tie this implementation to the caller.
			// Let the caller handle this details.
			this.emit( 'closing' );
		}
	}

	return this;
};

/**
 * Set the size of the popup.
 *
 * Changing the size may also change the popup's position depending on the alignment.
 *
 * @param {number|null} [width=320] Width in pixels. Pass `null` to use automatic width.
 * @param {number|null} [height=null] Height in pixels. Pass `null` to use automatic height.
 * @param {boolean} [transition=false] Use a smooth transition
 * @chainable
 */
OO.ui.PopupWidget.prototype.setSize = function ( width, height, transition ) {
	this.width = width !== undefined ? width : 320;
	this.height = height !== undefined ? height : null;
	if ( this.isVisible() ) {
		this.updateDimensions( transition );
	}
};

/**
 * Update the size and position.
 *
 * Only use this to keep the popup properly anchored. Use #setSize to change the size, and this will
 * be called automatically.
 *
 * @param {boolean} [transition=false] Use a smooth transition
 * @chainable
 */
OO.ui.PopupWidget.prototype.updateDimensions = function ( transition ) {
	// Prevent transition from being interrupted
	clearTimeout( this.transitionTimeout );
	if ( transition ) {
		// Enable transition
		this.$element.addClass( 'oo-ui-popupWidget-transitioning' );
	}

	this.position();

	if ( transition ) {
		// Prevent transitioning after transition is complete
		this.transitionTimeout = setTimeout( () => {
			this.$element.removeClass( 'oo-ui-popupWidget-transitioning' );
		}, 200 );
	} else {
		// Prevent transitioning immediately
		this.$element.removeClass( 'oo-ui-popupWidget-transitioning' );
	}
};

/**
 * @inheritdoc
 */
OO.ui.PopupWidget.prototype.computePosition = function () {
	const popupPos = {},
		anchorCss = { left: '', right: '', top: '', bottom: '' },
		popupPositionOppositeMap = {
			above: 'below',
			below: 'above',
			before: 'after',
			after: 'before'
		},
		alignMap = {
			ltr: {
				'force-left': 'backwards',
				'force-right': 'forwards'
			},
			rtl: {
				'force-left': 'forwards',
				'force-right': 'backwards'
			}
		},
		anchorEdgeMap = {
			above: 'bottom',
			below: 'top',
			before: 'end',
			after: 'start'
		},
		hPosMap = {
			forwards: 'start',
			center: 'center',
			backwards: this.anchored ? 'before' : 'end'
		},
		vPosMap = {
			forwards: 'top',
			center: 'center',
			backwards: 'bottom'
		};

	if ( !this.$container ) {
		// Lazy-initialize $container if not specified in constructor
		this.$container = $( this.getClosestScrollableElementContainer() );
	}
	const direction = this.$container.css( 'direction' );

	// Set height and width before we do anything else, since it might cause our measurements
	// to change (e.g. due to scrollbars appearing or disappearing), and it also affects centering
	this.setIdealSize(
		// The properties refer to the width of this.$popup, but we set the properties on this.$body
		// to make calculations work out right (T180173), so we subtract padding here.
		this.width !== null ? this.width - ( this.padded ? 24 : 0 ) : 'auto',
		this.height !== null ? this.height - ( this.padded ? 10 : 0 ) : 'auto'
	);

	const align = alignMap[ direction ][ this.align ] || this.align;
	let popupPosition = this.popupPosition;
	if ( this.isAutoFlipped ) {
		popupPosition = popupPositionOppositeMap[ popupPosition ];
	}

	// If the popup is positioned before or after, then the anchor positioning is vertical,
	// otherwise horizontal
	const vertical = popupPosition === 'before' || popupPosition === 'after';
	const start = vertical ? 'top' : ( direction === 'rtl' ? 'right' : 'left' );
	const end = vertical ? 'bottom' : ( direction === 'rtl' ? 'left' : 'right' );
	const near = vertical ? 'top' : 'left';
	const far = vertical ? 'bottom' : 'right';
	const sizeProp = vertical ? 'Height' : 'Width';
	const popupSize = vertical ? this.$popup.height() : this.$popup.width();

	this.setAnchorEdge( anchorEdgeMap[ popupPosition ] );
	this.horizontalPosition = vertical ? popupPosition : hPosMap[ align ];
	this.verticalPosition = vertical ? vPosMap[ align ] : popupPosition;

	// Parent method
	const parentPosition = OO.ui.mixin.FloatableElement.prototype.computePosition.call( this );
	// Find out which property FloatableElement used for positioning, and adjust that value
	const positionProp = vertical ?
		( parentPosition.top !== '' ? 'top' : 'bottom' ) :
		( parentPosition.left !== '' ? 'left' : 'right' );

	// Figure out where the near and far edges of the popup and $floatableContainer are
	const floatablePos = this.$floatableContainer.offset();
	floatablePos[ far ] = floatablePos[ near ] + this.$floatableContainer[ 'outer' + sizeProp ]();
	// Measure where the offsetParent is and compute our position based on that and parentPosition
	const offsetParentPos = this.$element.offsetParent()[ 0 ] === document.documentElement ?
		{ top: 0, left: 0 } :
		this.$element.offsetParent().offset();

	if ( positionProp === near ) {
		popupPos[ near ] = offsetParentPos[ near ] + parentPosition[ near ];
		popupPos[ far ] = popupPos[ near ] + popupSize;
	} else {
		popupPos[ far ] = offsetParentPos[ near ] +
			this.$element.offsetParent()[ 'inner' + sizeProp ]() - parentPosition[ far ];
		popupPos[ near ] = popupPos[ far ] - popupSize;
	}

	let anchorOffset, positionAdjustment;
	if ( this.anchored ) {
		// Position the anchor (which is positioned relative to the popup) to point to
		// $floatableContainer
		const anchorPos = ( floatablePos[ start ] + floatablePos[ end ] ) / 2;
		anchorOffset = ( start === far ? -1 : 1 ) * ( anchorPos - popupPos[ start ] );

		// If the anchor is less than 2*anchorSize from either edge, move the popup to make more
		// space this.$anchor.width()/height() returns 0 because of the CSS trickery we use, so use
		// scrollWidth/Height
		const anchorSize = this.$anchor[ 0 ][ 'scroll' + sizeProp ];
		const anchorMargin = parseFloat( this.$anchor.css( 'margin-' + start ) );
		if ( anchorOffset + anchorMargin < 2 * anchorSize ) {
			// Not enough space for the anchor on the start side; pull the popup startwards
			positionAdjustment = ( positionProp === start ? -1 : 1 ) *
				( 2 * anchorSize - ( anchorOffset + anchorMargin ) );
		} else if ( anchorOffset + anchorMargin > popupSize - 2 * anchorSize ) {
			// Not enough space for the anchor on the end side; pull the popup endwards
			positionAdjustment = ( positionProp === end ? -1 : 1 ) *
				( anchorOffset + anchorMargin - ( popupSize - 2 * anchorSize ) );
		} else {
			positionAdjustment = 0;
		}
	} else {
		positionAdjustment = 0;
	}

	// Check if the popup will go beyond the edge of this.$container
	const containerPos = this.$container[ 0 ] === document.documentElement ?
		{ top: 0, left: 0 } :
		this.$container.offset();
	containerPos[ far ] = containerPos[ near ] + this.$container[ 'inner' + sizeProp ]();
	if ( this.$container[ 0 ] === document.documentElement ) {
		const viewportSpacing = OO.ui.getViewportSpacing();
		containerPos[ near ] += viewportSpacing[ near ];
		containerPos[ far ] -= viewportSpacing[ far ];
	}
	// Take into account how much the popup will move because of the adjustments we're going to make
	popupPos[ near ] += ( positionProp === near ? 1 : -1 ) * positionAdjustment;
	popupPos[ far ] += ( positionProp === near ? 1 : -1 ) * positionAdjustment;
	if ( containerPos[ near ] + this.containerPadding > popupPos[ near ] ) {
		// Popup goes beyond the near (left/top) edge, move it to the right/bottom
		positionAdjustment += ( positionProp === near ? 1 : -1 ) *
			( containerPos[ near ] + this.containerPadding - popupPos[ near ] );
	} else if ( containerPos[ far ] - this.containerPadding < popupPos[ far ] ) {
		// Popup goes beyond the far (right/bottom) edge, move it to the left/top
		positionAdjustment += ( positionProp === far ? 1 : -1 ) *
			( popupPos[ far ] - ( containerPos[ far ] - this.containerPadding ) );
	}

	if ( this.anchored ) {
		// Adjust anchorOffset for positionAdjustment
		anchorOffset += ( positionProp === start ? -1 : 1 ) * positionAdjustment;

		// Position the anchor
		anchorCss[ start ] = anchorOffset;
		this.$anchor.css( anchorCss );
	}

	// Move the popup if needed
	parentPosition[ positionProp ] += positionAdjustment;

	return parentPosition;
};

/**
 * Set popup alignment
 *
 * @param {string} [align=center] Alignment of the popup, `center`, `force-left`, `force-right`,
 *  `backwards` or `forwards`.
 */
OO.ui.PopupWidget.prototype.setAlignment = function ( align ) {
	// Validate alignment
	if ( [ 'force-left', 'force-right', 'backwards', 'forwards', 'center' ].indexOf( align ) > -1 ) {
		this.align = align;
	} else {
		this.align = 'center';
	}
	this.position();
};

/**
 * Get popup alignment
 *
 * @return {string} Alignment of the popup, `center`, `force-left`, `force-right`,
 *  `backwards` or `forwards`.
 */
OO.ui.PopupWidget.prototype.getAlignment = function () {
	return this.align;
};

/**
 * Change the positioning of the popup.
 *
 * @param {string} position 'above', 'below', 'before' or 'after'
 */
OO.ui.PopupWidget.prototype.setPosition = function ( position ) {
	if ( [ 'above', 'below', 'before', 'after' ].indexOf( position ) === -1 ) {
		position = 'below';
	}
	this.popupPosition = position;
	this.position();
};

/**
 * Get popup positioning.
 *
 * @return {string} 'above', 'below', 'before' or 'after'
 */
OO.ui.PopupWidget.prototype.getPosition = function () {
	return this.popupPosition;
};

/**
 * Set popup auto-flipping.
 *
 * @param {boolean} [autoFlip=false] Whether to automatically switch the popup's position between
 *  'above' and 'below', or between 'before' and 'after', if there is not enough space in the
 *  desired direction to display the popup without clipping
 */
OO.ui.PopupWidget.prototype.setAutoFlip = function ( autoFlip ) {
	autoFlip = !!autoFlip;

	if ( this.autoFlip !== autoFlip ) {
		this.autoFlip = autoFlip;
	}
};

/**
 * Set which elements will not close the popup when clicked.
 *
 * For auto-closing popups, clicks on these elements will not cause the popup to auto-close.
 *
 * @param {jQuery} $autoCloseIgnore Elements to ignore for auto-closing
 */
OO.ui.PopupWidget.prototype.setAutoCloseIgnore = function ( $autoCloseIgnore ) {
	this.$autoCloseIgnore = $autoCloseIgnore;
};

/**
 * Get an ID of the body element, this can be used as the
 * `aria-describedby` attribute for an input field.
 *
 * @return {string} The ID of the body element
 */
OO.ui.PopupWidget.prototype.getBodyId = function () {
	let id = this.$body.attr( 'id' );
	if ( id === undefined ) {
		id = OO.ui.generateElementId();
		this.$body.attr( 'id', id );
	}
	return id;
};
