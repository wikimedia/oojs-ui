/**
 * A basic tag multiselect widget, similar in concept to
 * {@link OO.ui.ComboBoxInputWidget combo box widget} that allows the user to add multiple values
 * that are displayed in a tag area.
 *
 * This widget is a base widget; see {@link OO.ui.MenuTagMultiselectWidget MenuTagMultiselectWidget}
 * and {@link OO.ui.PopupTagMultiselectWidget PopupTagMultiselectWidget} for the implementations
 * that use a menu and a popup respectively.
 *
 *     @example
 *     // A TagMultiselectWidget.
 *     const widget = new OO.ui.TagMultiselectWidget( {
 *         inputPosition: 'outline',
 *         allowedValues: [ 'Option 1', 'Option 2', 'Option 3' ],
 *         selected: [ 'Option 1' ]
 *     } );
 *     $( document.body ).append( widget.$element );
 *
 * @class
 * @extends OO.ui.Widget
 * @mixes OO.ui.mixin.GroupWidget
 * @mixes OO.ui.mixin.DraggableGroupElement
 * @mixes OO.ui.mixin.IndicatorElement
 * @mixes OO.ui.mixin.IconElement
 * @mixes OO.ui.mixin.TabIndexedElement
 * @mixes OO.ui.mixin.FlaggedElement
 * @mixes OO.ui.mixin.TitledElement
 *
 * @constructor
 * @param {Object} config Configuration object
 * @param {Object} [config.input] Configuration options for the input widget
 * @param {OO.ui.InputWidget} [config.inputWidget] An optional input widget. If given, it will
 *  replace the input widget used in the TagMultiselectWidget. If not given,
 *  TagMultiselectWidget creates its own.
 * @param {boolean} [config.inputPosition='inline'] Position of the input. Options are:
 *  - inline: The input is invisible, but exists inside the tag list, so
 *    the user types into the tag groups to add tags.
 *  - outline: The input is underneath the tag area.
 *  - none: No input supplied
 * @param {string} [config.placeholder] Placeholder text for the input box
 * @param {boolean} [config.allowEditTags=true] Allow editing of the tags by clicking them
 * @param {boolean} [config.allowArbitrary=false] Allow data items to be added even if
 *  not present in the menu.
 * @param {any[]} [config.allowedValues] An array representing the allowed items
 *  by their datas.
 * @param {boolean} [config.allowDuplicates=false] Allow duplicate items to be added
 * @param {boolean} [config.allowDisplayInvalidTags=false] Allow the display of
 *  invalid tags. These tags will display with an invalid state, and
 *  the widget as a whole will have an invalid state if any invalid tags
 *  are present.
 * @param {number} [config.tagLimit] An optional limit on the number of selected options.
 *  If 'tagLimit' is set and is reached, the input is disabled, not allowing any
 *  additions. If 'tagLimit' is unset or is 0, an unlimited number of items can be
 *  added.
 * @param {boolean} [config.allowReordering=true] Allow reordering of the items
 * @param {Object[]|string[]} [config.selected] A set of selected tags. If given,
 *  these will appear in the tag list on initialization, as long as they
 *  pass the validity tests.
 */
