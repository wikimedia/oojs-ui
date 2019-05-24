/**
 * TabSelectWidget is a list that contains {@link OO.ui.TabOptionWidget tab options}
 *
 * **Currently, this class is only used by {@link OO.ui.IndexLayout index layouts}.**
 *
 * @class
 * @extends OO.ui.SelectWidget
 * @mixins OO.ui.mixin.TabIndexedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [framed=true] Use framed tabs
 */
OO.ui.TabSelectWidget = function OoUiTabSelectWidget( config ) {
	// Parent constructor
	OO.ui.TabSelectWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.TabIndexedElement.call( this, config );

	// Events
	this.$element.on( {
		focus: this.bindDocumentKeyDownListener.bind( this ),
		blur: this.unbindDocumentKeyDownListener.bind( this )
	} );

	// Initialization
	this.$element
		.addClass( 'oo-ui-tabSelectWidget' )
		.attr( 'role', 'tablist' );

	this.toggleFramed( config.framed === undefined || config.framed );

	if ( OO.ui.isMobile() ) {
		this.$element.addClass( 'oo-ui-tabSelectWidget-mobile' );
	}
};

/* Setup */

OO.inheritClass( OO.ui.TabSelectWidget, OO.ui.SelectWidget );
OO.mixinClass( OO.ui.TabSelectWidget, OO.ui.mixin.TabIndexedElement );

/* Methods */

/**
 * Check if tabs are framed.
 *
 * @return {boolean} Tabs are framed
 */
OO.ui.TabSelectWidget.prototype.isFramed = function () {
	return this.framed;
};

/**
 * Render the tabs with or without frames.
 *
 * @param {boolean} [framed] Make tabs framed, omit to toggle
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 */
OO.ui.TabSelectWidget.prototype.toggleFramed = function ( framed ) {
	framed = framed === undefined ? !this.framed : !!framed;
	if ( framed !== this.framed ) {
		this.framed = framed;
		this.$element
			.toggleClass( 'oo-ui-tabSelectWidget-frameless', !framed )
			.toggleClass( 'oo-ui-tabSelectWidget-framed', framed );
	}

	return this;
};
