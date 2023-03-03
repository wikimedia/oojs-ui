/**
 * StackLayouts contain a series of {@link OO.ui.PanelLayout panel layouts}. By default, only one
 * panel is displayed at a time, though the stack layout can also be configured to show all
 * contained panels, one after another, by setting the #continuous option to 'true'.
 *
 *     @example
 *     // A stack layout with two panels, configured to be displayed continuously
 *     var myStack = new OO.ui.StackLayout( {
 *         items: [
 *             new OO.ui.PanelLayout( {
 *                 $content: $( '<p>Panel One</p>' ),
 *                 padded: true,
 *                 framed: true
 *             } ),
 *             new OO.ui.PanelLayout( {
 *                 $content: $( '<p>Panel Two</p>' ),
 *                 padded: true,
 *                 framed: true
 *             } )
 *         ],
 *         continuous: true
 *     } );
 *     $( document.body ).append( myStack.$element );
 *
 * @class
 * @extends OO.ui.PanelLayout
 * @mixins OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [continuous=false] Show all panels, one after another. By default, only one panel
 *  is displayed at a time.
 * @cfg {OO.ui.Layout[]} [items] Panel layouts to add to the stack layout.
 * @cfg {boolean} [hideUntilFound] Hide panels using hidden="until-found", meaning they will be
 *  shown when matched with the browser's find-and-replace feature if supported.
 */
OO.ui.StackLayout = function OoUiStackLayout( config ) {
	// Configuration initialization
	// Make the layout scrollable in continuous mode, otherwise each
	// panel is responsible for its own scrolling.
	config = $.extend( { scrollable: !!( config && config.continuous ) }, config );

	// Parent constructor
	OO.ui.StackLayout.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.GroupElement.call( this, $.extend( { $group: this.$element }, config ) );

	// Properties
	this.currentItem = null;
	this.continuous = !!config.continuous;
	this.hideUntilFound = !!config.hideUntilFound;

	// Initialization
	this.$element.addClass( 'oo-ui-stackLayout' );
	if ( this.continuous ) {
		this.$element.addClass( 'oo-ui-stackLayout-continuous' );
	}
	this.addItems( config.items || [] );
};

/* Setup */

OO.inheritClass( OO.ui.StackLayout, OO.ui.PanelLayout );
OO.mixinClass( OO.ui.StackLayout, OO.ui.mixin.GroupElement );

/* Events */

/**
 * A 'set' event is emitted when panels are {@link #addItems added}, {@link #removeItems removed},
 * {@link #clearItems cleared} or {@link #setItem displayed}.
 *
 * @event set
 * @param {OO.ui.Layout|null} item Current panel or `null` if no panel is shown
 */

/* Methods */

/**
 * Get the current panel.
 *
 * @return {OO.ui.Layout|null}
 */
OO.ui.StackLayout.prototype.getCurrentItem = function () {
	return this.currentItem;
};

/**
 * Unset the current item.
 *
 * @private
 * @param {OO.ui.StackLayout} layout
 * @fires set
 */
OO.ui.StackLayout.prototype.unsetCurrentItem = function () {
	var prevItem = this.currentItem;
	if ( prevItem === null ) {
		return;
	}

	this.currentItem = null;
	this.emit( 'set', null );
};

/**
 * Set the hideUntilFound config (see contructor)
 *
 * @param {boolean} hideUntilFound
 */
OO.ui.StackLayout.prototype.setHideUntilFound = function ( hideUntilFound ) {
	this.hideUntilFound = hideUntilFound;
	// Force an update of the attributes used to hide/show items
	this.updateHiddenState( this.items, this.currentItem );
};

/**
 * Add panel layouts to the stack layout.
 *
 * Panels will be added to the end of the stack layout array unless the optional index parameter
 * specifies a different insertion point. Adding a panel that is already in the stack will move it
 * to the end of the array or the point specified by the index.
 *
 * @param {OO.ui.Layout[]} [items] Panels to add
 * @param {number} [index] Index of the insertion point
 * @chainable
 * @return {OO.ui.StackLayout} The layout, for chaining
 */
OO.ui.StackLayout.prototype.addItems = function ( items, index ) {
	if ( !items || items.length === 0 ) {
		return this;
	}

	// Update the visibility
	this.updateHiddenState( items, this.currentItem );

	// Mixin method
	OO.ui.mixin.GroupElement.prototype.addItems.call( this, items, index );

	if ( !this.currentItem ) {
		this.setItem( items[ 0 ] );
	}

	return this;
};

