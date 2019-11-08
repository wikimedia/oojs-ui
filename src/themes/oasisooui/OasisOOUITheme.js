/**
 * @class
 * @extends OO.ui.Theme
 *
 * @constructor
 */
OO.ui.OasisOOUITheme = function OoUiOasisTheme() {
	// Parent constructor
	OO.ui.OasisOOUITheme.parent.call( this );
};

/* Setup */

OO.inheritClass( OO.ui.OasisOOUITheme, OO.ui.Theme );

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.OasisOOUITheme.prototype.getElementClasses = function ( element ) {
	// Parent method
	var classes = OO.ui.OasisOOUITheme.parent.prototype.getElementClasses.call( this, element );

	// Add classes to classes.on or classes.off

	return classes;
};

/* Instantiation */

OO.ui.theme = new OO.ui.OasisOOUITheme();
