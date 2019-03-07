/**
 * A ButtonGroupWidget groups related buttons and is used together with OO.ui.ButtonWidget and
 * its subclasses. Each button in a group is addressed by a unique reference. Buttons can be added,
 * removed, and cleared from the group.
 *
 *     @example
 *     // A ButtonGroupWidget with two buttons.
 *     var button1 = new OO.ui.PopupButtonWidget( {
 *             label: 'Select a category',
 *             icon: 'menu',
 *             popup: {
 *                 $content: $( '<p>List of categories…</p>' ),
 *                 padded: true,
 *                 align: 'left'
 *             }
 *         } ),
 *         button2 = new OO.ui.ButtonWidget( {
 *             label: 'Add item'
 *         } ),
 *         buttonGroup = new OO.ui.ButtonGroupWidget( {
 *             items: [ button1, button2 ]
 *         } );
 *     $( document.body ).append( buttonGroup.$element );
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.GroupElement
 * @mixins OO.ui.mixin.TitledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {OO.ui.ButtonWidget[]} [items] Buttons to add
 */
OO.ui.ButtonGroupWidget = function OoUiButtonGroupWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.ButtonGroupWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.GroupElement.call( this, $.extend( {
		$group: this.$element
	}, config ) );
	OO.ui.mixin.TitledElement.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-buttonGroupWidget' );
	if ( Array.isArray( config.items ) ) {
		this.addItems( config.items );
	}
};

/* Setup */

OO.inheritClass( OO.ui.ButtonGroupWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.ButtonGroupWidget, OO.ui.mixin.GroupElement );
OO.mixinClass( OO.ui.ButtonGroupWidget, OO.ui.mixin.TitledElement );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.ButtonGroupWidget.static.tagName = 'span';

/* Methods */

/**
 * Focus the widget
 *
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.ButtonGroupWidget.prototype.focus = function () {
	if ( !this.isDisabled() ) {
		if ( this.items[ 0 ] ) {
			this.items[ 0 ].focus();
		}
	}
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.ButtonGroupWidget.prototype.simulateLabelClick = function () {
	this.focus();
};
