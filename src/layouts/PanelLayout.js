/**
 * PanelLayouts expand to cover the entire area of their parent. They can be configured with
 * scrolling, padding, and a frame, and are often used together with
 * {@link OO.ui.StackLayout StackLayouts}.
 *
 *     @example
 *     // Example of a panel layout
 *     const panel = new OO.ui.PanelLayout( {
 *         expanded: false,
 *         framed: true,
 *         padded: true,
 *         $content: $( '<p>A panel layout with padding and a frame.</p>' )
 *     } );
 *     $( document.body ).append( panel.$element );
 *
 * @class
 * @extends OO.ui.Layout
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {boolean} [config.scrollable=false] Allow vertical scrolling
 * @param {boolean} [config.padded=false] Add padding between the content and the edges of the panel.
 * @param {boolean} [config.expanded=true] Expand the panel to fill the entire parent element.
 * @param {boolean} [config.framed=false] Render the panel with a frame to visually separate it from outside
 *  content.
 */
OO.ui.PanelLayout = function OoUiPanelLayout( config ) {
	// Configuration initialization
	config = $.extend( {
		scrollable: false,
		padded: false,
		expanded: true,
		framed: false
	}, config );

	// Parent constructor
	OO.ui.PanelLayout.super.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-panelLayout' );
	if ( config.scrollable ) {
		this.$element.addClass( 'oo-ui-panelLayout-scrollable' );
	}
	if ( config.padded ) {
		this.$element.addClass( 'oo-ui-panelLayout-padded' );
	}
	if ( config.expanded ) {
		this.$element.addClass( 'oo-ui-panelLayout-expanded' );
	}
	if ( config.framed ) {
		this.$element.addClass( 'oo-ui-panelLayout-framed' );
	}
};

/* Setup */

OO.inheritClass( OO.ui.PanelLayout, OO.ui.Layout );

/* Static Methods */

/**
 * @inheritdoc
 */
OO.ui.PanelLayout.static.reusePreInfuseDOM = function ( node, config ) {
	config = OO.ui.PanelLayout.super.static.reusePreInfuseDOM( node, config );
	if ( config.preserveContent !== false ) {
		config.$content = $( node ).contents();
	}
	return config;
};

/* Methods */

/**
 * Focus the panel layout
 *
 * The default implementation just focuses the first focusable element in the panel
 */
OO.ui.PanelLayout.prototype.focus = function () {
	OO.ui.findFocusable( this.$element ).focus();
};