OO.ui.TagMultiselectWidget = function OoUiTagMultiselectWidget( config ) {
	const rAF = window.requestAnimationFrame || setTimeout,
		$tabFocus = $( '<span>' ).addClass( 'oo-ui-tagMultiselectWidget-focusTrap' );

	config = config || {};

	// Parent constructor
	OO.ui.TagMultiselectWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.GroupWidget.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.TabIndexedElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.DraggableGroupElement.call( this, config );
	OO.ui.mixin.TitledElement.call( this, config );

	this.toggleDraggable(
		config.allowReordering === undefined ?
			true : !!config.allowReordering
	);

	this.inputPosition =
		this.constructor.static.allowedInputPositions.indexOf( config.inputPosition ) > -1 ?
			config.inputPosition : 'inline';
	this.allowEditTags = config.allowEditTags === undefined ? true : !!config.allowEditTags;
	this.allowArbitrary = !!config.allowArbitrary;
	this.allowDuplicates = !!config.allowDuplicates;
	this.allowedValues = config.allowedValues || [];
	this.allowDisplayInvalidTags = config.allowDisplayInvalidTags;
	this.hasInput = this.inputPosition !== 'none';
	this.tagLimit = config.tagLimit;
	this.height = null;
	this.valid = true;

	this.$content = $( '<div>' ).addClass( 'oo-ui-tagMultiselectWidget-content' );
	this.$handle = $( '<div>' )
		.addClass( 'oo-ui-tagMultiselectWidget-handle' )
		.append(
			this.$indicator,
			this.$icon,
			this.$content
				.append(
					this.$group.addClass( 'oo-ui-tagMultiselectWidget-group' )
				)
		);

	// Events
	this.aggregate( {
		remove: 'itemRemove',
		navigate: 'itemNavigate',
		select: 'itemSelect',
		fixed: 'itemFixed'
	} );
	this.connect( this, {
		itemRemove: 'onTagRemove',
		itemSelect: 'onTagSelect',
		itemFixed: 'onTagFixed',
		itemNavigate: 'onTagNavigate',
		change: 'onChangeTags'
	} );
	this.$handle.on( {
		mousedown: this.onMouseDown.bind( this )
	} );

	// Initialize
	this.$element
		.addClass( 'oo-ui-tagMultiselectWidget' )
		.append( this.$handle );

	if ( this.hasInput ) {
		if ( config.inputWidget ) {
			this.input = config.inputWidget;
		} else {
			this.input = new OO.ui.TextInputWidget( Object.assign( {
				placeholder: config.placeholder,
				classes: [ 'oo-ui-tagMultiselectWidget-input' ]
			}, config.input ) );
		}
		this.input.setDisabled( this.isDisabled() );

		const inputEvents = {
			focus: this.onInputFocus.bind( this ),
			blur: this.onInputBlur.bind( this ),
			'propertychange change click mouseup keydown keyup input cut paste select focus':
				OO.ui.debounce( this.updateInputSize.bind( this ) ),
			keydown: this.onInputKeyDown.bind( this ),
			keypress: this.onInputKeyPress.bind( this )
		};

		this.input.$input.on( inputEvents );
		this.inputPlaceholder = this.input.$input.attr( 'placeholder' );

		if ( this.inputPosition === 'outline' ) {
			// Override max-height for the input widget
			// in the case the widget is outline so it can
			// stretch all the way if the widget is wide
			this.input.$element.css( 'max-width', 'inherit' );
			this.$element
				.addClass( 'oo-ui-tagMultiselectWidget-outlined' )
				.append( this.input.$element );
		} else {
			this.$element.addClass( 'oo-ui-tagMultiselectWidget-inlined' );
			// HACK: When the widget is using 'inline' input, the
			// behavior needs to only use the $input itself
			// so we style and size it accordingly (otherwise
			// the styling and sizing can get very convoluted
			// when the wrapping divs and other elements)
			// We are taking advantage of still being able to
			// call the widget itself for operations like
			// .getValue() and setDisabled() and .focus() but
			// having only the $input attached to the DOM
			this.$group.append( this.input.$input );
		}
	} else {
		this.$content.append( $tabFocus );
	}

	this.setTabIndexedElement(
		this.hasInput ?
			this.input.$input :
			$tabFocus
	);

	if ( config.selected ) {
		this.setValue( config.selected );
	}

	// HACK: Input size needs to be calculated after everything
	// else is rendered
	rAF( () => {
		if ( this.hasInput ) {
			this.updateInputSize();
		}
	} );
};

/* Initialization */

OO.inheritClass( OO.ui.TagMultiselectWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.TagMultiselectWidget, OO.ui.mixin.GroupWidget );
OO.mixinClass( OO.ui.TagMultiselectWidget, OO.ui.mixin.DraggableGroupElement );
OO.mixinClass( OO.ui.TagMultiselectWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.TagMultiselectWidget, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.TagMultiselectWidget, OO.ui.mixin.TabIndexedElement );
OO.mixinClass( OO.ui.TagMultiselectWidget, OO.ui.mixin.FlaggedElement );
OO.mixinClass( OO.ui.TagMultiselectWidget, OO.ui.mixin.TitledElement );

/* Static properties */

