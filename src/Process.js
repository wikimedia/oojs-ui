/**
 * A list of functions, called in sequence.
 *
 * If a function added to a process returns boolean false the process will stop; if it returns an
 * object with a `promise` method the process will use the promise to either continue to the next
 * step when the promise is resolved or stop when the promise is rejected.
 *
 * @class
 *
 * @constructor
 */
OO.ui.Process = function () {
	// Properties
	this.steps = [];
};

/* Setup */

OO.initClass( OO.ui.Process );

/* Static Methods */

/**
 * Generate a promise which is resolved after a set amount of time.
 *
 * @param {number} length Number of milliseconds before resolving the promise
 * @return {jQuery.Promise} Promise that will be resolved after a set amount of time
 */
OO.ui.Process.static.delay = function ( length ) {
	var deferred = $.Deferred();

	setTimeout( function () {
		deferred.resolve();
	}, length );

	return deferred.promise();
};

/* Methods */

/**
 * Start the process.
 *
 * @return {jQuery.Promise} Promise that is resolved when all steps have completed or rejected when
 *   any of the steps return boolean false or a promise which gets rejected; upon stopping the
 *   process, the remaining steps will not be taken
 */
OO.ui.Process.prototype.execute = function () {
	var i, len, promise;

	/**
	 * Continue execution.
	 *
	 * @ignore
	 * @param {Array} step A function and the context it should be called in
	 * @return {Function} Function that continues the process
	 */
	function proceed( step ) {
		return function () {
			// Execute step in the correct context
			var result = step[0].call( step[1] );

			if ( result === false ) {
				// Use rejected promise for boolean false results
				return $.Deferred().reject().promise();
			}
			// Duck-type the object to see if it can produce a promise
			if ( result && $.isFunction( result.promise ) ) {
				// Use a promise generated from the result
				return result.promise();
			}
			// Use resolved promise for other results
			return $.Deferred().resolve().promise();
		};
	}

	if ( this.steps.length ) {
		// Generate a chain reaction of promises
		promise = proceed( this.steps[0] )();
		for ( i = 1, len = this.steps.length; i < len; i++ ) {
			promise = promise.then( proceed( this.steps[i] ) );
		}
	} else {
		promise = $.Deferred().resolve().promise();
	}

	return promise;
};

/**
 * Add step to the beginning of the process.
 *
 * @param {Function} step Function to execute; if it returns boolean false the process will stop; if
 *   it returns an object with a `promise` method the process will use the promise to either
 *   continue to the next step when the promise is resolved or stop when the promise is rejected
 * @param {Object} [context=null] Context to call the step function in
 * @chainable
 */
OO.ui.Process.prototype.first = function ( step, context ) {
	this.steps.unshift( [ step, context || null ] );
	return this;
};

/**
 * Add step to the end of the process.
 *
 * @param {Function} step Function to execute; if it returns boolean false the process will stop; if
 *   it returns an object with a `promise` method the process will use the promise to either
 *   continue to the next step when the promise is resolved or stop when the promise is rejected
 * @param {Object} [context=null] Context to call the step function in
 * @chainable
 */
OO.ui.Process.prototype.next = function ( step, context ) {
	this.steps.push( [ step, context || null ] );
	return this;
};
