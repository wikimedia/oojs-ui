/**
 * RequestManager is a mixin that manages the lifecycle of a promise-backed request for a widget, such as
 * the {@link OO.ui.mixin.LookupElement}.
 *
 * @class
 * @abstract
 *
 * @constructor
 */
OO.ui.mixin.RequestManager = function OoUiMixinRequestManager() {
	this.requestCache = {};
	this.requestQuery = null;
	this.requestRequest = null;
};

/* Setup */

OO.initClass( OO.ui.mixin.RequestManager );

/**
 * Get request results for the current query.
 *
 * @return {jQuery.Promise} Promise object which will be passed response data as the first argument of
 *   the done event. If the request was aborted to make way for a subsequent request, this promise
 *   may not be rejected, depending on what jQuery feels like doing.
 */
OO.ui.mixin.RequestManager.prototype.getRequestData = function () {
	var widget = this,
		value = this.getRequestQuery(),
		deferred = $.Deferred(),
		ourRequest;

	this.abortRequest();
	if ( Object.prototype.hasOwnProperty.call( this.requestCache, value ) ) {
		deferred.resolve( this.requestCache[ value ] );
	} else {
		if ( this.pushPending ) {
			this.pushPending();
		}
		this.requestQuery = value;
		ourRequest = this.requestRequest = this.getRequest();
		ourRequest
			.always( function () {
				// We need to pop pending even if this is an old request, otherwise
				// the widget will remain pending forever.
				// TODO: this assumes that an aborted request will fail or succeed soon after
				// being aborted, or at least eventually. It would be nice if we could popPending()
				// at abort time, but only if we knew that we hadn't already called popPending()
				// for that request.
				if ( widget.popPending ) {
					widget.popPending();
				}
			} )
			.done( function ( response ) {
				// If this is an old request (and aborting it somehow caused it to still succeed),
				// ignore its success completely
				if ( ourRequest === widget.requestRequest ) {
					widget.requestQuery = null;
					widget.requestRequest = null;
					widget.requestCache[ value ] = widget.getRequestCacheDataFromResponse( response );
					deferred.resolve( widget.requestCache[ value ] );
				}
			} )
			.fail( function () {
				// If this is an old request (or a request failing because it's being aborted),
				// ignore its failure completely
				if ( ourRequest === widget.requestRequest ) {
					widget.requestQuery = null;
					widget.requestRequest = null;
					deferred.reject();
				}
			} );
	}
	return deferred.promise();
};

/**
 * Abort the currently pending request, if any.
 *
 * @private
 */
OO.ui.mixin.RequestManager.prototype.abortRequest = function () {
	var oldRequest = this.requestRequest;
	if ( oldRequest ) {
		// First unset this.requestRequest to the fail handler will notice
		// that the request is no longer current
		this.requestRequest = null;
		this.requestQuery = null;
		oldRequest.abort();
	}
};

/**
 * Get the query to be made.
 *
 * @protected
 * @method
 * @abstract
 * @return {string} query to be used
 */
OO.ui.mixin.RequestManager.prototype.getRequestQuery = null;

/**
 * Get a new request object of the current query value.
 *
 * @protected
 * @method
 * @abstract
 * @return {jQuery.Promise} jQuery AJAX object, or promise object with an .abort() method
 */
OO.ui.mixin.RequestManager.prototype.getRequest = null;

/**
 * Pre-process data returned by the request from #getRequest.
 *
 * The return value of this function will be cached, and any further queries for the given value
 * will use the cache rather than doing API requests.
 *
 * @protected
 * @method
 * @abstract
 * @param {Mixed} response Response from server
 * @return {Mixed} Cached result data
 */
OO.ui.mixin.RequestManager.prototype.getRequestCacheDataFromResponse = null;
