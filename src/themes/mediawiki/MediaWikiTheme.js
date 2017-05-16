/**
 * @class
 * @extends OO.ui.WikimediaUITheme
 *
 * @constructor
 */
OO.ui.MediaWikiTheme = function OoUiMediaWikiTheme() {
	// Parent constructor
	OO.ui.MediaWikiTheme.parent.call( this );
};

/* Setup */

OO.inheritClass( OO.ui.MediaWikiTheme, OO.ui.WikimediaUITheme );

/* Instantiation */

OO.ui.theme = new OO.ui.MediaWikiTheme();
