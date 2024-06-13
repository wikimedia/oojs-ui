/**
 * HorizontalLayout arranges its contents in a single line (using `display: inline-block` for its
 * items), with small margins between them. Convenient when you need to put a number of block-level
 * widgets on a single line next to each other.
 *
 * Note that inline elements, such as OO.ui.ButtonWidgets, do not need this wrapper.
 *
 *     @example
 *     // HorizontalLayout with a text input and a label.
 *     const layout = new OO.ui.HorizontalLayout( {
 *       items: [
 *         new OO.ui.LabelWidget( { label: 'Label' } ),
 *         new OO.ui.TextInputWidget( { value: 'Text' } )
 *       ]
 *     } );
 *     $( document.body ).append( layout.$element );
 *
 * @class
 * @extends OO.ui.Layout
 * @mixes OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {OO.ui.Widget[]|OO.ui.Layout[]} [config.items] Widgets or other layouts to add to the layout.
 */
OO.ui.HorizontalLayout = function OoUiHorizontalLayout( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.HorizontalLayout.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.GroupElement.call( this, Object.assign( { $group: this.$element }, config ) );

	// Initialization
	this.$element.addClass( 'oo-ui-horizontalLayout' );
	this.addItems( config.items || [] );
};

/* Setup */

OO.inheritClass( OO.ui.HorizontalLayout, OO.ui.Layout );
OO.mixinClass( OO.ui.HorizontalLayout, OO.ui.mixin.GroupElement );
