/**
 * Layout with an HTML form.
 *
 * @class
 * @extends OO.ui.Layout
 * @mixins OO.ui.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [method] HTML form `method` attribute
 * @cfg {string} [action] HTML form `action` attribute
 * @cfg {string} [enctype] HTML form `enctype` attribute
 * @cfg {OO.ui.FieldsetLayout[]} [items] Items to add
 */
OO.ui.FormLayout = function OoUiFormLayout( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.FormLayout.super.call( this, config );

	// Mixin constructors
	OO.ui.GroupElement.call( this, $.extend( {}, config, { $group: this.$element } ) );

	// Events
	this.$element.on( 'submit', this.onFormSubmit.bind( this ) );

	// Initialization
	this.$element
		.addClass( 'oo-ui-formLayout' )
		.attr( {
			method: config.method,
			action: config.action,
			enctype: config.enctype
		} );
	if ( Array.isArray( config.items ) ) {
		this.addItems( config.items );
	}
};

/* Setup */

OO.inheritClass( OO.ui.FormLayout, OO.ui.Layout );
OO.mixinClass( OO.ui.FormLayout, OO.ui.GroupElement );

/* Events */

/**
 * The HTML form was submitted. If the submission is handled, call `e.preventDefault()` to prevent
 * HTML form submission.
 *
 * @event submit
 * @param {jQuery.Event} e Submit event
 */

/* Static Properties */

OO.ui.FormLayout.static.tagName = 'form';

/* Methods */

/**
 * Handle form submit events.
 *
 * @param {jQuery.Event} e Submit event
 * @fires submit
 */
OO.ui.FormLayout.prototype.onFormSubmit = function ( e ) {
	this.emit( 'submit', e );
};
