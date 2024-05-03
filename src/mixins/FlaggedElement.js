/**
 * The FlaggedElement class is an attribute mixin, meaning that it is used to add
 * additional functionality to an element created by another class. The class provides
 * a ‘flags’ property assigned the name (or an array of names) of styling flags,
 * which are used to customize the look and feel of a widget to better describe its
 * importance and functionality.
 *
 * The library currently contains the following styling flags for general use:
 *
 * - **progressive**: Progressive styling is applied to convey that the widget will move the user
 *   forward in a process.
 * - **destructive**: Destructive styling is applied to convey that the widget will remove
 *   something.
 *
 * {@link OO.ui.ActionWidget ActionWidgets}, which are a special kind of button that execute an
 * action, use these flags: **primary** and **safe**.
 * Please see the [OOUI documentation on MediaWiki][1] for more information.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Elements/Flagged
 *
 * The flags affect the appearance of the buttons:
 *
 *     @example
 *     // FlaggedElement is mixed into ButtonWidget to provide styling flags
 *     const button1 = new OO.ui.ButtonWidget( {
 *             label: 'Progressive',
 *             flags: 'progressive'
 *         } ),
 *         button2 = new OO.ui.ButtonWidget( {
 *             label: 'Destructive',
 *             flags: 'destructive'
 *         } );
 *     $( document.body ).append( button1.$element, button2.$element );
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {string|string[]} [config.flags] The name or names of the flags (e.g., 'progressive' or 'primary')
 *  to apply.
 *  Please see the [OOUI documentation on MediaWiki][2] for more information about available flags.
 *  [2]: https://www.mediawiki.org/wiki/OOUI/Elements/Flagged
 * @param {jQuery} [config.$flagged] The flagged element. By default,
 *  the flagged functionality is applied to the element created by the class ($element).
 *  If a different element is specified, the flagged functionality will be applied to it instead.
 */
OO.ui.mixin.FlaggedElement = function OoUiMixinFlaggedElement( config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.flags = {};
	this.$flagged = null;

	// Initialization
	this.setFlags( config.flags || this.constructor.static.flags );
	this.setFlaggedElement( config.$flagged || this.$element );
};

/* Setup */

OO.initClass( OO.ui.mixin.FlaggedElement );

/* Events */

/**
 * A flag event is emitted when the #clearFlags or #setFlags methods are used. The `changes`
 * parameter contains the name of each modified flag and indicates whether it was
 * added or removed.
 *
 * @event OO.ui.mixin.FlaggedElement#flag
 * @param {Object.<string,boolean>} changes Object keyed by flag name. A Boolean `true` indicates
 * that the flag was added, `false` that the flag was removed.
 */

/* Static Properties */

/**
 * Initial value to pass to setFlags if no value is provided in config.
 *
 * @static
 * @property {string|string[]|Object.<string, boolean>}
 */
OO.ui.mixin.FlaggedElement.static.flags = null;

/* Methods */

/**
 * Set the flagged element.
 *
 * This method is used to retarget a flagged mixin so that its functionality applies to the
 * specified element.
 * If an element is already set, the method will remove the mixin’s effect on that element.
 *
 * @param {jQuery} $flagged Element that should be flagged
 */
OO.ui.mixin.FlaggedElement.prototype.setFlaggedElement = function ( $flagged ) {
	const classNames = Object.keys( this.flags ).map( ( flag ) => 'oo-ui-flaggedElement-' + flag );

	if ( this.$flagged ) {
		this.$flagged.removeClass( classNames );
	}

	this.$flagged = $flagged.addClass( classNames );
};

/**
 * Check if the specified flag is set.
 *
 * @param {string} flag Name of flag
 * @return {boolean} The flag is set
 */
OO.ui.mixin.FlaggedElement.prototype.hasFlag = function ( flag ) {
	// This may be called before the constructor, thus before this.flags is set
	return this.flags && ( flag in this.flags );
};

/**
 * Get the names of all flags set.
 *
 * @return {string[]} Flag names
 */
OO.ui.mixin.FlaggedElement.prototype.getFlags = function () {
	// This may be called before the constructor, thus before this.flags is set
	return Object.keys( this.flags || {} );
};

/**
 * Clear all flags.
 *
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 * @fires OO.ui.mixin.FlaggedElement#flag
 */
OO.ui.mixin.FlaggedElement.prototype.clearFlags = function () {
	const changes = {},
		remove = [],
		classPrefix = 'oo-ui-flaggedElement-';

	for ( const flag in this.flags ) {
		const className = classPrefix + flag;
		changes[ flag ] = false;
		delete this.flags[ flag ];
		remove.push( className );
	}

	if ( this.$flagged ) {
		this.$flagged.removeClass( remove );
	}

	this.updateThemeClasses();
	this.emit( 'flag', changes );

	return this;
};

/**
 * Add one or more flags.
 *
 * @param {string|string[]|Object.<string, boolean>} flags A flag name, an array of flag names,
 *  or an object keyed by flag name with a boolean value that indicates whether the flag should
 *  be added (`true`) or removed (`false`).
 * @chainable
 * @return {OO.ui.Element} The element, for chaining
 * @fires OO.ui.mixin.FlaggedElement#flag
 */
OO.ui.mixin.FlaggedElement.prototype.setFlags = function ( flags ) {
	const changes = {},
		add = [],
		remove = [],
		classPrefix = 'oo-ui-flaggedElement-';

	let className, flag;
	if ( typeof flags === 'string' ) {
		className = classPrefix + flags;
		// Set
		if ( !this.flags[ flags ] ) {
			this.flags[ flags ] = true;
			add.push( className );
		}
	} else if ( Array.isArray( flags ) ) {
		for ( let i = 0, len = flags.length; i < len; i++ ) {
			flag = flags[ i ];
			className = classPrefix + flag;
			// Set
			if ( !this.flags[ flag ] ) {
				changes[ flag ] = true;
				this.flags[ flag ] = true;
				add.push( className );
			}
		}
	} else if ( OO.isPlainObject( flags ) ) {
		for ( flag in flags ) {
			className = classPrefix + flag;
			if ( flags[ flag ] ) {
				// Set
				if ( !this.flags[ flag ] ) {
					changes[ flag ] = true;
					this.flags[ flag ] = true;
					add.push( className );
				}
			} else {
				// Remove
				if ( this.flags[ flag ] ) {
					changes[ flag ] = false;
					delete this.flags[ flag ];
					remove.push( className );
				}
			}
		}
	}

	if ( this.$flagged ) {
		this.$flagged
			.addClass( add )
			.removeClass( remove );
	}

	this.updateThemeClasses();
	this.emit( 'flag', changes );

	return this;
};
