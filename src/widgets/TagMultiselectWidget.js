/**
 * A basic tag multiselect widget, similar in concept to {@link OO.ui.ComboBoxInputWidget combo box widget}
 * that allows the user to add multiple values that are displayed in a tag area.
 *
 * For more information about menus and options, please see the [OOjs UI documentation on MediaWiki][1].
 *
 * This widget is a base widget; see {@link OO.ui.MenuTagMultiselectWidget MenuTagMultiselectWidget} and
 * {@link OO.ui.PopupTagMultiselectWidget PopupTagMultiselectWidget} for the implementations that use
 * a menu and a popup respectively.
 *
 *     @example
 *     // Example: A basic TagMultiselectWidget.
 *     var widget = new OO.ui.TagMultiselectWidget( {
 *         inputPosition: 'outline',
 *         allowedValues: [ 'Option 1', 'Option 2', 'Option 3' ],
 *         selected: [ 'Option 1' ]
 *     } );
 *     $( 'body' ).append( widget.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets/Selects_and_Options#Menu_selects_and_options
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.GroupWidget
 * @mixins OO.ui.mixin.DraggableGroupElement
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.TabIndexedElement
 * @mixins OO.ui.mixin.FlaggedElement
 *
 * @constructor
 * @param {Object} config Configuration object
 * @cfg {Object} [input] Configuration options for the input widget
 * @cfg {OO.ui.InputWidget} [inputWidget] An optional input widget. If given, it will
 *  replace the input widget used in the TagMultiselectWidget. If not given,
 *  TagMultiselectWidget creates its own.
 * @cfg {boolean} [inputPosition='inline'] Position of the input. Options are:
 * 	- inline: The input is invisible, but exists inside the tag list, so
 * 		the user types into the tag groups to add tags.
 * 	- outline: The input is underneath the tag area.
 * 	- none: No input supplied
 * @cfg {boolean} [allowEditTags=true] Allow editing of the tags by clicking them
 * @cfg {boolean} [allowArbitrary=false] Allow data items to be added even if
 *  not present in the menu.
 * @cfg {Object[]} [allowedValues] An array representing the allowed items
 *  by their datas.
 * @cfg {boolean} [allowDuplicates=false] Allow duplicate items to be added
 * @cfg {boolean} [allowDisplayInvalidTags=false] Allow the display of
 *  invalid tags. These tags will display with an invalid state, and
 *  the widget as a whole will have an invalid state if any invalid tags
 *  are present.
 * @cfg {boolean} [allowReordering=true] Allow reordering of the items
 * @cfg {Object[]|String[]} [selected] A set of selected tags. If given,
 *  these will appear in the tag list on initialization, as long as they
 *  pass the validity tests.
 */
