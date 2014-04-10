/**
 * Group widget.
 *
 * Mixin for OO.ui.Widget subclasses.
 *
 * Use together with OO.ui.ItemWidget to make disabled state inheritable.
 *
 * @abstract
 * @class
 * @extends OO.ui.GroupElement
 *
 * @constructor
 * @param {jQuery} $group Container node, assigned to #$group
 * @param {Object} [config] Configuration options
 */
OO.ui.GroupWidget = function OoUiGroupWidget( $element, config ) {
	// Parent constructor
	OO.ui.GroupWidget.super.call( this, $element, config );
};

/* Setup */

OO.inheritClass( OO.ui.GroupWidget, OO.ui.GroupElement );

/* Methods */

/**
 * Set the disabled state of the widget.
 *
 * This will also update the disabled state of child widgets.
 *
 * @param {boolean} disabled Disable widget
 * @chainable
 */
OO.ui.GroupWidget.prototype.setDisabled = function ( disabled ) {
	var i, len;

	// Parent method
	// Note this is calling OO.ui.Widget; we're assuming the class this is mixed into
	// is a subclass of OO.ui.Widget.
	OO.ui.Widget.prototype.setDisabled.call( this, disabled );

	// During construction, #setDisabled is called before the OO.ui.GroupElement constructor
	if ( this.items ) {
		for ( i = 0, len = this.items.length; i < len; i++ ) {
			this.items[i].updateDisabled();
		}
	}

	return this;
};
