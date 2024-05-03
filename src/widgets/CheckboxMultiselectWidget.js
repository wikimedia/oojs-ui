/**
 * CheckboxMultiselectWidget is a {@link OO.ui.MultiselectWidget multiselect widget} that contains
 * checkboxes and is used together with OO.ui.CheckboxMultioptionWidget. The
 * CheckboxMultiselectWidget provides an interface for adding, removing and selecting options.
 * Please see the [OOUI documentation on MediaWiki][1] for more information.
 *
 * If you want to use this within an HTML form, such as a OO.ui.FormLayout, use
 * OO.ui.CheckboxMultiselectInputWidget instead.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Selects_and_Options
 *
 *     @example
 *     // A CheckboxMultiselectWidget with CheckboxMultioptions.
 *     const option1 = new OO.ui.CheckboxMultioptionWidget( {
 *             data: 'a',
 *             selected: true,
 *             label: 'Selected checkbox'
 *         } ),
 *         option2 = new OO.ui.CheckboxMultioptionWidget( {
 *             data: 'b',
 *             label: 'Unselected checkbox'
 *         } ),
 *         multiselect = new OO.ui.CheckboxMultiselectWidget( {
 *             items: [ option1, option2 ]
 *         } );
 *     $( document.body ).append( multiselect.$element );
 *
 * @class
 * @extends OO.ui.MultiselectWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.CheckboxMultiselectWidget = function OoUiCheckboxMultiselectWidget( config ) {
	// Parent constructor
	OO.ui.CheckboxMultiselectWidget.super.call( this, config );

	// Properties
	this.$lastClicked = null;

	// Events
	this.$group.on( 'click', this.onClick.bind( this ) );

	// Initialization
	this.$element.addClass( 'oo-ui-checkboxMultiselectWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.CheckboxMultiselectWidget, OO.ui.MultiselectWidget );

/* Methods */

/**
 * Get an option by its position relative to the specified item (or to the start of the
 * option array, if item is `null`). The direction in which to search through the option array
 * is specified with a number: -1 for reverse (the default) or 1 for forward. The method will
 * return an option, or `null` if there are no options in the array.
 *
 * @param {OO.ui.CheckboxMultioptionWidget|null} item Item to describe the start position, or
 *  `null` to start at the beginning of the array.
 * @param {number} direction Direction to move in: -1 to move backward, 1 to move forward
 * @return {OO.ui.CheckboxMultioptionWidget|null} Item at position, `null` if there are no items
 *  in the select.
 */
OO.ui.CheckboxMultiselectWidget.prototype.getRelativeFocusableItem = function ( item, direction ) {
	const increase = direction > 0 ? 1 : -1,
		len = this.items.length;

	let nextIndex;
	if ( item ) {
		const currentIndex = this.items.indexOf( item );
		nextIndex = ( currentIndex + increase + len ) % len;
	} else {
		// If no item is selected and moving forward, start at the beginning.
		// If moving backward, start at the end.
		nextIndex = direction > 0 ? 0 : len - 1;
	}

	for ( let i = 0; i < len; i++ ) {
		item = this.items[ nextIndex ];
		if ( item && !item.isDisabled() ) {
			return item;
		}
		nextIndex = ( nextIndex + increase + len ) % len;
	}
	return null;
};

/**
 * Handle click events on checkboxes.
 *
 * @param {jQuery.Event} e
 */
OO.ui.CheckboxMultiselectWidget.prototype.onClick = function ( e ) {
	const $lastClicked = this.$lastClicked,
		$nowClicked = $( e.target ).closest( '.oo-ui-checkboxMultioptionWidget' )
			.not( '.oo-ui-widget-disabled' );

	// Allow selecting multiple options at once by Shift-clicking them
	if ( $lastClicked && $nowClicked.length && e.shiftKey ) {
		const $options = this.$group.find( '.oo-ui-checkboxMultioptionWidget' );
		const lastClickedIndex = $options.index( $lastClicked );
		const nowClickedIndex = $options.index( $nowClicked );
		// If it's the same item, either the user is being silly, or it's a fake event generated
		// by the browser. In either case we don't need custom handling.
		if ( nowClickedIndex !== lastClickedIndex ) {
			const items = this.items;
			const wasSelected = items[ nowClickedIndex ].isSelected();
			const direction = nowClickedIndex > lastClickedIndex ? 1 : -1;

			// This depends on the DOM order of the items and the order of the .items array being
			// the same.
			for ( let i = lastClickedIndex; i !== nowClickedIndex; i += direction ) {
				if ( !items[ i ].isDisabled() ) {
					items[ i ].setSelected( !wasSelected );
				}
			}
			// For the now-clicked element, use immediate timeout to allow the browser to do its own
			// handling first, then set our value. The order in which events happen is different for
			// clicks on the <input> and on the <label> and there are additional fake clicks fired
			// for non-click actions that change the checkboxes.
			e.preventDefault();
			setTimeout( () => {
				if ( !items[ nowClickedIndex ].isDisabled() ) {
					items[ nowClickedIndex ].setSelected( !wasSelected );
				}
			} );
		}
	}

	if ( $nowClicked.length ) {
		this.$lastClicked = $nowClicked;
	}
};

/**
 * Focus the widget
 *
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.CheckboxMultiselectWidget.prototype.focus = function () {
	if ( !this.isDisabled() ) {
		const item = this.getRelativeFocusableItem( null, 1 );
		if ( item ) {
			item.focus();
		}
	}
	return this;
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxMultiselectWidget.prototype.simulateLabelClick = function () {
	this.focus();
};
