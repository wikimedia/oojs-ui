/**
 * Layout made of a fieldset and optional legend.
 *
 * Just add OO.ui.FieldLayout items.
 *
 * @class
 * @extends OO.ui.Layout
 * @mixins OO.ui.LabeledElement
 * @mixins OO.ui.IconedElement
 * @mixins OO.ui.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [icon] Symbolic icon name
 * @cfg {OO.ui.FieldLayout[]} [items] Items to add
 */
OO.ui.FieldsetLayout = function OoUiFieldsetLayout( config ) {
	// Config initialization
	config = config || {};

	// Parent constructor
	OO.ui.FieldsetLayout.super.call( this, config );

	// Mixin constructors
	OO.ui.IconedElement.call( this, this.$( '<div>' ), config );
	OO.ui.LabeledElement.call( this, this.$( '<div>' ), config );
	OO.ui.GroupElement.call( this, this.$( '<div>' ), config );

	// Initialization
	this.$element
		.addClass( 'oo-ui-fieldsetLayout' )
		.append( this.$icon, this.$label, this.$group );
	if ( $.isArray( config.items ) ) {
		this.addItems( config.items );
	}
};

/* Setup */

OO.inheritClass( OO.ui.FieldsetLayout, OO.ui.Layout );
OO.mixinClass( OO.ui.FieldsetLayout, OO.ui.IconedElement );
OO.mixinClass( OO.ui.FieldsetLayout, OO.ui.LabeledElement );
OO.mixinClass( OO.ui.FieldsetLayout, OO.ui.GroupElement );

/* Static Properties */

OO.ui.FieldsetLayout.static.tagName = 'div';
