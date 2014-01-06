( function ( $ ) {

	/**
	 * @param {Object} item
	 * @param {OO.ui.Widget} item.widget
	 * @param {string} [item.label=""]
	 * @returns {jQuery} Console interface element
	 */
	function buildConsole( item ) {
		var $toggle, $log, $label, $input, $submit, $console, $form,
			console = window.console,
			name = item.label || item.widget.constructor.name;

		function exec( str ) {
			var func, ret;
			/*jshint evil:true */
			if ( str.indexOf( 'return' ) !== 0 ) {
				str = 'return ' + str;
			}
			try {
				func = new Function( 'widget', 'item', str );
				ret = { value: func( item.widget, item ) };
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

			if ( result.value && $.type( result.value ) === 'object' ) {
				logval = '[object ' + ( result.value.constructor.name || 'Object' ) + ']';
			} else {
				logval = String( result.value );
				if ( logval === '' ) {
					logval = '""';
				}
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
				console.log( '[Console "' + name + '"]', result.value );
				if ( result.error ) {
					if ( console.error ) {
						console.error( '[Console "' + name + '"]', String( result.error ), result.error );
					} else {
						console.log( '[Console "' + name + '"] Error: ', result.error );
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
						window.$widget = item.widget;
						console.log( '[Console "' + name + '"]', 'Global $widget has been set' );
						console.log( '[Console "' + name + '"]', item.widget );
					}
				}
			} );

		$log = $( '<div>' )
			.addClass( 'oo-ui-demo-console-log' );

		$label = $( '<label>' )
			.addClass( 'oo-ui-demo-console-label' );

		$input = $( '<input>' )
			.addClass( 'oo-ui-demo-console-input' )
			.prop( 'placeholder', '... (predefined: OoUiWidget widget, Object item)' );

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
