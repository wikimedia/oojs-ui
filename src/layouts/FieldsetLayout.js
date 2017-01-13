/**
 * FieldsetLayouts are composed of one or more {@link OO.ui.FieldLayout FieldLayouts},
 * which each contain an individual widget and, optionally, a label. Each Fieldset can be
 * configured with a label as well. For more information and examples,
 * please see the [OOjs UI documentation on MediaWiki][1].
 *
 *     @example
 *     // Example of a fieldset layout
 *     var input1 = new OO.ui.TextInputWidget( {
 *         placeholder: 'A text input field'
 *     } );
 *
 *     var input2 = new OO.ui.TextInputWidget( {
 *         placeholder: 'A text input field'
 *     } );
 *
 *     var fieldset = new OO.ui.FieldsetLayout( {
 *         label: 'Example of a fieldset layout'
 *     } );
 *
 *     fieldset.addItems( [
 *         new OO.ui.FieldLayout( input1, {
 *             label: 'Field One'
 *         } ),
 *         new OO.ui.FieldLayout( input2, {
 *             label: 'Field Two'
 *         } )
 *     ] );
 *     $( 'body' ).append( fieldset.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Layouts/Fields_and_Fieldsets
 *
 * @class
 * @extends OO.ui.Layout
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {OO.ui.FieldLayout[]} [items] An array of fields to add to the fieldset. See OO.ui.FieldLayout for more information about fields.
 * @cfg {string|OO.ui.HtmlSnippet} [help] Help text. When help text is specified, a "help" icon will appear
 *  in the upper-right corner of the rendered field; clicking it will display the text in a popup.
 *  For important messages, you are advised to use `notices`, as they are always shown.
 */
OO.ui.FieldsetLayout = function OoUiFieldsetLayout( config ) {
	var $div;

	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.FieldsetLayout.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, $.extend( {}, config, { $label: $( '<div>' ) } ) );
	OO.ui.mixin.GroupElement.call( this, config );

	// Properties
	this.$header = $( '<div>' );
	if ( config.help ) {
		this.popupButtonWidget = new OO.ui.PopupButtonWidget( {
			classes: [ 'oo-ui-fieldsetLayout-help' ],
			framed: false,
			icon: 'info'
		} );

		$div = $( '<div>' );
		if ( config.help instanceof OO.ui.HtmlSnippet ) {
			$div.html( config.help.toString() );
		} else {
			$div.text( config.help );
		}
		this.popupButtonWidget.getPopup().$body.append(
			$div.addClass( 'oo-ui-fieldsetLayout-help-content' )
		);
		this.$help = this.popupButtonWidget.$element;
	} else {
		this.$help = $( [] );
	}

	// Initialization
	this.$header
		.addClass( 'oo-ui-fieldsetLayout-header' )
		.append( this.$icon, this.$label, this.$help );
	this.$group.addClass( 'oo-ui-fieldsetLayout-group' );
	this.$element
		.addClass( 'oo-ui-fieldsetLayout' )
		.prepend( this.$header, this.$group );
	if ( Array.isArray( config.items ) ) {
		this.addItems( config.items );
	}
};

/* Setup */

OO.inheritClass( OO.ui.FieldsetLayout, OO.ui.Layout );
OO.mixinClass( OO.ui.FieldsetLayout, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.FieldsetLayout, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.FieldsetLayout, OO.ui.mixin.GroupElement );

/* Static Properties */

OO.ui.FieldsetLayout.static.tagName = 'fieldset';
