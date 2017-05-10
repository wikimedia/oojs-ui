/**
 * The TabIndexedElement class is an attribute mixin used to add additional functionality to an
 * element created by another class. The mixin provides a ‘tabIndex’ property, which specifies the
 * order in which users will navigate through the focusable elements via the "tab" key.
 *
 *     @example
 *     // TabIndexedElement is mixed into the ButtonWidget class
 *     // to provide a tabIndex property.
 *     var button1 = new OO.ui.ButtonWidget( {
 *         label: 'fourth',
 *         tabIndex: 4
 *     } );
 *     var button2 = new OO.ui.ButtonWidget( {
 *         label: 'second',
 *         tabIndex: 2
 *     } );
 *     var button3 = new OO.ui.ButtonWidget( {
 *         label: 'third',
 *         tabIndex: 3
 *     } );
 *     var button4 = new OO.ui.ButtonWidget( {
 *         label: 'first',
 *         tabIndex: 1
 *     } );
 *     $( 'body' ).append( button1.$element, button2.$element, button3.$element, button4.$element );
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$tabIndexed] The element that should use the tabindex functionality. By default,
 *  the functionality is applied to the element created by the class ($element). If a different element is specified, the tabindex
 *  functionality will be applied to it instead.
 * @cfg {number|null} [tabIndex=0] Number that specifies the element’s position in the tab-navigation
 *  order (e.g., 1 for the first focusable element). Use 0 to use the default navigation order; use -1
 *  to remove the element from the tab-navigation flow.
 */
OO.ui.mixin.TabIndexedElement = function OoUiMixinTabIndexedElement( config ) {
	// Configuration initialization
	config = $.extend( { tabIndex: 0 }, config );

	// Properties
	this.$tabIndexed = null;
	this.tabIndex = null;

	// Events
	this.connect( this, { disable: 'onTabIndexedElementDisable' } );

	// Initialization
	this.setTabIndex( config.tabIndex );
	this.setTabIndexedElement( config.$tabIndexed || this.$element );
};

/* Setup */

OO.initClass( OO.ui.mixin.TabIndexedElement );

/* Methods */

/**
 * Set the element that should use the tabindex functionality.
 *
 * This method is used to retarget a tabindex mixin so that its functionality applies
 * to the specified element. If an element is currently using the functionality, the mixin’s
 * effect on that element is removed before the new element is set up.
 *
 * @param {jQuery} $tabIndexed Element that should use the tabindex functionality
 * @chainable
 */
OO.ui.mixin.TabIndexedElement.prototype.setTabIndexedElement = function ( $tabIndexed ) {
	var tabIndex = this.tabIndex;
	// Remove attributes from old $tabIndexed
	this.setTabIndex( null );
	// Force update of new $tabIndexed
	this.$tabIndexed = $tabIndexed;
	this.tabIndex = tabIndex;
	return this.updateTabIndex();
};

/**
 * Set the value of the tabindex.
 *
 * @param {number|null} tabIndex Tabindex value, or `null` for no tabindex
 * @chainable
 */
OO.ui.mixin.TabIndexedElement.prototype.setTabIndex = function ( tabIndex ) {
	tabIndex = typeof tabIndex === 'number' ? tabIndex : null;

	if ( this.tabIndex !== tabIndex ) {
		this.tabIndex = tabIndex;
		this.updateTabIndex();
	}

	return this;
};

/**
 * Update the `tabindex` attribute, in case of changes to tab index or
 * disabled state.
 *
 * @private
 * @chainable
 */
OO.ui.mixin.TabIndexedElement.prototype.updateTabIndex = function () {
	if ( this.$tabIndexed ) {
		if ( this.tabIndex !== null ) {
			// Do not index over disabled elements
			this.$tabIndexed.attr( {
				tabindex: this.isDisabled() ? -1 : this.tabIndex,
				// Support: ChromeVox and NVDA
				// These do not seem to inherit aria-disabled from parent elements
				'aria-disabled': this.isDisabled().toString()
			} );
		} else {
			this.$tabIndexed.removeAttr( 'tabindex aria-disabled' );
		}
	}
	return this;
};

/**
 * Handle disable events.
 *
 * @private
 * @param {boolean} disabled Element is disabled
 */
OO.ui.mixin.TabIndexedElement.prototype.onTabIndexedElementDisable = function () {
	this.updateTabIndex();
};

/**
 * Get the value of the tabindex.
 *
 * @return {number|null} Tabindex value
 */
OO.ui.mixin.TabIndexedElement.prototype.getTabIndex = function () {
	return this.tabIndex;
};

/**
 * Get an ID of a focusable element of this widget, if any, to be used for `<label for>` value.
 *
 * If the element already has an ID then that is returned, otherwise unique ID is
 * generated, set on the element, and returned.
 *
 * @return {string|null} The ID of the focusable element
 */
OO.ui.mixin.TabIndexedElement.prototype.getInputId = function () {
	var id;

	if ( !this.$tabIndexed ) {
		return null;
	}
	if ( !this.isLabelableNode( this.$tabIndexed ) ) {
		return null;
	}

	id = this.$tabIndexed.attr( 'id' );
	if ( id === undefined ) {
		id = OO.ui.generateElementId();
		this.$tabIndexed.attr( 'id', id );
	}

	return id;
};

/**
 * Whether the node is 'labelable' according to the HTML spec
 * (i.e., whether it can be interacted with through a `<label for="…">`).
 * See: <https://html.spec.whatwg.org/multipage/forms.html#category-label>.
 *
 * @private
 * @param {jQuery} $node
 * @return {boolean}
 */
OO.ui.mixin.TabIndexedElement.prototype.isLabelableNode = function ( $node ) {
	var
		labelableTags = [ 'button', 'meter', 'output', 'progress', 'select', 'textarea' ],
		tagName = $node.prop( 'tagName' ).toLowerCase();

	if ( tagName === 'input' && $node.attr( 'type' ) !== 'hidden' ) {
		return true;
	}
	if ( labelableTags.indexOf( tagName ) !== -1 ) {
		return true;
	}
	return false;
};

/**
 * Focus this element.
 *
 * @chainable
 */
OO.ui.mixin.TabIndexedElement.prototype.focus = function () {
	if ( !this.isDisabled() ) {
		this.$tabIndexed.focus();
	}
	return this;
};

/**
 * Blur this element.
 *
 * @chainable
 */
OO.ui.mixin.TabIndexedElement.prototype.blur = function () {
	this.$tabIndexed.blur();
	return this;
};
