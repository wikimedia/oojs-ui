/**
 * RequestManager is a mixin that manages the lifecycle of a promise-backed request for a widget,
 * such as the {@link OO.ui.mixin.LookupElement}.
 *
 * @class
 * @abstract
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {boolean} [config.showPendingRequest=true] Show pending state while request data is being fetched.
 *  Requires widget to have also mixed in {@link OO.ui.mixin.PendingElement}.
 */
OO.ui.mixin.RequestManager = function OoUiMixinRequestManager( config ) {
	this.requestCache = {};
	this.requestQuery = null;
	this.requestRequest = null;
	this.showPendingRequest = !!this.pushPending && config.showPendingRequest !== false;
};

/* Setup */

OO.initClass( OO.ui.mixin.RequestManager );

/**
 * Get request results for the current query.
 *
 * @return {jQuery.Promise} Promise object which will be passed response data as the first argument
 *  of the done event. If the request was aborted to make way for a subsequent request, this
 *  promise may not be rejected, depending on what jQuery feels like doing.
 */
OO.ui.mixin.RequestManager.prototype.getRequestData = function () {
	const widget = this,
		value = this.getRequestQuery(),
		deferred = $.Deferred();

	this.abortRequest();
	if ( Object.prototype.hasOwnProperty.call( this.requestCache, value ) ) {
		deferred.resolve( this.requestCache[ value ] );
	} else {
		if ( this.showPendingRequest ) {
			this.pushPending();
		}
		this.requestQuery = value;
		const ourRequest = this.requestRequest = this.getRequest();
		ourRequest
			.always( () => {
				// We need to pop pending even if this is an old request, otherwise
				// the widget will remain pending forever.
				// TODO: this assumes that an aborted request will fail or succeed soon after
				// being aborted, or at least eventually. It would be nice if we could popPending()
				// at abort time, but only if we knew that we hadn't already called popPending()
				// for that request.
				if ( widget.showPendingRequest ) {
					widget.popPending();
				}
			} )
			.done( ( response ) => {
				// If this is an old request (and aborting it somehow caused it to still succeed),
				// ignore its success completely
				if ( ourRequest === widget.requestRequest ) {
					widget.requestQuery = null;
					widget.requestRequest = null;
					widget.requestCache[ value ] =
						widget.getRequestCacheDataFromResponse( response );
					deferred.resolve( widget.requestCache[ value ] );
				}
			} )
			.fail( () => {
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
	const oldRequest = this.requestRequest;
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
 * @param {any} response Response from server
 * @return {any} Cached result data
 */
OO.ui.mixin.RequestManager.prototype.getRequestCacheDataFromResponse = null;
