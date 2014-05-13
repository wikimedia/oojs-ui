QUnit.module( 'OO.ui.Process' );

/* Tests */

QUnit.test( 'next', 1, function ( assert ) {
	var process = new OO.ui.Process(),
		result = [];

	process
		.next( function () {
			result.push( 0 );
		} )
		.next( function () {
			result.push( 1 );
		} )
		.next( function () {
			result.push( 2 );
		} )
		.execute();

	assert.deepEqual( result, [ 0, 1, 2 ], 'Steps can be added at the end' );
} );

QUnit.test( 'first', 1, function ( assert ) {
	var process = new OO.ui.Process(),
		result = [];

	process
		.first( function () {
			result.push( 0 );
		} )
		.first( function () {
			result.push( 1 );
		} )
		.first( function () {
			result.push( 2 );
		} )
		.execute();

	assert.deepEqual( result, [ 2, 1, 0 ], 'Steps can be added at the beginning' );
} );

QUnit.asyncTest( 'execute (async)', 1, function ( assert ) {
	// Async
	var process = new OO.ui.Process(),
		result = [];

	process
		.next( function () {
			var deferred = $.Deferred();

			setTimeout( function () {
				result.push( 1 );
				deferred.resolve();
			}, 10 );

			return deferred.promise();
		} )
		.first( function () {
			var deferred = $.Deferred();

			setTimeout( function () {
				result.push( 0 );
				deferred.resolve();
			}, 10 );

			return deferred.promise();
		} )
		.next( function () {
			result.push( 2 );
		} );

	process.execute().done( function () {
		assert.deepEqual(
			result,
			[ 0, 1, 2 ],
			'Synchronous and asynchronous steps are executed in the correct order'
		);
		QUnit.start();
	} );
} );

QUnit.asyncTest( 'execute (return false)', 1, function ( assert ) {
	var process = new OO.ui.Process(),
		result = [];

	process
		.next( function () {
			var deferred = $.Deferred();

			setTimeout( function () {
				result.push( 0 );
				deferred.resolve();
			}, 10 );

			return deferred.promise();
		} )
		.next( function () {
			result.push( 1 );
			return false;
		} )
		.next( function () {
			// Should never be run because previous step is rejected
			result.push( 2 );
		} );

	process.execute().fail( function () {
		assert.deepEqual(
			result,
			[ 0, 1 ],
			'Process is stopped when a step returns false'
		);
		QUnit.start();
	} );
} );

QUnit.asyncTest( 'execute (async reject)', 1, function ( assert ) {
	var process = new OO.ui.Process(),
		result = [];

	process
		.next( function () {
			result.push( 0 );
		} )
		.next( function () {
			var deferred = $.Deferred();

			setTimeout( function () {
				result.push( 1 );
				deferred.reject();
			}, 10 );

			return deferred.promise();
		} )
		.next( function () {
			// Should never be run because previous step is rejected
			result.push( 2 );
		} );

	process.execute().fail( function () {
		assert.deepEqual(
			result,
			[ 0, 1 ],
			'Process is stopped when a step returns a promise that is then rejected'
		);
		QUnit.start();
	} );
} );

QUnit.asyncTest( 'delay', 2, function ( assert ) {
	var result = [];

	OO.ui.Process.static.delay( 10 ).done( function () {
		result.push( 0 );
	} );

	// Will still be empty because delayed promise hasn't been resolved yet
	assert.deepEqual( result, [], 'Delayed promises take time to resolve' );

	setTimeout( function () {
		assert.deepEqual( result, [ 0 ], 'Delayed promises resolve after a time' );
		QUnit.start();
	}, 20 );
} );
