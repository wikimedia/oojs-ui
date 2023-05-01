/**
 * RadioInputWidget creates a single radio button. Because radio buttons are usually used as a set,
 * in most cases you will want to use a {@link OO.ui.RadioSelectWidget radio select}
 * with {@link OO.ui.RadioOptionWidget radio options} instead of this class. For more information,
 * please see the [OOUI documentation on MediaWiki][1].
 *
 * This widget can be used inside an HTML form, such as a OO.ui.FormLayout.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Inputs
 *
 *     @example
 *     // An example of selected, unselected, and disabled radio inputs
 *     const radio1 = new OO.ui.RadioInputWidget( {
 *         value: 'a',
 *         selected: true
 *     } );
 *     const radio2 = new OO.ui.RadioInputWidget( {
 *         value: 'b'
 *     } );
 *     const radio3 = new OO.ui.RadioInputWidget( {
 *         value: 'c',
 *         disabled: true
 *     } );
 *     // Create a fieldset layout with fields for each radio button.
 *     const fieldset = new OO.ui.FieldsetLayout( {
 *         label: 'Radio inputs'
 *     } );
 *     fieldset.addItems( [
 *         new OO.ui.FieldLayout( radio1, { label: 'Selected', align: 'inline' } ),
 *         new OO.ui.FieldLayout( radio2, { label: 'Unselected', align: 'inline' } ),
 *         new OO.ui.FieldLayout( radio3, { label: 'Disabled', align: 'inline' } ),
 *     ] );
 *     $( document.body ).append( fieldset.$element );
 *
 * @class
 * @extends OO.ui.InputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {boolean} [config.selected=false] Select the radio button initially. By default, the radio button
 *  is not selected.
 */
OO.ui.RadioInputWidget = function OoUiRadioInputWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.RadioInputWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.RequiredElement.call( this, $.extend( {}, {
		// TODO: Display the required indicator somewhere
		indicatorElement: null
	}, config ) );

	// Initialization
	this.$element
		.addClass( 'oo-ui-radioInputWidget' )
		// Required for pretty styling in WikimediaUI theme
		.append( $( '<span>' ) );
	this.setSelected( config.selected !== undefined ? config.selected : false );
};

/* Setup */

OO.inheritClass( OO.ui.RadioInputWidget, OO.ui.InputWidget );
OO.mixinClass( OO.ui.RadioInputWidget, OO.ui.mixin.RequiredElement );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.RadioInputWidget.static.tagName = 'span';

/* Static Methods */

/**
 * @inheritdoc
 */
OO.ui.RadioInputWidget.static.gatherPreInfuseState = function ( node, config ) {
	const state = OO.ui.RadioInputWidget.super.static.gatherPreInfuseState( node, config );
	if ( config.$input ) {
		state.checked = config.$input.prop( 'checked' );
	}
	return state;
};

/* Methods */

/**
 * @inheritdoc
 * @protected
 */
OO.ui.RadioInputWidget.prototype.getInputElement = function () {
	return $( '<input>' ).attr( 'type', 'radio' );
};

/**
 * @inheritdoc
 */
OO.ui.RadioInputWidget.prototype.onEdit = function () {
	// RadioInputWidget doesn't track its state.
};

/**
 * Set selection state of this radio button.
 *
 * @param {boolean} state `true` for selected
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.RadioInputWidget.prototype.setSelected = function ( state ) {
	// RadioInputWidget doesn't track its state.
	this.$input.prop( 'checked', state );
	// The first time that the selection state is set (probably while constructing the widget),
	// remember it in defaultSelected. This property can be later used to check whether
	// the selection state of the input has been changed since it was created.
	if ( this.defaultSelected === undefined ) {
		this.defaultSelected = state;
		this.$input[ 0 ].defaultChecked = this.defaultSelected;
	}
	return this;
};

/**
 * Check if this radio button is selected.
 *
 * @return {boolean} Radio is selected
 */
OO.ui.RadioInputWidget.prototype.isSelected = function () {
	return this.$input.prop( 'checked' );
};

/**
 * @inheritdoc
 */
OO.ui.RadioInputWidget.prototype.simulateLabelClick = function () {
	if ( !this.isDisabled() ) {
		this.$input.trigger( 'click' );
	}
	this.focus();
};

/**
 * @inheritdoc
 */
OO.ui.RadioInputWidget.prototype.restorePreInfuseState = function ( state ) {
	OO.ui.RadioInputWidget.super.prototype.restorePreInfuseState.call( this, state );
	if ( state.checked !== undefined && state.checked !== this.isSelected() ) {
		this.setSelected( state.checked );
	}
};
