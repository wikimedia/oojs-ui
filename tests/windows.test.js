QUnit.module( 'windows' );

QUnit.test( 'alert()', function ( assert ) {
	OO.ui.getWindowManager().once( 'opening', function ( win, opened ) {
		opened.progress( function ( notif ) {
			if ( notif.state === 'ready' ) {
				win.executeAction( 'accept' );
			}
		} );
	} );
	return OO.ui.alert( 'Text' ).then( function ( data ) {
		assert.strictEqual( data, undefined );
	} );
} );

QUnit.test( 'confirm() - accept', function ( assert ) {
	OO.ui.getWindowManager().once( 'opening', function ( win, opened ) {
		opened.progress( function ( notif ) {
			if ( notif.state === 'ready' ) {
				win.executeAction( 'accept' );
			}
		} );
	} );
	return OO.ui.confirm( 'Text' ).then( function ( result ) {
		assert.strictEqual( result, true, 'Accepted' );
	} );
} );

QUnit.test( 'confirm() - reject', function ( assert ) {
	OO.ui.getWindowManager().once( 'opening', function ( win, opened ) {
		opened.progress( function ( notif ) {
			if ( notif.state === 'ready' ) {
				win.executeAction( 'reject' );
			}
		} );
	} );
	return OO.ui.confirm( 'Text' ).then( function ( result ) {
		assert.strictEqual( result, false, 'Rejected' );
	} );
} );

QUnit.test( 'prompt() - accept', function ( assert ) {
	OO.ui.getWindowManager().once( 'opening', function ( win, opened ) {
		opened.progress( function ( notif ) {
			if ( notif.state === 'ready' ) {
				win.$body.find( 'input[type="text"]' ).val( 'Hello' );
				win.executeAction( 'accept' );
			}
		} );
	} );
	return OO.ui.prompt( 'Text' ).then( function ( result ) {
		assert.strictEqual( result, 'Hello', 'Accepted - text value' );
	} );
} );

QUnit.test( 'prompt() - reject', function ( assert ) {
	OO.ui.getWindowManager().once( 'opening', function ( win, opened ) {
		opened.progress( function ( notif ) {
			if ( notif.state === 'ready' ) {
				win.$body.find( 'input[type="text"]' ).val( 'Hello' );
				win.executeAction( 'reject' );
			}
		} );
	} );
	return OO.ui.prompt( 'Text' ).then( function ( result ) {
		assert.strictEqual( result, null, 'Rejected' );
	} );
} );
