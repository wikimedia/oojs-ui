/**
 * A window instance represents the life cycle for one single opening of a window
 * until its closing.
 *
 * While OO.ui.WindowManager will reuse OO.ui.Window objects, each time a window is
 * opened, a new lifecycle starts.
 *
 * For more information, please see the [OOjs UI documentation on MediaWiki] [1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Windows
 *
 * @class
 *
 * @constructor
 */
OO.ui.WindowInstance = function OOuiWindowInstance() {
	var deferreds = {
		opening: $.Deferred(),
		opened: $.Deferred(),
		closing: $.Deferred(),
		closed: $.Deferred()
	};

	/**
	 * @private
	 * @property {Object}
	 */
	this.deferreds = deferreds;

	// Set these up as chained promises so that rejecting of
	// an earlier stage automatically rejects the subsequent
	// would-be stages as well.

	/**
	 * @property {jQuery.Promise}
	 */
	this.opening = deferreds.opening.promise();
	/**
	 * @property {jQuery.Promise}
	 */
	this.opened = this.opening.then( function () {
		return deferreds.opened;
	} );
	/**
	 * @property {jQuery.Promise}
	 */
	this.closing = this.opened.then( function () {
		return deferreds.closing;
	} );
	/**
	 * @property {jQuery.Promise}
	 */
	this.closed = this.closing.then( function () {
		return deferreds.closed;
	} );
};

/* Setup */

OO.initClass( OO.ui.WindowInstance );
