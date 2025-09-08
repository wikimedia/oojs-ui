/**
 * ButtonSelectWidget is a {@link OO.ui.SelectWidget select widget} that contains
 * button options and is used together with
 * OO.ui.ButtonOptionWidget. The ButtonSelectWidget provides an interface for
 * highlighting, choosing, and selecting mutually exclusive options. Please see
 * the [OOUI documentation on MediaWiki][1] for more information.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Selects_and_Options
 *
 *     @example
 *     // A ButtonSelectWidget that contains three ButtonOptionWidgets.
 *     const option1 = new OO.ui.ButtonOptionWidget( {
 *             data: 1,
 *             label: 'Option 1',
 *             title: 'Button option 1'
 *         } ),
 *         option2 = new OO.ui.ButtonOptionWidget( {
 *             data: 2,
 *             label: 'Option 2',
 *             title: 'Button option 2'
 *         } ),
 *         option3 = new OO.ui.ButtonOptionWidget( {
 *             data: 3,
 *             label: 'Option 3',
 *             title: 'Button option 3'
 *         } ),
 *         buttonSelect = new OO.ui.ButtonSelectWidget( {
 *             items: [ option1, option2, option3 ]
 *         } );
 *     $( document.body ).append( buttonSelect.$element );
 *
 * @class
 * @extends OO.ui.SelectWidget
 * @mixes OO.ui.mixin.TabIndexedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.ButtonSelectWidget = function OoUiButtonSelectWidget( config ) {
	// Parent constructor
	OO.ui.ButtonSelectWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.TabIndexedElement.call( this, config );

	// Events
	this.attachDocumentKeyDownListenerOnFocus();

	// Initialization
	this.$element.addClass( 'oo-ui-buttonSelectWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.ButtonSelectWidget, OO.ui.SelectWidget );
OO.mixinClass( OO.ui.ButtonSelectWidget, OO.ui.mixin.TabIndexedElement );
