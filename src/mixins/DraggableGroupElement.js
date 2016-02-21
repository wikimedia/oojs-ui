/**
 * DraggableGroupElement is a mixin class used to create a group element to
 * contain draggable elements, which are items that can be clicked and dragged by a mouse.
 * The class is used with OO.ui.mixin.DraggableElement.
 *
 * @abstract
 * @class
 * @mixins OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [orientation] Item orientation: 'horizontal' or 'vertical'. The orientation
 *  should match the layout of the items. Items displayed in a single row
 *  or in several rows should use horizontal orientation. The vertical orientation should only be
 *  used when the items are displayed in a single column. Defaults to 'vertical'
 */
OO.ui.mixin.DraggableGroupElement = function OoUiMixinDraggableGroupElement( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.mixin.GroupElement.call( this, config );

	// Properties
	this.orientation = config.orientation || 'vertical';
	this.dragItem = null;
	this.itemKeys = {};
	this.dir = null;
	this.itemsOrder = null;

	// Events
	this.aggregate( {
		dragstart: 'itemDragStart',
		dragend: 'itemDragEnd',
		drop: 'itemDrop'
	} );
	this.connect( this, {
		itemDragStart: 'onItemDragStart',
		itemDrop: 'onItemDropOrDragEnd',
		itemDragEnd: 'onItemDropOrDragEnd'
	} );

	// Initialize
	if ( Array.isArray( config.items ) ) {
		this.addItems( config.items );
	}
	this.$element
		.addClass( 'oo-ui-draggableGroupElement' )
		.append( this.$status )
		.toggleClass( 'oo-ui-draggableGroupElement-horizontal', this.orientation === 'horizontal' );
};

/* Setup */
OO.mixinClass( OO.ui.mixin.DraggableGroupElement, OO.ui.mixin.GroupElement );

/* Events */

/**
 * An item has been dragged to a new position, but not yet dropped.
 *
 * @event drag
 * @param {OO.ui.mixin.DraggableElement} item Dragged item
 * @param {number} [newIndex] New index for the item
 */

/**
 * And item has been dropped at a new position.
 *
 * @event reorder
 * @param {OO.ui.mixin.DraggableElement} item Reordered item
 * @param {number} [newIndex] New index for the item
 */

/* Methods */

/**
 * Respond to item drag start event
 *
 * @private
 * @param {OO.ui.mixin.DraggableElement} item Dragged item
 */
OO.ui.mixin.DraggableGroupElement.prototype.onItemDragStart = function ( item ) {
	// Make a shallow copy of this.items so we can re-order it during previews
	// without affecting the original array.
	this.itemsOrder = this.items.slice();
	this.updateIndexes();
	if ( this.orientation === 'horizontal' ) {
		// Calculate and cache directionality on drag start - it's a little
		// expensive and it shouldn't change while dragging.
		this.dir = this.$element.css( 'direction' );
	}
	this.setDragItem( item );
};

/**
 * Update the index properties of the items
 */
OO.ui.mixin.DraggableGroupElement.prototype.updateIndexes = function () {
	var i, len;

	// Map the index of each object
	for ( i = 0, len = this.itemsOrder.length; i < len; i++ ) {
		this.itemsOrder[ i ].setIndex( i );
	}
};

/**
 * Handle drop or dragend event and switch the order of the items accordingly
 *
 * @private
 * @param {OO.ui.mixin.DraggableElement} item Dropped item
 */
OO.ui.mixin.DraggableGroupElement.prototype.onItemDropOrDragEnd = function () {
	var targetIndex, originalIndex,
		item = this.getDragItem();

	// TODO: Figure out a way to configure a list of legally droppable
	// elements even if they are not yet in the list
	if ( item ) {
		originalIndex = this.items.indexOf( item );
		// If the item has moved forward, add one to the index to account for the left shift
		targetIndex = item.getIndex() + ( item.getIndex() > originalIndex ? 1 : 0 );
		this.reorder( this.getDragItem(), targetIndex );
		this.emit( 'reorder', this.getDragItem(), targetIndex );
		this.updateIndexes();
	}
	this.unsetDragItem();
	// Return false to prevent propogation
	return false;
};

/**
 * Respond to dragover event
 *
 * @private
 * @param {jQuery.Event} event Dragover event
 * @fires reorder
 */
