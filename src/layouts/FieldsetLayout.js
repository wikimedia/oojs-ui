/**
 * Layout made of a fieldset and optional legend.
 *
 * Just add OO.ui.FieldLayout items.
 *
 * @class
 * @extends OO.ui.Layout
 * @mixins OO.ui.IconElement
 * @mixins OO.ui.LabelElement
 * @mixins OO.ui.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {OO.ui.FieldLayout[]} [items] Items to add
 */
OO.ui.FieldsetLayout = function OoUiFieldsetLayout( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.FieldsetLayout.super.call( this, config );

	// Mixin constructors
	OO.ui.IconElement.call( this, config );
	OO.ui.LabelElement.call( this, config );
	OO.ui.GroupElement.call( this, config );

	// Initialization
	this.$element
		.addClass( 'oo-ui-fieldsetLayout' )
		.prepend( this.$icon, this.$label, this.$group );
	if ( $.isArray( config.items ) ) {
		this.addItems( config.items );
	}
};

/* Setup */

OO.inheritClass( OO.ui.FieldsetLayout, OO.ui.Layout );
OO.mixinClass( OO.ui.FieldsetLayout, OO.ui.IconElement );
OO.mixinClass( OO.ui.FieldsetLayout, OO.ui.LabelElement );
OO.mixinClass( OO.ui.FieldsetLayout, OO.ui.GroupElement );
