/**
 * A mixin for an element that can be dragged and dropped.
 * Use in conjunction with DragGroupWidget
 *
 * @abstract
 * @class
 *
 * @constructor
 */
OO.ui.DraggableElement = function OoUiDraggableElement() {
	// Properties
	this.index = null;

	// Initialize and events
	this.$element
		.attr( 'draggable', true )
		.addClass( 'oo-ui-draggableElement' )
		.on( {
			dragstart: this.onDragStart.bind( this ),
			dragover: this.onDragOver.bind( this ),
			dragend: this.onDragEnd.bind( this ),
			drop: this.onDrop.bind( this )
		} );
};

OO.initClass( OO.ui.DraggableElement );

/* Events */

/**
 * @event dragstart
 * @param {OO.ui.DraggableElement} item Dragging item
 */

/**
 * @event dragend
 */

/**
 * @event drop
 */

/* Static Properties */

/**
 * @inheritdoc OO.ui.ButtonElement
 */
OO.ui.DraggableElement.static.cancelButtonMouseDownEvents = false;

/* Methods */

/**
 * Respond to dragstart event.
 * @param {jQuery.Event} event jQuery event
 * @fires dragstart
 */
OO.ui.DraggableElement.prototype.onDragStart = function ( e ) {
	var dataTransfer = e.originalEvent.dataTransfer;
	// Define drop effect
	dataTransfer.dropEffect = 'none';
	dataTransfer.effectAllowed = 'move';
	// We must set up a dataTransfer data property or Firefox seems to
	// ignore the fact the element is draggable.
	try {
		dataTransfer.setData( 'application-x/OOjs-UI-draggable', this.getIndex() );
	} catch ( err ) {
		// The above is only for firefox. No need to set a catch clause
		// if it fails, move on.
	}
	// Add dragging class
	this.$element.addClass( 'oo-ui-draggableElement-dragging' );
	// Emit event
	this.emit( 'dragstart', this );
	return true;
};

/**
 * Respond to dragend event.
 * @fires dragend
 */
OO.ui.DraggableElement.prototype.onDragEnd = function () {
	this.$element.removeClass( 'oo-ui-draggableElement-dragging' );
	this.emit( 'dragend' );
};

/**
 * Handle drop event.
 * @param {jQuery.Event} event jQuery event
 * @fires drop
 */
OO.ui.DraggableElement.prototype.onDrop = function ( e ) {
	e.preventDefault();
	this.emit( 'drop', e );
};

/**
 * In order for drag/drop to work, the dragover event must
 * return false and stop propogation.
 */
OO.ui.DraggableElement.prototype.onDragOver = function ( e ) {
	e.preventDefault();
};

/**
 * Set item index.
 * Store it in the DOM so we can access from the widget drag event
 * @param {number} Item index
 */
OO.ui.DraggableElement.prototype.setIndex = function ( index ) {
	if ( this.index !== index ) {
		this.index = index;
		this.$element.data( 'index', index );
	}
};

/**
 * Get item index
 * @return {number} Item index
 */
OO.ui.DraggableElement.prototype.getIndex = function () {
	return this.index;
};
