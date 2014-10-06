/**
 * Text input with a menu of optional values.
 *
 * @class
 * @extends OO.ui.Widget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {Object} [menu] Configuration options to pass to menu widget
 * @cfg {Object} [input] Configuration options to pass to input widget
 * @cfg {jQuery} [$overlay] Overlay layer; defaults to the current window's overlay.
 */
OO.ui.ComboBoxWidget = function OoUiComboBoxWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.ComboBoxWidget.super.call( this, config );

	// Properties
	this.$overlay = config.$overlay || ( this.$.$iframe || this.$element ).closest( '.oo-ui-window' ).children( '.oo-ui-window-overlay' );
	if ( this.$overlay.length === 0 ) {
		this.$overlay = this.$( 'body' );
	}
	this.input = new OO.ui.TextInputWidget( $.extend(
		{ $: this.$, indicator: 'down', disabled: this.isDisabled() },
		config.input
	) );
	this.menu = new OO.ui.TextInputMenuWidget( this.input, $.extend(
		{ $: this.$, widget: this, input: this.input, disabled: this.isDisabled() },
		config.menu
	) );

	// Events
	this.input.connect( this, {
		change: 'onInputChange',
		indicator: 'onInputIndicator',
		enter: 'onInputEnter'
	} );
	this.menu.connect( this, {
		choose: 'onMenuChoose',
		add: 'onMenuItemsChange',
		remove: 'onMenuItemsChange'
	} );

	// Initialization
	this.$element.addClass( 'oo-ui-comboBoxWidget' ).append( this.input.$element );
	this.$overlay.append( this.menu.$element );
	this.onMenuItemsChange();
};

/* Setup */

OO.inheritClass( OO.ui.ComboBoxWidget, OO.ui.Widget );

/* Methods */

/**
 * Handle input change events.
 *
 * @param {string} value New value
 */
OO.ui.ComboBoxWidget.prototype.onInputChange = function ( value ) {
	var match = this.menu.getItemFromData( value );

	this.menu.selectItem( match );

	if ( !this.isDisabled() ) {
		this.menu.toggle( true );
	}
};

/**
 * Handle input indicator events.
 */
OO.ui.ComboBoxWidget.prototype.onInputIndicator = function () {
	if ( !this.isDisabled() ) {
		this.menu.toggle();
	}
};

/**
 * Handle input enter events.
 */
OO.ui.ComboBoxWidget.prototype.onInputEnter = function () {
	if ( !this.isDisabled() ) {
		this.menu.toggle( false );
	}
};

/**
 * Handle menu choose events.
 *
 * @param {OO.ui.OptionWidget} item Chosen item
 */
OO.ui.ComboBoxWidget.prototype.onMenuChoose = function ( item ) {
	if ( item ) {
		this.input.setValue( item.getData() );
	}
};

/**
 * Handle menu item change events.
 */
OO.ui.ComboBoxWidget.prototype.onMenuItemsChange = function () {
	this.$element.toggleClass( 'oo-ui-comboBoxWidget-empty', this.menu.isEmpty() );
};

/**
 * @inheritdoc
 */
OO.ui.ComboBoxWidget.prototype.setDisabled = function ( disabled ) {
	// Parent method
	OO.ui.ComboBoxWidget.super.prototype.setDisabled.call( this, disabled );

	if ( this.input ) {
		this.input.setDisabled( this.isDisabled() );
	}
	if ( this.menu ) {
		this.menu.setDisabled( this.isDisabled() );
	}

	return this;
};
