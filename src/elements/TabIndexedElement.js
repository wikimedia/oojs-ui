/**
 * Element supporting "sequential focus navigation" using the 'tabindex' attribute.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$tabIndexed] tabIndexed node, assigned to #$tabIndexed, omit to use #$element
 * @cfg {number|Function} [tabIndex=0] Tab index value. Use 0 to use default ordering, use -1 to
 *  prevent tab focusing. (default: 0)
 */
OO.ui.TabIndexedElement = function OoUiTabIndexedElement( config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.$tabIndexed = null;
	this.tabIndex = null;

	// Events
	this.connect( this, { disable: 'onDisable' } );

	// Initialization
	this.setTabIndex( config.tabIndex || 0 );
	this.setTabIndexedElement( config.$tabIndexed || this.$element );
};

/* Setup */

OO.initClass( OO.ui.TabIndexedElement );

/* Methods */

/**
 * Set the element with 'tabindex' attribute.
 *
 * If an element is already set, it will be cleaned up before setting up the new element.
 *
 * @param {jQuery} $tabIndexed Element to set tab index on
 */
OO.ui.TabIndexedElement.prototype.setTabIndexedElement = function ( $tabIndexed ) {
	if ( this.$tabIndexed ) {
		this.$tabIndexed.removeAttr( 'tabindex aria-disabled' );
	}

	this.$tabIndexed = $tabIndexed;
	if ( this.tabIndex !== null ) {
		this.$tabIndexed.attr( {
			// Do not index over disabled elements
			tabindex: this.isDisabled() ? -1 : this.tabIndex,
			// ChromeVox and NVDA do not seem to inherit this from parent elements
			'aria-disabled': this.isDisabled().toString()
		} );
	}
};

/**
 * Set tab index value.
 *
 * @param {number|null} tabIndex Tab index value or null for no tabIndex
 * @chainable
 */
OO.ui.TabIndexedElement.prototype.setTabIndex = function ( tabIndex ) {
	tabIndex = typeof tabIndex === 'number' ? tabIndex : null;

	if ( this.tabIndex !== tabIndex ) {
		if ( this.$tabIndexed ) {
			if ( tabIndex !== null ) {
				this.$tabIndexed.attr( {
					// Do not index over disabled elements
					tabindex: this.isDisabled() ? -1 : tabIndex,
					// ChromeVox and NVDA do not seem to inherit this from parent elements
					'aria-disabled': this.isDisabled().toString()
				} );
			} else {
				this.$tabIndexed.removeAttr( 'tabindex aria-disabled' );
			}
		}
		this.tabIndex = tabIndex;
	}

	return this;
};

/**
 * Handle disable events.
 *
 * @param {boolean} disabled Element is disabled
 */
OO.ui.TabIndexedElement.prototype.onDisable = function ( disabled ) {
	if ( this.$tabIndexed && this.tabIndex !== null ) {
		this.$tabIndexed.attr( {
			// Do not index over disabled elements
			tabindex: disabled ? -1 : this.tabIndex,
			// ChromeVox and NVDA do not seem to inherit this from parent elements
			'aria-disabled': disabled.toString()
		} );
	}
};

/**
 * Get tab index value.
 *
 * @return {number} Tab index value
 */
OO.ui.TabIndexedElement.prototype.getTabIndex = function () {
	return this.tabIndex;
};
