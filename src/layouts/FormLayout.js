/**
 * FormLayouts are used to wrap {@link OO.ui.FieldsetLayout FieldsetLayouts} when you intend to use
 * browser-based form submission for the fields instead of handling them in JavaScript. Form layouts
 * can be configured with an HTML form action, an encoding type, and a method using the #action,
 * #enctype, and #method configs, respectively.
 * See the [OOUI documentation on MediaWiki][1] for more information and examples.
 *
 * Only widgets from the {@link OO.ui.InputWidget InputWidget} family support form submission. It
 * includes standard form elements like {@link OO.ui.CheckboxInputWidget checkboxes}, {@link
 * OO.ui.RadioInputWidget radio buttons} and {@link OO.ui.TextInputWidget text fields}, as well as
 * some fancier controls. Some controls have both regular and InputWidget variants, for example
 * OO.ui.DropdownWidget and OO.ui.DropdownInputWidget – only the latter support form submission and
 * often have simplified APIs to match the capabilities of HTML forms.
 * See the [OOUI documentation on MediaWiki][2] for more information about InputWidgets.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Layouts/Forms
 * [2]: https://www.mediawiki.org/wiki/OOUI/Widgets/Inputs
 *
 *     @example
 *     // Example of a form layout that wraps a fieldset layout.
 *     const input1 = new OO.ui.TextInputWidget( {
 *             placeholder: 'Username'
 *         } ),
 *         input2 = new OO.ui.TextInputWidget( {
 *             placeholder: 'Password',
 *             type: 'password'
 *         } ),
 *         submit = new OO.ui.ButtonInputWidget( {
 *             label: 'Submit'
 *         } ),
 *         fieldset = new OO.ui.FieldsetLayout( {
 *             label: 'A form layout'
 *         } );
 *
 *     fieldset.addItems( [
 *         new OO.ui.FieldLayout( input1, {
 *             label: 'Username',
 *             align: 'top'
 *         } ),
 *         new OO.ui.FieldLayout( input2, {
 *             label: 'Password',
 *             align: 'top'
 *         } ),
 *         new OO.ui.FieldLayout( submit )
 *     ] );
 *     const form = new OO.ui.FormLayout( {
 *         items: [ fieldset ],
 *         action: '/api/formhandler',
 *         method: 'get'
 *     } )
 *     $( document.body ).append( form.$element );
 *
 * @class
 * @extends OO.ui.Layout
 * @mixes OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {string} [config.method] HTML form `method` attribute
 * @param {string} [config.action] HTML form `action` attribute
 * @param {string} [config.enctype] HTML form `enctype` attribute
 * @param {OO.ui.FieldsetLayout[]} [config.items] Fieldset layouts to add to the form layout.
 */
OO.ui.FormLayout = function OoUiFormLayout( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.FormLayout.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.GroupElement.call( this, Object.assign( { $group: this.$element }, config ) );

	// Events
	this.$element.on( 'submit', this.onFormSubmit.bind( this ) );

	// Make sure the action is safe
	let action = config.action;
	if ( action !== undefined && !OO.ui.isSafeUrl( action ) ) {
		action = './' + action;
	}

	// Initialization
	this.$element
		.addClass( 'oo-ui-formLayout' )
		.attr( {
			method: config.method,
			action: action,
			enctype: config.enctype
		} );
	this.addItems( config.items || [] );
};

/* Setup */

OO.inheritClass( OO.ui.FormLayout, OO.ui.Layout );
OO.mixinClass( OO.ui.FormLayout, OO.ui.mixin.GroupElement );

/* Events */

/**
 * A 'submit' event is emitted when the form is submitted.
 *
 * @event OO.ui.FormLayout#submit
 */

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.FormLayout.static.tagName = 'form';

/* Methods */

/**
 * Handle form submit events.
 *
 * @private
 * @param {jQuery.Event} e Submit event
 * @fires OO.ui.FormLayout#submit
 * @return {OO.ui.FormLayout} The layout, for chaining
 */
OO.ui.FormLayout.prototype.onFormSubmit = function () {
	if ( this.emit( 'submit' ) ) {
		return false;
	}
};
