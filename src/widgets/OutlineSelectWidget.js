/**
 * Structured list of items.
 *
 * Use with OO.ui.OutlineOptionWidget.
 *
 * @class
 * @extends OO.ui.SelectWidget
 * @mixins OO.ui.TabIndexedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.OutlineSelectWidget = function OoUiOutlineSelectWidget( config ) {
	// Parent constructor
	OO.ui.OutlineSelectWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.TabIndexedElement.call( this, config );

	// Events
	this.$element.on( {
		focus: this.bindKeyDownListener.bind( this ),
		blur: this.unbindKeyDownListener.bind( this )
	} );

	// Initialization
	this.$element.addClass( 'oo-ui-outlineSelectWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.OutlineSelectWidget, OO.ui.SelectWidget );
OO.mixinClass( OO.ui.OutlineSelectWidget, OO.ui.TabIndexedElement );
