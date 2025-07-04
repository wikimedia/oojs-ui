/**
 * LabelToolGroup is a non-interactive toolgroup for displaying a label in the toolbar.
 *
 * It cannot contain any tools and does not respond to interaction.
 *
 * @class
 * @extends OO.ui.ToolGroup
 * @mixes OO.ui.mixin.IconElement
 * @mixes OO.ui.mixin.IndicatorElement
 * @mixes OO.ui.mixin.LabelElement
 * @mixes OO.ui.mixin.TitledElement
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 */
OO.ui.LabelToolGroup = function OoUiLabelToolGroup( toolbar, config ) {
	config = config || {};

	// Parent constructor
	OO.ui.LabelToolGroup.super.call( this, toolbar, config );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.TitledElement.call( this, config );

	// LabelToolGroup cannot contain tools.
	this.$group.remove();

	// Use a $handle like PopupToolGroup so styles can be shared more easily
	this.$handle = $( '<span>' ).addClass( 'oo-ui-toolGroup-handle oo-ui-labelToolGroup-handle' );

	this.$handle.append( this.$icon, this.$label, this.$indicator );
	this.$element
		.addClass( 'oo-ui-labelToolGroup' )
		.prepend( this.$handle );
};

OO.inheritClass( OO.ui.LabelToolGroup, OO.ui.ToolGroup );
OO.mixinClass( OO.ui.LabelToolGroup, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.LabelToolGroup, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.LabelToolGroup, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.LabelToolGroup, OO.ui.mixin.TitledElement );

/*  Static properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.LabelToolGroup.static.name = 'label';

/* Methods */

/**
 * LabelToolGroup cannot contain tools.
 *
 * @inheritdoc
 */
OO.ui.LabelToolGroup.prototype.populate = function () {};
