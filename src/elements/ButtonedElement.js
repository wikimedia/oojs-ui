/**
 * Element with a button.
 *
 * Buttons are used for controls which can be clicked. They can be configured to use tab indexing
 * and access keys for accessibility purposes.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {jQuery} $button Button node, assigned to #$button
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [framed=true] Render button with a frame
 * @cfg {number} [tabIndex=0] Button's tab index, use null to have no tabIndex
 * @cfg {string} [accessKey] Button's access key
 */
OO.ui.ButtonedElement = function OoUiButtonedElement( $button, config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.$button = $button;
	this.tabIndex = null;
	this.framed = null;
	this.active = false;
	this.onMouseUpHandler = OO.ui.bind( this.onMouseUp, this );

	// Events
	this.$button.on( 'mousedown', OO.ui.bind( this.onMouseDown, this ) );

	// Initialization
	this.$element.addClass( 'oo-ui-buttonedElement' );
	this.$button
		.addClass( 'oo-ui-buttonedElement-button' )
		.attr( 'role', 'button' );
	this.setTabIndex( config.tabIndex || 0 );
	this.setAccessKey( config.accessKey );
	this.toggleFramed( config.framed === undefined || config.framed );
};

/* Setup */

OO.initClass( OO.ui.ButtonedElement );

/* Static Properties */

/**
 * Cancel mouse down events.
 *
 * @static
 * @inheritable
 * @property {boolean}
 */
OO.ui.ButtonedElement.static.cancelButtonMouseDownEvents = true;

/* Methods */

/**
 * Handles mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.ButtonedElement.prototype.onMouseDown = function ( e ) {
	if ( this.isDisabled() || e.which !== 1 ) {
		return false;
	}
	// tabIndex should generally be interacted with via the property, but it's not possible to
	// reliably unset a tabIndex via a property so we use the (lowercase) "tabindex" attribute
	this.tabIndex = this.$button.attr( 'tabindex' );
	// Remove the tab-index while the button is down to prevent the button from stealing focus
	this.$button.removeAttr( 'tabindex' );
	this.$element.addClass( 'oo-ui-buttonedElement-pressed' );
	// Run the mouseup handler no matter where the mouse is when the button is let go, so we can
	// reliably reapply the tabindex and remove the pressed class
	this.getElementDocument().addEventListener( 'mouseup', this.onMouseUpHandler, true );
	// Prevent change of focus unless specifically configured otherwise
	if ( this.constructor.static.cancelButtonMouseDownEvents ) {
		return false;
	}
};

/**
 * Handles mouse up events.
 *
 * @param {jQuery.Event} e Mouse up event
 */
OO.ui.ButtonedElement.prototype.onMouseUp = function ( e ) {
	if ( this.isDisabled() || e.which !== 1 ) {
		return false;
	}
	// Restore the tab-index after the button is up to restore the button's accesssibility
	this.$button.attr( 'tabindex', this.tabIndex );
	this.$element.removeClass( 'oo-ui-buttonedElement-pressed' );
	// Stop listening for mouseup, since we only needed this once
	this.getElementDocument().removeEventListener( 'mouseup', this.onMouseUpHandler, true );
};

/**
 * Toggle frame.
 *
 * @param {boolean} [framed] Make button framed, omit to toggle
 * @chainable
 */
OO.ui.ButtonedElement.prototype.toggleFramed = function ( framed ) {
	framed = framed === undefined ? !this.framed : !!framed;
	if ( framed !== this.framed ) {
		this.framed = framed;
		this.$element
			.toggleClass( 'oo-ui-buttonedElement-frameless', !framed )
			.toggleClass( 'oo-ui-buttonedElement-framed', framed );
	}

	return this;
};

/**
 * Set tab index.
 *
 * @param {number|null} tabIndex Button's tab index, use null to remove
 * @chainable
 */
OO.ui.ButtonedElement.prototype.setTabIndex = function ( tabIndex ) {
	if ( typeof tabIndex === 'number' && tabIndex >= 0 ) {
		this.$button.attr( 'tabindex', tabIndex );
	} else {
		this.$button.removeAttr( 'tabindex' );
	}
	return this;
};

/**
 * Set access key
 *
 * @param {string} accessKey Button's access key, use empty string to remove
 * @chainable
 */
OO.ui.ButtonedElement.prototype.setAccessKey = function ( accessKey ) {
	if ( typeof accessKey === 'string' && accessKey.length ) {
		this.$button.attr( 'accesskey', accessKey );
	} else {
		this.$button.removeAttr( 'accesskey' );
	}
	return this;
};

/**
 * Set active state.
 *
 * @param {boolean} [value] Make button active
 * @chainable
 */
OO.ui.ButtonedElement.prototype.setActive = function ( value ) {
	this.$element.toggleClass( 'oo-ui-buttonedElement-active', !!value );
	return this;
};
