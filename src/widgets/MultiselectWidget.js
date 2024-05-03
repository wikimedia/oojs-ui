/**
 * MultiselectWidget allows selecting multiple options from a list.
 *
 * For more information about menus and options, please see the [OOUI documentation
 * on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Selects_and_Options#Menu_selects_and_options
 *
 * @class
 * @abstract
 * @extends OO.ui.Widget
 * @mixes OO.ui.mixin.GroupWidget
 * @mixes OO.ui.mixin.TitledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {OO.ui.MultioptionWidget[]} [config.items] An array of options to add to the multiselect.
 */
OO.ui.MultiselectWidget = function OoUiMultiselectWidget( config ) {
	// Parent constructor
	OO.ui.MultiselectWidget.super.call( this, config );

	// Configuration initialization
	config = config || {};

	// Mixin constructors
	OO.ui.mixin.GroupWidget.call( this, config );
	OO.ui.mixin.TitledElement.call( this, config );

	// Events
	this.aggregate( {
		change: 'select'
	} );
	// This is mostly for compatibility with TagMultiselectWidget... normally, 'change' is emitted
	// by GroupElement only when items are added/removed
	this.connect( this, {
		select: [ 'emit', 'change' ]
	} );

	// Initialization
	this.addItems( config.items || [] );
	this.$group.addClass( 'oo-ui-multiselectWidget-group' );
	this.$element.addClass( 'oo-ui-multiselectWidget' )
		.append( this.$group );
};

/* Setup */

OO.inheritClass( OO.ui.MultiselectWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.MultiselectWidget, OO.ui.mixin.GroupWidget );
OO.mixinClass( OO.ui.MultiselectWidget, OO.ui.mixin.TitledElement );

/* Events */

/**
 * A change event is emitted when the set of items changes, or an item is selected or deselected.
 *
 * @event OO.ui.MultiselectWidget#change
 */

/**
 * A select event is emitted when an item is selected or deselected.
 *
 * @event OO.ui.MultiselectWidget#select
 */

/* Methods */

/**
 * Find options that are selected.
 *
 * @return {OO.ui.MultioptionWidget[]} Selected options
 */
OO.ui.MultiselectWidget.prototype.findSelectedItems = function () {
	return this.items.filter( ( item ) => item.isSelected() );
};

/**
 * Find the data of options that are selected.
 *
 * @return {Object[]|string[]} Values of selected options
 */
OO.ui.MultiselectWidget.prototype.findSelectedItemsData = function () {
	return this.findSelectedItems().map( ( item ) => item.data );
};

/**
 * Select options by reference. Options not mentioned in the `items` array will be deselected.
 *
 * @param {OO.ui.MultioptionWidget[]} items Items to select
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.MultiselectWidget.prototype.selectItems = function ( items ) {
	const itemsSet = new Set( items );
	this.items.forEach( ( item ) => {
		const selected = itemsSet.has( item );
		item.setSelected( selected );
	} );
	return this;
};

/**
 * Select items by their data. Options not mentioned in the `datas` array will be deselected.
 *
 * @param {Object[]|string[]} datas Values of items to select
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.MultiselectWidget.prototype.selectItemsByData = function ( datas ) {
	const dataHashSet = new Set( datas.map( ( data ) => OO.getHash( data ) ) );
	this.items.forEach( ( item ) => {
		const selected = dataHashSet.has( OO.getHash( item.getData() ) );
		item.setSelected( selected );
	} );
	return this;
};
