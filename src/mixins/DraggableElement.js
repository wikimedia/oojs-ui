/**
 * DraggableElement is a mixin class used to create elements that can be clicked
 * and dragged by a mouse to a new position within a group. This class must be used
 * in conjunction with OO.ui.mixin.DraggableGroupElement, which provides a container for
 * the draggable elements.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {jQuery} [config.$handle] The part of the element which can be used for dragging, defaults to
 *  the whole element
 * @param {boolean} [config.draggable=true] The items are draggable. This can change with #toggleDraggable
 *  but the draggable state should be called from the DraggableGroupElement, which updates
 *  the whole group
 */
OO.ui.mixin.DraggableElement = function OoUiMixinDraggableElement( config ) {
	config = config || {};

	// Properties
	this.index = null;
	this.$handle = config.$handle || this.$element;
	this.wasHandleUsed = null;

	// Initialize and events
	this.$element
		.addClass( 'oo-ui-draggableElement' )
		.on( {
			mousedown: this.onDragMouseDown.bind( this ),
			dragstart: this.onDragStart.bind( this ),
			dragover: this.onDragOver.bind( this ),
			dragend: this.onDragEnd.bind( this ),
			drop: this.onDrop.bind( this )
		} );
	this.$handle.addClass( 'oo-ui-draggableElement-handle' );
	this.toggleDraggable( config.draggable === undefined ? true : !!config.draggable );
};

OO.initClass( OO.ui.mixin.DraggableElement );

/* Events */

/**
 * A dragstart event is emitted when the user clicks and begins dragging an item.
 *
 * @event OO.ui.mixin.DraggableElement#dragstart
 * @param {OO.ui.mixin.DraggableElement} item The item the user has clicked and is dragging with
 *  the mouse.
 */

/**
 * A dragend event is emitted when the user drags an item and releases the mouse,
 * thus terminating the drag operation.
 *
 * @event OO.ui.mixin.DraggableElement#dragend
 */

/**
 * A drop event is emitted when the user drags an item and then releases the mouse button
 * over a valid target.
 *
 * @event OO.ui.mixin.DraggableElement#drop
 */

/* Static Properties */

/**
 * @inheritdoc OO.ui.mixin.ButtonElement
 */
OO.ui.mixin.DraggableElement.static.cancelButtonMouseDownEvents = false;

/* Methods */

/**
 * Change the draggable state of this widget.
 * This allows users to temporarily halt the dragging operations.
 *
 * @param {boolean} [isDraggable] Widget supports draggable operations, omit to toggle
 */
OO.ui.mixin.DraggableElement.prototype.toggleDraggable = function ( isDraggable ) {
	isDraggable = isDraggable !== undefined ? !!isDraggable : !this.draggable;

	if ( this.draggable !== isDraggable ) {
		this.draggable = isDraggable;

		this.$handle.toggleClass( 'oo-ui-draggableElement-undraggable', !this.draggable );

		// We make the entire element draggable, not just the handle, so that
		// the whole element appears to move. wasHandleUsed prevents drags from
		// starting outside the handle
		this.$element.prop( 'draggable', this.draggable );
	}
};

/**
 * Check the draggable state of this widget.
 *
 * @return {boolean} Widget supports draggable operations
 */
OO.ui.mixin.DraggableElement.prototype.isDraggable = function () {
	return this.draggable;
};

/**
 * Respond to mousedown event.
 *
 * @private
 * @param {jQuery.Event} e Drag event
 */
OO.ui.mixin.DraggableElement.prototype.onDragMouseDown = function ( e ) {
	if ( !this.isDraggable() ) {
		return;
	}

	this.wasHandleUsed =
		// Optimization: if the handle is the whole element this is always true
		this.$handle[ 0 ] === this.$element[ 0 ] ||
		// Check the mousedown occurred inside the handle
		OO.ui.contains( this.$handle[ 0 ], e.target, true );
};

/**
 * Respond to dragstart event.
 *
 * @private
 * @param {jQuery.Event} e Drag event
 * @return {boolean} False if the event is cancelled
 * @fires OO.ui.mixin.DraggableElement#dragstart
 */
OO.ui.mixin.DraggableElement.prototype.onDragStart = function ( e ) {
	if ( !this.wasHandleUsed || !this.isDraggable() ) {
		return false;
	}

	const dataTransfer = e.originalEvent.dataTransfer;
	// Define drop effect
	dataTransfer.dropEffect = 'none';
	dataTransfer.effectAllowed = 'move';
	// Support: Firefox
	// We must set up a dataTransfer data property or Firefox seems to
	// ignore the fact the element is draggable.
	try {
		dataTransfer.setData( 'application-x/OOUI-draggable', this.getIndex() );
	} catch ( err ) {
		// The above is only for Firefox. Move on if it fails.
	}

	// Support: Chrome on Android
	if ( !dataTransfer.getData( 'text' ) ) {
		try {
			dataTransfer.setData( 'text', ' ' );
		} catch ( err ) {
			// This try catch exists only out of an abundance of caution,
			// and Chesterton's fence with respect to the try-catch above.
		}
	}

	// Briefly add a 'clone' class to style the browser's native drag image
	this.$element.addClass( 'oo-ui-draggableElement-clone' );
	// Add placeholder class after the browser has rendered the clone
	setTimeout( () => {
		this.$element
			.removeClass( 'oo-ui-draggableElement-clone' )
			.addClass( 'oo-ui-draggableElement-placeholder' );
	} );
	// Emit event
	this.emit( 'dragstart', this );
	return true;
};

/**
 * Respond to dragend event.
 *
 * @private
 * @fires OO.ui.mixin.DraggableElement#dragend
 */
OO.ui.mixin.DraggableElement.prototype.onDragEnd = function () {
	this.$element.removeClass( 'oo-ui-draggableElement-placeholder' );
	this.emit( 'dragend' );
};

/**
 * Handle drop event.
 *
 * @private
 * @param {jQuery.Event} e Drop event
 * @fires OO.ui.mixin.DraggableElement#drop
 */
OO.ui.mixin.DraggableElement.prototype.onDrop = function ( e ) {
	e.preventDefault();
	this.emit( 'drop', e );
};

/**
 * In order for drag/drop to work, the dragover event must
 * return false and stop propogation.
 *
 * @param {jQuery.Event} e Drag event
 * @private
 */
OO.ui.mixin.DraggableElement.prototype.onDragOver = function ( e ) {
	e.preventDefault();
};

/**
 * Set item index.
 * Store it in the DOM so we can access from the widget drag event.
 *
 * @private
 * @param {number} index Item index
 */
OO.ui.mixin.DraggableElement.prototype.setIndex = function ( index ) {
	if ( this.index !== index ) {
		this.index = index;
		this.$element.data( 'index', index );
	}
};

/**
 * Get item index.
 *
 * @private
 * @return {number} Item index
 */
OO.ui.mixin.DraggableElement.prototype.getIndex = function () {
	return this.index;
};
