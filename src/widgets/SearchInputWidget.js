/**
 * SearchInputWidgets are TextInputWidgets with `type="search"` assigned and feature a
 * {@link OO.ui.mixin.IconElement search icon} by default.
 * Please see the [OOUI documentation on MediaWiki] [1] for more information and examples.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Inputs#SearchInputWidget
 *
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

	// Parent constructor
	OO.ui.SearchInputWidget.parent.call( this, config );

	// Events
	this.connect( this, {
		change: 'onChange'
	} );
	this.$indicator.on( 'click', this.onIndicatorClick.bind( this ) );

	// Initialization
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
OO.ui.SearchInputWidget.prototype.getSaneType = function () {
	return 'search';
};

/**
 * Handle click events on the indicator
 *
 * @param {jQuery.Event} e Click event
 * @return {boolean}
 */
OO.ui.SearchInputWidget.prototype.onIndicatorClick = function ( e ) {
	if ( e.which === OO.ui.MouseButtons.LEFT ) {
		// Clear the text field
		this.setValue( '' );
		this.focus();
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
 * Handle change events.
 *
 * @private
 */
OO.ui.SearchInputWidget.prototype.onChange = function () {
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
