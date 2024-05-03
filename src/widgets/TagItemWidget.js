/**
 * TagItemWidgets are used within a {@link OO.ui.TagMultiselectWidget
 * TagMultiselectWidget} to display the selected items.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixes OO.ui.mixin.ItemWidget
 * @mixes OO.ui.mixin.LabelElement
 * @mixes OO.ui.mixin.FlaggedElement
 * @mixes OO.ui.mixin.TabIndexedElement
 * @mixes OO.ui.mixin.DraggableElement
 *
 * @constructor
 * @param {Object} [config] Configuration object
 * @param {boolean} [config.valid=true] Item is valid
 * @param {boolean} [config.fixed=false] Item is fixed. This means the item is
 *  always included in the values and cannot be removed.
 */
OO.ui.TagItemWidget = function OoUiTagItemWidget( config ) {
	config = config || {};

	// Parent constructor
	OO.ui.TagItemWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.ItemWidget.call( this );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.TabIndexedElement.call( this, config );
	OO.ui.mixin.DraggableElement.call( this, config );

	this.valid = config.valid === undefined ? true : !!config.valid;
	this.fixed = !!config.fixed;

	this.closeButton = new OO.ui.ButtonWidget( {
		framed: false,
		icon: 'close',
		tabIndex: -1,
		title: OO.ui.msg( 'ooui-item-remove' )
	} );
	this.closeButton.setDisabled( this.isDisabled() );

	// Events
	this.closeButton.connect( this, {
		click: 'remove'
	} );
	this.$element
		.on( 'click', this.select.bind( this ) )
		.on( 'keydown', this.onKeyDown.bind( this ) )
		// Prevent propagation of mousedown; the tag item "lives" in the
		// clickable area of the TagMultiselectWidget, which listens to
		// mousedown to open the menu or popup. We want to prevent that
		// for clicks specifically on the tag itself, so the actions taken
		// are more deliberate. When the tag is clicked, it will emit the
		// selection event (similar to how #OO.ui.MultioptionWidget emits 'change')
		// and can be handled separately.
		.on( 'mousedown', ( e ) => {
			e.stopPropagation();
		} );

	// Initialization
	this.$element
		.addClass( 'oo-ui-tagItemWidget' )
		.append( this.$label, this.closeButton.$element );
};

/* Initialization */

OO.inheritClass( OO.ui.TagItemWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.TagItemWidget, OO.ui.mixin.ItemWidget );
OO.mixinClass( OO.ui.TagItemWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.TagItemWidget, OO.ui.mixin.FlaggedElement );
OO.mixinClass( OO.ui.TagItemWidget, OO.ui.mixin.TabIndexedElement );
OO.mixinClass( OO.ui.TagItemWidget, OO.ui.mixin.DraggableElement );

/* Events */

/**
 * A remove action was performed on the item
 *
 * @event OO.ui.TagItemWidget#remove
 */

/**
 * A navigate action was performed on the item
 *
 * @event OO.ui.TagItemWidget#navigate
 * @param {string} direction Direction of the movement, forward or backwards
 */

/**
 * The tag widget was selected. This can occur when the widget
 * is either clicked or enter was pressed on it.
 *
 * @event OO.ui.TagItemWidget#select
 */

/**
 * Item validity has changed
 *
 * @event OO.ui.TagItemWidget#valid
 * @param {boolean} isValid Item is valid
 */

/**
 * Item fixed state has changed
 *
 * @event OO.ui.TagItemWidget#fixed
 * @param {boolean} isFixed Item is fixed
 */

/* Methods */

/**
 * Set this item as fixed, meaning it cannot be removed
 *
 * @param {boolean} [state] Item is fixed, omit to toggle
 * @fires OO.ui.TagItemWidget#fixed
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.TagItemWidget.prototype.setFixed = function ( state ) {
	state = state === undefined ? !this.fixed : !!state;

	if ( this.fixed !== state ) {
		this.fixed = state;
		if ( this.closeButton ) {
			this.closeButton.toggle( !this.fixed );
		}

		if ( !this.fixed && this.elementGroup && !this.elementGroup.isDraggable() ) {
			// Only enable the state of the item if the
			// entire group is draggable
			this.toggleDraggable( !this.fixed );
		}
		this.$element.toggleClass( 'oo-ui-tagItemWidget-fixed', this.fixed );

		this.emit( 'fixed', this.isFixed() );
	}
	return this;
};

/**
 * Check whether the item is fixed
 *
 * @return {boolean}
 */
OO.ui.TagItemWidget.prototype.isFixed = function () {
	return this.fixed;
};

/**
 * Handle removal of the item
 *
 * This is mainly for extensibility concerns, so other children
 * of this class can change the behavior if they need to. This
 * is called by both clicking the 'remove' button but also
 * on keypress, which is harder to override if needed.
 *
 * @fires OO.ui.TagItemWidget#remove
 */
OO.ui.TagItemWidget.prototype.remove = function () {
	if ( !this.isDisabled() && !this.isFixed() ) {
		this.emit( 'remove' );
	}
};

/**
 * Handle a keydown event on the widget
 *
 * @fires OO.ui.TagItemWidget#navigate
 * @fires OO.ui.TagItemWidget#remove
 * @param {jQuery.Event} e Key down event
 * @return {boolean|undefined} false to stop the operation
 */
OO.ui.TagItemWidget.prototype.onKeyDown = function ( e ) {
	if (
		!this.isDisabled() &&
		!this.isFixed() &&
		( e.keyCode === OO.ui.Keys.BACKSPACE || e.keyCode === OO.ui.Keys.DELETE )
	) {
		this.remove();
		return false;
	} else if ( e.keyCode === OO.ui.Keys.ENTER ) {
		this.select();
		return false;
	} else if (
		e.keyCode === OO.ui.Keys.LEFT ||
		e.keyCode === OO.ui.Keys.RIGHT
	) {
		let movement;

		if ( OO.ui.Element.static.getDir( this.$element ) === 'rtl' ) {
			movement = {
				left: 'forwards',
				right: 'backwards'
			};
		} else {
			movement = {
				left: 'backwards',
				right: 'forwards'
			};
		}

		this.emit(
			'navigate',
			e.keyCode === OO.ui.Keys.LEFT ?
				movement.left : movement.right
		);
		return false;
	}
};

/**
 * Select this item
 *
 * @fires OO.ui.TagItemWidget#select
 */
OO.ui.TagItemWidget.prototype.select = function () {
	if ( !this.isDisabled() ) {
		this.emit( 'select' );
	}
};

/**
 * Set the valid state of this item
 *
 * @param {boolean} [valid] Item is valid, omit to toggle
 * @fires OO.ui.TagItemWidget#valid
 */
OO.ui.TagItemWidget.prototype.toggleValid = function ( valid ) {
	valid = valid === undefined ? !this.valid : !!valid;

	if ( this.valid !== valid ) {
		this.valid = valid;

		this.setFlags( { invalid: !this.valid } );

		this.emit( 'valid', this.valid );
	}
};

/**
 * Check whether the item is valid
 *
 * @return {boolean} Item is valid
 */
OO.ui.TagItemWidget.prototype.isValid = function () {
	return this.valid;
};
