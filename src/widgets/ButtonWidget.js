/**
 * Generic widget for buttons.
 *
 * @class
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
	this.href = null;
	this.target = null;
	this.isHyperlink = false;

	// Events
	this.$button.on( {
		'click': OO.ui.bind( this.onClick, this ),
		'keypress': OO.ui.bind( this.onKeyPress, this )
	} );

	// Initialization
	this.$button.append( this.$icon, this.$label, this.$indicator );
	this.$element
		.addClass( 'oo-ui-buttonWidget' )
		.append( this.$button );
	this.setHref( config.href );
	this.setTarget( config.target );
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
 * @param {jQuery.Event} e Mouse click event
 * @fires click
 */
OO.ui.ButtonWidget.prototype.onClick = function () {
	if ( !this.isDisabled() ) {
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
 * @param {jQuery.Event} e Keypress event
 * @fires click
 */
OO.ui.ButtonWidget.prototype.onKeyPress = function ( e ) {
	if ( !this.isDisabled() && ( e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER ) ) {
		this.onClick();
		if ( this.isHyperlink ) {
			return true;
		}
	}
	return false;
};

/**
 * Get hyperlink location.
 *
 * @return {string} Hyperlink location
 */
OO.ui.ButtonWidget.prototype.getHref = function () {
	return this.href;
};

/**
 * Get hyperlink target.
 *
 * @return {string} Hyperlink target
 */
OO.ui.ButtonWidget.prototype.getTarget = function () {
	return this.target;
};

/**
 * Set hyperlink location.
 *
 * @param {string|null} href Hyperlink location, null to remove
 */
OO.ui.ButtonWidget.prototype.setHref = function ( href ) {
	href = typeof href === 'string' ? href : null;

	if ( href !== this.href ) {
		this.href = href;
		if ( href !== null ) {
			this.$button.attr( 'href', href );
			this.isHyperlink = true;
		} else {
			this.$button.removeAttr( 'href' );
			this.isHyperlink = false;
		}
	}

	return this;
};

/**
 * Set hyperlink target.
 *
 * @param {string|null} target Hyperlink target, null to remove
 */
OO.ui.ButtonWidget.prototype.setTarget = function ( target ) {
	target = typeof target === 'string' ? target : null;

	if ( target !== this.target ) {
		this.target = target;
		if ( target !== null ) {
			this.$button.attr( 'target', target );
		} else {
			this.$button.removeAttr( 'target' );
		}
	}

	return this;
};
