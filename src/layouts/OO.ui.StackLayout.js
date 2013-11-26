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
	var i, len;

	for ( i = 0, len = items.length; i < len; i++ ) {
		if ( !this.currentItem ) {
			this.setItem( items[i] );
		} else if ( !this.continuous ) {
			items[i].$element.hide();
		}
	}
	OO.ui.GroupElement.prototype.addItems.call( this, items, index );

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
	if ( items.indexOf( this.currentItem ) !== -1 ) {
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
	if ( this.items.indexOf( item ) !== -1 ) {
		if ( !this.continuous ) {
			this.$items.hide();
			item.$element.show();
		}
	} else {
		item = null;
	}
	this.currentItem = item;
	this.emit( 'set', item );

	return this;
};
