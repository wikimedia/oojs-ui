/**
 * ToggleButtons are buttons that have a state (‘on’ or ‘off’) that is represented by a
 * Boolean value. Like other {@link OO.ui.ButtonWidget buttons}, toggle buttons can be
 * configured with {@link OO.ui.IconElement icons}, {@link OO.ui.IndicatorElement indicators},
 * {@link OO.ui.TitledElement titles}, {@link OO.ui.FlaggedElement styling flags},
 * and {@link OO.ui.LabelElement labels}. Please see
 * the [OOjs UI documentation][1] on MediaWiki for more information.
 *
 *     @example
 *     // Toggle buttons in the 'off' and 'on' state.
 *     var toggleButton1 = new OO.ui.ToggleButtonWidget( {
 *         label: 'Toggle Button off'
 *     } );
 *     var toggleButton2 = new OO.ui.ToggleButtonWidget( {
 *         label: 'Toggle Button on',
 *         value: true
 *     } );
 *     // Append the buttons to the DOM.
 *     $( 'body' ).append( toggleButton1.$element, toggleButton2.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Buttons_and_Switches#Toggle_buttons
 *
 * @class
 * @extends OO.ui.ButtonWidget
 * @mixins OO.ui.ToggleWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [value=false] The toggle button’s initial on/off
 *  state. By default, the button is in the 'off' state.
 */
OO.ui.ToggleButtonWidget = function OoUiToggleButtonWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.ToggleButtonWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.ToggleWidget.call( this, config );

	// Events
	this.connect( this, { click: 'onAction' } );

	// Initialization
	this.$element.addClass( 'oo-ui-toggleButtonWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.ToggleButtonWidget, OO.ui.ButtonWidget );
OO.mixinClass( OO.ui.ToggleButtonWidget, OO.ui.ToggleWidget );

/* Methods */

/**
 *
 * @private
 * Handle the button action being triggered.
 */
OO.ui.ToggleButtonWidget.prototype.onAction = function () {
	this.setValue( !this.value );
};

/**
 * @inheritdoc
 */
OO.ui.ToggleButtonWidget.prototype.setValue = function ( value ) {
	value = !!value;
	if ( value !== this.value ) {
		this.$button.attr( 'aria-pressed', value.toString() );
		this.setActive( value );
	}

	// Parent method (from mixin)
	OO.ui.ToggleWidget.prototype.setValue.call( this, value );

	return this;
};
