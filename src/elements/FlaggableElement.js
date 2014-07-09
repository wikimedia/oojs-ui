/**
 * Element with named flags that can be added, removed, listed and checked.
 *
 * A flag, when set, adds a CSS class on the `$element` by combing `oo-ui-flaggableElement-` with
 * the flag name. Flags are primarily useful for styling.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string[]} [flags=[]] Styling flags, e.g. 'primary', 'destructive' or 'constructive'
 */
OO.ui.FlaggableElement = function OoUiFlaggableElement( config ) {
	// Config initialization
	config = config || {};

	// Properties
	this.flags = {};

	// Initialization
	this.setFlags( config.flags );
};

/* Events */

/**
 * @event flag
 * @param {Object.<string,boolean>} changes Object keyed by flag name containing boolean
 *   added/removed properties
 */

/* Methods */

/**
 * Check if a flag is set.
 *
 * @param {string} flag Name of flag
 * @return {boolean} Has flag
 */
OO.ui.FlaggableElement.prototype.hasFlag = function ( flag ) {
	return flag in this.flags;
};

/**
 * Get the names of all flags set.
 *
 * @return {string[]} flags Flag names
 */
OO.ui.FlaggableElement.prototype.getFlags = function () {
	return Object.keys( this.flags );
};

/**
 * Clear all flags.
 *
 * @chainable
 * @fires flag
 */
OO.ui.FlaggableElement.prototype.clearFlags = function () {
	var flag,
		changes = {},
		classPrefix = 'oo-ui-flaggableElement-';

	for ( flag in this.flags ) {
		changes[flag] = false;
		delete this.flags[flag];
		this.$element.removeClass( classPrefix + flag );
	}

	this.emit( 'flag', changes );

	return this;
};

/**
 * Add one or more flags.
 *
 * @param {string|string[]|Object.<string, boolean>} flags One or more flags to add, or an object
 *  keyed by flag name containing boolean set/remove instructions.
 * @chainable
 * @fires flag
 */
OO.ui.FlaggableElement.prototype.setFlags = function ( flags ) {
	var i, len, flag,
		changes = {},
		classPrefix = 'oo-ui-flaggableElement-';

	if ( typeof flags === 'string' ) {
		// Set
		this.flags[flags] = true;
		this.$element.addClass( classPrefix + flags );
	} else if ( $.isArray( flags ) ) {
		for ( i = 0, len = flags.length; i < len; i++ ) {
			flag = flags[i];
			// Set
			changes[flag] = true;
			this.flags[flag] = true;
			this.$element.addClass( classPrefix + flag );
		}
	} else if ( OO.isPlainObject( flags ) ) {
		for ( flag in flags ) {
			if ( flags[flag] ) {
				// Set
				changes[flag] = true;
				this.flags[flag] = true;
				this.$element.addClass( classPrefix + flag );
			} else {
				// Remove
				changes[flag] = false;
				delete this.flags[flag];
				this.$element.removeClass( classPrefix + flag );
			}
		}
	}

	this.emit( 'flag', changes );

	return this;
};
