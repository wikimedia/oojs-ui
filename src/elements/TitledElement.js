/**
 * Element with a title.
 *
 * Titles are rendered by the browser and are made visible when hovering the element. Titles are
 * not visible on touch devices.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$titled] Titled node, assigned to #$titled, omit to use #$element
 * @cfg {string|Function} [title] Title text or a function that returns text. If not provided, the
 *    static property 'title' is used.
 */
OO.ui.TitledElement = function OoUiTitledElement( config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.$titled = null;
	this.title = null;

	// Initialization
	this.setTitle( config.title || this.constructor.static.title );
	this.setTitledElement( config.$titled || this.$element );
};

/* Setup */

OO.initClass( OO.ui.TitledElement );

/* Static Properties */

/**
 * Title.
 *
 * @static
 * @inheritable
 * @property {string|Function} Title text or a function that returns text
 */
OO.ui.TitledElement.static.title = null;

/* Methods */

/**
 * Set the titled element.
 *
 * If an element is already set, it will be cleaned up before setting up the new element.
 *
 * @param {jQuery} $titled Element to set title on
 */
OO.ui.TitledElement.prototype.setTitledElement = function ( $titled ) {
	if ( this.$titled ) {
		this.$titled.removeAttr( 'title' );
	}

	this.$titled = $titled;
	if ( this.title ) {
		this.$titled.attr( 'title', this.title );
	}
};

/**
 * Set title.
 *
 * @param {string|Function|null} title Title text, a function that returns text or null for no title
 * @chainable
 */
OO.ui.TitledElement.prototype.setTitle = function ( title ) {
	title = typeof title === 'string' ? OO.ui.resolveMsg( title ) : null;

	if ( this.title !== title ) {
		if ( this.$titled ) {
			if ( title !== null ) {
				this.$titled.attr( 'title', title );
			} else {
				this.$titled.removeAttr( 'title' );
			}
		}
		this.title = title;
	}

	return this;
};

/**
 * Get title.
 *
 * @return {string} Title string
 */
OO.ui.TitledElement.prototype.getTitle = function () {
	return this.title;
};