/**
 * Allowed input positions.
 * - inline: The input is inside the tag list
 * - outline: The input is under the tag list
 * - none: There is no input
 *
 * @property {Array}
 */
OO.ui.TagMultiselectWidget.static.allowedInputPositions = [ 'inline', 'outline', 'none' ];

/* Events */

/**
 * @event OO.ui.TagMultiselectWidget#valid
 * @param {boolean} valid
 */

/* Methods */

/**
 * Handle mouse down events.
 *
 * @private
 * @param {jQuery.Event} e Mouse down event
 * @return {boolean} False to prevent defaults
 */
OO.ui.TagMultiselectWidget.prototype.onMouseDown = function ( e ) {
	if (
		!this.isDisabled() &&
		( !this.hasInput || e.target !== this.input.$input[ 0 ] ) &&
		e.which === OO.ui.MouseButtons.LEFT
	) {
		this.focus();
		return false;
	}
};

/**
 * Handle key press events.
 *
 * @private
 * @param {jQuery.Event} e Key press event
 * @return {boolean} Whether to prevent defaults
 */
OO.ui.TagMultiselectWidget.prototype.onInputKeyPress = function ( e ) {
	const withMetaKey = e.metaKey || e.ctrlKey;

	if ( !this.isDisabled() ) {
		let stopOrContinue;
		if ( e.which === OO.ui.Keys.ENTER ) {
			stopOrContinue = this.doInputEnter( e, withMetaKey );
		}

		this.updateInputSize();
		return stopOrContinue;
	}
};

/**
 * Handle key down events.
 *
 * @private
 * @param {jQuery.Event} e Key down event
 * @return {boolean}
 */
OO.ui.TagMultiselectWidget.prototype.onInputKeyDown = function ( e ) {
	const withMetaKey = e.metaKey || e.ctrlKey;

	const isMovementInsideInput = ( dir ) => {
		const inputRange = this.input.getRange(),
			inputValue = this.hasInput && this.input.getValue();

		if ( dir === 'forwards' && inputRange.to > inputValue.length - 1 ) {
			return false;
		}

		if ( dir === 'backwards' && inputRange.from <= 0 ) {
			return false;
		}

		return true;
	};

	if ( !this.isDisabled() ) {
		// 'keypress' event is not triggered for Backspace key
		if ( e.keyCode === OO.ui.Keys.BACKSPACE ) {
			return this.doInputBackspace( e, withMetaKey );
		} else if ( e.keyCode === OO.ui.Keys.ESCAPE ) {
			return this.doInputEscape( e );
		} else if (
			e.keyCode === OO.ui.Keys.LEFT ||
			e.keyCode === OO.ui.Keys.RIGHT
		) {
			let movement;
			if ( OO.ui.Element.static.getDir( this.$element ) === 'rtl' ) {
				movement = {
					left: 'forwards',
					right: 'backwards'
				};
			} else {
				movement = {
					left: 'backwards',
					right: 'forwards'
				};
			}
			const direction = e.keyCode === OO.ui.Keys.LEFT ?
				movement.left : movement.right;

			if ( !this.hasInput || !isMovementInsideInput( direction ) ) {
				return this.doInputArrow( e, direction, withMetaKey );
			}
		}
	}
};

/**
 * Respond to input focus event
 */
OO.ui.TagMultiselectWidget.prototype.onInputFocus = function () {
	this.$element.addClass( 'oo-ui-tagMultiselectWidget-focus' );
	// Reset validity
	this.toggleValid( true );
};

/**
 * Respond to input blur event
 */
OO.ui.TagMultiselectWidget.prototype.onInputBlur = function () {
	// Skip of blur was triggered by DOM re-ordering in onChangeTags
	if ( this.changing ) {
		return;
	}

	this.$element.removeClass( 'oo-ui-tagMultiselectWidget-focus' );

	// Set the widget as invalid if there's text in the input
	this.addTagFromInput();
	this.toggleValid( this.checkValidity() && ( !this.hasInput || !this.input.getValue() ) );
};

/**
 * Perform an action after the Enter key on the input
 *
 * @param {jQuery.Event} e Event data
 * @param {boolean} [withMetaKey] Whether this key was pressed with
 * a meta key like Control
 * @return {boolean} Whether to prevent defaults
 */
