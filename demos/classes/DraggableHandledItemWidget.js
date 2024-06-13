/**
 * Drag/drop items with custom handle
 *
 * @param {Object} [config] Configuration options
 */
Demo.DraggableHandledItemWidget = function DemoDraggableHandledItemWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	Demo.DraggableHandledItemWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.DraggableElement.call( this, Object.assign( { $handle: this.$icon }, config ) );
};

/* Setup */
OO.inheritClass( Demo.DraggableHandledItemWidget, Demo.SimpleWidget );
OO.mixinClass( Demo.DraggableHandledItemWidget, OO.ui.mixin.DraggableElement );
