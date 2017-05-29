/**
 * CheckboxInputWidgets, like HTML checkboxes, can be selected and/or configured with a value.
 * Note that these {@link OO.ui.InputWidget input widgets} are best laid out
 * in {@link OO.ui.FieldLayout field layouts} that use the {@link OO.ui.FieldLayout#align inline}
 * alignment. For more information, please see the [OOjs UI documentation on MediaWiki][1].
 *
 * This widget can be used inside an HTML form, such as a OO.ui.FormLayout.
 *
 *     @example
 *     // An example of selected, unselected, and disabled checkbox inputs
 *     var checkbox1=new OO.ui.CheckboxInputWidget( {
 *          value: 'a',
 *          selected: true
 *     } );
 *     var checkbox2=new OO.ui.CheckboxInputWidget( {
 *         value: 'b'
 *     } );
 *     var checkbox3=new OO.ui.CheckboxInputWidget( {
 *         value:'c',
 *         disabled: true
 *     } );
 *     // Create a fieldset layout with fields for each checkbox.
 *     var fieldset = new OO.ui.FieldsetLayout( {
 *         label: 'Checkboxes'
 *     } );
 *     fieldset.addItems( [
 *         new OO.ui.FieldLayout( checkbox1, { label: 'Selected checkbox', align: 'inline' } ),
 *         new OO.ui.FieldLayout( checkbox2, { label: 'Unselected checkbox', align: 'inline' } ),
 *         new OO.ui.FieldLayout( checkbox3, { label: 'Disabled checkbox', align: 'inline' } ),
 *     ] );
 *     $( 'body' ).append( fieldset.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Inputs
 *
 * @class
 * @extends OO.ui.InputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [selected=false] Select the checkbox initially. By default, the checkbox is not selected.
 */
OO.ui.CheckboxInputWidget = function OoUiCheckboxInputWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.CheckboxInputWidget.parent.call( this, config );

	// Initialization
	this.$element
		.addClass( 'oo-ui-checkboxInputWidget' )
		// Required for pretty styling in WikimediaUI theme
		.append( $( '<span>' ) );
	this.setSelected( config.selected !== undefined ? config.selected : false );
};

/* Setup */

OO.inheritClass( OO.ui.CheckboxInputWidget, OO.ui.InputWidget );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.CheckboxInputWidget.static.tagName = 'span';

/* Static Methods */

/**
 * @inheritdoc
 */
OO.ui.CheckboxInputWidget.static.gatherPreInfuseState = function ( node, config ) {
	var state = OO.ui.CheckboxInputWidget.parent.static.gatherPreInfuseState( node, config );
	state.checked = config.$input.prop( 'checked' );
	return state;
};

/* Methods */

/**
 * @inheritdoc
 * @protected
 */
OO.ui.CheckboxInputWidget.prototype.getInputElement = function () {
	return $( '<input>' ).attr( 'type', 'checkbox' );
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxInputWidget.prototype.onEdit = function () {
	var widget = this;
	if ( !this.isDisabled() ) {
		// Allow the stack to clear so the value will be updated
		setTimeout( function () {
			widget.setSelected( widget.$input.prop( 'checked' ) );
		} );
	}
};

/**
 * Set selection state of this checkbox.
 *
 * @param {boolean} state `true` for selected
 * @chainable
 */
OO.ui.CheckboxInputWidget.prototype.setSelected = function ( state ) {
	state = !!state;
	if ( this.selected !== state ) {
		this.selected = state;
		this.$input.prop( 'checked', this.selected );
		this.emit( 'change', this.selected );
	}
	return this;
};

/**
 * Check if this checkbox is selected.
 *
 * @return {boolean} Checkbox is selected
 */
OO.ui.CheckboxInputWidget.prototype.isSelected = function () {
	// Resynchronize our internal data with DOM data. Other scripts executing on the page can modify
	// it, and we won't know unless they're kind enough to trigger a 'change' event.
	var selected = this.$input.prop( 'checked' );
	if ( this.selected !== selected ) {
		this.setSelected( selected );
	}
	return this.selected;
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxInputWidget.prototype.simulateLabelClick = function () {
	if ( !this.isDisabled() ) {
		this.$input.click();
	}
	this.focus();
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxInputWidget.prototype.restorePreInfuseState = function ( state ) {
	OO.ui.CheckboxInputWidget.parent.prototype.restorePreInfuseState.call( this, state );
	if ( state.checked !== undefined && state.checked !== this.isSelected() ) {
		this.setSelected( state.checked );
	}
};
