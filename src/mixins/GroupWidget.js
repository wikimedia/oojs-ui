/**
 * Mixin for OO.ui.Widget subclasses to provide OO.ui.mixin.GroupElement.
 *
 * Use together with OO.ui.mixin.ItemWidget to make disabled state inheritable.
 *
 * @private
 * @abstract
 * @class
 * @mixins OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.mixin.GroupWidget = function OoUiMixinGroupWidget( config ) {
	// Mixin constructors
	OO.ui.mixin.GroupElement.call( this, config );
};

/* Setup */

OO.mixinClass( OO.ui.mixin.GroupWidget, OO.ui.mixin.GroupElement );

/* Methods */

/**
 * Set the disabled state of the widget.
 *
 * This will also update the disabled state of child widgets.
 *
 * @param {boolean} disabled Disable widget
 * @chainable
 */
OO.ui.mixin.GroupWidget.prototype.setDisabled = function ( disabled ) {
	var i, len;

	// Parent method
	// Note: Calling #setDisabled this way assumes this is mixed into an OO.ui.Widget
	OO.ui.Widget.prototype.setDisabled.call( this, disabled );

	// During construction, #setDisabled is called before the OO.ui.mixin.GroupElement constructor
	if ( this.items ) {
		for ( i = 0, len = this.items.length; i < len; i++ ) {
			this.items[ i ].updateDisabled();
		}
	}

	return this;
};
