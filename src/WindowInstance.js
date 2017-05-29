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
	var state = {
		opening: $.Deferred(),
		opened: $.Deferred(),
		closing: $.Deferred(),
		closed: $.Deferred()
	};

	/**
	 * @private
	 * @property {Object}
	 */
	this.state = state;

	// Set these up as chained promises so that rejecting of
	// an earlier stage automatically rejects the subsequent
	// would-be stages as well.

	/**
	 * @property {jQuery.Promise}
	 */
	this.opening = state.opening.promise();
	/**
	 * @property {jQuery.Promise}
	 */
	this.opened = this.opening.then( function () {
		return state.opened;
	} );
	/**
	 * @property {jQuery.Promise}
	 */
	this.closing = this.opened.then( function () {
		return state.closing;
	} );
	/**
	 * @property {jQuery.Promise}
	 */
	this.closed = this.closing.then( function () {
		return state.closed;
	} );
};

/* Setup */

OO.initClass( OO.ui.WindowInstance );
