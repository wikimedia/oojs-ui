/**
 * Layout containing a series of mutually exclusive pages.
 *
 * @class
 * @extends OO.ui.PanelLayout
 * @mixins OO.ui.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [continuous=false] Show all pages, one after another
 * @cfg {string} [icon=''] Symbolic icon name
 * @cfg {OO.ui.Layout[]} [items] Layouts to add
 */
OO.ui.StackLayout = function OoUiStackLayout( config ) {
	// Config initialization
	config = $.extend( { 'scrollable': true }, config );

	// Parent constructor
	OO.ui.PanelLayout.call( this, config );

	// Mixin constructors
	OO.ui.GroupElement.call( this, this.$element, config );

	// Properties
	this.currentItem = null;
	this.continuous = !!config.continuous;

	// Initialization
	this.$element.addClass( 'oo-ui-stackLayout' );
	if ( this.continuous ) {
		this.$element.addClass( 'oo-ui-stackLayout-continuous' );
	}
	if ( $.isArray( config.items ) ) {
		this.addItems( config.items );
	}
};

/* Inheritance */

OO.inheritClass( OO.ui.StackLayout, OO.ui.PanelLayout );

OO.mixinClass( OO.ui.StackLayout, OO.ui.GroupElement );

/* Events */

/**
 * @event set
 * @param {OO.ui.PanelLayout|null} [item] Current item
 */

/* Methods */

/**
 * Add items.
 *
 * Adding an existing item (by value) will move it.
 *
 * @method
 * @param {OO.ui.PanelLayout[]} items Items to add
 * @param {number} [index] Index to insert items after
 * @chainable
 */
OO.ui.StackLayout.prototype.addItems = function ( items, index ) {
	OO.ui.GroupElement.prototype.addItems.call( this, items, index );

	if ( !this.currentItem && items.length ) {
		this.setItem( items[0] );
	}

	return this;
};

/**
 * Remove items.
 *
 * Items will be detached, not removed, so they can be used later.
 *
 * @method
 * @param {OO.ui.PanelLayout[]} items Items to remove
 * @chainable
 */
OO.ui.StackLayout.prototype.removeItems = function ( items ) {
	OO.ui.GroupElement.prototype.removeItems.call( this, items );
	if ( $.inArray( this.currentItem, items  ) !== -1 ) {
		this.currentItem = null;
		if ( !this.currentItem && this.items.length ) {
			this.setItem( this.items[0] );
		}
	}

	return this;
};

/**
 * Clear all items.
 *
 * Items will be detached, not removed, so they can be used later.
 *
 * @method
 * @chainable
 */
OO.ui.StackLayout.prototype.clearItems = function () {
	this.currentItem = null;
	OO.ui.GroupElement.prototype.clearItems.call( this );

	return this;
};

/**
 * Show item.
 *
 * Any currently shown item will be hidden.
 *
 * @method
 * @param {OO.ui.PanelLayout} item Item to show
 * @chainable
 */
OO.ui.StackLayout.prototype.setItem = function ( item ) {
	if ( item !== this.currentItem ) {
		if ( !this.continuous ) {
			this.$items.css( 'display', '' );
		}
		if ( $.inArray( item, this.items ) !== -1 ) {
			if ( !this.continuous ) {
				item.$element.css( 'display', 'block' );
			}
		} else {
			item = null;
		}
		this.currentItem = item;
		this.emit( 'set', item );
	}

	return this;
};
