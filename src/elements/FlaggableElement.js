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
 */
OO.ui.FlaggableElement.prototype.clearFlags = function () {
	var flag,
		classPrefix = 'oo-ui-flaggableElement-';

	for ( flag in this.flags ) {
		delete this.flags[flag];
		this.$element.removeClass( classPrefix + flag );
	}

	return this;
};

/**
 * Add one or more flags.
 *
 * @param {string[]|Object.<string, boolean>} flags List of flags to add, or list of set/remove
 *  values, keyed by flag name
 * @chainable
 */
OO.ui.FlaggableElement.prototype.setFlags = function ( flags ) {
	var i, len, flag,
		classPrefix = 'oo-ui-flaggableElement-';

	if ( $.isArray( flags ) ) {
		for ( i = 0, len = flags.length; i < len; i++ ) {
			flag = flags[i];
			// Set
			this.flags[flag] = true;
			this.$element.addClass( classPrefix + flag );
		}
	} else if ( OO.isPlainObject( flags ) ) {
		for ( flag in flags ) {
			if ( flags[flag] ) {
				// Set
				this.flags[flag] = true;
				this.$element.addClass( classPrefix + flag );
			} else {
				// Remove
				delete this.flags[flag];
				this.$element.removeClass( classPrefix + flag );
			}
		}
	}
	return this;
};