/**
 * Remove the specified panels from the stack layout.
 *
 * Removed panels are detached from the DOM, not removed, so that they may be reused. To remove all
 * panels, you may wish to use the #clearItems method instead.
 *
 * @param {OO.ui.Layout[]} itemsToRemove Panels to remove
 * @chainable
 * @return {OO.ui.StackLayout} The layout, for chaining
 * @fires set
 */
OO.ui.StackLayout.prototype.removeItems = function ( itemsToRemove ) {
	var isCurrentItemRemoved = itemsToRemove.indexOf( this.currentItem ) !== -1;

	var nextItem;
	if ( isCurrentItemRemoved ) {
		var i = this.items.indexOf( this.currentItem );
		do {
			nextItem = this.items[ ++i ];
		} while ( nextItem && itemsToRemove.indexOf( nextItem ) !== -1 );
	}

	// Mixin method
	OO.ui.mixin.GroupElement.prototype.removeItems.call( this, itemsToRemove );

	if ( isCurrentItemRemoved ) {
		if ( this.items.length ) {
			this.setItem( nextItem || this.items[ this.items.length - 1 ] );
		} else {
			this.unsetCurrentItem();
		}
	}

	return this;
};

/**
 * Clear all panels from the stack layout.
 *
 * Cleared panels are detached from the DOM, not removed, so that they may be reused. To remove only
 * a subset of panels, use the #removeItems method.
 *
 * @chainable
 * @return {OO.ui.StackLayout} The layout, for chaining
 * @fires set
 */
OO.ui.StackLayout.prototype.clearItems = function () {
	this.unsetCurrentItem();
	OO.ui.mixin.GroupElement.prototype.clearItems.call( this );

	return this;
};

/**
 * Show the specified panel.
 *
 * If another panel is currently displayed, it will be hidden.
 *
 * @param {OO.ui.Layout} item Panel to show
 * @chainable
 * @return {OO.ui.StackLayout} The layout, for chaining
 * @fires set
 */
OO.ui.StackLayout.prototype.setItem = function ( item ) {
	if ( item !== this.currentItem ) {
		this.updateHiddenState( this.items, item );

		if ( this.items.indexOf( item ) !== -1 ) {
			this.currentItem = item;
			this.emit( 'set', item );
		} else {
			this.unsetCurrentItem();
		}
	}

	return this;
};

/**
 * Reset the scroll offset of all panels, or the container if continuous
 *
 * @inheritdoc
 */
OO.ui.StackLayout.prototype.resetScroll = function () {
	if ( this.continuous ) {
		// Parent method
		return OO.ui.StackLayout.super.prototype.resetScroll.call( this );
	}
	// Reset each panel
	this.getItems().forEach( function ( panel ) {
		// eslint-disable-next-line no-jquery/no-class-state
		var hidden = panel.$element.hasClass( 'oo-ui-element-hidden' );
		// Scroll can only be reset when panel is visible
		panel.$element.removeClass( 'oo-ui-element-hidden' );
		panel.resetScroll();
		if ( hidden ) {
			panel.$element.addClass( 'oo-ui-element-hidden' );
		}
	} );

	return this;
};

/**
 * Update the visibility of all items in case of non-continuous view.
 *
 * Ensure all items are hidden except for the selected one.
 * This method does nothing when the stack is continuous.
 *
 * @private
 * @param {OO.ui.Layout[]} items Item list iterate over
 * @param {OO.ui.Layout} [selectedItem] Selected item to show
 */
OO.ui.StackLayout.prototype.updateHiddenState = function ( items, selectedItem ) {
	if ( !this.continuous ) {
		for ( var i = 0, len = items.length; i < len; i++ ) {
			if ( !selectedItem || selectedItem !== items[ i ] ) {
				// jQuery "fixes" the value of the hidden attribute to always be "hidden"
				// Browsers which don't support 'until-found' will still hide the element
				items[ i ].$element[ 0 ].setAttribute( 'hidden', this.hideUntilFound ? 'until-found' : 'hidden' );
				items[ i ].$element.attr( 'aria-hidden', 'true' );
			}
		}
		if ( selectedItem ) {
			selectedItem.$element[ 0 ].removeAttribute( 'hidden' );
			selectedItem.$element.removeAttr( 'aria-hidden' );
		}
	}
};
