/**
 * PopupToolGroup is an abstract base class used by both {@link OO.ui.MenuToolGroup MenuToolGroup}
 * and {@link OO.ui.ListToolGroup ListToolGroup} to provide a popup--an overlaid menu or list of tools with an
 * optional icon and label. This class can be used for other base classes that also use this functionality.
 *
 * @abstract
 * @class
 * @extends OO.ui.ToolGroup
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.TitledElement
 * @mixins OO.ui.mixin.FlaggedElement
 * @mixins OO.ui.mixin.ClippableElement
 * @mixins OO.ui.mixin.FloatableElement
 * @mixins OO.ui.mixin.TabIndexedElement
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 * @cfg {string} [header] Text to display at the top of the popup
 */
OO.ui.PopupToolGroup = function OoUiPopupToolGroup( toolbar, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( toolbar ) && config === undefined ) {
		config = toolbar;
		toolbar = config.toolbar;
	}

	// Configuration initialization
	config = $.extend( {
		indicator: config.indicator === undefined ? ( toolbar.position === 'bottom' ? 'up' : 'down' ) : config.indicator
	}, config );

	// Parent constructor
	OO.ui.PopupToolGroup.parent.call( this, toolbar, config );

	// Properties
	this.active = false;
	this.dragging = false;
	this.onBlurHandler = this.onBlur.bind( this );
	this.$handle = $( '<span>' );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.TitledElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.ClippableElement.call( this, $.extend( {}, config, { $clippable: this.$group } ) );
	OO.ui.mixin.FloatableElement.call( this, $.extend( {}, config, {
		$floatable: this.$group,
		$floatableContainer: this.$handle,
		hideWhenOutOfView: false,
		verticalPosition: this.toolbar.position === 'bottom' ? 'above' : 'below'
	} ) );
	OO.ui.mixin.TabIndexedElement.call( this, $.extend( {}, config, { $tabIndexed: this.$handle } ) );

	// Events
	this.$handle.on( {
		keydown: this.onHandleMouseKeyDown.bind( this ),
		keyup: this.onHandleMouseKeyUp.bind( this ),
		mousedown: this.onHandleMouseKeyDown.bind( this ),
		mouseup: this.onHandleMouseKeyUp.bind( this )
	} );

	// Initialization
	this.$handle
		.addClass( 'oo-ui-popupToolGroup-handle' )
		.attr( 'role', 'button' )
		.append( this.$icon, this.$label, this.$indicator );
	// If the pop-up should have a header, add it to the top of the toolGroup.
	// Note: If this feature is useful for other widgets, we could abstract it into an
	// OO.ui.HeaderedElement mixin constructor.
	if ( config.header !== undefined ) {
		this.$group
			.prepend( $( '<span>' )
				.addClass( 'oo-ui-popupToolGroup-header' )
				.text( config.header )
			);
	}
	this.$element
		.addClass( 'oo-ui-popupToolGroup' )
		.prepend( this.$handle );
	this.$group.addClass( 'oo-ui-popupToolGroup-tools' );
	this.toolbar.$popups.append( this.$group );
};

/* Setup */

OO.inheritClass( OO.ui.PopupToolGroup, OO.ui.ToolGroup );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.TitledElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.FlaggedElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.ClippableElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.FloatableElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.TabIndexedElement );

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.setDisabled = function () {
	// Parent method
	OO.ui.PopupToolGroup.parent.prototype.setDisabled.apply( this, arguments );

	if ( this.isDisabled() && this.isElementAttached() ) {
		this.setActive( false );
	}
};

/**
 * Handle focus being lost.
 *
 * The event is actually generated from a mouseup/keyup, so it is not a normal blur event object.
 *
 * @protected
 * @param {MouseEvent|KeyboardEvent} e Mouse up or key up event
 */
