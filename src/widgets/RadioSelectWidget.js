/**
 * RadioSelectWidget is a {@link OO.ui.SelectWidget select widget} that contains radio
 * options and is used together with OO.ui.RadioOptionWidget. The RadioSelectWidget provides
 * an interface for adding, removing and selecting options.
 * Please see the [OOUI documentation on MediaWiki][1] for more information.
 *
 * If you want to use this within an HTML form, such as a OO.ui.FormLayout, use
 * OO.ui.RadioSelectInputWidget instead.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Selects_and_Options
 *
 *     @example
 *     // A RadioSelectWidget with RadioOptions.
 *     const option1 = new OO.ui.RadioOptionWidget( {
 *             data: 'a',
 *             label: 'Selected radio option'
 *         } ),
 *         option2 = new OO.ui.RadioOptionWidget( {
 *             data: 'b',
 *             label: 'Unselected radio option'
 *         } );
 *         radioSelect = new OO.ui.RadioSelectWidget( {
 *             items: [ option1, option2 ]
 *         } );
 *
 *     // Select 'option 1' using the RadioSelectWidget's selectItem() method.
 *     radioSelect.selectItem( option1 );
 *
 *     $( document.body ).append( radioSelect.$element );
 *
 * @class
 * @extends OO.ui.SelectWidget
 * @mixes OO.ui.mixin.TabIndexedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.RadioSelectWidget = function OoUiRadioSelectWidget( config ) {
	// Parent constructor
	OO.ui.RadioSelectWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.TabIndexedElement.call( this, config );

	// Events
	this.attachDocumentKeyDownListenerOnFocus();

	// Initialization
	this.$element
		.addClass( 'oo-ui-radioSelectWidget' )
		.attr( 'role', 'radiogroup' )
		// Not applicable to 'radiogroup', and it would always be 'false' anyway
		.removeAttr( 'aria-multiselectable' );
};

/* Setup */

OO.inheritClass( OO.ui.RadioSelectWidget, OO.ui.SelectWidget );
OO.mixinClass( OO.ui.RadioSelectWidget, OO.ui.mixin.TabIndexedElement );
