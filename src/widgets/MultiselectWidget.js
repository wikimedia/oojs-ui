/**
 * MultiselectWidget allows selecting multiple options from a list.
 *
 * For more information about menus and options, please see the [OOjs UI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Selects_and_Options#Menu_selects_and_options
 *
 * @class
 * @abstract
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.GroupWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {OO.ui.MultioptionWidget[]} [items] An array of options to add to the multiselect.
 */
OO.ui.MultiselectWidget = function OoUiMultiselectWidget( config ) {
	// Parent constructor
	OO.ui.MultiselectWidget.parent.call( this, config );

	// Configuration initialization
	config = config || {};

	// Mixin constructors
	OO.ui.mixin.GroupWidget.call( this, config );

	// Events
	this.aggregate( { change: 'select' } );
	// This is mostly for compatibility with CapsuleMultiselectWidget... normally, 'change' is emitted
	// by GroupElement only when items are added/removed
	this.connect( this, { select: [ 'emit', 'change' ] } );

	// Initialization
	if ( config.items ) {
		this.addItems( config.items );
	}
	this.$group.addClass( 'oo-ui-multiselectWidget-group' );
	this.$element.addClass( 'oo-ui-multiselectWidget' )
		.append( this.$group );
};

/* Setup */

OO.inheritClass( OO.ui.MultiselectWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.MultiselectWidget, OO.ui.mixin.GroupWidget );

/* Events */

/**
 * @event change
 *
 * A change event is emitted when the set of items changes, or an item is selected or deselected.
 */

/**
 * @event select
 *
 * A select event is emitted when an item is selected or deselected.
 */

/* Methods */

/**
 * Get options that are selected.
 *
 * @return {OO.ui.MultioptionWidget[]} Selected options
 */
OO.ui.MultiselectWidget.prototype.getSelectedItems = function () {
	return this.items.filter( function ( item ) {
		return item.isSelected();
	} );
};

/**
 * Get the data of options that are selected.
 *
 * @return {Object[]|string[]} Values of selected options
 */
OO.ui.MultiselectWidget.prototype.getSelectedItemsData = function () {
	return this.getSelectedItems().map( function ( item ) {
		return item.data;
	} );
};

/**
 * Select options by reference. Options not mentioned in the `items` array will be deselected.
 *
 * @param {OO.ui.MultioptionWidget[]} items Items to select
 * @chainable
 */
OO.ui.MultiselectWidget.prototype.selectItems = function ( items ) {
	this.items.forEach( function ( item ) {
		var selected = items.indexOf( item ) !== -1;
		item.setSelected( selected );
	} );
	return this;
};

/**
 * Select items by their data. Options not mentioned in the `datas` array will be deselected.
 *
 * @param {Object[]|string[]} datas Values of items to select
 * @chainable
 */
OO.ui.MultiselectWidget.prototype.selectItemsByData = function ( datas ) {
	var items,
		widget = this;
	items = datas.map( function ( data ) {
		return widget.getItemFromData( data );
	} );
	this.selectItems( items );
	return this;
};
