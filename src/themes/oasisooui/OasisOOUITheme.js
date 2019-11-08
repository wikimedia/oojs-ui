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

	return classes;
};

OO.ui.OasisOOUITheme.prototype.updateElementClasses = function ( element ) {
    var classes = this.getElementClasses( element );

    switch (element.constructor.name) {
        case 'OoUiTabSelectWidget':
            classes['on'].push( 'wds-tabs' );
            break;
        case 'OoUiTabOptionWidget':
            classes['on'].push( 'wds-tabs__tab' );

            if (element.selected) {
                classes['on'].push( 'wds-is-current' );
            }

            if (element.$label) {
                element.$label.addClass( 'wds-tabs__tab-label' );
            }
            break;
        case 'OoUiButtonWidget':
        case 'OoUiButtonInputWidget':
            console.log(element);
            if (element.$button) {
                element.$button.addClass( 'wds-button' );

                if (!element.flags.primary) {
                    element.$button.addClass( 'wds-is-secondary' );
                }

                if (!element.framed) {
                    element.$button.addClass( 'wds-is-text' );
                }

                if (element.disabled) {
                    element.$button.addClass( 'wds-is-disabled' );
                }
            }
            break;
        default:
            break;
    }

    element.$element.removeClass( classes.off ).addClass( classes.on );
};

OO.ui.theme = new OO.ui.OasisOOUITheme();
