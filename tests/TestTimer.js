/*!
 * OO UI TestTimer class.
 *
 * @copyright 2011-2017 OOjs UI Team and others; see http://ve.mit-license.org
 */

/**
 * @class
 *
 * @constructor
 */
OO.ui.TestTimer = function TestTimer() {
	this.pendingCalls = [];
	this.nextId = 1;
};

/* Inheritance */

OO.initClass( OO.ui.TestTimer );

/* Methods */

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
		timeout: timeout || 0
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
	calls = this.pendingCalls.splice( 0, this.pendingCalls.length ).sort( function ( a, b ) {
		return a.timeout - b.timeout;
	} );
	for ( i = 0, len = calls.length; i < len; i++ ) {
		call = calls[ i ];
		if ( interval === undefined || call.timeout <= interval ) {
			if ( call.f ) {
				call.f();
			}
		} else {
			this.pendingCalls.push( {
				id: call.id,
				f: call.f,
				timeout: call.timeout - interval
			} );
		}
	}
};
