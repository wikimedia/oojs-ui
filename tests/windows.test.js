QUnit.module( 'windows' );

QUnit.test( 'alert()', ( assert ) => {
	OO.ui.getWindowManager().once( 'opening', ( win, opened ) => {
		opened.progress( ( notif ) => {
			if ( notif.state === 'ready' ) {
				win.executeAction( 'accept' );
			}
		} );
	} );
	return OO.ui.alert( 'Text' ).then( ( data ) => {
		assert.strictEqual( data, undefined );
	} );
} );

QUnit.test( 'confirm() - accept', ( assert ) => {
	OO.ui.getWindowManager().once( 'opening', ( win, opened ) => {
		opened.progress( ( notif ) => {
			if ( notif.state === 'ready' ) {
				win.executeAction( 'accept' );
			}
		} );
	} );
	return OO.ui.confirm( 'Text' ).then( ( result ) => {
		assert.strictEqual( result, true, 'Accepted' );
	} );
} );

QUnit.test( 'confirm() - reject', ( assert ) => {
	OO.ui.getWindowManager().once( 'opening', ( win, opened ) => {
		opened.progress( ( notif ) => {
			if ( notif.state === 'ready' ) {
				win.executeAction( 'reject' );
			}
		} );
	} );
	return OO.ui.confirm( 'Text' ).then( ( result ) => {
		assert.strictEqual( result, false, 'Rejected' );
	} );
} );

QUnit.test( 'prompt() - accept', ( assert ) => {
	OO.ui.getWindowManager().once( 'opening', ( win, opened ) => {
		opened.progress( ( notif ) => {
			if ( notif.state === 'ready' ) {
				win.$body.find( 'input[type="text"]' ).val( 'Hello' );
				win.executeAction( 'accept' );
			}
		} );
	} );
	return OO.ui.prompt( 'Text' ).then( ( result ) => {
		assert.strictEqual( result, 'Hello', 'Accepted - text value' );
	} );
} );

QUnit.test( 'prompt() - reject', ( assert ) => {
	OO.ui.getWindowManager().once( 'opening', ( win, opened ) => {
		opened.progress( ( notif ) => {
			if ( notif.state === 'ready' ) {
				win.$body.find( 'input[type="text"]' ).val( 'Hello' );
				win.executeAction( 'reject' );
			}
		} );
	} );
	return OO.ui.prompt( 'Text' ).then( ( result ) => {
		assert.strictEqual( result, null, 'Rejected' );
	} );
} );

QUnit.test( 'clearWindows()', ( assert ) => {
	const windowManager = OO.ui.getWindowManager();
	let alertWindow;
	windowManager.once( 'opening', ( win, opened ) => {
		opened.then( () => {
			alertWindow = win;
			assert.true( windowManager.isOpened( alertWindow ) );
			windowManager.clearWindows();
		} );
	} );
	return OO.ui.alert( 'Text' ).then( () => {
		assert.false( windowManager.isOpened( alertWindow ) );
	} );
} );
