/**
 * CheckboxInputWidgets, like HTML checkboxes, can be selected and/or configured with a value.
 * Note that these {@link OO.ui.InputWidget input widgets} are best laid out
 * in {@link OO.ui.FieldLayout field layouts} that use the {@link OO.ui.FieldLayout#align inline}
 * alignment. For more information, please see the [OOUI documentation on MediaWiki][1].
 *
 * This widget can be used inside an HTML form, such as a OO.ui.FormLayout.
 *
 *     @example
 *     // An example of selected, unselected, and disabled checkbox inputs.
 *     var checkbox1 = new OO.ui.CheckboxInputWidget( {
 *             value: 'a',
 *              selected: true
 *         } ),
 *         checkbox2 = new OO.ui.CheckboxInputWidget( {
 *             value: 'b'
 *         } ),
 *         checkbox3 = new OO.ui.CheckboxInputWidget( {
 *             value:'c',
 *             disabled: true
 *         } ),
 *         // Create a fieldset layout with fields for each checkbox.
 *         fieldset = new OO.ui.FieldsetLayout( {
 *             label: 'Checkboxes'
 *         } );
 *     fieldset.addItems( [
 *         new OO.ui.FieldLayout( checkbox1, { label: 'Selected checkbox', align: 'inline' } ),
 *         new OO.ui.FieldLayout( checkbox2, { label: 'Unselected checkbox', align: 'inline' } ),
 *         new OO.ui.FieldLayout( checkbox3, { label: 'Disabled checkbox', align: 'inline' } ),
 *     ] );
 *     $( document.body ).append( fieldset.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Inputs
 *
 * @class
 * @extends OO.ui.InputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [selected=false] Select the checkbox initially. By default, the checkbox is
 *  not selected.
 * @cfg {boolean} [indeterminate=false] Whether the checkbox is in the indeterminate state.
 */
OO.ui.CheckboxInputWidget = function OoUiCheckboxInputWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.CheckboxInputWidget.parent.call( this, config );

	// Properties
	this.checkIcon = new OO.ui.IconWidget( {
		icon: 'check',
		classes: [ 'oo-ui-checkboxInputWidget-checkIcon' ]
	} );

	// Initialization
	this.$element
		.addClass( 'oo-ui-checkboxInputWidget' )
		// Required for pretty styling in WikimediaUI theme
		.append( this.checkIcon.$element );
	this.setSelected( config.selected !== undefined ? config.selected : false );
	this.setIndeterminate( config.indeterminate !== undefined ? config.indeterminate : false );
};

/* Setup */

OO.inheritClass( OO.ui.CheckboxInputWidget, OO.ui.InputWidget );

/* Events */

/**
 * @event change
 *
 * A change event is emitted when the state of the input changes.
 *
 * @param {boolean} selected
 * @param {boolean} indeterminate
 */

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
			widget.setIndeterminate( widget.$input.prop( 'indeterminate' ) );
		} );
	}
};

/**
 * Set selection state of this checkbox.
 *
 * @param {boolean} state Selected state
 * @param {boolean} internal Used for internal calls to suppress events
 * @chainable
 * @return {OO.ui.CheckboxInputWidget} The widget, for chaining
 */
OO.ui.CheckboxInputWidget.prototype.setSelected = function ( state, internal ) {
	state = !!state;
	if ( this.selected !== state ) {
		this.selected = state;
		this.$input.prop( 'checked', this.selected );
		if ( !internal ) {
			this.setIndeterminate( false, true );
			this.emit( 'change', this.selected, this.indeterminate );
		}
	}
	// The first time that the selection state is set (probably while constructing the widget),
	// remember it in defaultSelected. This property can be later used to check whether
	// the selection state of the input has been changed since it was created.
	if ( this.defaultSelected === undefined ) {
		this.defaultSelected = this.selected;
		this.$input[ 0 ].defaultChecked = this.defaultSelected;
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
 * Set indeterminate state of this checkbox.
 *
 * @param {boolean} state Indeterminate state
 * @param {boolean} internal Used for internal calls to suppress events
 * @chainable
 * @return {OO.ui.CheckboxInputWidget} The widget, for chaining
 */
OO.ui.CheckboxInputWidget.prototype.setIndeterminate = function ( state, internal ) {
	state = !!state;
	if ( this.indeterminate !== state ) {
		this.indeterminate = state;
		this.$input.prop( 'indeterminate', this.indeterminate );
		if ( !internal ) {
			this.setSelected( false, true );
			this.emit( 'change', this.selected, this.indeterminate );
		}
	}
	return this;
};

/**
 * Check if this checkbox is selected.
 *
 * @return {boolean} Checkbox is selected
 */
OO.ui.CheckboxInputWidget.prototype.isIndeterminate = function () {
	// Resynchronize our internal data with DOM data. Other scripts executing on the page can modify
	// it, and we won't know unless they're kind enough to trigger a 'change' event.
	var indeterminate = this.$input.prop( 'indeterminate' );
	if ( this.indeterminate !== indeterminate ) {
		this.setIndeterminate( indeterminate );
	}
	return this.indeterminate;
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxInputWidget.prototype.simulateLabelClick = function () {
	if ( !this.isDisabled() ) {
		this.$handle.trigger( 'click' );
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
