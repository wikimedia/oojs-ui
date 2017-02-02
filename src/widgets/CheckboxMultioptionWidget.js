/**
 * CheckboxMultioptionWidget is an option widget that looks like a checkbox.
 * The class is used with OO.ui.CheckboxMultiselectWidget to create a selection of checkbox options.
 * Please see the [OOjs UI documentation on MediaWiki] [1] for more information.
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Selects_and_Options#Button_selects_and_option
 *
 * @class
 * @extends OO.ui.MultioptionWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.CheckboxMultioptionWidget = function OoUiCheckboxMultioptionWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Properties (must be done before parent constructor which calls #setDisabled)
	this.checkbox = new OO.ui.CheckboxInputWidget();

	// Parent constructor
	OO.ui.CheckboxMultioptionWidget.parent.call( this, config );

	// Events
	this.checkbox.on( 'change', this.onCheckboxChange.bind( this ) );
	this.$element.on( 'keydown', this.onKeyDown.bind( this ) );

	// Initialization
	this.$element
		.addClass( 'oo-ui-checkboxMultioptionWidget' )
		.prepend( this.checkbox.$element );
};

/* Setup */

OO.inheritClass( OO.ui.CheckboxMultioptionWidget, OO.ui.MultioptionWidget );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.CheckboxMultioptionWidget.static.tagName = 'label';

/* Methods */

/**
 * Handle checkbox selected state change.
 *
 * @private
 */
OO.ui.CheckboxMultioptionWidget.prototype.onCheckboxChange = function () {
	this.setSelected( this.checkbox.isSelected() );
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxMultioptionWidget.prototype.setSelected = function ( state ) {
	OO.ui.CheckboxMultioptionWidget.parent.prototype.setSelected.call( this, state );
	this.checkbox.setSelected( state );
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxMultioptionWidget.prototype.setDisabled = function ( disabled ) {
	OO.ui.CheckboxMultioptionWidget.parent.prototype.setDisabled.call( this, disabled );
	this.checkbox.setDisabled( this.isDisabled() );
	return this;
};

/**
 * Focus the widget.
 */
OO.ui.CheckboxMultioptionWidget.prototype.focus = function () {
	this.checkbox.focus();
};

/**
 * Handle key down events.
 *
 * @protected
 * @param {jQuery.Event} e
 */
OO.ui.CheckboxMultioptionWidget.prototype.onKeyDown = function ( e ) {
	var
		element = this.getElementGroup(),
		nextItem;

	if ( e.keyCode === OO.ui.Keys.LEFT || e.keyCode === OO.ui.Keys.UP ) {
		nextItem = element.getRelativeFocusableItem( this, -1 );
	} else if ( e.keyCode === OO.ui.Keys.RIGHT || e.keyCode === OO.ui.Keys.DOWN ) {
		nextItem = element.getRelativeFocusableItem( this, 1 );
	}

	if ( nextItem ) {
		e.preventDefault();
		nextItem.focus();
	}
};