OO.ui.PopupToolGroup.prototype.onBlur = function ( e ) {
	var $target = $( e.target );
	// Only deactivate when clicking outside the dropdown element
	if ( $target.closest( '.oo-ui-popupToolGroup' )[ 0 ] === this.$element[ 0 ] ) {
		return;
	}
	if ( $target.closest( '.oo-ui-popupToolGroup-tools' )[ 0 ] === this.$group[ 0 ] ) {
		return;
	}
	this.setActive( false );
};

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.onMouseKeyUp = function ( e ) {
	// Only close toolgroup when a tool was actually selected
	if (
		!this.isDisabled() && this.pressed && this.pressed === this.findTargetTool( e ) &&
		( e.which === OO.ui.MouseButtons.LEFT || e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER )
	) {
		this.setActive( false );
	}
	return OO.ui.PopupToolGroup.parent.prototype.onMouseKeyUp.call( this, e );
};

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.onMouseKeyDown = function ( e ) {
	var $focused, $firstFocusable, $lastFocusable;
	// Shift-Tab on the first tool in the group jumps to the handle.
	// Tab on the last tool in the group jumps to the next group.
	if ( !this.isDisabled() && e.which === OO.ui.Keys.TAB ) {
		// (We can't use this.items because ListToolGroup inserts the extra fake expand/collapse tool.)
		$focused = $( document.activeElement );
		$firstFocusable = OO.ui.findFocusable( this.$group );
		if ( $focused[ 0 ] === $firstFocusable[ 0 ] && e.shiftKey ) {
			this.$handle.focus();
			return false;
		}
		$lastFocusable = OO.ui.findFocusable( this.$group, true );
		if ( $focused[ 0 ] === $lastFocusable[ 0 ] && !e.shiftKey ) {
			// Focus this group's handle and let the browser's tab handling happen (no 'return false').
			// This way we don't have to fiddle with other ToolGroups' business, or worry what to do
			// if the next group is not a PopupToolGroup or doesn't exist at all.
			this.$handle.focus();
			// Close the popup so that we don't move back inside it (if this is the last group).
			this.setActive( false );
		}
	}
	return OO.ui.PopupToolGroup.parent.prototype.onMouseKeyDown.call( this, e );
};

/**
 * Handle mouse up and key up events.
 *
 * @protected
 * @param {jQuery.Event} e Mouse up or key up event
 */
OO.ui.PopupToolGroup.prototype.onHandleMouseKeyUp = function ( e ) {
	if (
		!this.isDisabled() &&
		( e.which === OO.ui.MouseButtons.LEFT || e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER )
	) {
		return false;
	}
};

/**
 * Handle mouse down and key down events.
 *
 * @protected
 * @param {jQuery.Event} e Mouse down or key down event
 */
OO.ui.PopupToolGroup.prototype.onHandleMouseKeyDown = function ( e ) {
	var $focusable;
	if ( !this.isDisabled() ) {
		// Tab on the handle jumps to the first tool in the group (if the popup is open).
		if ( e.which === OO.ui.Keys.TAB && !e.shiftKey ) {
			$focusable = OO.ui.findFocusable( this.$group );
			if ( $focusable.length ) {
				$focusable.focus();
				return false;
			}
		}
		if ( e.which === OO.ui.MouseButtons.LEFT || e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER ) {
			this.setActive( !this.active );
			return false;
		}
	}
};

/**
 * Check if the tool group is active.
 *
 * @return {boolean} Tool group is active
 */
OO.ui.PopupToolGroup.prototype.isActive = function () {
	return this.active;
};

/**
 * Switch into 'active' mode.
 *
 * When active, the popup is visible. A mouseup event anywhere in the document will trigger
 * deactivation.
 *
 * @param {boolean} value The active state to set
 * @fires active
 */
OO.ui.PopupToolGroup.prototype.setActive = function ( value ) {
	var containerWidth, containerLeft;
	value = !!value;
	if ( this.active !== value ) {
		this.active = value;
		if ( value ) {
			this.getElementDocument().addEventListener( 'mouseup', this.onBlurHandler, true );
			this.getElementDocument().addEventListener( 'keyup', this.onBlurHandler, true );

			this.$clippable.css( 'left', '' );
			this.$element.addClass( 'oo-ui-popupToolGroup-active' );
			this.$group.addClass( 'oo-ui-popupToolGroup-active-tools' );
			this.togglePositioning( true );
			this.toggleClipping( true );

			// Try anchoring the popup to the left first
			this.setHorizontalPosition( 'start' );

			if ( this.isClippedHorizontally() || this.isFloatableOutOfView() ) {
				// Anchoring to the left caused the popup to clip, so anchor it to the right instead
				this.setHorizontalPosition( 'end' );
			}
			if ( this.isClippedHorizontally() || this.isFloatableOutOfView() ) {
				// Anchoring to the right also caused the popup to clip, so just make it fill the container
				containerWidth = this.$clippableScrollableContainer.width();
				containerLeft = this.$clippableScrollableContainer[ 0 ] === document.documentElement ?
					0 :
					this.$clippableScrollableContainer.offset().left;

				this.toggleClipping( false );
				this.setHorizontalPosition( 'start' );

				this.$clippable.css( {
					'margin-left': -( this.$element.offset().left - containerLeft ),
					width: containerWidth
				} );
			}
		} else {
			this.getElementDocument().removeEventListener( 'mouseup', this.onBlurHandler, true );
			this.getElementDocument().removeEventListener( 'keyup', this.onBlurHandler, true );
			this.$element.removeClass( 'oo-ui-popupToolGroup-active' );
			this.$group.removeClass( 'oo-ui-popupToolGroup-active-tools' );
			this.togglePositioning( false );
			this.toggleClipping( false );
		}
		this.emit( 'active', this.active );
		this.updateThemeClasses();
	}
};
