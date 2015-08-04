/**
 * ButtonOptionWidget is a special type of {@link OO.ui.mixin.ButtonElement button element} that
 * can be selected and configured with data. The class is
 * used with OO.ui.ButtonSelectWidget to create a selection of button options. Please see the
 * [OOjs UI documentation on MediaWiki] [1] for more information.
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Selects_and_Options#Button_selects_and_options
 *
 * @class
 * @extends OO.ui.DecoratedOptionWidget
 * @mixins OO.ui.mixin.ButtonElement
 * @mixins OO.ui.mixin.TabIndexedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.ButtonOptionWidget = function OoUiButtonOptionWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.ButtonOptionWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.ButtonElement.call( this, config );
	OO.ui.mixin.TabIndexedElement.call( this, $.extend( {}, config, {
		$tabIndexed: this.$button,
		tabIndex: -1
	} ) );

	// Initialization
	this.$element.addClass( 'oo-ui-buttonOptionWidget' );
	this.$button.append( this.$element.contents() );
	this.$element.append( this.$button );
};

/* Setup */

OO.inheritClass( OO.ui.ButtonOptionWidget, OO.ui.DecoratedOptionWidget );
OO.mixinClass( OO.ui.ButtonOptionWidget, OO.ui.mixin.ButtonElement );
OO.mixinClass( OO.ui.ButtonOptionWidget, OO.ui.mixin.TabIndexedElement );

/* Static Properties */

// Allow button mouse down events to pass through so they can be handled by the parent select widget
OO.ui.ButtonOptionWidget.static.cancelButtonMouseDownEvents = false;

OO.ui.ButtonOptionWidget.static.highlightable = false;

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.ButtonOptionWidget.prototype.setSelected = function ( state ) {
	OO.ui.ButtonOptionWidget.parent.prototype.setSelected.call( this, state );

	if ( this.constructor.static.selectable ) {
		this.setActive( state );
	}

	return this;
};
