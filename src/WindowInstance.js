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

/**
 * Check if window is opening.
 *
 * @return {boolean} Window is opening
 */
OO.ui.WindowInstance.prototype.isOpening = function () {
	return this.deferreds.opened.state() === 'pending';
};

/**
 * Check if window is opened.
 *
 * @return {boolean} Window is opened
 */
OO.ui.WindowInstance.prototype.isOpened = function () {
	return this.deferreds.opened.state() === 'resolved' &&
		this.deferreds.closing.state() === 'pending';
};

/**
 * Check if window is closing.
 *
 * @return {boolean} Window is closing
 */
OO.ui.WindowInstance.prototype.isClosing = function () {
	return this.deferreds.closing.state() === 'resolved' &&
		this.deferreds.closed.state() === 'pending';
};

/**
 * Check if window is closed.
 *
 * @return {boolean} Window is closed
 */
OO.ui.WindowInstance.prototype.isClosed = function () {
	return this.deferreds.closed.state() === 'resolved';
};
