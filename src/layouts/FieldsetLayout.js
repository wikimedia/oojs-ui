/**
 * FieldsetLayouts are composed of one or more {@link OO.ui.FieldLayout FieldLayouts},
 * which each contain an individual widget and, optionally, a label. Each Fieldset can be
 * configured with a label as well. For more information and examples,
 * please see the [OOUI documentation on MediaWiki][1].
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
 *     $( document.body ).append( fieldset.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Layouts/Fields_and_Fieldsets
 *
 * @class
 * @extends OO.ui.Layout
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.GroupElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {OO.ui.FieldLayout[]} [items] An array of fields to add to the fieldset.
 *  See OO.ui.FieldLayout for more information about fields.
 * @cfg {string|OO.ui.HtmlSnippet} [help] Help text. When help text is specified
 *  and `helpInline` is `false`, a "help" icon will appear in the upper-right
 *  corner of the rendered field; clicking it will display the text in a popup.
 *  If `helpInline` is `true`, then a subtle description will be shown after the
 *  label.
 *  For feedback messages, you are advised to use `notices`.
 * @cfg {boolean} [helpInline=false] Whether or not the help should be inline,
 *  or shown when the "help" icon is clicked.
 * @cfg {jQuery} [$overlay] Passed to OO.ui.PopupButtonWidget for help popup, if `help` is given.
 *  See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
 */
OO.ui.FieldsetLayout = function OoUiFieldsetLayout( config ) {
	var helpWidget;

	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.FieldsetLayout.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.GroupElement.call( this, config );

	// Properties
	this.$header = $( '<legend>' );

	// Initialization
	this.$header
		.addClass( 'oo-ui-fieldsetLayout-header' )
		.append( this.$icon, this.$label );
	this.$group.addClass( 'oo-ui-fieldsetLayout-group' );
	this.$element
		.addClass( 'oo-ui-fieldsetLayout' )
		.prepend( this.$header, this.$group );

	// Help
	if ( config.help ) {
		if ( config.helpInline ) {
			helpWidget = new OO.ui.LabelWidget( {
				label: config.help,
				classes: [ 'oo-ui-inline-help' ]
			} );
			this.$element.prepend( this.$header, helpWidget.$element, this.$group );
		} else {
			helpWidget = new OO.ui.PopupButtonWidget( {
				$overlay: config.$overlay,
				popup: {
					padded: true
				},
				classes: [ 'oo-ui-fieldsetLayout-help' ],
				framed: false,
				icon: 'info',
				label: OO.ui.msg( 'ooui-field-help' ),
				invisibleLabel: true
			} );
			if ( config.help instanceof OO.ui.HtmlSnippet ) {
				helpWidget.getPopup().$body.html( config.help.toString() );
			} else {
				helpWidget.getPopup().$body.text( config.help );
			}
			this.$header.append( helpWidget.$element );
		}
	}
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

/**
 * @static
 * @inheritdoc
 */
OO.ui.FieldsetLayout.static.tagName = 'fieldset';
