/**
 * Set of controls for an OO.ui.OutlineWidget.
 *
 * Controls include moving items up and down, removing items, and adding different kinds of items.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.GroupElement
 * @mixins OO.ui.IconedElement
 *
 * @constructor
 * @param {OO.ui.OutlineWidget} outline Outline to control
 * @param {Object} [config] Configuration options
 */
OO.ui.OutlineControlsWidget = function OoUiOutlineControlsWidget( outline, config ) {
	// Configuration initialization
	config = $.extend( { 'icon': 'add-item' }, config );

	// Parent constructor
	OO.ui.OutlineControlsWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.GroupElement.call( this, this.$( '<div>' ), config );
	OO.ui.IconedElement.call( this, this.$( '<div>' ), config );

	// Properties
	this.outline = outline;
	this.$movers = this.$( '<div>' );
	this.upButton = new OO.ui.ButtonWidget( {
		'$': this.$,
		'framed': false,
		'icon': 'collapse',
		'title': OO.ui.msg( 'ooui-outline-control-move-up' )
	} );
	this.downButton = new OO.ui.ButtonWidget( {
		'$': this.$,
		'framed': false,
		'icon': 'expand',
		'title': OO.ui.msg( 'ooui-outline-control-move-down' )
	} );
	this.removeButton = new OO.ui.ButtonWidget( {
		'$': this.$,
		'framed': false,
		'icon': 'remove',
		'title': OO.ui.msg( 'ooui-outline-control-remove' )
	} );

	// Events
	outline.connect( this, {
		'select': 'onOutlineChange',
		'add': 'onOutlineChange',
		'remove': 'onOutlineChange'
	} );
	this.upButton.connect( this, { 'click': [ 'emit', 'move', -1 ] } );
	this.downButton.connect( this, { 'click': [ 'emit', 'move', 1 ] } );
	this.removeButton.connect( this, { 'click': [ 'emit', 'remove' ] } );

	// Initialization
	this.$element.addClass( 'oo-ui-outlineControlsWidget' );
	this.$group.addClass( 'oo-ui-outlineControlsWidget-items' );
	this.$movers
		.addClass( 'oo-ui-outlineControlsWidget-movers' )
		.append( this.removeButton.$element, this.upButton.$element, this.downButton.$element );
	this.$element.append( this.$icon, this.$group, this.$movers );
};

/* Setup */

OO.inheritClass( OO.ui.OutlineControlsWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.OutlineControlsWidget, OO.ui.GroupElement );
OO.mixinClass( OO.ui.OutlineControlsWidget, OO.ui.IconedElement );

/* Events */

/**
 * @event move
 * @param {number} places Number of places to move
 */

/**
 * @event remove
 */

/* Methods */

/**
 * Handle outline change events.
 */
OO.ui.OutlineControlsWidget.prototype.onOutlineChange = function () {
	var i, len, firstMovable, lastMovable,
		items = this.outline.getItems(),
		selectedItem = this.outline.getSelectedItem(),
		movable = selectedItem && selectedItem.isMovable(),
		removable = selectedItem && selectedItem.isRemovable();

	if ( movable ) {
		i = -1;
		len = items.length;
		while ( ++i < len ) {
			if ( items[i].isMovable() ) {
				firstMovable = items[i];
				break;
			}
		}
		i = len;
		while ( i-- ) {
			if ( items[i].isMovable() ) {
				lastMovable = items[i];
				break;
			}
		}
	}
	this.upButton.setDisabled( !movable || selectedItem === firstMovable );
	this.downButton.setDisabled( !movable || selectedItem === lastMovable );
	this.removeButton.setDisabled( !removable );
};