OO.ui.mixin.DraggableGroupElement.prototype.onDragOver = function ( e ) {
	var dragOverObj, $optionWidget, itemOffset, itemMidpoint, itemBoundingRect,
		itemSize, cssOutput, dragPosition, overIndex, itemPosition, after,
		targetIndex = null,
		item = this.getDragItem(),
		dragItemIndex = item.getIndex(),
		clientX = e.originalEvent.clientX,
		clientY = e.originalEvent.clientY;

	// Get the OptionWidget item we are dragging over
	dragOverObj = this.getElementDocument().elementFromPoint( clientX, clientY );
	$optionWidget = $( dragOverObj ).closest( '.oo-ui-draggableElement' );
	if ( $optionWidget[ 0 ] ) {
		itemOffset = $optionWidget.offset();
		itemBoundingRect = $optionWidget[ 0 ].getBoundingClientRect();
		itemPosition = $optionWidget.position();
		overIndex = $optionWidget.data( 'index' );
	}

	if (
		itemOffset &&
		overIndex !== dragItemIndex
	) {
		if ( this.orientation === 'horizontal' ) {
			// Calculate where the mouse is relative to the item width
			itemSize = itemBoundingRect.width;
			itemMidpoint = itemBoundingRect.left + itemSize / 2;
			dragPosition = clientX;
			// Which side of the item we hover over will dictate
			// where to drop the selected item, on the left or
			// on the right
			cssOutput = {
				left: dragPosition < itemMidpoint ? itemPosition.left : itemPosition.left + itemSize,
				top: itemPosition.top
			};
		} else {
			// Calculate where the mouse is relative to the item height
			itemSize = itemBoundingRect.height;
			itemMidpoint = itemBoundingRect.top + itemSize / 2;
			dragPosition = clientY;
			// Which side of the item we hover over will dictate
			// where to drop the selected item, on the top or
			// on the bottom
			cssOutput = {
				top: dragPosition < itemMidpoint ? itemPosition.top : itemPosition.top + itemSize,
				left: itemPosition.left
			};
		}
		// Store whether we are before or after an item to rearrange
		// For horizontal layout, we need to account for RTL, as this is flipped
		if ( this.orientation === 'horizontal' && this.dir === 'rtl' ) {
			after = dragPosition < itemMidpoint;
		} else {
			after = dragPosition > itemMidpoint;
		}
		targetIndex = overIndex + ( after ? 1 : 0 );
		// Check the targetIndex isn't immediately to the left or right of the current item (a no-op)
		if ( targetIndex === dragItemIndex || targetIndex === dragItemIndex + 1 ) {
			targetIndex = null;
		}
	}
	if ( targetIndex !== null ) {
		if ( targetIndex > 0 ) {
			this.$group.children().eq( targetIndex - 1 ).after( item.$element );
		} else {
			this.$group.prepend( item.$element );
		}
		// Move item in itemsOrder array. Needs to account for left shift if the item is moved forward.
		this.itemsOrder.splice( targetIndex - ( targetIndex > dragItemIndex ? 1 : 0 ), 0,
			this.itemsOrder.splice( dragItemIndex, 1 )[ 0 ]
		);
		this.updateIndexes();
		this.emit( 'drag', item, targetIndex );
	}
	// Prevent default
	e.preventDefault();
};

/**
 * Reorder the items in the group
 *
 * @param {OO.ui.mixin.DraggableElement} item Reordered item
 * @param {number} newIndex New index
 */
OO.ui.mixin.DraggableGroupElement.prototype.reorder = function ( item, newIndex ) {
	this.addItems( [ item ], newIndex );
};

/**
 * Set a dragged item
 *
 * @param {OO.ui.mixin.DraggableElement} item Dragged item
 */
OO.ui.mixin.DraggableGroupElement.prototype.setDragItem = function ( item ) {
	this.dragItem = item;
	this.$element.on( 'dragover', this.onDragOver.bind( this ) );
	this.$element.addClass( 'oo-ui-draggableGroupElement-dragging' );
};

/**
 * Unset the current dragged item
 */
OO.ui.mixin.DraggableGroupElement.prototype.unsetDragItem = function () {
	this.dragItem = null;
	this.$element.off( 'dragover' );
	this.$element.removeClass( 'oo-ui-draggableGroupElement-dragging' );
};

/**
 * Get the item that is currently being dragged.
 *
 * @return {OO.ui.mixin.DraggableElement|null} The currently dragged item, or `null` if no item is being dragged
 */
OO.ui.mixin.DraggableGroupElement.prototype.getDragItem = function () {
	return this.dragItem;
};
