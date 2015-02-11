/**
 * Option widget that looks like a button.
 *
 * Use together with OO.ui.ButtonSelectWidget.
 *
 * @class
 * @extends OO.ui.DecoratedOptionWidget
 * @mixins OO.ui.ButtonElement
 * @mixins OO.ui.TabIndexedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.ButtonOptionWidget = function OoUiButtonOptionWidget( config ) {
	// Configuration initialization
	config = $.extend( { tabIndex: -1 }, config );

	// Parent constructor
	OO.ui.ButtonOptionWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.ButtonElement.call( this, config );
	OO.ui.TabIndexedElement.call( this, $.extend( {}, config, { $tabIndexed: this.$button } ) );

	// Initialization
	this.$element.addClass( 'oo-ui-buttonOptionWidget' );
	this.$button.append( this.$element.contents() );
	this.$element.append( this.$button );
};

/* Setup */

OO.inheritClass( OO.ui.ButtonOptionWidget, OO.ui.DecoratedOptionWidget );
OO.mixinClass( OO.ui.ButtonOptionWidget, OO.ui.ButtonElement );
OO.mixinClass( OO.ui.ButtonOptionWidget, OO.ui.TabIndexedElement );

/* Static Properties */

// Allow button mouse down events to pass through so they can be handled by the parent select widget
OO.ui.ButtonOptionWidget.static.cancelButtonMouseDownEvents = false;

OO.ui.ButtonOptionWidget.static.highlightable = false;

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
