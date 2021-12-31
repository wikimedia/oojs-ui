/**
 * RequiredElement is mixed into other classes to provide a `required` attribute.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$required] The element to which the `required` attribute is applied.
 *  If this config is omitted, the required functionality is applied to $input if it
 *  exists, or $element if it doesn't.
 * @cfg {boolean} [required=false] Mark the field as required with `true`.
 * @cfg {OO.ui.Element} [indicatorElement=this] Element which mixes in OO.ui.mixin.IndicatorElement
 *  Will set the indicator on that element to 'required' when the element is required.
 *  Note that `false` & setting `indicator: 'required'` will result in no indicator shown.
 */
OO.ui.mixin.RequiredElement = function OoUiMixinRequiredElement( config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.$required = config.$required || this.$input || this.$element;
	this.required = false;
	this.indicatorElement = config.indicatorElement !== undefined ? config.indicatorElement : this;
	if ( this.indicatorElement && !this.indicatorElement.getIndicator ) {
		throw new Error( 'config.indicatorElement must mixin OO.ui.mixin.IndicatorElement.' );
	}

	// Initialization
	this.setRequired( !!config.required );
};

/* Setup */

OO.initClass( OO.ui.mixin.RequiredElement );

/* Methods */

/**
 * Set the element which can take the required attribute.
 *
 * This method is used to retarget a RequiredElement mixin so that its functionality applies to the
 * specified element.
 * If an element is already set, the mixin’s effect on that element is removed before the new
 * element is set up.
 *
 * @param {jQuery} $required Element that should use the 'required' functionality
 */
OO.ui.mixin.RequiredElement.prototype.setRequiredElement = function ( $required ) {
	if ( this.$required === $required ) {
		return;
	}

	if ( this.$required && this.required ) {
		this.updateRequiredElement( false );
	}

	this.$required = $required;
	this.updateRequiredElement();
};

/**
 * @private
 * @param {boolean} [state]
 */
OO.ui.mixin.RequiredElement.prototype.updateRequiredElement = function ( state ) {
	if ( state === undefined ) {
		state = this.required;
	}

	this.$required
		.prop( 'required', state );
};

/**
 * Check if the input is {@link #required required}.
 *
 * @return {boolean}
 */
OO.ui.mixin.RequiredElement.prototype.isRequired = function () {
	return this.required;
};

/**
 * Set the {@link #required required} state of the input.
 *
 * @param {boolean} state Make input required
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.mixin.RequiredElement.prototype.setRequired = function ( state ) {
	if ( this.required === state ) {
		return this;
	}

	this.required = !!state;
	this.updateRequiredElement();
	if ( this.indicatorElement ) {
		// Make sure to not destroy other, unrelated indicators
		var expected = state ? null : 'required';
		if ( this.indicatorElement.getIndicator() === expected ) {
			this.indicatorElement.setIndicator( state ? 'required' : null );
		}
	}
	return this;
};
