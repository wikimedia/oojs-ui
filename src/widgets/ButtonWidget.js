/**
 * ButtonWidget is a generic widget for buttons. A wide variety of looks,
 * feels, and functionality can be customized via the class’s configuration options
 * and methods. Please see the [OOUI documentation on MediaWiki] [1] for more information
 * and examples.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets/Buttons_and_Switches
 *
 *     @example
 *     // A button widget.
 *     var button = new OO.ui.ButtonWidget( {
 *         label: 'Button with Icon',
 *         icon: 'trash',
 *         title: 'Remove'
 *     } );
 *     $( document.body ).append( button.$element );
 *
 * NOTE: HTML form buttons should use the OO.ui.ButtonInputWidget class.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.ButtonElement
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.TitledElement
 * @mixins OO.ui.mixin.FlaggedElement
 * @mixins OO.ui.mixin.TabIndexedElement
 * @mixins OO.ui.mixin.AccessKeyedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [active=false] Whether button should be shown as active
 * @cfg {string} [href=null] Hyperlink to visit when the button is clicked.
 * @cfg {string} [target=null] The frame or window in which to open the hyperlink.
 * @cfg {boolean} [noFollow=true] Search engine traversal hint
 * @cfg {string|string[]} [rel=[]] Relationship attributes for the hyperlink
 */
OO.ui.ButtonWidget = function OoUiButtonWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.ButtonWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.ButtonElement.call( this, config );
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.TitledElement.call( this, $.extend( {
		$titled: this.$button
	}, config ) );
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.TabIndexedElement.call( this, $.extend( {
		$tabIndexed: this.$button
	}, config ) );
	OO.ui.mixin.AccessKeyedElement.call( this, $.extend( {
		$accessKeyed: this.$button
	}, config ) );

	// Properties
	this.href = null;
	this.target = null;
	this.noFollow = false;
	this.rel = [];

	// Events
	this.connect( this, {
		disable: 'onDisable'
	} );

	// Initialization
	this.$button.append( this.$icon, this.$label, this.$indicator );
	this.$element
		.addClass( 'oo-ui-buttonWidget' )
		.append( this.$button );
	this.setActive( config.active );
	this.setHref( config.href );
	this.setTarget( config.target );
	if ( config.rel !== undefined ) {
		this.setRel( config.rel );
	} else {
		this.setNoFollow( config.noFollow );
	}
};

/* Setup */

OO.inheritClass( OO.ui.ButtonWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.mixin.ButtonElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.mixin.TitledElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.mixin.FlaggedElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.mixin.TabIndexedElement );
OO.mixinClass( OO.ui.ButtonWidget, OO.ui.mixin.AccessKeyedElement );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.ButtonWidget.static.cancelButtonMouseDownEvents = false;

/**
 * @static
 * @inheritdoc
 */
OO.ui.ButtonWidget.static.tagName = 'span';

/* Methods */

/**
 * Get hyperlink location.
 *
 * @return {string|null} Hyperlink location
 */
OO.ui.ButtonWidget.prototype.getHref = function () {
	return this.href;
};

/**
 * Get hyperlink target.
 *
 * @return {string|null} Hyperlink target
 */
OO.ui.ButtonWidget.prototype.getTarget = function () {
	return this.target;
};

/**
 * Get search engine traversal hint.
 *
 * @return {boolean} Whether search engines should avoid traversing this hyperlink
 */
OO.ui.ButtonWidget.prototype.getNoFollow = function () {
	return this.noFollow;
};

/**
 * Get the relationship attribute of the hyperlink.
 *
 * @return {string[]} Relationship attributes that apply to the hyperlink
 */
OO.ui.ButtonWidget.prototype.getRel = function () {
	return this.rel;
};

/**
 * Set hyperlink location.
 *
 * @param {string|null} href Hyperlink location, null to remove
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.ButtonWidget.prototype.setHref = function ( href ) {
	href = typeof href === 'string' ? href : null;
	if ( href !== null && !OO.ui.isSafeUrl( href ) ) {
		href = './' + href;
	}

	if ( href !== this.href ) {
		this.href = href;
		this.updateHref();
	}

	return this;
};

/**
 * Update the `href` attribute, in case of changes to href or
 * disabled state.
 *
 * @private
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.ButtonWidget.prototype.updateHref = function () {
	if ( this.href !== null && !this.isDisabled() ) {
		this.$button.attr( 'href', this.href );
	} else {
		this.$button.removeAttr( 'href' );
	}

	return this;
};

/**
 * Handle disable events.
 *
 * @private
 * @param {boolean} disabled Element is disabled
 */
OO.ui.ButtonWidget.prototype.onDisable = function () {
	this.updateHref();
};

/**
 * Set hyperlink target.
 *
 * @param {string|null} target Hyperlink target, null to remove
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.ButtonWidget.prototype.setTarget = function ( target ) {
	target = typeof target === 'string' ? target : null;

	if ( target !== this.target ) {
		this.target = target;
		if ( target !== null ) {
			this.$button.attr( 'target', target );
		} else {
			this.$button.removeAttr( 'target' );
		}
	}

	return this;
};

/**
 * Set search engine traversal hint.
 *
 * @param {boolean} noFollow True if search engines should avoid traversing this hyperlink
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.ButtonWidget.prototype.setNoFollow = function ( noFollow ) {
	noFollow = typeof noFollow === 'boolean' ? noFollow : true;

	if ( noFollow !== this.noFollow ) {
		var rel;
		if ( noFollow ) {
			rel = this.rel.concat( [ 'nofollow' ] );
		} else {
			rel = this.rel.filter( function ( value ) {
				return value !== 'nofollow';
			} );
		}
		this.setRel( rel );
	}

	return this;
};

/**
 * Set the `rel` attribute of the hyperlink.
 *
 * @param {string|string[]} [rel] Relationship attributes for the hyperlink, omit to remove
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.ButtonWidget.prototype.setRel = function ( rel ) {
	if ( !Array.isArray( rel ) ) {
		rel = rel ? [ rel ] : [];
	}

	this.rel = rel;
	// For backwards compatibility.
	this.noFollow = rel.indexOf( 'nofollow' ) !== -1;
	this.$button.attr( 'rel', rel.join( ' ' ) || null );

	return this;
};

// Override method visibility hints from ButtonElement
/**
 * @method setActive
 * @inheritdoc
 */
/**
 * @method isActive
 * @inheritdoc
 */