OO.ui.TagMultiselectWidget.prototype.doInputEnter = function () {
	this.addTagFromInput();
	return false;
};

/**
 * Perform an action responding to the Backspace key on the input
 *
 * @param {jQuery.Event} e Event data
 * @param {boolean} [withMetaKey] Whether this key was pressed with
 * a meta key like Control
 * @return {boolean} Whether to prevent defaults
 */
OO.ui.TagMultiselectWidget.prototype.doInputBackspace = function ( e, withMetaKey ) {
	if (
		this.inputPosition === 'inline' &&
		this.input.getValue() === '' &&
		!this.isEmpty()
	) {
		// Delete the last item
		const items = this.getItems();
		const item = items[ items.length - 1 ];

		if ( !item.isDisabled() && !item.isFixed() ) {
			this.removeItems( [ item ] );
			// If Ctrl/Cmd was pressed, delete item entirely.
			// Otherwise put it into the text field for editing.
			if ( !withMetaKey ) {
				let itemLabel;
				if ( typeof item.getLabel() === 'string' ) {
					itemLabel = item.getLabel();
				} else if ( item.getLabel() instanceof $ ) {
					itemLabel = item.getLabel().text();
				}
				this.input.setValue( itemLabel );
			}
		}

		return false;
	}
};

/**
 * Perform an action after the Escape key on the input
 *
 * @param {jQuery.Event} e Event data
 */
OO.ui.TagMultiselectWidget.prototype.doInputEscape = function () {
	this.clearInput();
};

/**
 * Perform an action after the Left/Right arrow key on the input, select the previous
 * item from the input.
 * See #getPreviousItem
 *
 * @param {jQuery.Event} e Event data
 * @param {string} direction Direction of the movement; forwards or backwards
 * @param {boolean} [withMetaKey] Whether this key was pressed with
 *  a meta key like Control
 */
OO.ui.TagMultiselectWidget.prototype.doInputArrow = function ( e, direction ) {
	if (
		this.inputPosition === 'inline' &&
		!this.isEmpty() &&
		direction === 'backwards'
	) {
		// Get previous item
		this.getPreviousItem().focus();
	}
};

/**
 * Respond to item select event
 *
 * @param {OO.ui.TagItemWidget} item Selected item
 */
OO.ui.TagMultiselectWidget.prototype.onTagSelect = function ( item ) {
	if ( this.hasInput && this.allowEditTags && !item.isFixed() ) {
		if ( this.input.getValue() ) {
			this.addTagFromInput();
		}
		// 1. Get the label of the tag into the input
		this.input.setValue( item.getLabel() );
		// 2. Remove the tag
		this.removeItems( [ item ] );
		// 3. Focus the input
		this.focus();
	}
};

/**
 * Respond to item fixed state change
 *
 * @param {OO.ui.TagItemWidget} item Selected item
 */
OO.ui.TagMultiselectWidget.prototype.onTagFixed = function ( item ) {
	const items = this.getItems();

	// Move item to the end of the static items
	let i;
	for ( i = 0; i < items.length; i++ ) {
		if ( items[ i ] !== item && !items[ i ].isFixed() ) {
			break;
		}
	}
	this.addItems( [ item ], i );
};

/**
 * Respond to change event, where items were added, removed, or cleared.
 */
OO.ui.TagMultiselectWidget.prototype.onChangeTags = function () {
	const isUnderLimit = this.isUnderLimit();

	this.changing = true;

	// Reset validity
	this.toggleValid( this.checkValidity() );

	if ( this.hasInput ) {
		this.updateInputSize();
		if ( !isUnderLimit ) {
			// Clear the input
			this.input.setValue( '' );
		}
		if ( this.inputPosition === 'outline' ) {
			// Show/clear the placeholder and enable/disable the input
			// based on whether we are/aren't under the specified limit
			this.input.$input.attr( 'placeholder', isUnderLimit ? this.inputPlaceholder : '' );
			this.input.setDisabled( !isUnderLimit );
		} else {
			const hadFocus = document.activeElement === this.input.$input[ 0 ];
			// Move input to the end of the group
			this.$group.append( this.input.$input );
			// Show/hide the input
			this.input.$input.toggleClass( 'oo-ui-element-hidden', !isUnderLimit );
			if ( hadFocus && isUnderLimit ) {
				this.input.focus();
			}
		}
	}
	this.updateIfHeightChanged();

	this.changing = false;
};

