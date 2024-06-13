/**
 * FieldLayouts are used with OO.ui.FieldsetLayout. Each FieldLayout requires a field-widget,
 * which is a widget that is specified by reference before any optional configuration settings.
 *
 * Field layouts can be configured with help text and/or labels. Labels are aligned in one of
 * four ways:
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
 * Help text can either be:
 *
 * - accessed via a help icon that appears in the upper right corner of the rendered field layout,
 *   or
 * - shown as a subtle explanation below the label.
 *
 * If the help text is brief, or is essential to always expose it, set `helpInline` to `true`.
 * If it is long or not essential, leave `helpInline` to its default, `false`.
 *
 * Please see the [OOUI documentation on MediaWiki][1] for examples and more information.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Layouts/Fields_and_Fieldsets
 *
 * @class
 * @extends OO.ui.Layout
 * @mixes OO.ui.mixin.LabelElement
 * @mixes OO.ui.mixin.TitledElement
 *
 * @constructor
 * @param {OO.ui.Widget} fieldWidget Field widget
 * @param {Object} [config] Configuration options
 * @param {string} [config.align='left'] Alignment of the label: 'left', 'right', 'top'
 *  or 'inline'
 * @param {Array} [config.errors] Error messages about the widget, which will be
 *  displayed below the widget.
 * @param {Array} [config.warnings] Warning messages about the widget, which will be
 *  displayed below the widget.
 * @param {Array} [config.successMessages] Success messages on user interactions with the widget,
 *  which will be displayed below the widget.
 *  The array may contain strings or OO.ui.HtmlSnippet instances.
 * @param {Array} [config.notices] Notices about the widget, which will be displayed
 *  below the widget.
 *  The array may contain strings or OO.ui.HtmlSnippet instances.
 *  These are more visible than `help` messages when `helpInline` is set, and so
 *  might be good for transient messages.
 * @param {string|OO.ui.HtmlSnippet} [config.help] Help text. When help text is specified
 *  and `helpInline` is `false`, a "help" icon will appear in the upper-right
 *  corner of the rendered field; clicking it will display the text in a popup.
 *  If `helpInline` is `true`, then a subtle description will be shown after the
 *  label.
 * @param {boolean} [config.helpInline=false] Whether or not the help should be inline,
 *  or shown when the "help" icon is clicked.
 * @param {jQuery} [config.$overlay] Passed to OO.ui.PopupButtonWidget for help popup, if
 * `help` is given.
 *  See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
 *
 * @throws {Error} An error is thrown if no widget is specified
 *
 * @property {OO.ui.Widget} fieldWidget
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

	// Configuration initialization
	config = Object.assign( { align: 'left', helpInline: false }, config );

	if ( config.help && !config.label ) {
		// Add an empty label. For some combinations of 'helpInline' and 'align'
		// there would be no space in the interface to display the help text otherwise.
		config.label = ' ';
	}

	// Parent constructor
	OO.ui.FieldLayout.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.LabelElement.call( this, Object.assign( {
		$label: $( '<label>' )
	}, config ) );
	OO.ui.mixin.TitledElement.call( this, Object.assign( { $titled: this.$label }, config ) );

	// Properties
	this.fieldWidget = fieldWidget;
	this.errors = [];
	this.warnings = [];
	this.successMessages = [];
	this.notices = [];
	this.$field = this.isFieldInline() ? $( '<span>' ) : $( '<div>' );
	this.$messages = $( '<div>' );
	this.$header = $( '<span>' );
	this.$body = $( '<div>' );
	this.align = null;
	this.helpInline = config.helpInline;

	// Events
	this.fieldWidget.connect( this, {
		disable: 'onFieldDisable'
	} );

	// Initialization
	this.$help = config.help ?
		this.createHelpElement( config.help, config.$overlay ) :
		$( [] );
	if ( this.fieldWidget.getInputId() ) {
		this.$label.attr( 'for', this.fieldWidget.getInputId() );
		if ( this.helpInline ) {
			this.$help.attr( 'for', this.fieldWidget.getInputId() );
		}
	} else {
		// We can't use `label for` with non-form elements, use `aria-labelledby` instead
		const id = OO.ui.generateElementId();
		this.$label.attr( 'id', id );
		this.fieldWidget.setLabelledBy( id );

		// Forward clicks on the label to the widget, like `label for` would do
		this.$label.on( 'click', this.onLabelClick.bind( this ) );
		if ( this.helpInline ) {
			this.$help.on( 'click', this.onLabelClick.bind( this ) );
		}
	}
	this.$element
		.addClass( 'oo-ui-fieldLayout' )
		.toggleClass( 'oo-ui-fieldLayout-disabled', this.fieldWidget.isDisabled() )
		.append( this.$body );
	this.$body.addClass( 'oo-ui-fieldLayout-body' );
	this.$header.addClass( 'oo-ui-fieldLayout-header' );
	this.$messages.addClass( 'oo-ui-fieldLayout-messages' );
	this.$field
		.addClass( 'oo-ui-fieldLayout-field' )
		.append( this.fieldWidget.$element );

	this.setErrors( config.errors || [] );
	this.setWarnings( config.warnings || [] );
	this.setSuccess( config.successMessages || [] );
	this.setNotices( config.notices || [] );
	this.setAlignment( config.align );
	// Call this again to take into account the widget's accessKey
	this.updateTitle();
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
 * Handle click events on the field label, or inline help
 *
 * @param {jQuery.Event} event
 */
