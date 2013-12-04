/**
 * @class
 * @abstract
 * @extends OO.ui.Widget
 * @mixins OO.ui.ToggleWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [value=false] Initial value
 */
OO.ui.ToggleSwitchWidget = function OoUiToggleSwitchWidget( config ) {
	// Parent constructor
	OO.ui.Widget.call( this, config );

	// Mixin constructors
	OO.ui.ToggleWidget.call( this, config );

	// Properties
	this.dragging = false;
	this.dragStart = null;
	this.sliding = false;
	this.$slide = this.$( '<span>' );
	this.$grip = this.$( '<span>' );
	this.onDocumentMouseMoveHandler = OO.ui.bind( this.onDocumentMouseMove, this );
	this.onDocumentMouseUpHandler = OO.ui.bind( this.onDocumentMouseUp, this );

	// Events
	this.$slide.on( 'mousedown', OO.ui.bind( this.onMouseDown, this ) );

	// Initialization
	this.$grip.addClass( 'oo-ui-toggleSwitchWidget-grip' );
	this.$slide
		.addClass( 'oo-ui-toggleSwitchWidget-slide' )
		.append( this.$onLabel, this.$offLabel, this.$grip );
	this.$element
		.addClass( 'oo-ui-toggleSwitchWidget' )
		.append( this.$slide );
};

/* Inheritance */

OO.inheritClass( OO.ui.ToggleSwitchWidget, OO.ui.Widget );

OO.mixinClass( OO.ui.ToggleSwitchWidget, OO.ui.ToggleWidget );

/* Methods */

/**
 * Handles mouse down events.
 *
 * @method
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.ToggleSwitchWidget.prototype.onMouseDown = function ( e ) {
	if ( !this.disabled && e.which === 1 ) {
		this.dragging = true;
		this.dragStart = e.pageX;
		this.$( this.$.context ).on( {
			'mousemove': this.onDocumentMouseMoveHandler,
			'mouseup': this.onDocumentMouseUpHandler
		} );
		this.$element.addClass( 'oo-ui-toggleSwitchWidget-dragging' );
		return false;
	}
};

/**
 * Handles document mouse up events.
 *
 * @method
 * @param {jQuery.Event} e Mouse up event
 */
OO.ui.ToggleSwitchWidget.prototype.onDocumentMouseUp = function ( e ) {
	var overlap, dragOffset;

	if ( e.which === 1 ) {
		this.$element.removeClass( 'oo-ui-toggleSwitchWidget-dragging' );

		if ( !this.sliding ) {
			this.setValue( !this.value );
		} else {
			this.$slide.css( 'margin-left', 0 );
			dragOffset = e.pageX - this.dragStart;
			overlap = this.$element.outerWidth() - this.$slide.outerWidth();
			if ( this.value ? overlap / 2 > dragOffset : -overlap / 2 < dragOffset ) {
				this.setValue( !this.value );
			}
		}
		this.dragging = false;
		this.sliding = false;
		this.$( this.$.context ).off( {
			'mousemove': this.onDocumentMouseMoveHandler,
			'mouseup': this.onDocumentMouseUpHandler
		} );
	}
};

/**
 * Handles document mouse move events.
 *
 * @method
 * @param {jQuery.Event} e Mouse move event
 */
OO.ui.ToggleSwitchWidget.prototype.onDocumentMouseMove = function ( e ) {
	var overlap, dragOffset, left;

	if ( this.dragging ) {
		dragOffset = e.pageX - this.dragStart;
		if ( dragOffset !== 0 || this.sliding ) {
			this.sliding = true;
			overlap = this.$element.outerWidth() - this.$slide.outerWidth();
			left = this.value ?
				Math.min( 0, Math.max( overlap, dragOffset ) ) :
				Math.min( -overlap, Math.max( 0, dragOffset ) );
			this.$slide.css( 'margin-left', left );
		}
	}
};
