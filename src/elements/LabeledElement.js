/**
 * Element containing a label.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {jQuery} $label Label node, assigned to #$label
 * @param {Object} [config] Configuration options
 * @cfg {jQuery|string|Function} [label] Label nodes, text or a function that returns nodes or text
 * @cfg {boolean} [autoFitLabel=true] Whether to fit the label or not.
 */
OO.ui.LabeledElement = function OoUiLabeledElement( $label, config ) {
	// Config intialization
	config = config || {};

	// Properties
	this.$label = $label;
	this.label = null;

	// Initialization
	this.$label.addClass( 'oo-ui-labeledElement-label' );
	this.setLabel( config.label || this.constructor.static.label );
	this.autoFitLabel = config.autoFitLabel === undefined || !!config.autoFitLabel;
};

/* Setup */

OO.initClass( OO.ui.LabeledElement );

/* Static Properties */

/**
 * Label.
 *
 * @static
 * @inheritable
 * @property {string|Function|null} Label text; a function that returns nodes or text; or null for
 *  no label
 */
OO.ui.LabeledElement.static.label = null;

/* Methods */

/**
 * Set the label.
 *
 * An empty string will result in the label being hidden. A string containing only whitespace will
 * be converted to a single &nbsp;
 *
 * @param {jQuery|string|Function|null} label Label nodes; text; a function that retuns nodes or
 *  text; or null for no label
 * @chainable
 */
OO.ui.LabeledElement.prototype.setLabel = function ( label ) {
	var empty = false;

	this.label = label = OO.ui.resolveMsg( label ) || null;
	if ( typeof label === 'string' && label.length ) {
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
		empty = true;
	}
	this.$element.toggleClass( 'oo-ui-labeledElement', !empty );
	this.$label.css( 'display', empty ? 'none' : '' );

	return this;
};

/**
 * Get the label.
 *
 * @return {jQuery|string|Function|null} label Label nodes; text; a function that returns nodes or
 *  text; or null for no label
 */
OO.ui.LabeledElement.prototype.getLabel = function () {
	return this.label;
};

/**
 * Fit the label.
 *
 * @chainable
 */
OO.ui.LabeledElement.prototype.fitLabel = function () {
	if ( this.$label.autoEllipsis && this.autoFitLabel ) {
		this.$label.autoEllipsis( { hasSpan: false, tooltip: true } );
	}
	return this;
};
