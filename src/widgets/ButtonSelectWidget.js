/**
 * Select widget containing button options.
 *
 * Use together with OO.ui.ButtonOptionWidget.
 *
 * @class
 * @extends OO.ui.SelectWidget
 * @mixins OO.ui.TabIndexedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.ButtonSelectWidget = function OoUiButtonSelectWidget( config ) {
	// Parent constructor
	OO.ui.ButtonSelectWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.TabIndexedElement.call( this, config );

	// Events
	this.$element.on( {
		focus: this.bindKeyDownListener.bind( this ),
		blur: this.unbindKeyDownListener.bind( this )
	} );

	// Initialization
	this.$element.addClass( 'oo-ui-buttonSelectWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.ButtonSelectWidget, OO.ui.SelectWidget );
OO.mixinClass( OO.ui.ButtonSelectWidget, OO.ui.TabIndexedElement );
