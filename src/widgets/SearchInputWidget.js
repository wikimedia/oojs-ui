/**
 * @class
 * @extends OO.ui.TextInputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.SearchInputWidget = function OoUiSearchInputWidget( config ) {
	config = $.extend( {
		icon: 'search'
	}, config );

	// Set type to text so that TextInputWidget doesn't
	// get stuck in an infinite loop.
	config.type = 'text';

	// Parent constructor
	OO.ui.SearchInputWidget.parent.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-textInputWidget-type-search' );
	this.updateSearchIndicator();
	this.connect( this, {
		disable: 'onDisable'
	} );
};

/* Setup */

OO.inheritClass( OO.ui.SearchInputWidget, OO.ui.TextInputWidget );

/* Methods */

/**
 * @inheritdoc
 * @protected
 */
OO.ui.SearchInputWidget.prototype.getInputElement = function () {
	return $( '<input>' ).attr( 'type', 'search' );
};

/**
 * @inheritdoc
 */
OO.ui.SearchInputWidget.prototype.onIndicatorMouseDown = function ( e ) {
	if ( e.which === OO.ui.MouseButtons.LEFT ) {
		// Clear the text field
		this.setValue( '' );
		this.$input[ 0 ].focus();
		return false;
	}
};

/**
 * Update the 'clear' indicator displayed on type: 'search' text
 * fields, hiding it when the field is already empty or when it's not
 * editable.
 */
OO.ui.SearchInputWidget.prototype.updateSearchIndicator = function () {
	if ( this.getValue() === '' || this.isDisabled() || this.isReadOnly() ) {
		this.setIndicator( null );
	} else {
		this.setIndicator( 'clear' );
	}
};

/**
 * @inheritdoc
 */
OO.ui.SearchInputWidget.prototype.onChange = function () {
	OO.ui.SearchInputWidget.parent.prototype.onChange.call( this );
	this.updateSearchIndicator();
};

/**
 * Handle disable events.
 *
 * @param {boolean} disabled Element is disabled
 * @private
 */
OO.ui.SearchInputWidget.prototype.onDisable = function () {
	this.updateSearchIndicator();
};

/**
 * @inheritdoc
 */
OO.ui.SearchInputWidget.prototype.setReadOnly = function ( state ) {
	OO.ui.SearchInputWidget.parent.prototype.setReadOnly.call( this, state );
	this.updateSearchIndicator();
	return this;
};
