/**
 * Element containing a sequence of child elements.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$group] Container node, assigned to #$group, omit to use a generated `<div>`
 */
OO.ui.GroupElement = function OoUiGroupElement( config ) {
	// Configuration intialization
	config = config || {};

	// Properties
	this.$group = null;
	this.items = [];
	this.aggregateItemEvents = {};

	// Initialization
	this.setGroupElement( config.$group || this.$( '<div>' ) );
};

/* Methods */

/**
 * Set the group element.
 *
 * If an element is already set, items will be moved to the new element.
 *
 * @param {jQuery} $group Element to use as group
 */
OO.ui.GroupElement.prototype.setGroupElement = function ( $group ) {
	var i, len;

	this.$group = $group;
	for ( i = 0, len = this.items.length; i < len; i++ ) {
		this.$group.append( this.items[i].$element );
	}
};

/**
 * Check if there are no items.
 *
 * @return {boolean} Group is empty
 */
OO.ui.GroupElement.prototype.isEmpty = function () {
	return !this.items.length;
};

/**
 * Get items.
 *
 * @return {OO.ui.Element[]} Items
 */
OO.ui.GroupElement.prototype.getItems = function () {
	return this.items.slice( 0 );
};

/**
 * Add an aggregate item event.
 *
 * Aggregated events are listened to on each item and then emitted by the group under a new name,
 * and with an additional leading parameter containing the item that emitted the original event.
 * Other arguments that were emitted from the original event are passed through.
 *
 * @param {Object.<string,string|null>} events Aggregate events emitted by group, keyed by item
 *   event, use null value to remove aggregation
 * @throws {Error} If aggregation already exists
 */
OO.ui.GroupElement.prototype.aggregate = function ( events ) {
	var i, len, item, add, remove, itemEvent, groupEvent;

	for ( itemEvent in events ) {
		groupEvent = events[itemEvent];

		// Remove existing aggregated event
		if ( itemEvent in this.aggregateItemEvents ) {
			// Don't allow duplicate aggregations
			if ( groupEvent ) {
				throw new Error( 'Duplicate item event aggregation for ' + itemEvent );
			}
			// Remove event aggregation from existing items
			for ( i = 0, len = this.items.length; i < len; i++ ) {
				item = this.items[i];
				if ( item.connect && item.disconnect ) {
					remove = {};
					remove[itemEvent] = [ 'emit', groupEvent, item ];
					item.disconnect( this, remove );
				}
			}
			// Prevent future items from aggregating event
			delete this.aggregateItemEvents[itemEvent];
		}

		// Add new aggregate event
		if ( groupEvent ) {
			// Make future items aggregate event
			this.aggregateItemEvents[itemEvent] = groupEvent;
			// Add event aggregation to existing items
			for ( i = 0, len = this.items.length; i < len; i++ ) {
				item = this.items[i];
				if ( item.connect && item.disconnect ) {
					add = {};
					add[itemEvent] = [ 'emit', groupEvent, item ];
					item.connect( this, add );
				}
			}
		}
	}
};

/**
 * Add items.
 *
 * Adding an existing item will move it.
 *
 * @param {OO.ui.Element[]} items Items
 * @param {number} [index] Index to insert items at
 * @chainable
 */
OO.ui.GroupElement.prototype.addItems = function ( items, index ) {
	var i, len, item, event, events, currentIndex,
		itemElements = [];

	for ( i = 0, len = items.length; i < len; i++ ) {
		item = items[i];

		// Check if item exists then remove it first, effectively "moving" it
		currentIndex = $.inArray( item, this.items );
		if ( currentIndex >= 0 ) {
			this.removeItems( [ item ] );
			// Adjust index to compensate for removal
			if ( currentIndex < index ) {
				index--;
			}
		}
		// Add the item
		if ( item.connect && item.disconnect && !$.isEmptyObject( this.aggregateItemEvents ) ) {
			events = {};
			for ( event in this.aggregateItemEvents ) {
				events[event] = [ 'emit', this.aggregateItemEvents[event], item ];
			}
			item.connect( this, events );
		}
		item.setElementGroup( this );
		itemElements.push( item.$element.get( 0 ) );
	}

	if ( index === undefined || index < 0 || index >= this.items.length ) {
		this.$group.append( itemElements );
		this.items.push.apply( this.items, items );
	} else if ( index === 0 ) {
		this.$group.prepend( itemElements );
		this.items.unshift.apply( this.items, items );
	} else {
		this.items[index].$element.before( itemElements );
		this.items.splice.apply( this.items, [ index, 0 ].concat( items ) );
	}

	return this;
};

/**
 * Remove items.
 *
 * Items will be detached, not removed, so they can be used later.
 *
 * @param {OO.ui.Element[]} items Items to remove
 * @chainable
 */
OO.ui.GroupElement.prototype.removeItems = function ( items ) {
	var i, len, item, index, remove, itemEvent;

	// Remove specific items
	for ( i = 0, len = items.length; i < len; i++ ) {
		item = items[i];
		index = $.inArray( item, this.items );
		if ( index !== -1 ) {
			if (
				item.connect && item.disconnect &&
				!$.isEmptyObject( this.aggregateItemEvents )
			) {
				remove = {};
				if ( itemEvent in this.aggregateItemEvents ) {
					remove[itemEvent] = [ 'emit', this.aggregateItemEvents[itemEvent], item ];
				}
				item.disconnect( this, remove );
			}
			item.setElementGroup( null );
			this.items.splice( index, 1 );
			item.$element.detach();
		}
	}

	return this;
};

/**
 * Clear all items.
 *
 * Items will be detached, not removed, so they can be used later.
 *
 * @chainable
 */
OO.ui.GroupElement.prototype.clearItems = function () {
	var i, len, item, remove, itemEvent;

	// Remove all items
	for ( i = 0, len = this.items.length; i < len; i++ ) {
		item = this.items[i];
		if (
			item.connect && item.disconnect &&
			!$.isEmptyObject( this.aggregateItemEvents )
		) {
			remove = {};
			if ( itemEvent in this.aggregateItemEvents ) {
				remove[itemEvent] = [ 'emit', this.aggregateItemEvents[itemEvent], item ];
			}
			item.disconnect( this, remove );
		}
		item.setElementGroup( null );
		item.$element.detach();
	}

	this.items = [];
	return this;
};
