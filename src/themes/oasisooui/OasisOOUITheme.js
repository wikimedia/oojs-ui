/**
 * @class
 * @extends OO.ui.Theme
 *
 * @constructor
 */
OO.ui.OasisOOUITheme = function OoUiOasisTheme() {
	OO.ui.OasisOOUITheme.parent.call( this );
};

/* Setup */

OO.inheritClass( OO.ui.OasisOOUITheme, OO.ui.Theme );

/* Methods */

OO.ui.OasisOOUITheme.prototype.getElementClasses = function ( element ) {
	var classes = OO.ui.OasisOOUITheme.parent.prototype.getElementClasses.call( this, element );

    if (element instanceof OO.ui.TabSelectWidget) {
        classes['on'].push( 'wds-tabs' );
    }

	return classes;
};

OO.ui.OasisOOUITheme.prototype.updateElementClasses = function ( element ) {
    var classes = this.getElementClasses( element );
    element.$element.removeClass( classes.off ).addClass( classes.on );
};

OO.ui.theme = new OO.ui.OasisOOUITheme();