/**
 * @inheritdoc
 */
OO.ui.TagMultiselectWidget.prototype.setDisabled = function ( isDisabled ) {
	// Parent method
	OO.ui.TagMultiselectWidget.super.prototype.setDisabled.call( this, isDisabled );

	if ( this.hasInput && this.input ) {
		if ( !isDisabled ) {
			this.updateInputSize();
		}
		this.input.setDisabled( !!isDisabled || !this.isUnderLimit() );
	}

	if ( this.items ) {
		this.getItems().forEach( ( item ) => {
			item.setDisabled( !!isDisabled );
		} );
	}
};

/**
 * Respond to tag remove event
 *
 * @param {OO.ui.TagItemWidget} item Removed tag
 */
OO.ui.TagMultiselectWidget.prototype.onTagRemove = function ( item ) {
	this.removeTagByData( item.getData() );
};

/**
 * Respond to navigate event on the tag
 *
 * @param {OO.ui.TagItemWidget} item Removed tag
 * @param {string} direction Direction of movement; 'forwards' or 'backwards'
 */
OO.ui.TagMultiselectWidget.prototype.onTagNavigate = function ( item, direction ) {
	const firstItem = this.getItems()[ 0 ];

	if ( direction === 'forwards' ) {
		this.getNextItem( item ).focus();
	} else if ( !this.inputPosition === 'inline' || item !== firstItem ) {
		// If the widget has an inline input, we want to stop at the starting edge
		// of the tags
		this.getPreviousItem( item ).focus();
	}
};

/**
 * Get data and label for a new tag from the input value
 *
 * @return {Object} The data and label for a tag
 */
OO.ui.TagMultiselectWidget.prototype.getTagInfoFromInput = function () {
	const val = this.input.getValue();
	return { data: val, label: val };
};

/**
 * Add tag from input value
 */
OO.ui.TagMultiselectWidget.prototype.addTagFromInput = function () {
	const tagInfo = this.getTagInfoFromInput();

	if ( !tagInfo.data ) {
		return;
	}

	if ( this.addTag( tagInfo.data, tagInfo.label ) ) {
		this.clearInput();
	}
};

/**
 * Clear the input
 */
OO.ui.TagMultiselectWidget.prototype.clearInput = function () {
	this.input.setValue( '' );
};

/**
 * Check whether the given value is a duplicate of an existing
 * tag already in the list.
 *
 * @param {any} data Requested value
 * @return {boolean} Value is duplicate
 */
OO.ui.TagMultiselectWidget.prototype.isDuplicateData = function ( data ) {
	return !!this.findItemFromData( data );
};

/**
 * Check whether a given value is allowed to be added
 *
 * @param {any} data Requested value
 * @return {boolean} Value is allowed
 */
OO.ui.TagMultiselectWidget.prototype.isAllowedData = function ( data ) {
	if (
		!this.allowDuplicates &&
		this.isDuplicateData( data )
	) {
		return false;
	}

	if ( this.allowArbitrary ) {
		return true;
	}

	// Check with allowed values
	if (
		this.getAllowedValues().some( ( value ) => data === value )
	) {
		return true;
	}

	return false;
};

/**
 * Get the allowed values list
 *
 * @return {any[]} Allowed data values
 */
OO.ui.TagMultiselectWidget.prototype.getAllowedValues = function () {
	return this.allowedValues;
};

/**
 * Add a value to the allowed values list
 *
 * @param {any} value Allowed data value
 */
OO.ui.TagMultiselectWidget.prototype.addAllowedValue = function ( value ) {
	if ( this.allowedValues.indexOf( value ) === -1 ) {
		this.allowedValues.push( value );
	}
};

/**
 * Get the datas of the currently selected items
 *
 * @return {any[]} Datas of currently selected items
 */
OO.ui.TagMultiselectWidget.prototype.getValue = function () {
	return this.getItems()
		.filter( ( item ) => item.isValid() )
		.map( ( item ) => item.getData() );
};

