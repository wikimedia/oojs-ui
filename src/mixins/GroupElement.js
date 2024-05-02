/**
 * Any OOUI widget that contains other widgets (such as {@link OO.ui.ButtonWidget buttons} or
 * {@link OO.ui.OptionWidget options}) mixes in GroupElement. Adding, removing, and clearing
 * items from the group is done through the interface the class provides.
 * For more information, please see the [OOUI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Elements/Groups
 *
 * @abstract
 * @mixes OO.EmitterList
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {jQuery} [config.$group] The container element created by the class. If this configuration
 *  is omitted, the group element will use a generated `<div>`.
 */
OO.ui.mixin.GroupElement = function OoUiMixinGroupElement( config ) {
	// Configuration initialization
	config = config || {};

	// Mixin constructors
	OO.EmitterList.call( this, config );

	// Properties
	this.$group = null;

	// Initialization
	this.setGroupElement( config.$group || $( '<div>' ) );
};

/* Setup */

OO.mixinClass( OO.ui.mixin.GroupElement, OO.EmitterList );

/* Events */

/**
 * A change event is emitted when the set of selected items changes.
 *
 * @event OO.ui.mixin.GroupElement#change
 * @param {OO.ui.Element[]} items Items currently in the group
 */

/* Methods */

/**
 * Set the group element.
 *
 * If an element is already set, items will be moved to the new element.
 *
 * @param {jQuery} $group Element to use as group
 */
OO.ui.mixin.GroupElement.prototype.setGroupElement = function ( $group ) {
	this.$group = $group;
	for ( let i = 0, len = this.items.length; i < len; i++ ) {
		this.$group.append( this.items[ i ].$element );
	}
};

/**
 * Find an item by its data.
 *
 * Only the first item with matching data will be returned. To return all matching items,
 * use the #findItemsFromData method.
 *
 * @param {any} data Item data to search for
 * @return {OO.ui.Element|null} Item with equivalent data, `null` if none exists
 */
OO.ui.mixin.GroupElement.prototype.findItemFromData = function ( data ) {
	const hash = OO.getHash( data );

	for ( let i = 0, len = this.items.length; i < len; i++ ) {
		const item = this.items[ i ];
		if ( hash === OO.getHash( item.getData() ) ) {
			return item;
		}
	}

	return null;
};

/**
 * Find items by their data.
 *
 * All items with matching data will be returned. To return only the first match, use the
 * #findItemFromData method instead.
 *
 * @param {any} data Item data to search for
 * @return {OO.ui.Element[]} Items with equivalent data
 */
OO.ui.mixin.GroupElement.prototype.findItemsFromData = function ( data ) {
	const hash = OO.getHash( data ),
		items = [];

	for ( let i = 0, len = this.items.length; i < len; i++ ) {
		const item = this.items[ i ];
		if ( hash === OO.getHash( item.getData() ) ) {
			items.push( item );
		}
	}

	return items;
};

/**
 * Add items to the group.
 *
 * Items will be added to the end of the group array unless the optional `index` parameter
 * specifies a different insertion point. Adding an existing item will move it to the end of the
 * array or the point specified by the `index`.
 *
 * @param {OO.ui.Element|OO.ui.Element[]} [items] Elements to add to the group
 * @param {number} [index] Index of the insertion point
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.mixin.GroupElement.prototype.addItems = function ( items, index ) {
	if ( !items || items.length === 0 ) {
		return this;
	}

	// Mixin method
	OO.EmitterList.prototype.addItems.call( this, items, index );

	this.emit( 'change', this.getItems() );
	return this;
};

/**
 * Move an item from its current position to a new index.
 *
 * The item is expected to exist in the list. If it doesn't,
 * the method will throw an exception.
 *
 * See https://doc.wikimedia.org/oojs/master/OO.EmitterList.html
 *
 * @private
 * @param {OO.EventEmitter} items Item to add
 * @param {number} newIndex Index to move the item to
 * @return {number} The index the item was moved to
 * @throws {Error} If item is not in the list
 */
OO.ui.mixin.GroupElement.prototype.moveItem = function ( items, newIndex ) {
	// insertItemElements expects this.items to not have been modified yet, so call before the mixin
	this.insertItemElements( items, newIndex );

	// Mixin method
	newIndex = OO.EmitterList.prototype.moveItem.call( this, items, newIndex );

	return newIndex;
};

/**
 * Utility method to insert an item into the list, and
 * connect it to aggregate events.
 *
 * Don't call this directly unless you know what you're doing.
 * Use #addItems instead.
 *
 * This method can be extended in child classes to produce
 * different behavior when an item is inserted. For example,
 * inserted items may also be attached to the DOM or may
 * interact with some other nodes in certain ways. Extending
 * this method is allowed, but if overridden, the aggregation
 * of events must be preserved, or behavior of emitted events
 * will be broken.
 *
 * If you are extending this method, please make sure the
 * parent method is called.
 *
 * See https://doc.wikimedia.org/oojs/master/OO.EmitterList.html
 *
 * @protected
 * @param {OO.EventEmitter|Object} item Item to add
 * @param {number} index Index to add items at
 * @return {number} The index the item was added at
 */
OO.ui.mixin.GroupElement.prototype.insertItem = function ( item, index ) {
	item.setElementGroup( this );
	this.insertItemElements( item, index );

	// Mixin method
	index = OO.EmitterList.prototype.insertItem.call( this, item, index );

	return index;
};

/**
 * Insert elements into the group
 *
 * @private
 * @param {OO.ui.Element} item Item to insert
 * @param {number} index Insertion index
 */
OO.ui.mixin.GroupElement.prototype.insertItemElements = function ( item, index ) {
	if ( index === undefined || index < 0 || index >= this.items.length ) {
		this.$group.append( item.$element );
	} else if ( index === 0 ) {
		this.$group.prepend( item.$element );
	} else {
		this.items[ index ].$element.before( item.$element );
	}
};

/**
 * Remove the specified items from a group.
 *
 * Removed items are detached (not removed) from the DOM so that they may be reused.
 * To remove all items from a group, you may wish to use the #clearItems method instead.
 *
 * @param {OO.ui.Element[]} items An array of items to remove
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.mixin.GroupElement.prototype.removeItems = function ( items ) {
	if ( items.length === 0 ) {
		return this;
	}

	// Remove specific items elements
	for ( let i = 0, len = items.length; i < len; i++ ) {
		const item = items[ i ];
		const index = this.items.indexOf( item );
		if ( index !== -1 ) {
			item.setElementGroup( null );
			item.$element.detach();
		}
	}

	// Mixin method
	OO.EmitterList.prototype.removeItems.call( this, items );

	this.emit( 'change', this.getItems() );
	return this;
};

/**
 * Clear all items from the group.
 *
 * Cleared items are detached from the DOM, not removed, so that they may be reused.
 * To remove only a subset of items from a group, use the #removeItems method.
 *
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.mixin.GroupElement.prototype.clearItems = function () {
	// Remove all item elements
	for ( let i = 0, len = this.items.length; i < len; i++ ) {
		this.items[ i ].setElementGroup( null );
		this.items[ i ].$element.detach();
	}

	// Mixin method
	OO.EmitterList.prototype.clearItems.call( this );

	this.emit( 'change', this.getItems() );
	return this;
};
