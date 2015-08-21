/**
 * FieldLayouts are used with OO.ui.FieldsetLayout. Each FieldLayout requires a field-widget,
 * which is a widget that is specified by reference before any optional configuration settings.
 *
 * Field layouts can be configured with help text and/or labels. Labels are aligned in one of four ways:
 *
 * - **left**: The label is placed before the field-widget and aligned with the left margin.
 *   A left-alignment is used for forms with many fields.
 * - **right**: The label is placed before the field-widget and aligned to the right margin.
 *   A right-alignment is used for long but familiar forms which users tab through,
 *   verifying the current field with a quick glance at the label.
 * - **top**: The label is placed above the field-widget. A top-alignment is used for brief forms
 *   that users fill out from top to bottom.
 * - **inline**: The label is placed after the field-widget and aligned to the left.
 *   An inline-alignment is best used with checkboxes or radio buttons.
 *
 * Help text is accessed via a help icon that appears in the upper right corner of the rendered field layout.
 * Please see the [OOjs UI documentation on MediaWiki] [1] for examples and more information.
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Layouts/Fields_and_Fieldsets
 * @class
 * @extends OO.ui.Layout
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.TitledElement
 *
 * @constructor
 * @param {OO.ui.Widget} fieldWidget Field widget
 * @param {Object} [config] Configuration options
 * @cfg {string} [align='left'] Alignment of the label: 'left', 'right', 'top' or 'inline'
 * @cfg {Array} [errors] Error messages about the widget, which will be displayed below the widget.
 *  The array may contain strings or OO.ui.HtmlSnippet instances.
 * @cfg {Array} [notices] Notices about the widget, which will be displayed below the widget.
 *  The array may contain strings or OO.ui.HtmlSnippet instances.
 * @cfg {string|OO.ui.HtmlSnippet} [help] Help text. When help text is specified, a "help" icon will appear
 *  in the upper-right corner of the rendered field; clicking it will display the text in a popup.
 *  For important messages, you are advised to use `notices`, as they are always shown.
 *
 * @throws {Error} An error is thrown if no widget is specified
 */
OO.ui.FieldLayout = function OoUiFieldLayout( fieldWidget, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( fieldWidget ) && config === undefined ) {
		config = fieldWidget;
		fieldWidget = config.fieldWidget;
	}

	// Make sure we have required constructor arguments
	if ( fieldWidget === undefined ) {
		throw new Error( 'Widget not found' );
	}

	var hasInputWidget = fieldWidget.constructor.static.supportsSimpleLabel,
		div, i;

	// Configuration initialization
	config = $.extend( { align: 'left' }, config );

	// Parent constructor
	OO.ui.FieldLayout.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.TitledElement.call( this, $.extend( {}, config, { $titled: this.$label } ) );

	// Properties
	this.fieldWidget = fieldWidget;
	this.errors = config.errors || [];
	this.notices = config.notices || [];
	this.$field = $( '<div>' );
	this.$messages = $( '<ul>' );
	this.$body = $( '<' + ( hasInputWidget ? 'label' : 'div' ) + '>' );
	this.align = null;
	if ( config.help ) {
		this.popupButtonWidget = new OO.ui.PopupButtonWidget( {
			classes: [ 'oo-ui-fieldLayout-help' ],
			framed: false,
			icon: 'info'
		} );

		div = $( '<div>' );
		if ( config.help instanceof OO.ui.HtmlSnippet ) {
			div.html( config.help.toString() );
		} else {
			div.text( config.help );
		}
		this.popupButtonWidget.getPopup().$body.append(
			div.addClass( 'oo-ui-fieldLayout-help-content' )
		);
		this.$help = this.popupButtonWidget.$element;
	} else {
		this.$help = $( [] );
	}

	// Events
	if ( hasInputWidget ) {
		this.$label.on( 'click', this.onLabelClick.bind( this ) );
	}
	this.fieldWidget.connect( this, { disable: 'onFieldDisable' } );

	// Initialization
	this.$element
		.addClass( 'oo-ui-fieldLayout' )
		.append( this.$help, this.$body );
	if ( this.errors.length || this.notices.length ) {
		this.$element.append( this.$messages );
	}
	this.$body.addClass( 'oo-ui-fieldLayout-body' );
	this.$messages.addClass( 'oo-ui-fieldLayout-messages' );
	this.$field
		.addClass( 'oo-ui-fieldLayout-field' )
		.toggleClass( 'oo-ui-fieldLayout-disable', this.fieldWidget.isDisabled() )
		.append( this.fieldWidget.$element );

	for ( i = 0; i < this.notices.length; i++ ) {
		this.$messages.append( this.makeMessage( 'notice', this.notices[ i ] ) );
	}
	for ( i = 0; i < this.errors.length; i++ ) {
		this.$messages.append( this.makeMessage( 'error', this.errors[ i ] ) );
	}

	this.setAlignment( config.align );
};

