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
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$button] Button node, assigned to #$button, omit to use a generated `<a>`
 * @cfg {boolean} [framed=true] Render button with a frame
 * @cfg {string} [accessKey] Button's access key
 */
OO.ui.ButtonElement = function OoUiButtonElement( config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.$button = config.$button || this.$( '<a>' );
	this.framed = null;
	this.accessKey = null;
	this.active = false;
	this.onMouseUpHandler = this.onMouseUp.bind( this );
	this.onMouseDownHandler = this.onMouseDown.bind( this );

	// Initialization
	this.$element.addClass( 'oo-ui-buttonElement' );
	this.toggleFramed( config.framed === undefined || config.framed );
	this.setAccessKey( config.accessKey );
	this.setButtonElement( this.$button );
};

/* Setup */

OO.initClass( OO.ui.ButtonElement );

/* Static Properties */

/**
 * Cancel mouse down events.
 *
 * @static
 * @inheritable
 * @property {boolean}
 */
OO.ui.ButtonElement.static.cancelButtonMouseDownEvents = true;

/* Methods */

/**
 * Set the button element.
 *
 * If an element is already set, it will be cleaned up before setting up the new element.
 *
 * @param {jQuery} $button Element to use as button
 */
OO.ui.ButtonElement.prototype.setButtonElement = function ( $button ) {
	if ( this.$button ) {
		this.$button
			.removeClass( 'oo-ui-buttonElement-button' )
			.removeAttr( 'role accesskey' )
			.off( 'mousedown', this.onMouseDownHandler );
	}

	this.$button = $button
		.addClass( 'oo-ui-buttonElement-button' )
		.attr( { role: 'button', accesskey: this.accessKey } )
		.on( 'mousedown', this.onMouseDownHandler );
};

/**
 * Handles mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.ButtonElement.prototype.onMouseDown = function ( e ) {
	if ( this.isDisabled() || e.which !== 1 ) {
		return false;
	}
	this.$element.addClass( 'oo-ui-buttonElement-pressed' );
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
OO.ui.ButtonElement.prototype.onMouseUp = function ( e ) {
	if ( this.isDisabled() || e.which !== 1 ) {
		return false;
	}
	this.$element.removeClass( 'oo-ui-buttonElement-pressed' );
};

/**
 * Check if button has a frame.
 *
 * @return {boolean} Button is framed
 */
OO.ui.ButtonElement.prototype.isFramed = function () {
	return this.framed;
};

/**
 * Toggle frame.
 *
 * @param {boolean} [framed] Make button framed, omit to toggle
 * @chainable
 */
OO.ui.ButtonElement.prototype.toggleFramed = function ( framed ) {
	framed = framed === undefined ? !this.framed : !!framed;
	if ( framed !== this.framed ) {
		this.framed = framed;
		this.$element
			.toggleClass( 'oo-ui-buttonElement-frameless', !framed )
			.toggleClass( 'oo-ui-buttonElement-framed', framed );
		this.updateThemeClasses();
	}

	return this;
};

/**
 * Set access key.
 *
 * @param {string} accessKey Button's access key, use empty string to remove
 * @chainable
 */
OO.ui.ButtonElement.prototype.setAccessKey = function ( accessKey ) {
	accessKey = typeof accessKey === 'string' && accessKey.length ? accessKey : null;

	if ( this.accessKey !== accessKey ) {
		if ( this.$button ) {
			if ( accessKey !== null ) {
				this.$button.attr( 'accesskey', accessKey );
			} else {
				this.$button.removeAttr( 'accesskey' );
			}
		}
		this.accessKey = accessKey;
	}

	return this;
};

/**
 * Set active state.
 *
 * @param {boolean} [value] Make button active
 * @chainable
 */
OO.ui.ButtonElement.prototype.setActive = function ( value ) {
	this.$element.toggleClass( 'oo-ui-buttonElement-active', !!value );
	return this;
};
