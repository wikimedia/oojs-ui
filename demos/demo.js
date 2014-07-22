( function ( $ ) {

	var pageMenu = new OO.ui.InlineMenuWidget( {
			menu: {
				items: [
					new OO.ui.MenuItemWidget( 'dialogs',  { label: 'Dialogs' } ),
					new OO.ui.MenuItemWidget( 'icons',  { label: 'Icons' } ),
					new OO.ui.MenuItemWidget( 'toolbars',  { label: 'Toolbars' } ),
					new OO.ui.MenuItemWidget( 'widgets',  { label: 'Widgets' } )
				]
			}
		} ),
		pageMenuMenu = pageMenu.getMenu(),
		themeSelect = new OO.ui.ButtonSelectWidget().addItems( [
			new OO.ui.ButtonOptionWidget( 'apex', { label: 'Apex' } ),
			new OO.ui.ButtonOptionWidget( 'agora', { label: 'Agora' } )
		] ),
		directionSelect = new OO.ui.ButtonSelectWidget().addItems( [
			new OO.ui.ButtonOptionWidget( 'ltr', { label: 'LTR' } ),
			new OO.ui.ButtonOptionWidget( 'rtl', { label: 'RTL' } )
		] );

	function updateDemo() {
		var page = pageMenuMenu.getSelectedItem().getData(),
			theme = themeSelect.getSelectedItem().getData(),
			dir = directionSelect.getSelectedItem().getData();

		$( 'link[rel=stylesheet]' )
			.prop( 'disabled', true )
			.filter( '.stylesheet-dir-' + dir + ', .stylesheet-dir-all' )
			.filter( '.stylesheet-theme-' + theme + ', .stylesheet-theme-all' )
			.prop( 'disabled', false );

		$( 'body' ).removeClass( 'oo-ui-ltr oo-ui-rtl' ).addClass( 'oo-ui-' + dir );

		$( '.oo-ui-demo' ).empty();

		OO.ui.demo[page]();

		location.hash = [ page, theme, dir ].join( '-' );
	}

	function onHashChange() {
		var parts = location.hash.substr( 1 ).split( '-' );
		if ( parts.length !== 3 ) {
			parts = [ 'widgets', 'apex', 'ltr' ];
		}
		pageMenuMenu.selectItem( pageMenuMenu.getItemFromData( parts[0] ) );
		themeSelect.selectItem( themeSelect.getItemFromData( parts[1] ) );
		directionSelect.selectItem( directionSelect.getItemFromData( parts[2] ) );
	}
	$( window ).on( 'hashchange', onHashChange );
	onHashChange();

	pageMenuMenu.on( 'select', updateDemo );
	themeSelect.on( 'select', updateDemo );
	directionSelect.on( 'select', updateDemo );

	$( function () {
		$( '.oo-ui-demo-menu' ).append( pageMenu.$element, themeSelect.$element, directionSelect.$element );
		updateDemo();
	} );

	/**
	 * @param {OO.ui.Element} item
	 * @param {string} key Variable name for item
	 * @param {string} [item.label=""]
	 * @return {jQuery} Console interface element
	 */
	function buildConsole( item, key ) {
		var $toggle, $log, $label, $input, $submit, $console, $form,
			console = window.console;

		function exec( str ) {
			var func, ret;
			/*jshint evil:true */
			if ( str.indexOf( 'return' ) !== 0 ) {
				str = 'return ' + str;
			}
			try {
				func = new Function( key, 'item', str );
				ret = { value: func( item, item ) };
			} catch ( error ) {
				ret = {
					value: undefined,
					error: error
				};
			}
			return ret;
		}

		function submit() {
			var val, result, logval;

			val = $input.val();
			$input.val( '' );
			$input[0].focus();
			result = exec( val );

			logval = String( result.value );
			if ( logval === '' ) {
				logval = '""';
			}

			$log.append(
				$( '<div>' )
					.addClass( 'oo-ui-demo-console-log-line oo-ui-demo-console-log-line-input' )
					.text( val ),
				$('<div>')
					.addClass( 'oo-ui-demo-console-log-line oo-ui-demo-console-log-line-return' )
					.text( logval || result.value )
			);

			if ( result.error ) {
				$log.append( $('<div>').addClass( 'oo-ui-demo-console-log-line oo-ui-demo-console-log-line-error' ).text( result.error ) );
			}

			if ( console && console.log ) {
				console.log( '[demo]', result.value );
				if ( result.error ) {
					if ( console.error ) {
						console.error( '[demo]', String( result.error ), result.error );
					} else {
						console.log( '[demo] Error: ', result.error );
					}
				}
			}

			// Scrol to end
			$log.prop( 'scrollTop', $log.prop( 'scrollHeight' ) );
		}

		$toggle = $( '<span>' )
			.addClass( 'oo-ui-demo-console-toggle' )
			.attr( 'title', 'Toggle console' )
			.on( 'click', function ( e ) {
				e.preventDefault();
				$console.toggleClass( 'oo-ui-demo-console-collapsed oo-ui-demo-console-expanded' );
				if ( $input.is( ':visible' ) ) {
					$input[0].focus();
					if ( console && console.log ) {
						window[ '$' + key ] = item;
						console.log( '[demo]', 'Global $' + key + ' has been set' );
						console.log( '[demo]', item );
					}
				}
			} );

		$log = $( '<div>' )
			.addClass( 'oo-ui-demo-console-log' );

		$label = $( '<label>' )
			.addClass( 'oo-ui-demo-console-label' );

		$input = $( '<input>' )
			.addClass( 'oo-ui-demo-console-input' )
			.prop( 'placeholder', '... (predefined: ' + key + ')' );

		$submit = $( '<div>' )
			.addClass( 'oo-ui-demo-console-submit' )
			.text( '↵' )
			.on( 'click', submit );

		$form = $( '<form>' ).on( 'submit', function ( e ) {
			e.preventDefault();
			submit();
		} );

		$console = $( '<div>' )
			.addClass( 'oo-ui-demo-console oo-ui-demo-console-collapsed' )
			.append(
				$toggle,
				$log,
				$form.append(
					$label.append(
						$input
					),
					$submit
				)
			);

		return $console;
	}

	OO.ui.demo = {
		buildConsole: buildConsole
	};

} )( jQuery );
