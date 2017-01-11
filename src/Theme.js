/**
 * Theme logic.
 *
 * @abstract
 * @class
 *
 * @constructor
 */
OO.ui.Theme = function OoUiTheme() {
	this.elementClassesQueue = [];
	this.debouncedUpdateQueuedElementClasses = OO.ui.debounce( this.updateQueuedElementClasses );
};

/* Setup */

OO.initClass( OO.ui.Theme );

/* Methods */

/**
 * Get a list of classes to be applied to a widget.
 *
 * The 'on' and 'off' lists combined MUST contain keys for all classes the theme adds or removes,
 * otherwise state transitions will not work properly.
 *
 * @param {OO.ui.Element} element Element for which to get classes
 * @return {Object.<string,string[]>} Categorized class names with `on` and `off` lists
 */
OO.ui.Theme.prototype.getElementClasses = function () {
	return { on: [], off: [] };
};

/**
 * Update CSS classes provided by the theme.
 *
 * For elements with theme logic hooks, this should be called any time there's a state change.
 *
 * @param {OO.ui.Element} element Element for which to update classes
 */
OO.ui.Theme.prototype.updateElementClasses = function ( element ) {
	var $elements = $( [] ),
		classes = this.getElementClasses( element );

	if ( element.$icon ) {
		$elements = $elements.add( element.$icon );
	}
	if ( element.$indicator ) {
		$elements = $elements.add( element.$indicator );
	}

	$elements
		.removeClass( classes.off.join( ' ' ) )
		.addClass( classes.on.join( ' ' ) );
};

/**
 * @private
 */
OO.ui.Theme.prototype.updateQueuedElementClasses = function () {
	var i;
	for ( i = 0; i < this.elementClassesQueue.length; i++ ) {
		this.updateElementClasses( this.elementClassesQueue[ i ] );
	}
	// Clear the queue
	this.elementClassesQueue = [];
};

/**
 * Queue #updateElementClasses to be called for this element.
 *
 * @localdoc QUnit tests override this method to directly call #queueUpdateElementClasses,
 *   to make them synchronous.
 *
 * @param {OO.ui.Element} element Element for which to update classes
 */
OO.ui.Theme.prototype.queueUpdateElementClasses = function ( element ) {
	// Keep items in the queue unique. Use lastIndexOf to start checking from the end because that's
	// the most common case (this method is often called repeatedly for the same element).
	if ( this.elementClassesQueue.lastIndexOf( element ) !== -1 ) {
		return;
	}
	this.elementClassesQueue.push( element );
	this.debouncedUpdateQueuedElementClasses();
};

/**
 * Get the transition duration in milliseconds for dialogs opening/closing
 *
 * The dialog should be fully rendered this many milliseconds after the
 * ready process has executed.
 *
 * @return {number} Transition duration in milliseconds
 */
OO.ui.Theme.prototype.getDialogTransitionDuration = function () {
	return 0;
};
