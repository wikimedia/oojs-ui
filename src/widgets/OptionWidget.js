/**
 * Generic option widget for use with OO.ui.SelectWidget.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.LabelElement
 * @mixins OO.ui.FlaggedElement
 *
 * @constructor
 * @param {Mixed} data Option data
 * @param {Object} [config] Configuration options
 * @cfg {string} [rel] Value for `rel` attribute in DOM, allowing per-option styling
 */
OO.ui.OptionWidget = function OoUiOptionWidget( data, config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.OptionWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.ItemWidget.call( this );
	OO.ui.LabelElement.call( this, config );
	OO.ui.FlaggedElement.call( this, config );

	// Properties
	this.data = data;
	this.selected = false;
	this.highlighted = false;
	this.pressed = false;

	// Initialization
	this.$element
		.data( 'oo-ui-optionWidget', this )
		.attr( 'rel', config.rel )
		.attr( 'role', 'option' )
		.addClass( 'oo-ui-optionWidget' )
		.append( this.$label );
};

/* Setup */

OO.inheritClass( OO.ui.OptionWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.OptionWidget, OO.ui.ItemWidget );
OO.mixinClass( OO.ui.OptionWidget, OO.ui.LabelElement );
OO.mixinClass( OO.ui.OptionWidget, OO.ui.FlaggedElement );

/* Static Properties */

OO.ui.OptionWidget.static.selectable = true;

OO.ui.OptionWidget.static.highlightable = true;

OO.ui.OptionWidget.static.pressable = true;

OO.ui.OptionWidget.static.scrollIntoViewOnSelect = false;

/* Methods */

/**
 * Check if option can be selected.
 *
 * @return {boolean} Item is selectable
 */
OO.ui.OptionWidget.prototype.isSelectable = function () {
	return this.constructor.static.selectable && !this.isDisabled();
};

/**
 * Check if option can be highlighted.
 *
 * @return {boolean} Item is highlightable
 */
OO.ui.OptionWidget.prototype.isHighlightable = function () {
	return this.constructor.static.highlightable && !this.isDisabled();
};

/**
 * Check if option can be pressed.
 *
 * @return {boolean} Item is pressable
 */
OO.ui.OptionWidget.prototype.isPressable = function () {
	return this.constructor.static.pressable && !this.isDisabled();
};

/**
 * Check if option is selected.
 *
 * @return {boolean} Item is selected
 */
OO.ui.OptionWidget.prototype.isSelected = function () {
	return this.selected;
};

/**
 * Check if option is highlighted.
 *
 * @return {boolean} Item is highlighted
 */
OO.ui.OptionWidget.prototype.isHighlighted = function () {
	return this.highlighted;
};

/**
 * Check if option is pressed.
 *
 * @return {boolean} Item is pressed
 */
OO.ui.OptionWidget.prototype.isPressed = function () {
	return this.pressed;
};

/**
 * Set selected state.
 *
 * @param {boolean} [state=false] Select option
 * @chainable
 */
OO.ui.OptionWidget.prototype.setSelected = function ( state ) {
	if ( this.constructor.static.selectable ) {
		this.selected = !!state;
		this.$element.toggleClass( 'oo-ui-optionWidget-selected', state );
		if ( state && this.constructor.static.scrollIntoViewOnSelect ) {
			this.scrollElementIntoView();
		}
		this.updateThemeClasses();
	}
	return this;
};

/**
 * Set highlighted state.
 *
 * @param {boolean} [state=false] Highlight option
 * @chainable
 */
OO.ui.OptionWidget.prototype.setHighlighted = function ( state ) {
	if ( this.constructor.static.highlightable ) {
		this.highlighted = !!state;
		this.$element.toggleClass( 'oo-ui-optionWidget-highlighted', state );
		this.updateThemeClasses();
	}
	return this;
};

/**
 * Set pressed state.
 *
 * @param {boolean} [state=false] Press option
 * @chainable
 */
OO.ui.OptionWidget.prototype.setPressed = function ( state ) {
	if ( this.constructor.static.pressable ) {
		this.pressed = !!state;
		this.$element.toggleClass( 'oo-ui-optionWidget-pressed', state );
		this.updateThemeClasses();
	}
	return this;
};

/**
 * Make the option's highlight flash.
 *
 * While flashing, the visual style of the pressed state is removed if present.
 *
 * @return {jQuery.Promise} Promise resolved when flashing is done
 */
OO.ui.OptionWidget.prototype.flash = function () {
	var widget = this,
		$element = this.$element,
		deferred = $.Deferred();

	if ( !this.isDisabled() && this.constructor.static.pressable ) {
		$element.removeClass( 'oo-ui-optionWidget-highlighted oo-ui-optionWidget-pressed' );
		setTimeout( function () {
			// Restore original classes
			$element
				.toggleClass( 'oo-ui-optionWidget-highlighted', widget.highlighted )
				.toggleClass( 'oo-ui-optionWidget-pressed', widget.pressed );

			setTimeout( function () {
				deferred.resolve();
			}, 100 );

		}, 100 );
	}

	return deferred.promise();
};

/**
 * Get option data.
 *
 * @return {Mixed} Option data
 */
OO.ui.OptionWidget.prototype.getData = function () {
	return this.data;
};
