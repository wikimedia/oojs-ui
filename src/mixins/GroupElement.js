/**
 * Any OOjs UI widget that contains other widgets (such as {@link OO.ui.ButtonWidget buttons} or
 * {@link OO.ui.OptionWidget options}) mixes in GroupElement. Adding, removing, and clearing
 * items from the group is done through the interface the class provides.
 * For more information, please see the [OOjs UI documentation on MediaWiki] [1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Elements/Groups
 *
 * @abstract
 * @class
 * @mixins OO.EmitterList
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$group] The container element created by the class. If this configuration
 *  is omitted, the group element will use a generated `<div>`.
 */
OO.ui.mixin.GroupElement = function OoUiMixinGroupElement( config ) {
	// Configuration initialization
	config = config || {};

	// Mixin constructors
	OO.EmitterList.call( this );

	// Properties
	this.$group = null;

	// Initialization
	this.setGroupElement( config.$group || $( '<div>' ) );
};

OO.mixinClass( OO.ui.mixin.GroupElement, OO.EmitterList );

/* Events */

/**
 * @event change
 *
 * A change event is emitted when the set of selected items changes.
 *
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
	var i, len;

	this.$group = $group;
	for ( i = 0, len = this.items.length; i < len; i++ ) {
		this.$group.append( this.items[ i ].$element );
	}
};

/**
 * Get an item by its data.
 *
 * Only the first item with matching data will be returned. To return all matching items,
 * use the #getItemsFromData method.
 *
 * @param {Object} data Item data to search for
 * @return {OO.ui.Element|null} Item with equivalent data, `null` if none exists
 */
OO.ui.mixin.GroupElement.prototype.getItemFromData = function ( data ) {
	var i, len, item,
		hash = OO.getHash( data );

	for ( i = 0, len = this.items.length; i < len; i++ ) {
		item = this.items[ i ];
		if ( hash === OO.getHash( item.getData() ) ) {
			return item;
		}
	}

	return null;
};

/**
 * Get items by their data.
 *
 * All items with matching data will be returned. To return only the first match, use the #getItemFromData method instead.
 *
 * @param {Object} data Item data to search for
 * @return {OO.ui.Element[]} Items with equivalent data
 */
OO.ui.mixin.GroupElement.prototype.getItemsFromData = function ( data ) {
	var i, len, item,
		hash = OO.getHash( data ),
		items = [];

	for ( i = 0, len = this.items.length; i < len; i++ ) {
		item = this.items[ i ];
		if ( hash === OO.getHash( item.getData() ) ) {
			items.push( item );
		}
	}

	return items;
};

/**
 * @inheritdoc
 */
OO.ui.mixin.GroupElement.prototype.addItems = function ( items, index ) {
	// Mixin method
	OO.EmitterList.prototype.addItems.call( this, items, index );

	// Event
	this.emit( 'change', this.getItems() );

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.mixin.GroupElement.prototype.moveItem = function ( item, newIndex ) {
	// Get the normalized index for the move by calling the parent
	var index = OO.EmitterList.prototype.insertItem.call( this, item, newIndex );

	this.attachElementToDom( item, index );
};

/**
 * @inheritdoc
 */
OO.ui.mixin.GroupElement.prototype.insertItem = function ( item, index ) {
	// Get the normalized index for the move by calling the parent
	index = OO.EmitterList.prototype.insertItem.call( this, item, index );

	item.setElementGroup( this );
	this.attachElementToDom( item, index );

	return index;
};

/**
 * Attach the item element into the DOM in its proper place.
 *
 * @private
 * @param {OO.EventEmitter} item Item
 * @param {number} index Insertion index
 */
OO.ui.mixin.GroupElement.prototype.attachElementToDom = function ( item, index ) {
	if ( index === undefined || index < 0 || index >= this.items.length - 1 ) {
		this.$group.append( item.$element.get( 0 ) );
	} else {
		this.items[ index + 1 ].$element.before( item.$element.get( 0 ) );
	}
};

/**
 * @inheritdoc
 */
OO.ui.mixin.GroupElement.prototype.removeItems = function ( items ) {
	var i, item, index;

	if ( !Array.isArray( items ) ) {
		items = [ items ];
	}

	if ( items.length > 0 ) {
		// Remove specific items
		for ( i = 0; i < items.length; i++ ) {
			item = items[ i ];
			index = this.items.indexOf( item );
			if ( index !== -1 ) {
				item.setElementGroup( null );
				item.$element.detach();
			}
		}
	}

	// Mixin method
	OO.EmitterList.prototype.removeItems.call( this, items );

	// Event
	this.emit( 'change', this.getItems() );

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.mixin.GroupElement.prototype.clearItems = function () {
	var i, len, item;

	for ( i = 0, len = this.items.length; i < len; i++ ) {
		item = this.items[ i ];
		item.setElementGroup( null );
		item.$element.detach();
	}

	// Mixin method
	OO.EmitterList.prototype.clearItems.call( this );

	// Event
	this.emit( 'change', this.getItems() );

	return this;
};