/* Setup */

OO.inheritClass( OO.ui.FieldLayout, OO.ui.Layout );
OO.mixinClass( OO.ui.FieldLayout, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.FieldLayout, OO.ui.mixin.TitledElement );

/* Methods */

/**
 * Handle field disable events.
 *
 * @private
 * @param {boolean} value Field is disabled
 */
OO.ui.FieldLayout.prototype.onFieldDisable = function ( value ) {
	this.$element.toggleClass( 'oo-ui-fieldLayout-disabled', value );
};

/**
 * Handle label mouse click events.
 *
 * @private
 * @param {jQuery.Event} e Mouse click event
 */
OO.ui.FieldLayout.prototype.onLabelClick = function () {
	this.fieldWidget.simulateLabelClick();
	return false;
};

/**
 * Get the widget contained by the field.
 *
 * @return {OO.ui.Widget} Field widget
 */
OO.ui.FieldLayout.prototype.getField = function () {
	return this.fieldWidget;
};

/**
 * @param {string} kind 'error' or 'notice'
 * @param {string|OO.ui.HtmlSnippet} text
 * @return {jQuery}
 */
OO.ui.FieldLayout.prototype.makeMessage = function ( kind, text ) {
	var $listItem, $icon, message;
	$listItem = $( '<li>' );
	if ( kind === 'error' ) {
		$icon = new OO.ui.IconWidget( { icon: 'alert', flags: [ 'warning' ] } ).$element;
	} else if ( kind === 'notice' ) {
		$icon = new OO.ui.IconWidget( { icon: 'info' } ).$element;
	} else {
		$icon = '';
	}
	message = new OO.ui.LabelWidget( { label: text } );
	$listItem
		.append( $icon, message.$element )
		.addClass( 'oo-ui-fieldLayout-messages-' + kind );
	return $listItem;
};

/**
 * Set the field alignment mode.
 *
 * @private
 * @param {string} value Alignment mode, either 'left', 'right', 'top' or 'inline'
 * @chainable
 */
OO.ui.FieldLayout.prototype.setAlignment = function ( value ) {
	if ( value !== this.align ) {
		// Default to 'left'
		if ( [ 'left', 'right', 'top', 'inline' ].indexOf( value ) === -1 ) {
			value = 'left';
		}
		// Reorder elements
		if ( value === 'inline' ) {
			this.$body.append( this.$field, this.$label );
		} else {
			this.$body.append( this.$label, this.$field );
		}
		// Set classes. The following classes can be used here:
		// * oo-ui-fieldLayout-align-left
		// * oo-ui-fieldLayout-align-right
		// * oo-ui-fieldLayout-align-top
		// * oo-ui-fieldLayout-align-inline
		if ( this.align ) {
			this.$element.removeClass( 'oo-ui-fieldLayout-align-' + this.align );
		}
		this.$element.addClass( 'oo-ui-fieldLayout-align-' + value );
		this.align = value;
	}

	return this;
};
