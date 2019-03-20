/**
 * MenuSectionOptionWidgets are used inside {@link OO.ui.MenuSelectWidget menu select widgets} to
 * group one or more related {@link OO.ui.MenuOptionWidget menu options}. MenuSectionOptionWidgets
 * cannot be highlighted or selected.
 *
 *     @example
 *     var dropdown = new OO.ui.DropdownWidget( {
 *         menu: {
 *             items: [
 *                 new OO.ui.MenuSectionOptionWidget( {
 *                     label: 'Dogs'
 *                 } ),
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'corgi',
 *                     label: 'Welsh Corgi'
 *                 } ),
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'poodle',
 *                     label: 'Standard Poodle'
 *                 } ),
 *                 new OO.ui.MenuSectionOptionWidget( {
 *                     label: 'Cats'
 *                 } ),
 *                 new OO.ui.MenuOptionWidget( {
 *                     data: 'lion',
 *                     label: 'Lion'
 *                 } )
 *             ]
 *         }
 *     } );
 *     $( document.body ).append( dropdown.$element );
 *
 * @class
 * @extends OO.ui.DecoratedOptionWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.MenuSectionOptionWidget = function OoUiMenuSectionOptionWidget( config ) {
	// Parent constructor
	OO.ui.MenuSectionOptionWidget.parent.call( this, config );

	// Initialization
	this.$element
		.addClass( 'oo-ui-menuSectionOptionWidget' )
		.removeAttr( 'role aria-selected' );
	this.selected = false;
};

/* Setup */

OO.inheritClass( OO.ui.MenuSectionOptionWidget, OO.ui.DecoratedOptionWidget );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.MenuSectionOptionWidget.static.selectable = false;

/**
 * @static
 * @inheritdoc
 */
OO.ui.MenuSectionOptionWidget.static.highlightable = false;
