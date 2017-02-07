/**
 * @class OO.ui
 */

/**
 * Lazy-initialize and return a global OO.ui.WindowManager instance, used by OO.ui.alert and
 * OO.ui.confirm.
 *
 * @private
 * @return {OO.ui.WindowManager}
 */
OO.ui.getWindowManager = function () {
	if ( !OO.ui.windowManager ) {
		OO.ui.windowManager = new OO.ui.WindowManager();
		$( 'body' ).append( OO.ui.windowManager.$element );
		OO.ui.windowManager.addWindows( [ new OO.ui.MessageDialog() ] );
	}
	return OO.ui.windowManager;
};

/**
 * Display a quick modal alert dialog, using a OO.ui.MessageDialog. While the dialog is open, the
 * rest of the page will be dimmed out and the user won't be able to interact with it. The dialog
 * has only one action button, labelled "OK", clicking it will simply close the dialog.
 *
 * A window manager is created automatically when this function is called for the first time.
 *
 *     @example
 *     OO.ui.alert( 'Something happened!' ).done( function () {
 *         console.log( 'User closed the dialog.' );
 *     } );
 *
 * @param {jQuery|string} text Message text to display
 * @param {Object} [options] Additional options, see OO.ui.MessageDialog#getSetupProcess
 * @return {jQuery.Promise} Promise resolved when the user closes the dialog
 */
OO.ui.alert = function ( text, options ) {
	return OO.ui.getWindowManager().openWindow( 'message', $.extend( {
		message: text,
		actions: [ OO.ui.MessageDialog.static.actions[ 0 ] ]
	}, options ) ).then( function ( opened ) {
		return opened.then( function ( closing ) {
			return closing.then( function () {
				return $.Deferred().resolve();
			} );
		} );
	} );
};

/**
 * Display a quick modal confirmation dialog, using a OO.ui.MessageDialog. While the dialog is open,
 * the rest of the page will be dimmed out and the user won't be able to interact with it. The
 * dialog has two action buttons, one to confirm an operation (labelled "OK") and one to cancel it
 * (labelled "Cancel").
 *
 * A window manager is created automatically when this function is called for the first time.
 *
 *     @example
 *     OO.ui.confirm( 'Are you sure?' ).done( function ( confirmed ) {
 *         if ( confirmed ) {
 *             console.log( 'User clicked "OK"!' );
 *         } else {
 *             console.log( 'User clicked "Cancel" or closed the dialog.' );
 *         }
 *     } );
 *
 * @param {jQuery|string} text Message text to display
 * @param {Object} [options] Additional options, see OO.ui.MessageDialog#getSetupProcess
 * @return {jQuery.Promise} Promise resolved when the user closes the dialog. If the user chose to
 *  confirm, the promise will resolve to boolean `true`; otherwise, it will resolve to boolean
 *  `false`.
 */
OO.ui.confirm = function ( text, options ) {
	return OO.ui.getWindowManager().openWindow( 'message', $.extend( {
		message: text
	}, options ) ).then( function ( opened ) {
		return opened.then( function ( closing ) {
			return closing.then( function ( data ) {
				return $.Deferred().resolve( !!( data && data.action === 'accept' ) );
			} );
		} );
	} );
};

/**
 * Display a quick modal prompt dialog, using a OO.ui.MessageDialog. While the dialog is open,
 * the rest of the page will be dimmed out and the user won't be able to interact with it. The
 * dialog has a text input widget and two action buttons, one to confirm an operation (labelled "OK")
 * and one to cancel it (labelled "Cancel").
 *
 * A window manager is created automatically when this function is called for the first time.
 *
 *     @example
 *     OO.ui.prompt( 'Choose a line to go to', { textInput: { placeholder: 'Line number' } } ).done( function ( result ) {
 *         if ( result !== null ) {
 *             console.log( 'User typed "' + result + '" then clicked "OK".' );
 *         } else {
 *             console.log( 'User clicked "Cancel" or closed the dialog.' );
 *         }
 *     } );
 *
 * @param {jQuery|string} text Message text to display
 * @param {Object} [options] Additional options, see OO.ui.MessageDialog#getSetupProcess
 * @param {Object} [options.textInput] Additional options for text input widget, see OO.ui.TextInputWidget
 * @return {jQuery.Promise} Promise resolved when the user closes the dialog. If the user chose to
 *  confirm, the promise will resolve with the value of the text input widget; otherwise, it will
 *  resolve to `null`.
 */
OO.ui.prompt = function ( text, options ) {
	var manager = OO.ui.getWindowManager(),
		textInput = new OO.ui.TextInputWidget( ( options && options.textInput ) || {} ),
		textField = new OO.ui.FieldLayout( textInput, {
			align: 'top',
			label: text
		} );

	// TODO: This is a little hacky, and could be done by extending MessageDialog instead.

	return manager.openWindow( 'message', $.extend( {
		message: textField.$element
	}, options ) ).then( function ( opened ) {
		// After ready
		textInput.on( 'enter', function () {
			manager.getCurrentWindow().close( { action: 'accept' } );
		} );
		textInput.focus();
		return opened.then( function ( closing ) {
			return closing.then( function ( data ) {
				return $.Deferred().resolve( data && data.action === 'accept' ? textInput.getValue() : null );
			} );
		} );
	} );
};
