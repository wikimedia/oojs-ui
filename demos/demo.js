( function ( $ ) {

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
			$input.val( '' ).focus();
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
					$input.focus();
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

	$( function () {
		var directionSelect = new OO.ui.ButtonSelectWidget().addItems( [
			new OO.ui.ButtonOptionWidget( 'ltr', { '$': this.$, 'label': 'LTR' } ),
			new OO.ui.ButtonOptionWidget( 'rtl', { '$': this.$, 'label': 'RTL' } )
		] )
		.on( 'select', function ( option ) {
			var dir = option.getData(),
				oldDir = dir === 'ltr' ? 'rtl' : 'ltr';

			$( '.stylesheet-' + dir ).removeAttr( 'disabled' );
			$( '.stylesheet-' + oldDir ).attr( 'disabled', 'disabled' );
			$( 'body' ).addClass( 'oo-ui-' + dir );
			$( 'body' ).removeClass( 'oo-ui-' + oldDir );
		} );

		directionSelect.selectItem( directionSelect.getItemFromData( 'ltr' ) );
		$( '.oo-ui-demo-dir' ).prepend( directionSelect.$element );
	} );

} )( jQuery );
