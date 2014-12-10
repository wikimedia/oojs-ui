/**
 * Element with named flags that can be added, removed, listed and checked.
 *
 * A flag, when set, adds a CSS class on the `$element` by combining `oo-ui-flaggedElement-` with
 * the flag name. Flags are primarily useful for styling.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string|string[]} [flags] Flags describing importance and functionality, e.g. 'primary',
 *   'safe', 'progressive', 'destructive' or 'constructive'
 * @cfg {jQuery} [$flagged] Flagged node, assigned to #$flagged, omit to use #$element
 */
OO.ui.FlaggedElement = function OoUiFlaggedElement( config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.flags = {};
	this.$flagged = null;

	// Initialization
	this.setFlags( config.flags );
	this.setFlaggedElement( config.$flagged || this.$element );
};

/* Events */

/**
 * @event flag
 * @param {Object.<string,boolean>} changes Object keyed by flag name containing boolean
 *   added/removed properties
 */

/* Methods */

/**
 * Set the flagged element.
 *
 * If an element is already set, it will be cleaned up before setting up the new element.
 *
 * @param {jQuery} $flagged Element to add flags to
 */
OO.ui.FlaggedElement.prototype.setFlaggedElement = function ( $flagged ) {
	var classNames = Object.keys( this.flags ).map( function ( flag ) {
		return 'oo-ui-flaggedElement-' + flag;
	} ).join( ' ' );

	if ( this.$flagged ) {
		this.$flagged.removeClass( classNames );
	}

	this.$flagged = $flagged.addClass( classNames );
};

/**
 * Check if a flag is set.
 *
 * @param {string} flag Name of flag
 * @return {boolean} Has flag
 */
OO.ui.FlaggedElement.prototype.hasFlag = function ( flag ) {
	return flag in this.flags;
};

/**
 * Get the names of all flags set.
 *
 * @return {string[]} Flag names
 */
OO.ui.FlaggedElement.prototype.getFlags = function () {
	return Object.keys( this.flags );
};

/**
 * Clear all flags.
 *
 * @chainable
 * @fires flag
 */
OO.ui.FlaggedElement.prototype.clearFlags = function () {
	var flag, className,
		changes = {},
		remove = [],
		classPrefix = 'oo-ui-flaggedElement-';

	for ( flag in this.flags ) {
		className = classPrefix + flag;
		changes[flag] = false;
		delete this.flags[flag];
		remove.push( className );
	}

	if ( this.$flagged ) {
		this.$flagged.removeClass( remove.join( ' ' ) );
	}

	this.updateThemeClasses();
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
OO.ui.FlaggedElement.prototype.setFlags = function ( flags ) {
	var i, len, flag, className,
		changes = {},
		add = [],
		remove = [],
		classPrefix = 'oo-ui-flaggedElement-';

	if ( typeof flags === 'string' ) {
		className = classPrefix + flags;
		// Set
		if ( !this.flags[flags] ) {
			this.flags[flags] = true;
			add.push( className );
		}
	} else if ( $.isArray( flags ) ) {
		for ( i = 0, len = flags.length; i < len; i++ ) {
			flag = flags[i];
			className = classPrefix + flag;
			// Set
			if ( !this.flags[flag] ) {
				changes[flag] = true;
				this.flags[flag] = true;
				add.push( className );
			}
		}
	} else if ( OO.isPlainObject( flags ) ) {
		for ( flag in flags ) {
			className = classPrefix + flag;
			if ( flags[flag] ) {
				// Set
				if ( !this.flags[flag] ) {
					changes[flag] = true;
					this.flags[flag] = true;
					add.push( className );
				}
			} else {
				// Remove
				if ( this.flags[flag] ) {
					changes[flag] = false;
					delete this.flags[flag];
					remove.push( className );
				}
			}
		}
	}

	if ( this.$flagged ) {
		this.$flagged
			.addClass( add.join( ' ' ) )
			.removeClass( remove.join( ' ' ) );
	}

	this.updateThemeClasses();
	this.emit( 'flag', changes );

	return this;
};
