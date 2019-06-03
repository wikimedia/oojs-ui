/*!
 * OO UI TestTimer class.
 */

/**
 * @class
 *
 * @constructor
 */
OO.ui.TestTimer = function TestTimer() {
	this.pendingCalls = [];
	this.nextId = 1;
	this.timestamp = 0;
};

/* Inheritance */

OO.initClass( OO.ui.TestTimer );

/* Methods */

/**
 * Return the fake timestamp
 *
 * @return {number} The fake timestamp
 */
OO.ui.TestTimer.prototype.now = function () {
	return this.timestamp;
};

/**
 * Emulated setTimeout; just pushes the call into a queue
 *
 * @param {Function} f The function to call
 * @param {number} [timeout] Minimum wait time in ms
 * @return {number} Timeout id for cancellation
 */
OO.ui.TestTimer.prototype.setTimeout = function ( f, timeout ) {
	this.pendingCalls.push( {
		id: this.nextId,
		f: f,
		timestamp: this.timestamp + ( timeout || 0 )
	} );
	return this.nextId++;
};

/**
 * Emulated clearTimeout; just blanks the queued call function
 *
 * @param {number} id Timeout id for cancellation
 */
OO.ui.TestTimer.prototype.clearTimeout = function ( id ) {
	this.pendingCalls.forEach( function ( call ) {
		if ( call.id === id ) {
			call.f = null;
		}
	} );
};

/**
 * Run queued calls
 *
 * @param {number} [interval] Apparent passed time since last call (defaults to infinite)
 */
OO.ui.TestTimer.prototype.runPending = function ( interval ) {
	var calls, i, len, call;
	this.timestamp += ( interval || 0 );
	calls = this.pendingCalls.splice( 0, this.pendingCalls.length ).sort( function ( a, b ) {
		return a.timeout - b.timeout;
	} );
	for ( i = 0, len = calls.length; i < len; i++ ) {
		call = calls[ i ];
		if ( interval === undefined || call.timestamp <= this.timestamp ) {
			if ( call.f ) {
				call.f();
			}
		} else {
			this.pendingCalls.push( call );
		}
	}
};
