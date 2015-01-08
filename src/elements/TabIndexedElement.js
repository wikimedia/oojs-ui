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
		this.$tabIndexed.removeAttr( 'tabindex' );
	}

	this.$tabIndexed = $tabIndexed;
	if ( this.tabIndex !== null ) {
		this.$tabIndexed.attr( 'tabindex', this.tabIndex );
	}
};

/**
 * Set tab index value.
 *
 * @param {number|null} tabIndex Tab index value or null for no tabIndex
 * @chainable
 */
OO.ui.TabIndexedElement.prototype.setTabIndex = function ( tabIndex ) {
	tabIndex = typeof tabIndex === 'number' && tabIndex >= 0 ? tabIndex : null;

	if ( this.tabIndex !== tabIndex ) {
		if ( this.$tabIndexed ) {
			if ( tabIndex !== null ) {
				this.$tabIndexed.attr( 'tabindex', tabIndex );
			} else {
				this.$tabIndexed.removeAttr( 'tabindex' );
			}
		}
		this.tabIndex = tabIndex;
	}

	return this;
};

/**
 * Get tab index value.
 *
 * @return {number} Tab index value
 */
OO.ui.TabIndexedElement.prototype.getTabIndex = function () {
	return this.tabIndex;
};
