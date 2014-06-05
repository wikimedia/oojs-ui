/**
 * Option widget that looks like a button.
 *
 * Use together with OO.ui.ButtonSelectWidget.
 *
 * @class
 * @extends OO.ui.OptionWidget
 * @mixins OO.ui.ButtonedElement
 * @mixins OO.ui.FlaggableElement
 *
 * @constructor
 * @param {Mixed} data Option data
 * @param {Object} [config] Configuration options
 */
OO.ui.ButtonOptionWidget = function OoUiButtonOptionWidget( data, config ) {
	// Parent constructor
	OO.ui.ButtonOptionWidget.super.call( this, data, config );

	// Mixin constructors
	OO.ui.ButtonedElement.call( this, this.$( '<a>' ), config );
	OO.ui.FlaggableElement.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-buttonOptionWidget' );
	this.$button.append( this.$element.contents() );
	this.$element.append( this.$button );
};

/* Setup */

OO.inheritClass( OO.ui.ButtonOptionWidget, OO.ui.OptionWidget );
OO.mixinClass( OO.ui.ButtonOptionWidget, OO.ui.ButtonedElement );
OO.mixinClass( OO.ui.ButtonOptionWidget, OO.ui.FlaggableElement );

/* Static Properties */

// Allow button mouse down events to pass through so they can be handled by the parent select widget
OO.ui.ButtonOptionWidget.static.cancelButtonMouseDownEvents = false;

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.ButtonOptionWidget.prototype.setSelected = function ( state ) {
	OO.ui.ButtonOptionWidget.super.prototype.setSelected.call( this, state );

	if ( this.constructor.static.selectable ) {
		this.setActive( state );
	}

	return this;
};
