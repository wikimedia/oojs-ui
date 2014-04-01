$( function () {
	var i, j, iLen, jLen, rules, selectorText, matches, options, fieldset,
		sheets = document.styleSheets,
		pattern = /\.oo-ui-(icon|indicator)-(.*)/,
		iconsFieldset = new OO.ui.FieldsetLayout( { 'label': 'Icons' } ),
		indicatorsFieldset = new OO.ui.FieldsetLayout( { 'label': 'Indicators' } );

	for ( i = 0, iLen = sheets.length; i < iLen; i++ ) {
		rules = sheets[i].cssRules;
		for ( j = 0, jLen = rules.length; j < jLen; j++ ) {
			selectorText = rules[j].selectorText;
			if ( selectorText ) {
				matches = selectorText.match( pattern );
				if ( matches ) {
					fieldset = matches[1] === 'icon' ? iconsFieldset : indicatorsFieldset;
					options = {
						'frameless': true,
						'label': matches[2]
					};
					options[matches[1]] = matches[2];
					fieldset.addItems( [
						new OO.ui.ButtonWidget( options )
					] );
				}
			}
		}
	}

	$( '.oo-ui-demo' ).append(
		indicatorsFieldset.$element,
		iconsFieldset.$element
	);
} );
