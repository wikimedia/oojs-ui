QUnit.module( 'OO.ui.Process' );

/* Tests */

QUnit.test( 'next', function ( assert ) {
	var process = new OO.ui.Process(),
		result = [];

	return process
		.next( function () {
			result.push( 0 );
		} )
		.next( function () {
			result.push( 1 );
		} )
		.next( function () {
			result.push( 2 );
		} )
		.execute()
		.then( function () {
			assert.deepEqual( result, [ 0, 1, 2 ], 'Steps can be added at the end' );
		} );
} );

QUnit.test( 'first', function ( assert ) {
	var process = new OO.ui.Process(),
		result = [];

	return process
		.first( function () {
			result.push( 0 );
		} )
		.first( function () {
			result.push( 1 );
		} )
		.first( function () {
			result.push( 2 );
		} )
		.execute()
		.then( function () {
			assert.deepEqual( result, [ 2, 1, 0 ], 'Steps can be added at the beginning' );
		} );
} );

QUnit.test( 'execute (async)', function ( assert ) {
	var process = new OO.ui.Process(),
		result = [];

	return process
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
		} )
		.execute()
		.then( function () {
			assert.deepEqual(
				result,
				[ 0, 1, 2 ],
				'Synchronous and asynchronous steps are executed in the correct order'
			);
		} );
} );

QUnit.test( 'execute (return false)', function ( assert ) {
	var process = new OO.ui.Process(),
		result = [];

	return process
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
		} )
		.execute()
		.then( null, function () {
			assert.deepEqual(
				result,
				[ 0, 1 ],
				'Process is stopped when a step returns false'
			);
			return $.Deferred().resolve();
		} );
} );

QUnit.test( 'execute (async reject)', function ( assert ) {
	var process = new OO.ui.Process(),
		result = [];

	return process
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
		} )
		.execute()
		.then( null, function () {
			assert.deepEqual(
				result,
				[ 0, 1 ],
				'Process is stopped when a step returns a promise that is then rejected'
			);
			return $.Deferred().resolve();
		} );
} );

QUnit.test( 'execute (wait)', function ( assert ) {
	var process = new OO.ui.Process(),
		result = [];

	process
		.next( function () {
			result.push( 'A' );
			return 10;
		} )
		.next( function () {
			result.push( 'B' );
		} );

	// Steps defined above don't run until execute()
	result.push( 'before' );

	// Process yields between step A and B
	setTimeout( function () {
		result.push( 'yield' );
	} );

	return process
		.execute()
		.then( function () {
			assert.deepEqual(
				result,
				[ 'before', 'A', 'yield', 'B' ],
				'Process is stopped when a step returns a promise that is then rejected'
			);
		} );
} );

QUnit.test( 'execute (thenable, success)', function ( assert ) {
	var process = new OO.ui.Process(),
		result = [];

	return process
		.next( function () {
			var deferred = $.Deferred();

			setTimeout( function () {
				result.push( 1 );
				deferred.resolve();
			}, 10 );

			return { then: deferred.then.bind( deferred ) };
		} )
		.first( function () {
			var deferred = $.Deferred();

			setTimeout( function () {
				result.push( 0 );
				deferred.resolve();
			}, 10 );

			return { then: deferred.then.bind( deferred ) };
		} )
		.next( function () {
			result.push( 2 );
		} )
		.execute()
		.then( function () {
			assert.deepEqual(
				result,
				[ 0, 1, 2 ],
				'Synchronous and asynchronous steps are executed in the correct order'
			);
		} );
} );

QUnit.test( 'execute (thenable, failure)', function ( assert ) {
	var process = new OO.ui.Process(),
		deferred = $.Deferred();

	deferred.reject( 'err' );

	return process
		.next( { then: deferred.then.bind( deferred ) } )
		.execute()
		.then(
			function () {
				assert.ok( false, 'Promise should have rejected' );
			},
			function ( err ) {
				assert.strictEqual(
					err,
					'err',
					'Error is propagated correctly'
				);
			}
		);
} );

QUnit.test( 'execute (function returning thenable, failure)', function ( assert ) {
	var process = new OO.ui.Process();

	return process
		.next( function () {
			var deferred = $.Deferred();

			deferred.reject( 'err' );

			return { then: deferred.then.bind( deferred ) };
		} )
		.execute()
		.then(
			function () {
				assert.ok( false, 'Promise should have rejected' );
			},
			function ( err ) {
				assert.strictEqual(
					err,
					'err',
					'Error is propagated correctly'
				);
			}
		);
} );
