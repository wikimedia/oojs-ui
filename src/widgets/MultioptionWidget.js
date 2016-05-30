/**
 * MultioptionWidgets are special elements that can be selected and configured with data. The
 * data is often unique for each option, but it does not have to be. MultioptionWidgets are used
 * with OO.ui.SelectWidget to create a selection of mutually exclusive options. For more information
 * and examples, please see the [OOjs UI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Selects_and_Multioptions
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.ItemWidget
 * @mixins OO.ui.mixin.LabelElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [selected=false] Whether the option is initially selected
 */
OO.ui.MultioptionWidget = function OoUiMultioptionWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.MultioptionWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.ItemWidget.call( this );
	OO.ui.mixin.LabelElement.call( this, config );

	// Properties
	this.selected = null;

	// Initialization
	this.$element
		.addClass( 'oo-ui-multioptionWidget' )
		.append( this.$label );
	this.setSelected( config.selected );
};

/* Setup */

OO.inheritClass( OO.ui.MultioptionWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.MultioptionWidget, OO.ui.mixin.ItemWidget );
OO.mixinClass( OO.ui.MultioptionWidget, OO.ui.mixin.LabelElement );

/* Events */

/**
 * @event change
 *
 * A change event is emitted when the selected state of the option changes.
 *
 * @param {boolean} selected Whether the option is now selected
 */

/* Methods */

/**
 * Check if the option is selected.
 *
 * @return {boolean} Item is selected
 */
OO.ui.MultioptionWidget.prototype.isSelected = function () {
	return this.selected;
};

/**
 * Set the option’s selected state. In general, all modifications to the selection
 * should be handled by the SelectWidget’s {@link OO.ui.SelectWidget#selectItem selectItem( [item] )}
 * method instead of this method.
 *
 * @param {boolean} [state=false] Select option
 * @chainable
 */
OO.ui.MultioptionWidget.prototype.setSelected = function ( state ) {
	state = !!state;
	if ( this.selected !== state ) {
		this.selected = state;
		this.emit( 'change', state );
		this.$element.toggleClass( 'oo-ui-multioptionWidget-selected', state );
	}
	return this;
};