/**
 * Set the value of this widget by datas.
 *
 * @param {string|string[]|Object|Object[]} valueObject An object representing the data
 *  and label of the value. If the widget allows arbitrary values,
 *  the items will be added as-is. Otherwise, the data value will
 *  be checked against allowedValues.
 *  This object must contain at least a data key. Example:
 *  { data: 'foo', label: 'Foo item' }
 *  For multiple items, use an array of objects. For example:
 *  [
 *     { data: 'foo', label: 'Foo item' },
 *     { data: 'bar', label: 'Bar item' }
 *  ]
 *  Value can also be added with plaintext array, for example:
 *  [ 'foo', 'bar', 'bla' ] or a single string, like 'foo'
 */
OO.ui.TagMultiselectWidget.prototype.setValue = function ( valueObject ) {
	valueObject = Array.isArray( valueObject ) ? valueObject : [ valueObject ];

	this.clearItems();
	valueObject.forEach( ( obj ) => {
		if ( typeof obj === 'object' ) {
			this.addTag( obj.data, obj.label );
		} else {
			this.addTag( String( obj ) );
		}
	} );
};

/**
 * Add tag to the display area.
 *
 * Performs a validation check on the tag to be added.
 *
 * @param {any} data Tag data
 * @param {string|jQuery} [label=data] Tag label. If no label is provided, the
 *  stringified version of the data will be used instead.
 * @return {boolean} Item was added successfully
 */
OO.ui.TagMultiselectWidget.prototype.addTag = function ( data, label ) {
	const isValid = this.isAllowedData( data );

	if ( this.isUnderLimit() && ( isValid || this.allowDisplayInvalidTags ) ) {
		const newItemWidget = this.createTagItemWidget( data, label );
		newItemWidget.toggleValid( isValid );
		this.addItems( [ newItemWidget ] );
		return true;
	}

	return false;
};

/**
 * Check whether the number of current tags is within the limit.
 *
 * @return {boolean} True if current tag count is within the limit or
 *  if 'tagLimit' is not set
 */
OO.ui.TagMultiselectWidget.prototype.isUnderLimit = function () {
	return !this.tagLimit ||
		this.getItemCount() < this.tagLimit;
};

/**
 * Remove tag by its data property.
 *
 * @param {string|Object} data Tag data
 */
OO.ui.TagMultiselectWidget.prototype.removeTagByData = function ( data ) {
	const item = this.findItemFromData( data );

	this.removeItems( [ item ] );
};

/**
 * Construct a OO.ui.TagItemWidget (or a subclass thereof) from given label and data.
 *
 * @protected
 * @param {any} data Item data
 * @param {string|jQuery} [label=data] The label text or JQuery collection.
 * @return {OO.ui.TagItemWidget}
 */
OO.ui.TagMultiselectWidget.prototype.createTagItemWidget = function ( data, label ) {
	return new OO.ui.TagItemWidget( { data: data, label: label || data } );
};

/**
 * Given an item, returns the item after it. If the item is already the
 * last item, return `this.input`. If no item is passed, returns the
 * very first item.
 *
 * @protected
 * @param {OO.ui.TagItemWidget} [item] Tag item
 * @return {OO.ui.Widget} The next widget available.
 */
OO.ui.TagMultiselectWidget.prototype.getNextItem = function ( item ) {
	const itemIndex = this.items.indexOf( item );

	if ( item === undefined || itemIndex === -1 ) {
		return this.items[ 0 ];
	}

	if ( itemIndex === this.items.length - 1 ) { // Last item
		if ( this.hasInput ) {
			return this.input;
		} else {
			// Return first item
			return this.items[ 0 ];
		}
	} else {
		return this.items[ itemIndex + 1 ];
	}
};

/**
 * Given an item, returns the item before it. If the item is already the
 * first item, return `this.input`. If no item is passed, returns the
 * very last item.
 *
 * @protected
 * @param {OO.ui.TagItemWidget} [item] Tag item
 * @return {OO.ui.Widget} The previous widget available.
 */
OO.ui.TagMultiselectWidget.prototype.getPreviousItem = function ( item ) {
	const itemIndex = this.items.indexOf( item );

	if ( item === undefined || itemIndex === -1 ) {
		return this.items[ this.items.length - 1 ];
	}

	if ( itemIndex === 0 ) {
		if ( this.hasInput ) {
			return this.input;
		} else {
			// Return the last item
			return this.items[ this.items.length - 1 ];
		}
	} else {
		return this.items[ itemIndex - 1 ];
	}
};

