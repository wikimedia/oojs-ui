/**
 * Element containing a label.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$label] Label node, assigned to #$label, omit to use a generated `<span>`
 * @cfg {jQuery|string|Function} [label] Label nodes, text or a function that returns nodes or text
 * @cfg {boolean} [autoFitLabel=true] Whether to fit the label or not.
 */
OO.ui.LabelElement = function OoUiLabelElement( config ) {
	// Config intialization
	config = config || {};

	// Properties
	this.$label = null;
	this.label = null;
	this.autoFitLabel = config.autoFitLabel === undefined || !!config.autoFitLabel;

	// Initialization
	this.setLabel( config.label || this.constructor.static.label );
	this.setLabelElement( config.$label || this.$( '<span>' ) );
};

/* Setup */

OO.initClass( OO.ui.LabelElement );

/* Static Properties */

/**
 * Label.
 *
 * @static
 * @inheritable
 * @property {string|Function|null} Label text; a function that returns nodes or text; or null for
 *  no label
 */
OO.ui.LabelElement.static.label = null;

/* Methods */

/**
 * Set the label element.
 *
 * If an element is already set, it will be cleaned up before setting up the new element.
 *
 * @param {jQuery} $label Element to use as label
 */
OO.ui.LabelElement.prototype.setLabelElement = function ( $label ) {
	if ( this.$label ) {
		this.$label.removeClass( 'oo-ui-labelElement-label' ).empty();
	}

	this.$label = $label.addClass( 'oo-ui-labelElement-label' );
	this.setLabelContent( this.label );
};

/**
 * Set the label.
 *
 * An empty string will result in the label being hidden. A string containing only whitespace will
 * be converted to a single `&nbsp;`.
 *
 * @param {jQuery|string|Function|null} label Label nodes; text; a function that returns nodes or
 *  text; or null for no label
 * @chainable
 */
OO.ui.LabelElement.prototype.setLabel = function ( label ) {
	label = typeof label === 'function' ? OO.ui.resolveMsg( label ) : label;
	label = ( typeof label === 'string' && label.length ) || label instanceof jQuery ? label : null;

	if ( this.label !== label ) {
		if ( this.$label ) {
			this.setLabelContent( label );
		}
		this.label = label;
	}

	this.$element.toggleClass( 'oo-ui-labelElement', !!this.label );

	return this;
};

/**
 * Get the label.
 *
 * @return {jQuery|string|Function|null} label Label nodes; text; a function that returns nodes or
 *  text; or null for no label
 */
OO.ui.LabelElement.prototype.getLabel = function () {
	return this.label;
};

/**
 * Fit the label.
 *
 * @chainable
 */
OO.ui.LabelElement.prototype.fitLabel = function () {
	if ( this.$label && this.$label.autoEllipsis && this.autoFitLabel ) {
		this.$label.autoEllipsis( { hasSpan: false, tooltip: true } );
	}

	return this;
};

/**
 * Set the content of the label.
 *
 * Do not call this method until after the label element has been set by #setLabelElement.
 *
 * @private
 * @param {jQuery|string|Function|null} label Label nodes; text; a function that returns nodes or
 *  text; or null for no label
 */
OO.ui.LabelElement.prototype.setLabelContent = function ( label ) {
	if ( typeof label === 'string' ) {
		if ( label.match( /^\s*$/ ) ) {
			// Convert whitespace only string to a single non-breaking space
			this.$label.html( '&nbsp;' );
		} else {
			this.$label.text( label );
		}
	} else if ( label instanceof jQuery ) {
		this.$label.empty().append( label );
	} else {
		this.$label.empty();
	}
	this.$label.css( 'display', !label ? 'none' : '' );
};
