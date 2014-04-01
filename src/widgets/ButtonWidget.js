/**
 * Creates an OO.ui.ButtonWidget object.
 *
 * @class
 * @abstract
 * @extends OO.ui.Widget
 * @mixins OO.ui.ButtonedElement
 * @mixins OO.ui.IconedElement
 * @mixins OO.ui.IndicatedElement
 * @mixins OO.ui.LabeledElement
 * @mixins OO.ui.TitledElement
 * @mixins OO.ui.FlaggableElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [title=''] Title text
 * @cfg {string} [href] Hyperlink to visit when clicked
 * @cfg {string} [target] Target to open hyperlink in
 */
OO.ui.ButtonWidget = function OoUiButtonWidget( config ) {
	// Configuration initialization
	config = $.extend( { 'target': '_blank' }, config );

	// Parent constructor
	OO.ui.ButtonWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.ButtonedElement.call( this, this.$( '<a>' ), config );
	OO.ui.IconedElement.call( this, this.$( '<span>' ), config );
	OO.ui.IndicatedElement.call( this, this.$( '<span>' ), config );
	OO.ui.LabeledElement.call( this, this.$( '<span>' ), config );
	OO.ui.TitledElement.call( this, this.$button, config );
	OO.ui.FlaggableElement.call( this, config );

	// Properties
	this.isHyperlink = typeof config.href === 'string';

	// Events
	this.$button.on( {
		'click': OO.ui.bind( this.onClick, this ),
		'keypress': OO.ui.bind( this.onKeyPress, this )
	} );

	// Initialization
	this.$button
		.append( this.$icon, this.$label, this.$indicator )
		.attr( { 'href': config.href, 'target': config.target } );
	this.$element
		.addClass( 'oo-ui-buttonWidget' )
		.append( this.$button );
};

/* Setup */

OO.inheritClass( OO.ui.ButtonWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.ButtonedElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.IconedElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.IndicatedElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.LabeledElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.TitledElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.FlaggableElement );

/* Events */

/**
 * @event click
 */

/* Methods */

/**
 * Handles mouse click events.
 *
 * @method
 * @param {jQuery.Event} e Mouse click event
 * @fires click
 */
OO.ui.ButtonWidget.prototype.onClick = function () {
	if ( !this.disabled ) {
		this.emit( 'click' );
		if ( this.isHyperlink ) {
			return true;
		}
	}
	return false;
};

/**
 * Handles keypress events.
 *
 * @method
 * @param {jQuery.Event} e Keypress event
 * @fires click
 */
OO.ui.ButtonWidget.prototype.onKeyPress = function ( e ) {
	if ( !this.disabled && e.which === OO.ui.Keys.SPACE ) {
		if ( this.isHyperlink ) {
			this.onClick();
			return true;
		}
	}
	return false;
};
