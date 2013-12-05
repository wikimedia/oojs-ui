/**
 * Element containing a sequence of child elements.
 *
 * @class
 * @abstract
 *
 * @constructor
 * @param {jQuery} $group Container node, assigned to #$group
 * @param {Object} [config] Configuration options
 * @cfg {Object.<string,string>} [aggregations] Events to aggregate, keyed by item event name
 */
OO.ui.GroupElement = function OoUiGroupElement( $group, config ) {
	// Configuration
	config = config || {};

	// Properties
	this.$group = $group;
	this.items = [];
	this.$items = this.$( [] );
	this.aggregate = !$.isEmptyObject( config.aggregations );
	this.aggregations = config.aggregations || {};
};

/* Methods */

/**
 * Get items.
 *
 * @method
 * @returns {OO.ui.Element[]} Items
 */
OO.ui.GroupElement.prototype.getItems = function () {
	return this.items.slice( 0 );
};

/**
 * Add items.
 *
 * @method
 * @param {OO.ui.Element[]} items Item
 * @param {number} [index] Index to insert items after
 * @chainable
 */
OO.ui.GroupElement.prototype.addItems = function ( items, index ) {
	var i, len, item, event, events, currentIndex,
		$items = this.$( [] );

	for ( i = 0, len = items.length; i < len; i++ ) {
		item = items[i];

		// Check if item exists then remove it first, effectively "moving" it
		currentIndex = this.items.indexOf( item );
		if ( currentIndex >= 0 ) {
			this.removeItems( [ item ] );
			// Adjust index to compensate for removal
			if ( currentIndex < index ) {
				index--;
			}
		}
		// Add the item
		if ( this.aggregate ) {
			events = {};
			for ( event in this.aggregations ) {
				events[event] = [ 'emit', this.aggregations[event], item ];
			}
			item.connect( this, events );
		}
		$items = $items.add( item.$element );
	}

	if ( index === undefined || index < 0 || index >= this.items.length ) {
		this.$group.append( $items );
		this.items.push.apply( this.items, items );
	} else if ( index === 0 ) {
		this.$group.prepend( $items );
		this.items.unshift.apply( this.items, items );
	} else {
		this.$items.eq( index ).before( $items );
		this.items.splice.apply( this.items, [ index, 0 ].concat( items ) );
	}

	this.$items = this.$items.add( $items );

	return this;
};

/**
 * Remove items.
 *
 * Items will be detached, not removed, so they can be used later.
 *
 * @method
 * @param {OO.ui.Element[]} items Items to remove
 * @chainable
 */
OO.ui.GroupElement.prototype.removeItems = function ( items ) {
	var i, len, item, index;

	// Remove specific items
	for ( i = 0, len = items.length; i < len; i++ ) {
		item = items[i];
		index = this.items.indexOf( item );
		if ( index !== -1 ) {
			if ( this.aggregate ) {
				item.disconnect( this );
			}
			this.items.splice( index, 1 );
			item.$element.detach();
			this.$items = this.$items.not( item.$element );
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
OO.ui.GroupElement.prototype.clearItems = function () {
	var i, len, item;

	// Remove all items
	if ( this.aggregate ) {
		for ( i = 0, len = this.items.length; i < len; i++ ) {
			item.disconnect( this );
		}
	}
	this.items = [];
	this.$items.detach();
	this.$items = this.$( [] );
};