OO.ui.TagMultiselectWidget = function OoUiTagMultiselectWidget( config ) {
	var inputEvents,
		rAF = window.requestAnimationFrame || setTimeout,
		widget = this,
		$tabFocus = $( '<span>' )
			.addClass( 'oo-ui-tagMultiselectWidget-focusTrap' );

	config = config || {};

	// Parent constructor
	OO.ui.TagMultiselectWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.GroupWidget.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.TabIndexedElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.DraggableGroupElement.call( this, config );

	this.toggleDraggable(
		config.allowReordering === undefined ?
			true : !!config.allowReordering
	);

	this.inputPosition = this.constructor.static.allowedInputPositions.indexOf( config.inputPosition ) > -1 ?
			config.inputPosition : 'inline';
	this.allowEditTags = config.allowEditTags === undefined ? true : !!config.allowEditTags;
	this.allowArbitrary = !!config.allowArbitrary;
	this.allowDuplicates = !!config.allowDuplicates;
	this.allowedValues = config.allowedValues || [];
	this.allowDisplayInvalidTags = config.allowDisplayInvalidTags;
	this.hasInput = this.inputPosition !== 'none';
	this.height = null;
	this.valid = true;

	this.$content = $( '<div>' )
		.addClass( 'oo-ui-tagMultiselectWidget-content' );
	this.$handle = $( '<div>' )
		.addClass( 'oo-ui-tagMultiselectWidget-handle' )
		.append(
			this.$indicator,
			this.$icon,
			this.$content
				.append(
					this.$group
						.addClass( 'oo-ui-tagMultiselectWidget-group' )
				)
		);

	// Events
	this.aggregate( {
		remove: 'itemRemove',
		navigate: 'itemNavigate',
		select: 'itemSelect'
	} );
	this.connect( this, {
		itemRemove: 'onTagRemove',
		itemSelect: 'onTagSelect',
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
			this.input = new OO.ui.TextInputWidget( $.extend( {
				placeholder: config.placeholder,
				classes: [ 'oo-ui-tagMultiselectWidget-input' ]
			}, config.input ) );
		}
		this.input.setDisabled( this.isDisabled() );

		inputEvents = {
			focus: this.onInputFocus.bind( this ),
			blur: this.onInputBlur.bind( this ),
			'propertychange change click mouseup keydown keyup input cut paste select focus':
				OO.ui.debounce( this.updateInputSize.bind( this ) ),
			keydown: this.onInputKeyDown.bind( this ),
			keypress: this.onInputKeyPress.bind( this )
		};

		this.input.$input.on( inputEvents );

		if ( this.inputPosition === 'outline' ) {
			// Override max-height for the input widget
			// in the case the widget is outline so it can
			// stretch all the way if the widet is wide
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
			this.$content.append( this.input.$input );
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
	rAF( function () {
		if ( widget.hasInput ) {
			widget.updateInputSize();
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

/* Methods */

/**
 * Handle mouse down events.
 *
 * @private
 * @param {jQuery.Event} e Mouse down event
 * @return {boolean} False to prevent defaults
 */
OO.ui.TagMultiselectWidget.prototype.onMouseDown = function ( e ) {
	if ( !this.isDisabled() && e.which === OO.ui.MouseButtons.LEFT ) {
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
	var stopOrContinue,
		withMetaKey = e.metaKey || e.ctrlKey;

	if ( !this.isDisabled() ) {
		if ( e.which === OO.ui.Keys.ENTER ) {
			stopOrContinue = this.doInputEnter( e, withMetaKey );
		}

		// Make sure the input gets resized.
		setTimeout( this.updateInputSize.bind( this ), 0 );
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
	var movement, direction,
		withMetaKey = e.metaKey || e.ctrlKey;

	if ( !this.isDisabled() ) {
		// 'keypress' event is not triggered for Backspace
		if ( e.keyCode === OO.ui.Keys.BACKSPACE ) {
			return this.doInputBackspace( e, withMetaKey );
		} else if ( e.keyCode === OO.ui.Keys.ESCAPE ) {
			return this.doInputEscape( e );
		} else if (
			e.keyCode === OO.ui.Keys.LEFT ||
			e.keyCode === OO.ui.Keys.RIGHT
		) {
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
			direction = e.keyCode === OO.ui.Keys.LEFT ?
				movement.left : movement.right;

			return this.doInputArrow( e, direction, withMetaKey );
		}
	}
};

/**
 * Respond to input focus event
 */
OO.ui.TagMultiselectWidget.prototype.onInputFocus = function () {
	this.$element.addClass( 'oo-ui-tagMultiselectWidget-focus' );
};

/**
 * Respond to input blur event
 */
OO.ui.TagMultiselectWidget.prototype.onInputBlur = function () {
	this.$element.removeClass( 'oo-ui-tagMultiselectWidget-focus' );
};

/**
 * Perform an action after the enter key on the input
 *
 * @param {jQuery.Event} e Event data
 * @param {boolean} [withMetaKey] Whether this key was pressed with
 * a meta key like 'ctrl'
 * @return {boolean} Whether to prevent defaults
 */
OO.ui.TagMultiselectWidget.prototype.doInputEnter = function () {
	this.addTagFromInput();
	return false;
};

/**
 * Perform an action responding to the enter key on the input
 *
 * @param {jQuery.Event} e Event data
 * @param {boolean} [withMetaKey] Whether this key was pressed with
 * a meta key like 'ctrl'
 * @return {boolean} Whether to prevent defaults
 */
OO.ui.TagMultiselectWidget.prototype.doInputBackspace = function () {
	var items, item;

	if (
		this.inputPosition === 'inline' &&
		this.input.getValue() === '' &&
		!this.isEmpty()
	) {
		// Delete the last item
		items = this.getItems();
		item = items[ items.length - 1 ];
		this.input.setValue( item.getData() );
		this.removeItems( [ item ] );

		return false;
	}
};

/**
 * Perform an action after the escape key on the input
 *
 * @param {jQuery.Event} e Event data
 */
OO.ui.TagMultiselectWidget.prototype.doInputEscape = function () {
	this.clearInput();
};

/**
 * Perform an action after the arrow key on the input, select the previous
 * or next item from the input.
 * See #getPreviousItem and #getNextItem
 *
 * @param {jQuery.Event} e Event data
 * @param {string} direction Direction of the movement; forwards or backwards
 * @param {boolean} [withMetaKey] Whether this key was pressed with
 *  a meta key like 'ctrl'
 */
OO.ui.TagMultiselectWidget.prototype.doInputArrow = function ( e, direction ) {
	if (
		this.inputPosition === 'inline' &&
		!this.isEmpty()
	) {
		if ( direction === 'backwards' ) {
			// Get previous item
			this.getPreviousItem().focus();
		} else {
			// Get next item
			this.getNextItem().focus();
		}
	}
};

/**
 * Respond to item select event
 *
 * @param {OO.ui.TagItemWidget} item Selected item
 */
OO.ui.TagMultiselectWidget.prototype.onTagSelect = function ( item ) {
	if ( this.hasInput && this.allowEditTags ) {
		if ( this.input.getValue() ) {
			this.addTagFromInput();
		}
		// 1. Get the label of the tag into the input
		this.input.setValue( item.getData() );
		// 2. Remove the tag
		this.removeItems( [ item ] );
		// 3. Focus the input
		this.focus();
	}
};

/**
 * Respond to change event, where items were added, removed, or cleared.
 */
OO.ui.TagMultiselectWidget.prototype.onChangeTags = function () {
	this.toggleValid( this.checkValidity() );
	if ( this.hasInput ) {
		this.updateInputSize();
	}
	this.updateIfHeightChanged();
};

/**
 * @inheritdoc
 */
OO.ui.TagMultiselectWidget.prototype.setDisabled = function ( isDisabled ) {
	// Parent method
	OO.ui.TagMultiselectWidget.parent.prototype.setDisabled.call( this, isDisabled );

	if ( this.hasInput && this.input ) {
		this.input.setDisabled( !!isDisabled );
	}

	if ( this.items ) {
		this.getItems().forEach( function ( item ) {
			item.setDisabled( !!isDisabled );
		} );
	}
};

/**
 * Respond to tag remove event
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
	if ( direction === 'forwards' ) {
		this.getNextItem( item ).focus();
	} else {
		this.getPreviousItem( item ).focus();
	}
};

/**
 * Add tag from input value
 */
OO.ui.TagMultiselectWidget.prototype.addTagFromInput = function () {
	var val = this.input.getValue(),
		isValid = this.isAllowedData( val );

	if ( !val ) {
		return;
	}

	if ( isValid || this.allowDisplayInvalidTags ) {
		this.addTag( val );
		this.clearInput();
		this.focus();
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
 * @param {string|Object} data Requested value
 * @return {boolean} Value is duplicate
 */
OO.ui.TagMultiselectWidget.prototype.isDuplicateData = function ( data ) {
	return !!this.getItemFromData( data );
};

/**
 * Check whether a given value is allowed to be added
 *
 * @param {string|Object} data Requested value
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
		this.getAllowedValues().some( function ( value ) {
			return data === value;
		} )
	) {
		return true;
	}

	return false;
};

/**
 * Get the allowed values list
 *
 * @return {string[]} Allowed data values
 */
OO.ui.TagMultiselectWidget.prototype.getAllowedValues = function () {
	return this.allowedValues;
};

/**
 * Add a value to the allowed values list
 *
 * @param {string} value Allowed data value
 */
OO.ui.TagMultiselectWidget.prototype.addAllowedValue = function ( value ) {
	if ( this.allowedValues.indexOf( value ) === -1 ) {
		this.allowedValues.push( value );
	}
};

/**
 * Focus the widget
 */
OO.ui.TagMultiselectWidget.prototype.focus = function () {
	if ( this.hasInput ) {
		this.input.focus();
	}
};

/**
 * Get the datas of the currently selected items
 *
 * @return {string[]|Object[]} Datas of currently selected items
 */
OO.ui.TagMultiselectWidget.prototype.getValue = function () {
	return this.getItems()
		.filter( function ( item ) {
			return item.isValid();
		} )
		.map( function ( item ) {
			return item.getData();
		} );
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
 *   [
 *      { data: 'foo', label: 'Foo item' },
 *      { data: 'bar', label: 'Bar item' }
 * 	 ]
 *  Value can also be added with plaintext array, for example:
 *  [ 'foo', 'bar', 'bla' ] or a single string, like 'foo'
 */
OO.ui.TagMultiselectWidget.prototype.setValue = function ( valueObject ) {
	valueObject = Array.isArray( valueObject ) ? valueObject : [ valueObject ];

	this.clearItems();
	valueObject.forEach( function ( obj ) {
		if ( typeof obj === 'string' ) {
			this.addTag( obj );
		} else {
			this.addTag( obj.data, obj.label );
		}
	}.bind( this ) );
};

/**
 * Add tag to the display area
 *
 * @param {string|Object} data Tag data
 * @param {string} [label] Tag label. If no label is provided, the
 *  stringified version of the data will be used instead.
 * @return {boolean} Item was added successfully
 */
OO.ui.TagMultiselectWidget.prototype.addTag = function ( data, label ) {
	var newItemWidget,
		isValid = this.isAllowedData( data );

	if ( isValid || this.allowDisplayInvalidTags ) {
		newItemWidget = this.createTagItemWidget( data, label );
		newItemWidget.toggleValid( isValid );
		this.addItems( [ newItemWidget ] );
		return true;
	}
	return false;
};

/**
 * Remove tag by its data property.
 *
 * @param {string|Object} data Tag data
 */
OO.ui.TagMultiselectWidget.prototype.removeTagByData = function ( data ) {
	var item = this.getItemFromData( data );

	this.removeItems( [ item ] );
};

/**
 * Construct a OO.ui.TagItemWidget (or a subclass thereof) from given label and data.
 *
 * @protected
 * @param {string} data Item data
 * @param {string} label The label text.
 * @return {OO.ui.TagItemWidget}
 */
OO.ui.TagMultiselectWidget.prototype.createTagItemWidget = function ( data, label ) {
	label = label || data;

	return new OO.ui.TagItemWidget( { data: data, label: label } );
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
	var itemIndex = this.items.indexOf( item );

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
	var itemIndex = this.items.indexOf( item );

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
	var $lastItem, direction, contentWidth, currentWidth, bestWidth;
	if ( this.inputPosition === 'inline' && !this.isDisabled() ) {
		this.input.$input.css( 'width', '1em' );
		$lastItem = this.$group.children().last();
		direction = OO.ui.Element.static.getDir( this.$handle );

		// Get the width of the input with the placeholder text as
		// the value and save it so that we don't keep recalculating
		if (
			this.contentWidthWithPlaceholder === undefined &&
			this.input.getValue() === '' &&
			this.input.$input.attr( 'placeholder' ) !== undefined
		) {
			this.input.setValue( this.input.$input.attr( 'placeholder' ) );
			this.contentWidthWithPlaceholder = this.input.$input[ 0 ].scrollWidth;
			this.input.setValue( '' );

		}

		// Always keep the input wide enough for the placeholder text
		contentWidth = Math.max(
			this.input.$input[ 0 ].scrollWidth,
			// undefined arguments in Math.max lead to NaN
			( this.contentWidthWithPlaceholder === undefined ) ?
				0 : this.contentWidthWithPlaceholder
		);
		currentWidth = this.input.$input.width();

		if ( contentWidth < currentWidth ) {
			this.updateIfHeightChanged();
			// All is fine, don't perform expensive calculations
			return;
		}

		if ( $lastItem.length === 0 ) {
			bestWidth = this.$content.innerWidth();
		} else {
			bestWidth = direction === 'ltr' ?
				this.$content.innerWidth() - $lastItem.position().left - $lastItem.outerWidth() :
				$lastItem.position().left;
		}

		// Some safety margin for sanity, because I *really* don't feel like finding out where the few
		// pixels this is off by are coming from.
		bestWidth -= 10;
		if ( contentWidth > bestWidth ) {
			// This will result in the input getting shifted to the next line
			bestWidth = this.$content.innerWidth() - 10;
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
	var height = this.$element.height();
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
	return this.getItems().every( function ( item ) {
		return item.isValid();
	} );
};

/**
 * Set the valid state of this item
 *
 * @param {boolean} [valid] Item is valid
 * @fires valid
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
