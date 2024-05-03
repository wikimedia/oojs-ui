/**
 * DraggableGroupElement is a mixin class used to create a group element to
 * contain draggable elements, which are items that can be clicked and dragged by a mouse.
 * The class is used with OO.ui.mixin.DraggableElement.
 *
 * @abstract
 * @class
 * @mixes OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {OO.ui.mixin.DraggableElement[]} config.items
 * @param {string} [config.orientation='vertical'] Item orientation: 'horizontal' or 'vertical'.
 *  The orientation should match the layout of the items. Items displayed in a single row
 *  or in several rows should use horizontal orientation. The vertical orientation should only be
 *  used when the items are displayed in a single column.
 * @param {boolean} [config.draggable=true] The items are draggable. This can change with #toggleDraggable
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
	this.draggable = config.draggable === undefined ? true : !!config.draggable;

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
	this.addItems( config.items || [] );
	this.$element
		.addClass( 'oo-ui-draggableGroupElement' )
		.toggleClass( 'oo-ui-draggableGroupElement-horizontal', this.orientation === 'horizontal' );
};

/* Setup */
OO.mixinClass( OO.ui.mixin.DraggableGroupElement, OO.ui.mixin.GroupElement );

/* Events */

/**
 * An item has been dragged to a new position, but not yet dropped.
 *
 * @event OO.ui.mixin.DraggableGroupElement#drag
 * @param {OO.ui.mixin.DraggableElement} item Dragged item
 * @param {number} [newIndex] New index for the item
 */

/**
 * An item has been dropped at a new position.
 *
 * @event OO.ui.mixin.DraggableGroupElement#reorder
 * @param {OO.ui.mixin.DraggableElement} item Reordered item
 * @param {number} [newIndex] New index for the item
 */

/**
 * Draggable state of this widget has changed.
 *
 * @event OO.ui.mixin.DraggableGroupElement#draggable
 * @param {boolean} [draggable] Widget is draggable
 */

/* Methods */

/**
 * Change the draggable state of this widget.
 * This allows users to temporarily halt the dragging operations.
 *
 * @param {boolean} [isDraggable] Widget supports draggable operations, omit to toggle
 * @fires OO.ui.mixin.DraggableGroupElement#draggable
 */
OO.ui.mixin.DraggableGroupElement.prototype.toggleDraggable = function ( isDraggable ) {
	isDraggable = isDraggable !== undefined ? !!isDraggable : !this.draggable;

	if ( this.draggable !== isDraggable ) {
		this.draggable = isDraggable;

		// Tell the items their draggable state changed
		this.getItems().forEach( ( item ) => {
			item.toggleDraggable( this.draggable );
		} );

		// Emit event
		this.emit( 'draggable', this.draggable );
	}
};

/**
 * Check the draggable state of this widget
 *
 * @return {boolean} Widget supports draggable operations
 */
OO.ui.mixin.DraggableGroupElement.prototype.isDraggable = function () {
	return this.draggable;
};

/**
 * Respond to item drag start event
 *
 * @private
 * @param {OO.ui.mixin.DraggableElement} item Dragged item
 */
OO.ui.mixin.DraggableGroupElement.prototype.onItemDragStart = function ( item ) {
	if ( !this.isDraggable() ) {
		return;
	}
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
	// Map the index of each object
	for ( let i = 0, len = this.itemsOrder.length; i < len; i++ ) {
		this.itemsOrder[ i ].setIndex( i );
	}
};

/**
 * Handle drop or dragend event and switch the order of the items accordingly
 *
 * @private
 * @param {OO.ui.mixin.DraggableElement} item Dropped item
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.mixin.DraggableGroupElement.prototype.onItemDropOrDragEnd = function () {
	const item = this.getDragItem();

	// TODO: Figure out a way to configure a list of legally droppable
	// elements even if they are not yet in the list
	if ( item ) {
		const originalIndex = this.items.indexOf( item );
		// If the item has moved forward, add one to the index to account for the left shift
		const targetIndex = item.getIndex() + ( item.getIndex() > originalIndex ? 1 : 0 );
		if ( targetIndex !== originalIndex ) {
			this.reorder( this.getDragItem(), targetIndex );
			this.emit( 'reorder', this.getDragItem(), targetIndex );
		}
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
 * @param {jQuery.Event} e Dragover event
 * @fires OO.ui.mixin.DraggableGroupElement#reorder
 */
OO.ui.mixin.DraggableGroupElement.prototype.onDragOver = function ( e ) {
	const item = this.getDragItem(),
		dragItemIndex = item.getIndex();

	// Get the OptionWidget item we are dragging over
	const overIndex = $( e.target ).closest( '.oo-ui-draggableElement' ).data( 'index' );

	if ( overIndex !== undefined && overIndex !== dragItemIndex ) {
		const targetIndex = overIndex + ( overIndex > dragItemIndex ? 1 : 0 );

		if ( targetIndex > 0 ) {
			this.$group.children().eq( targetIndex - 1 ).after( item.$element );
		} else {
			this.$group.prepend( item.$element );
		}
		// Move item in itemsOrder array
		this.itemsOrder.splice( overIndex, 0,
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
	if ( this.dragItem !== item ) {
		this.dragItem = item;
		this.$element.on( 'dragover', this.onDragOver.bind( this ) );
		this.$element.addClass( 'oo-ui-draggableGroupElement-dragging' );
	}
};

/**
 * Unset the current dragged item
 */
OO.ui.mixin.DraggableGroupElement.prototype.unsetDragItem = function () {
	if ( this.dragItem ) {
		this.dragItem = null;
		this.$element.off( 'dragover' );
		this.$element.removeClass( 'oo-ui-draggableGroupElement-dragging' );
	}
};

/**
 * Get the item that is currently being dragged.
 *
 * @return {OO.ui.mixin.DraggableElement|null} The currently dragged item, or `null` if no item is
 *  being dragged
 */
OO.ui.mixin.DraggableGroupElement.prototype.getDragItem = function () {
	return this.dragItem;
};
