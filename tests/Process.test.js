QUnit.module( 'OO.ui.Process' );

/* Tests */

QUnit.test( 'next', ( assert ) => {
	const process = new OO.ui.Process();
	const result = [];

	return process
		.next( () => {
			result.push( 0 );
		} )
		.next( () => {
			result.push( 1 );
		} )
		.next( () => {
			result.push( 2 );
		} )
		.execute()
		.then( () => {
			assert.deepEqual( result, [ 0, 1, 2 ], 'Steps can be added at the end' );
		} );
} );

QUnit.test( 'first', ( assert ) => {
	const process = new OO.ui.Process();
	const result = [];

	return process
		.first( () => {
			result.push( 0 );
		} )
		.first( () => {
			result.push( 1 );
		} )
		.first( () => {
			result.push( 2 );
		} )
		.execute()
		.then( () => {
			assert.deepEqual( result, [ 2, 1, 0 ], 'Steps can be added at the beginning' );
		} );
} );

QUnit.test( 'execute (async)', ( assert ) => {
	const process = new OO.ui.Process();
	const result = [];

	return process
		.next( () => {
			const deferred = $.Deferred();

			setTimeout( () => {
				result.push( 1 );
				deferred.resolve();
			}, 10 );

			return deferred.promise();
		} )
		.first( () => {
			const deferred = $.Deferred();

			setTimeout( () => {
				result.push( 0 );
				deferred.resolve();
			}, 10 );

			return deferred.promise();
		} )
		.next( () => {
			result.push( 2 );
		} )
		.execute()
		.then( () => {
			assert.deepEqual(
				result,
				[ 0, 1, 2 ],
				'Synchronous and asynchronous steps are executed in the correct order'
			);
		} );
} );

QUnit.test( 'execute (return false)', ( assert ) => {
	const process = new OO.ui.Process(),
		result = [];

	return process
		.next( () => {
			const deferred = $.Deferred();

			setTimeout( () => {
				result.push( 0 );
				deferred.resolve();
			}, 10 );

			return deferred.promise();
		} )
		.next( () => {
			result.push( 1 );
			return false;
		} )
		.next( () => {
			// Should never be run because previous step is rejected
			result.push( 2 );
		} )
		.execute()
		.then( null, () => {
			assert.deepEqual(
				result,
				[ 0, 1 ],
				'Process is stopped when a step returns false'
			);
			return $.Deferred().resolve();
		} );
} );

QUnit.test( 'execute (async reject)', ( assert ) => {
	const process = new OO.ui.Process(),
		result = [];

	return process
		.next( () => {
			result.push( 0 );
		} )
		.next( () => {
			const deferred = $.Deferred();

			setTimeout( () => {
				result.push( 1 );
				deferred.reject();
			}, 10 );

			return deferred.promise();
		} )
		.next( () => {
			// Should never be run because previous step is rejected
			result.push( 2 );
		} )
		.execute()
		.then( null, () => {
			assert.deepEqual(
				result,
				[ 0, 1 ],
				'Process is stopped when a step returns a promise that is then rejected'
			);
			return $.Deferred().resolve();
		} );
} );

QUnit.test( 'execute (wait)', ( assert ) => {
	const process = new OO.ui.Process(),
		result = [];

	process
		.next( () => {
			result.push( 'A' );
			return 10;
		} )
		.next( () => {
			result.push( 'B' );
		} );

	// Steps defined above don't run until execute()
	result.push( 'before' );

	// Process yields between step A and B
	setTimeout( () => {
		result.push( 'yield' );
	} );

	return process
		.execute()
		.then( () => {
			assert.deepEqual(
				result,
				[ 'before', 'A', 'yield', 'B' ],
				'Process is stopped when a step returns a promise that is then rejected'
			);
		} );
} );

QUnit.test( 'execute (thenable, success)', ( assert ) => {
	const process = new OO.ui.Process(),
		result = [];

	return process
		.next( () => {
			const deferred = $.Deferred();

			setTimeout( () => {
				result.push( 1 );
				deferred.resolve();
			}, 10 );

			return { then: deferred.then.bind( deferred ) };
		} )
		.first( () => {
			const deferred = $.Deferred();

			setTimeout( () => {
				result.push( 0 );
				deferred.resolve();
			}, 10 );

			return { then: deferred.then.bind( deferred ) };
		} )
		.next( () => {
			result.push( 2 );
		} )
		.execute()
		.then( () => {
			assert.deepEqual(
				result,
				[ 0, 1, 2 ],
				'Synchronous and asynchronous steps are executed in the correct order'
			);
		} );
} );

QUnit.test( 'execute (thenable, failure)', ( assert ) => {
	const process = new OO.ui.Process(),
		deferred = $.Deferred();

	deferred.reject( 'err' );

	return process
		.next( { then: deferred.then.bind( deferred ) } )
		.execute()
		.then(
			() => {
				assert.true( false, 'Promise should have rejected' );
			},
			( err ) => {
				assert.strictEqual(
					err,
					'err',
					'Error is propagated correctly'
				);
			}
		);
} );

QUnit.test( 'execute (function returning thenable, failure)', ( assert ) => {
	const process = new OO.ui.Process();

	return process
		.next( () => {
			const deferred = $.Deferred();

			deferred.reject( 'err' );

			return { then: deferred.then.bind( deferred ) };
		} )
		.execute()
		.then(
			() => {
				assert.true( false, 'Promise should have rejected' );
			},
			( err ) => {
				assert.strictEqual(
					err,
					'err',
					'Error is propagated correctly'
				);
			}
		);
} );
