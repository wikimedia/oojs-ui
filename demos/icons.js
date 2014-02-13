$( function () {
	var i, j, iLen, jLen, rules, selectorText,
		sheets = document.styleSheets,
		prefix = '.oo-ui-icon-',
		$icons = $( '<div>' ),
		$icon = $( '<span>' ),
		$label = $( '<span>' );

	$icons.addClass( 'oo-ui-demo-icons' );
	$icon.addClass( 'oo-ui-demo-icon' );
	$label.addClass( 'oo-ui-demo-icon-label' );
	for ( i = 0, iLen = sheets.length; i < iLen; i++ ) {
		rules = sheets[i].cssRules;
		for ( j = 0, jLen = rules.length; j < jLen; j++ ) {
			selectorText = rules[j].selectorText;
			if ( selectorText ) {
				if ( selectorText.indexOf( prefix ) === 0 ) {
					$icons.append(
						$icon.clone().addClass( selectorText.substr( 1 ) ),
						$label.clone().text( selectorText.substr( prefix.length ) )
					);
				}
			}
		}
	}

	$( '.oo-ui-demo' ).append( $icons );
} );