OO.ui.FieldLayout.prototype.onLabelClick = function () {
	this.fieldWidget.simulateLabelClick();
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
 * Return `true` if the given field widget can be used with `'inline'` alignment (see
 * #setAlignment). Return `false` if it can't or if this can't be determined.
 *
 * @return {boolean}
 */
OO.ui.FieldLayout.prototype.isFieldInline = function () {
	// This is very simplistic, but should be good enough.
	return this.getField().$element.prop( 'tagName' ).toLowerCase() === 'span';
};

/**
 * @protected
 * @param {string} kind 'error' or 'notice'
 * @param {string|OO.ui.HtmlSnippet} text
 * @return {jQuery}
 */
OO.ui.FieldLayout.prototype.makeMessage = function ( kind, text ) {
	return new OO.ui.MessageWidget( {
		type: kind,
		inline: true,
		label: text
	} ).$element;
};

/**
 * Set the field alignment mode.
 *
 * @private
 * @param {string} value Alignment mode, either 'left', 'right', 'top' or 'inline'
 * @chainable
 * @return {OO.ui.BookletLayout} The layout, for chaining
 */
OO.ui.FieldLayout.prototype.setAlignment = function ( value ) {
	if ( value !== this.align ) {
		// Default to 'left'
		if ( [ 'left', 'right', 'top', 'inline' ].indexOf( value ) === -1 ) {
			value = 'left';
		}
		// Validate
		if ( value === 'inline' && !this.isFieldInline() ) {
			value = 'top';
		}
		// Reorder elements

		if ( this.helpInline ) {
			if ( value === 'top' ) {
				this.$header.append( this.$label );
				this.$body.append( this.$header, this.$field, this.$help );
			} else if ( value === 'inline' ) {
				this.$header.append( this.$label, this.$help );
				this.$body.append( this.$field, this.$header );
			} else {
				this.$header.append( this.$label, this.$help );
				this.$body.append( this.$header, this.$field );
			}
		} else {
			if ( value === 'top' ) {
				this.$header.append( this.$help, this.$label );
				this.$body.append( this.$header, this.$field );
			} else if ( value === 'inline' ) {
				this.$header.append( this.$help, this.$label );
				this.$body.append( this.$field, this.$header );
			} else {
				this.$header.append( this.$label );
				this.$body.append( this.$header, this.$help, this.$field );
			}
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

/**
 * Set the list of error messages.
 *
 * @param {Array} errors Error messages about the widget, which will be displayed below the widget.
 *  The array may contain strings or OO.ui.HtmlSnippet instances.
 * @chainable
 * @return {OO.ui.BookletLayout} The layout, for chaining
 */
OO.ui.FieldLayout.prototype.setErrors = function ( errors ) {
	this.errors = errors.slice();
	this.updateMessages();
	return this;
};

/**
 * Set the list of warning messages.
 *
 * @param {Array} warnings Warning messages about the widget, which will be displayed below
 *  the widget.
 *  The array may contain strings or OO.ui.HtmlSnippet instances.
 * @chainable
 * @return {OO.ui.BookletLayout} The layout, for chaining
 */
OO.ui.FieldLayout.prototype.setWarnings = function ( warnings ) {
	this.warnings = warnings.slice();
	this.updateMessages();
	return this;
};

/**
 * Set the list of success messages.
 *
 * @param {Array} successMessages Success messages about the widget, which will be displayed below
 *  the widget.
 *  The array may contain strings or OO.ui.HtmlSnippet instances.
 * @chainable
 * @return {OO.ui.BookletLayout} The layout, for chaining
 */
OO.ui.FieldLayout.prototype.setSuccess = function ( successMessages ) {
	this.successMessages = successMessages.slice();
	this.updateMessages();
	return this;
};

/**
 * Set the list of notice messages.
 *
 * @param {Array} notices Notices about the widget, which will be displayed below the widget.
 *  The array may contain strings or OO.ui.HtmlSnippet instances.
 * @chainable
 * @return {OO.ui.BookletLayout} The layout, for chaining
 */
OO.ui.FieldLayout.prototype.setNotices = function ( notices ) {
	this.notices = notices.slice();
	this.updateMessages();
	return this;
};

/**
 * Update the rendering of error, warning, success and notice messages.
 *
 * @private
 */
OO.ui.FieldLayout.prototype.updateMessages = function () {
	this.$messages.empty();

	if (
		this.errors.length ||
		this.warnings.length ||
		this.successMessages.length ||
		this.notices.length
	) {
		this.$body.after( this.$messages );
	} else {
		this.$messages.remove();
		return;
	}

	let i;
	for ( i = 0; i < this.errors.length; i++ ) {
		this.$messages.append( this.makeMessage( 'error', this.errors[ i ] ) );
	}
	for ( i = 0; i < this.warnings.length; i++ ) {
		this.$messages.append( this.makeMessage( 'warning', this.warnings[ i ] ) );
	}
	for ( i = 0; i < this.successMessages.length; i++ ) {
		this.$messages.append( this.makeMessage( 'success', this.successMessages[ i ] ) );
	}
	for ( i = 0; i < this.notices.length; i++ ) {
		this.$messages.append( this.makeMessage( 'notice', this.notices[ i ] ) );
	}
};

/**
 * Include information about the widget's accessKey in our title. TitledElement calls this method.
 * (This is a bit of a hack.)
 *
 * @protected
 * @param {string} title Tooltip label for 'title' attribute
 * @return {string}
 */
OO.ui.FieldLayout.prototype.formatTitleWithAccessKey = function ( title ) {
	if ( this.fieldWidget && this.fieldWidget.formatTitleWithAccessKey ) {
		return this.fieldWidget.formatTitleWithAccessKey( title );
	}
	return title;
};

/**
 * Creates and returns the help element. Also sets the `aria-describedby`
 * attribute on the main element of the `fieldWidget`.
 *
 * @private
 * @param {string|OO.ui.HtmlSnippet} [help] Help text.
 * @param {jQuery} [$overlay] Passed to OO.ui.PopupButtonWidget for help popup.
 * @return {jQuery} The element that should become `this.$help`.
 */
OO.ui.FieldLayout.prototype.createHelpElement = function ( help, $overlay ) {
	let helpId, helpWidget;

	if ( this.helpInline ) {
		helpWidget = new OO.ui.LabelWidget( {
			label: help,
			classes: [ 'oo-ui-inline-help' ]
		} );

		helpId = helpWidget.getElementId();
	} else {
		helpWidget = new OO.ui.PopupButtonWidget( {
			$overlay: $overlay,
			popup: {
				padded: true
			},
			classes: [ 'oo-ui-fieldLayout-help' ],
			framed: false,
			icon: 'info',
			label: OO.ui.msg( 'ooui-field-help' ),
			invisibleLabel: true
		} );

		helpWidget.popup.on( 'ready', () => {
			const $popupElement = helpWidget.popup.$element;
			$popupElement.attr( 'tabindex', 0 );
			$popupElement.trigger( 'focus' );
		} );

		helpWidget.popup.on( 'closing', () => {
			helpWidget.$button.trigger( 'focus' );
		} );

		if ( help instanceof OO.ui.HtmlSnippet ) {
			helpWidget.getPopup().$body.html( help.toString() );
		} else {
			helpWidget.getPopup().$body.text( help );
		}

		helpId = helpWidget.getPopup().getBodyId();
	}

	// Set the 'aria-describedby' attribute on the fieldWidget
	// Preference given to an input or a button
	(
		this.fieldWidget.$input ||
		( this.fieldWidget.input && this.fieldWidget.input.$input ) ||
		this.fieldWidget.$button ||
		this.fieldWidget.$element
	).attr( 'aria-describedby', helpId );

	return helpWidget.$element;
};