/**
 * Update the dimensions of the text input field to encompass all available area.
 * This is especially relevant for when the input is at the edge of a line
 * and should get smaller. The usual operation (as an inline-block with min-width)
 * does not work in that case, pushing the input downwards to the next line.
 *
 * @private
 */
OO.ui.TagMultiselectWidget.prototype.updateInputSize = function () {
	if ( this.inputPosition === 'inline' && !this.isDisabled() ) {
		if ( this.input.$input[ 0 ].scrollWidth === 0 ) {
			// Input appears to be attached but not visible.
			// Don't attempt to adjust its size, because our measurements
			// are going to fail anyway.
			return;
		}
		this.input.$input.css( 'width', '1em' );
		const $lastItem = this.$group.children().last();
		const direction = OO.ui.Element.static.getDir( this.$handle );

		// Get the width of the input with the placeholder text as
		// the value and save it so that we don't keep recalculating
		const placeholder = this.input.$input.attr( 'placeholder' );
		if (
			this.contentWidthWithPlaceholder === undefined &&
			this.input.getValue() === '' &&
			placeholder !== undefined
		) {
			// Set the value directly to avoid any side effects of setValue
			this.input.$input.val( placeholder );
			this.contentWidthWithPlaceholder = this.input.$input[ 0 ].scrollWidth;
			this.input.$input.val( '' );

		}

		// Always keep the input wide enough for the placeholder text
		const contentWidth = Math.max(
			this.input.$input[ 0 ].scrollWidth,
			// undefined arguments in Math.max lead to NaN
			( this.contentWidthWithPlaceholder === undefined ) ?
				0 : this.contentWidthWithPlaceholder
		);
		const currentWidth = this.input.$input.width();

		if ( contentWidth < currentWidth ) {
			this.updateIfHeightChanged();
			// All is fine, don't perform expensive calculations
			return;
		}

		let bestWidth;
		if ( $lastItem.length === 0 ) {
			bestWidth = this.$content.innerWidth();
		} else {
			bestWidth = direction === 'ltr' ?
				this.$content.innerWidth() - $lastItem.position().left - $lastItem.outerWidth() :
				$lastItem.position().left;
		}

		// Some safety margin because I *really* don't feel like finding out where the
		// few pixels this is off by are coming from.
		bestWidth -= 13;
		if ( contentWidth > bestWidth ) {
			// This will result in the input getting shifted to the next line
			bestWidth = this.$content.innerWidth() - 13;
		}
		this.input.$input.width( Math.floor( bestWidth ) );
		this.updateIfHeightChanged();
	} else {
		this.updateIfHeightChanged();
	}
};

/**
 * Determine if widget height changed, and if so,
 * emit the resize event. This is useful for when there are either
 * menus or popups attached to the bottom of the widget, to allow
 * them to change their positioning in case the widget moved down
 * or up.
 *
 * @private
 */
OO.ui.TagMultiselectWidget.prototype.updateIfHeightChanged = function () {
	const height = this.$element.height();
	if ( height !== this.height ) {
		this.height = height;
		this.emit( 'resize' );
	}
};

/**
 * Check whether all items in the widget are valid
 *
 * @return {boolean} Widget is valid
 */
OO.ui.TagMultiselectWidget.prototype.checkValidity = function () {
	return this.getItems().every( ( item ) => item.isValid() );
};

/**
 * Set the valid state of this item
 *
 * @param {boolean} [valid] Item is valid, omit to toggle
 * @fires OO.ui.TagMultiselectWidget#valid
 */
OO.ui.TagMultiselectWidget.prototype.toggleValid = function ( valid ) {
	valid = valid === undefined ? !this.valid : !!valid;

	if ( this.valid !== valid ) {
		this.valid = valid;

		this.setFlags( { invalid: !this.valid } );

		this.emit( 'valid', this.valid );
	}
};

/**
 * Get the current valid state of the widget
 *
 * @return {boolean} Widget is valid
 */
OO.ui.TagMultiselectWidget.prototype.isValid = function () {
	return this.valid;
};
