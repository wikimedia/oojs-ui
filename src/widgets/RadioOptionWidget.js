/**
 * RadioOptionWidget is an option widget that looks like a radio button.
 * The class is used with OO.ui.RadioSelectWidget to create a selection of radio options.
 * Please see the [OOUI documentation on MediaWiki][1] for more information.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Selects_and_Options#Button_selects_and_option
 *
 * @class
 * @extends OO.ui.OptionWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {any} [config.data]
 */
OO.ui.RadioOptionWidget = function OoUiRadioOptionWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Properties (must be done before parent constructor which calls #setDisabled)
	this.radio = new OO.ui.RadioInputWidget( { value: config.data, tabIndex: -1 } );

	// Parent constructor
	OO.ui.RadioOptionWidget.super.call( this, config );

	// Initialization
	// Remove implicit role, we're handling it ourselves
	this.radio.$input.attr( 'role', 'presentation' );
	this.$element
		.addClass( 'oo-ui-radioOptionWidget' )
		.attr( { role: 'radio', 'aria-checked': 'false' } )
		.removeAttr( 'aria-selected' )
		.prepend( this.radio.$element );
};

/* Setup */

OO.inheritClass( OO.ui.RadioOptionWidget, OO.ui.OptionWidget );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.RadioOptionWidget.static.highlightable = false;

/**
 * @static
 * @inheritdoc
 */
OO.ui.RadioOptionWidget.static.pressable = false;

/**
 * @static
 * @inheritdoc
 */
OO.ui.RadioOptionWidget.static.tagName = 'label';

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.RadioOptionWidget.prototype.setSelected = function ( state ) {
	OO.ui.RadioOptionWidget.super.prototype.setSelected.call( this, state );

	this.radio.setSelected( state );
	this.$element
		.attr( 'aria-checked', this.selected.toString() )
		.removeAttr( 'aria-selected' );

	return this;
};

/**
 * @inheritdoc
 */
OO.ui.RadioOptionWidget.prototype.setDisabled = function ( disabled ) {
	OO.ui.RadioOptionWidget.super.prototype.setDisabled.call( this, disabled );

	this.radio.setDisabled( this.isDisabled() );

	return this;
};
