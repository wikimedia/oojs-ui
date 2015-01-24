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
 * @param {number|jQuery.Promise|Function} step Time to wait, promise to wait for or function to
 *   call, see #createStep for more information
 * @param {Object} [context=null] Context to call the step function in, ignored if step is a number
 *   or a promise
 * @return {Object} Step object, with `callback` and `context` properties
 */
OO.ui.Process = function ( step, context ) {
	// Properties
	this.steps = [];

	// Initialization
	if ( step !== undefined ) {
		this.next( step, context );
	}
};

/* Setup */

OO.initClass( OO.ui.Process );

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
			var deferred,
				result = step.callback.call( step.context );

			if ( result === false ) {
				// Use rejected promise for boolean false results
				return $.Deferred().reject( [] ).promise();
			}
			if ( typeof result === 'number' ) {
				if ( result < 0 ) {
					throw new Error( 'Cannot go back in time: flux capacitor is out of service' );
				}
				// Use a delayed promise for numbers, expecting them to be in milliseconds
				deferred = $.Deferred();
				setTimeout( deferred.resolve, result );
				return deferred.promise();
			}
			if ( result instanceof OO.ui.Error ) {
				// Use rejected promise for error
				return $.Deferred().reject( [ result ] ).promise();
			}
			if ( $.isArray( result ) && result.length && result[ 0 ] instanceof OO.ui.Error ) {
				// Use rejected promise for list of errors
				return $.Deferred().reject( result ).promise();
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
		promise = proceed( this.steps[ 0 ] )();
		for ( i = 1, len = this.steps.length; i < len; i++ ) {
			promise = promise.then( proceed( this.steps[ i ] ) );
		}
	} else {
		promise = $.Deferred().resolve().promise();
	}

	return promise;
};

/**
 * Create a process step.
 *
 * @private
 * @param {number|jQuery.Promise|Function} step
 *
 * - Number of milliseconds to wait; or
 * - Promise to wait to be resolved; or
 * - Function to execute
 *   - If it returns boolean false the process will stop
 *   - If it returns an object with a `promise` method the process will use the promise to either
 *     continue to the next step when the promise is resolved or stop when the promise is rejected
 *   - If it returns a number, the process will wait for that number of milliseconds before
 *     proceeding
 * @param {Object} [context=null] Context to call the step function in, ignored if step is a number
 *   or a promise
 * @return {Object} Step object, with `callback` and `context` properties
 */
OO.ui.Process.prototype.createStep = function ( step, context ) {
	if ( typeof step === 'number' || $.isFunction( step.promise ) ) {
		return {
			callback: function () {
				return step;
			},
			context: null
		};
	}
	if ( $.isFunction( step ) ) {
		return {
			callback: step,
			context: context
		};
	}
	throw new Error( 'Cannot create process step: number, promise or function expected' );
};

/**
 * Add step to the beginning of the process.
 *
 * @inheritdoc #createStep
 * @return {OO.ui.Process} this
 * @chainable
 */
OO.ui.Process.prototype.first = function ( step, context ) {
	this.steps.unshift( this.createStep( step, context ) );
	return this;
};

/**
 * Add step to the end of the process.
 *
 * @inheritdoc #createStep
 * @return {OO.ui.Process} this
 * @chainable
 */
OO.ui.Process.prototype.next = function ( step, context ) {
	this.steps.push( this.createStep( step, context ) );
	return this;
};
