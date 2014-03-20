/**
 * Group widget.
 *
 * Use together with OO.ui.ItemWidget to make disabled state inheritable.
 *
 * @class
 * @abstract
 * @extends OO.ui.Widget
 * @mixins OO.ui.GroupElement
 *
 * @constructor
 * @param {jQuery} $group Container node, assigned to #$group
 * @param {Object} [config] Configuration options
 */
OO.ui.GroupWidget = function OoUiGroupWidget( $element, config ) {
	// Parent constructor
	OO.ui.GroupWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.GroupElement.call( this, $element, config );
};

/* Inheritance */

OO.inheritClass( OO.ui.GroupWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.GroupWidget, OO.ui.GroupElement );

/* Methods */

/**
 * Set the disabled state of the widget.
 *
 * This will also update the disabled state of child widgets.
 *
 * @method
 * @param {boolean} disabled Disable widget
 * @chainable
 */
OO.ui.GroupWidget.prototype.setDisabled = function ( disabled ) {
	var i, len;

	// Parent method
	OO.ui.Widget.prototype.setDisabled.call( this, disabled );

	// During construction, #setDisabled is called before the OO.ui.GroupElement constructor
	if ( this.items ) {
		for ( i = 0, len = this.items.length; i < len; i++ ) {
			this.items[i].updateDisabled();
		}
	}

	return this;
};
