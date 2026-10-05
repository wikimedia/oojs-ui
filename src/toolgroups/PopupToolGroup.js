/**
 * PopupToolGroup is an abstract base class used by both {@link OO.ui.MenuToolGroup MenuToolGroup}
 * and {@link OO.ui.ListToolGroup ListToolGroup} to provide a popup (an overlaid menu or list of
 * tools with an optional icon and label). This class can be used for other base classes that
 * also use this functionality.
 *
 * @abstract
 * @class
 * @extends OO.ui.ToolGroup
 * @mixes OO.ui.mixin.IconElement
 * @mixes OO.ui.mixin.IndicatorElement
 * @mixes OO.ui.mixin.LabelElement
 * @mixes OO.ui.mixin.TitledElement
 * @mixes OO.ui.mixin.FlaggedElement
 * @mixes OO.ui.mixin.ClippableElement
 * @mixes OO.ui.mixin.FloatableElement
 * @mixes OO.ui.mixin.TabIndexedElement
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 * @param {string} [config.header] Text to display at the top of the popup
 * @param {Object} [config.narrowConfig] See static.narrowConfig
 * @param {Array|string} [config.promoteToBar=[]] Tools to show outside of the popup (before the
 *  toolgroup) when there is room in the toolbar. Promoted tools are displayed as if they were in
 *  a {@link OO.ui.BarToolGroup bar} toolgroup. Tools are promoted in the order given, so the first
 *  tool is promoted first and demoted last. See OO.ui.ToolFactory#extract for the format, and
 *  OO.ui.Toolbar#getPromotedToolCount for how the available room is calculated.
 *
 *  Tools can be grouped in a nested array so that they are only promoted together, e.g.
 *  `[ [ 'bold', 'italic' ], 'underline' ]` promotes bold and italic when there is room for both,
 *  then underline. A nested array can use any of the formats supported by
 *  OO.ui.ToolFactory#extract, e.g. `[ [ { group: 'lists' } ] ]` promotes a whole group of tools
 *  together, whereas `[ { group: 'lists' } ]` promotes them one at a time.
 */
OO.ui.PopupToolGroup = function OoUiPopupToolGroup( toolbar, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( toolbar ) && config === undefined ) {
		config = toolbar;
		toolbar = config.toolbar;
	}

	// Configuration initialization
	config = Object.assign( {
		indicator: config.indicator === undefined ?
			( toolbar.position === 'bottom' ? 'up' : 'down' ) : config.indicator
	}, config );

	// Properties (must be set before parent constructor, which calls #populate)
	this.promoteToBar = config.promoteToBar || [];
	this.promotedTools = [];
	this.$promotedTools = $( '<div>' );
	this.$promoted = $( '<div>' );

	// Parent constructor
	OO.ui.PopupToolGroup.super.call( this, toolbar, config );

	// Properties
	this.active = false;
	this.dragging = false;
	// Don't conflict with parent method of the same name
	this.onPopupDocumentMouseKeyUpHandler = this.onPopupDocumentMouseKeyUp.bind( this );
	this.$handle = $( '<span>' );
	this.narrowConfig = config.narrowConfig || this.constructor.static.narrowConfig;

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.TitledElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );
	OO.ui.mixin.ClippableElement.call( this, Object.assign( {
		$clippable: this.$group
	}, config ) );
	OO.ui.mixin.FloatableElement.call( this, Object.assign( {
		$floatable: this.$group,
		$floatableContainer: this.$handle,
		hideWhenOutOfView: false,
		verticalPosition: this.toolbar.position === 'bottom' ? 'above' : 'below'
		// horizontalPosition is set in setActive
	}, config ) );
	OO.ui.mixin.TabIndexedElement.call( this, Object.assign( {
		$tabIndexed: this.$handle
	}, config ) );

	// Events
	this.$handle.on( {
		keydown: this.onHandleMouseKeyDown.bind( this ),
		keyup: this.onHandleMouseKeyUp.bind( this ),
		mousedown: this.onHandleMouseKeyDown.bind( this ),
		mouseup: this.onHandleMouseKeyUp.bind( this )
	} );
	this.$promotedTools.on( {
		mousedown: this.onMouseKeyDown.bind( this ),
		mouseup: this.onMouseKeyUp.bind( this ),
		keydown: this.onMouseKeyDown.bind( this ),
		keyup: this.onMouseKeyUp.bind( this ),
		mouseover: this.onMouseOverFocus.bind( this ),
		mouseout: this.onMouseOutBlur.bind( this )
	} );
	this.toolbar.connect( this, {
		resize: 'onToolbarResize'
	} );

	// Initialization
	this.$handle
		.addClass( 'oo-ui-toolGroup-handle oo-ui-popupToolGroup-handle' )
		.attr( { role: 'button', 'aria-expanded': 'false' } )
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
	// Promoted tools are shown in a separate element, before this one, which is
	// styled like a BarToolGroup. It is attached when tools are first promoted.
	this.$promotedTools.addClass( 'oo-ui-toolGroup-tools oo-ui-barToolGroup-tools' );
	this.$promoted
		.addClass( [
			'oo-ui-widget', 'oo-ui-toolGroup', 'oo-ui-barToolGroup',
			'oo-ui-popupToolGroup-promoted', 'oo-ui-element-hidden'
		] )
		.append( this.$promotedTools );
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

/* Static properties */

/**
 * Config options to change when toolbar is in narrow mode
 *
 * Supports `invisibleLabel`, label` and `icon` properties.
 *
 * @static
 * @property {Object|null}
 */
OO.ui.PopupToolGroup.static.narrowConfig = null;

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.setDisabled = function () {
	// Parent method
	OO.ui.PopupToolGroup.super.prototype.setDisabled.apply( this, arguments );

	if ( this.isDisabled() && this.isElementAttached() ) {
		this.setActive( false );
	}
};

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.onDisable = function ( isDisabled ) {
	// Parent method
	OO.ui.PopupToolGroup.super.prototype.onDisable.apply( this, arguments );

	this.$promoted
		.toggleClass( 'oo-ui-widget-disabled', isDisabled )
		.toggleClass( 'oo-ui-widget-enabled', !isDisabled );
	this.$promotedTools
		.toggleClass( 'oo-ui-toolGroup-disabled-tools', isDisabled )
		.toggleClass( 'oo-ui-toolGroup-enabled-tools', !isDisabled );
};

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.populate = function () {
	const promotedTools = this.promotedTools;

	// Move promoted tools back into the popup, as the parent method positions
	// tools relative to each other
	this.setPromotedTools( [] );

	// Parent method
	OO.ui.PopupToolGroup.super.prototype.populate.apply( this, arguments );

	// Re-promote tools that are still in the group
	this.setPromotedTools( promotedTools.filter(
		( tool ) => this.tools[ tool.getName() ] === tool
	) );
};

/**
 * Get the sets of tools that can be promoted out of the popup, in priority order.
 *
 * The tools in each set are only promoted together. See the `promoteToBar` config option.
 *
 * @return {OO.ui.Tool[][]} Sets of promotable tools
 */
OO.ui.PopupToolGroup.prototype.getPromotableToolSets = function () {
	const toolFactory = this.toolbar.getToolFactory(),
		collection = Array.isArray( this.promoteToBar ) ? this.promoteToBar : [ this.promoteToBar ],
		// Each tool can only be in one set
		used = {},
		sets = [];

	collection.forEach( ( item ) => {
		const tools = toolFactory.extract( item, used )
			.map( ( name ) => this.tools[ name ] )
			.filter( Boolean );
		if ( Array.isArray( item ) ) {
			if ( tools.length ) {
				sets.push( tools );
			}
		} else {
			// A single item can still select multiple tools (e.g. a group),
			// but they are promoted one at a time
			tools.forEach( ( tool ) => sets.push( [ tool ] ) );
		}
	} );
	return sets;
};

/**
 * Get the tools that can be promoted out of the popup, in priority order.
 *
 * See the `promoteToBar` config option.
 *
 * @return {OO.ui.Tool[]} Promotable tools
 */
OO.ui.PopupToolGroup.prototype.getPromotableTools = function () {
	return [].concat( ...this.getPromotableToolSets() );
};

/**
 * Get the tools which are currently promoted out of the popup.
 *
 * @return {OO.ui.Tool[]} Promoted tools, in display order
 */
OO.ui.PopupToolGroup.prototype.getPromotedTools = function () {
	return this.promotedTools;
};

/**
 * Set which tools are promoted out of the popup.
 *
 * Promoted tools are shown before the toolgroup, like tools in a {@link OO.ui.BarToolGroup bar}.
 * They keep the order they have in the popup. If all tools are promoted, the toolgroup is hidden.
 *
 * This is usually called by the toolbar, see OO.ui.Toolbar#updatePromotedTools.
 *
 * @param {OO.ui.Tool[]} tools Tools to promote, which must be in this group
 */
OO.ui.PopupToolGroup.prototype.setPromotedTools = function ( tools ) {
	const promotedTools = this.items.filter( ( tool ) => tools.includes( tool ) );

	if (
		promotedTools.length === this.promotedTools.length &&
		promotedTools.every( ( tool, i ) => tool === this.promotedTools[ i ] )
	) {
		return;
	}
	this.promotedTools = promotedTools;

	// Rebuild both lists in item order. The popup may contain a header before the
	// tools, and other elements after them (e.g. ListToolGroup's expand/collapse tool).
	let $prevInPopup = this.$group.children( '.oo-ui-popupToolGroup-header' );
	this.items.forEach( ( tool ) => {
		const promoted = promotedTools.includes( tool );
		if ( promoted ) {
			this.$promotedTools.append( tool.$element );
		} else {
			if ( $prevInPopup.length ) {
				$prevInPopup.after( tool.$element );
			} else {
				this.$group.prepend( tool.$element );
			}
			$prevInPopup = tool.$element;
		}
		tool.setPromoted( promoted );
	} );

	if ( promotedTools.length && this.$promoted[ 0 ].nextSibling !== this.$element[ 0 ] ) {
		this.$element.before( this.$promoted );
	}
	this.$promoted.toggleClass( 'oo-ui-element-hidden', !promotedTools.length );

	const allPromoted = !!this.items.length && promotedTools.length === this.items.length;
	this.$element
		.toggleClass( 'oo-ui-popupToolGroup-hasPromotedTools', !!promotedTools.length )
		.toggleClass( 'oo-ui-popupToolGroup-allToolsPromoted', allPromoted );
	if ( allPromoted && this.isActive() ) {
		this.setActive( false );
	}
};

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.destroy = function () {
	// Parent method
	OO.ui.PopupToolGroup.super.prototype.destroy.apply( this, arguments );

	this.$promoted.remove();
};

/**
 * Handle resize events from the toolbar
 */
OO.ui.PopupToolGroup.prototype.onToolbarResize = function () {
	if ( !this.narrowConfig ) {
		return;
	}
	if ( this.toolbar.isNarrow() ) {
		if ( this.narrowConfig.invisibleLabel !== undefined ) {
			this.wideInvisibleLabel = this.invisibleLabel;
			this.setInvisibleLabel( this.narrowConfig.invisibleLabel );
		}
		if ( this.narrowConfig.label !== undefined ) {
			this.wideLabel = this.label;
			this.setLabel( this.narrowConfig.label );
		}
		if ( this.narrowConfig.icon !== undefined ) {
			this.wideIcon = this.icon;
			this.setIcon( this.narrowConfig.icon );
		}
	} else {
		if ( this.wideInvisibleLabel !== undefined ) {
			this.setInvisibleLabel( this.wideInvisibleLabel );
		}
		if ( this.wideLabel !== undefined ) {
			this.setLabel( this.wideLabel );
		}
		if ( this.wideIcon !== undefined ) {
			this.setIcon( this.wideIcon );
		}
	}
};

/**
 * Handle document mouse up and key up events.
 *
 * @protected
 * @param {MouseEvent|KeyboardEvent} e Mouse up or key up event
 */
OO.ui.PopupToolGroup.prototype.onPopupDocumentMouseKeyUp = function ( e ) {
	if ( e.target === document.documentElement ) {
		// This means that the scrollbar was the target of the click
		return;
	}
	const $target = $( e.target );
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
		!this.isDisabled() && this.pressed && this.pressed === this.findTargetTool( e ) && (
			e.which === OO.ui.MouseButtons.LEFT ||
			e.which === OO.ui.Keys.SPACE ||
			e.which === OO.ui.Keys.ENTER
		)
	) {
		this.setActive( false );
	}
	return OO.ui.PopupToolGroup.super.prototype.onMouseKeyUp.call( this, e );
};

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.onMouseKeyDown = function ( e ) {
	// Shift-Tab on the first tool in the group jumps to the handle.
	// Tab on the last tool in the group jumps to the next group.
	if ( !this.isDisabled() && e.which === OO.ui.Keys.TAB ) {
		// We can't use this.items because ListToolGroup inserts the extra fake
		// expand/collapse tool.
		const $focused = $( document.activeElement );
		const $firstFocusable = OO.ui.findFocusable( this.$group );
		if ( $focused[ 0 ] === $firstFocusable[ 0 ] && e.shiftKey ) {
			this.$handle.trigger( 'focus' );
			return false;
		}
		const $lastFocusable = OO.ui.findFocusable( this.$group, true );
		if ( $focused[ 0 ] === $lastFocusable[ 0 ] && !e.shiftKey ) {
			// Focus this group's handle and let the browser's tab handling happen
			// (no 'return false').
			// This way we don't have to fiddle with other ToolGroups' business, or worry what to do
			// if the next group is not a PopupToolGroup or doesn't exist at all.
			this.$handle.trigger( 'focus' );
			// Close the popup so that we don't move back inside it (if this is the last group).
			this.setActive( false );
		}
	}
	return OO.ui.PopupToolGroup.super.prototype.onMouseKeyDown.call( this, e );
};

/**
 * Handle mouse up and key up events.
 *
 * @protected
 * @param {jQuery.Event} e Mouse up or key up event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.PopupToolGroup.prototype.onHandleMouseKeyUp = function ( e ) {
	if (
		!this.isDisabled() && (
			e.which === OO.ui.MouseButtons.LEFT ||
			e.which === OO.ui.Keys.SPACE ||
			e.which === OO.ui.Keys.ENTER
		)
	) {
		return false;
	}
};

/**
 * Handle mouse down and key down events.
 *
 * @protected
 * @param {jQuery.Event} e Mouse down or key down event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.PopupToolGroup.prototype.onHandleMouseKeyDown = function ( e ) {
	let $focusable;
	if ( !this.isDisabled() ) {
		// Tab on the handle jumps to the first tool in the group (if the popup is open).
		if ( e.which === OO.ui.Keys.TAB && !e.shiftKey ) {
			$focusable = OO.ui.findFocusable( this.$group );
			if ( $focusable.length ) {
				$focusable.trigger( 'focus' );
				return false;
			}
		}
		if (
			e.which === OO.ui.MouseButtons.LEFT ||
			e.which === OO.ui.Keys.SPACE ||
			e.which === OO.ui.Keys.ENTER
		) {
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
 * @param {boolean} [value=false] The active state to set
 * @fires OO.ui.PopupToolGroup#active
 */
OO.ui.PopupToolGroup.prototype.setActive = function ( value ) {
	let containerWidth, containerLeft;
	value = !!value;
	if ( this.active !== value ) {
		this.active = value;
		if ( value ) {
			this.getElementDocument().addEventListener(
				'mouseup',
				this.onPopupDocumentMouseKeyUpHandler,
				true
			);
			this.getElementDocument().addEventListener(
				'keyup',
				this.onPopupDocumentMouseKeyUpHandler,
				true
			);

			this.$clippable.css( { left: '', width: '', 'margin-left': '', 'min-width': '' } );
			this.$element.addClass( 'oo-ui-popupToolGroup-active' );
			this.$group.addClass( 'oo-ui-popupToolGroup-active-tools' );
			this.$handle.attr( 'aria-expanded', true );
			this.togglePositioning( true );
			this.toggleClipping( true );

			// Tools on the left of the toolbar will try to align their
			// popups with their left side if possible, and vice-versa.
			const preferredSide = this.align === 'before' ? 'start' : 'end';
			const otherSide = this.align === 'before' ? 'end' : 'start';

			// Try anchoring the popup to the preferred side first
			this.setHorizontalPosition( preferredSide );

			if ( this.isClippedHorizontally() || this.isFloatableOutOfView() ) {
				// Anchoring to the preferred side caused the popup to clip, so anchor it
				// to the other side instead.
				this.setHorizontalPosition( otherSide );
			}
			if ( this.isClippedHorizontally() || this.isFloatableOutOfView() ) {
				this.setHorizontalPosition( 'center' );
			}
			if ( this.isClippedHorizontally() || this.isFloatableOutOfView() ) {
				// Anchoring to the right also caused the popup to clip, so just make it fill the
				// container.
				const isDocument = this.$clippableScrollableContainer[ 0 ] ===
					document.documentElement;
				containerWidth = isDocument ?
					document.documentElement.clientWidth :
					this.$clippableScrollableContainer.width();
				containerLeft = isDocument ?
					0 :
					this.$clippableScrollableContainer.offset().left;

				this.toggleClipping( false );
				this.setHorizontalPosition( 'start' );

				this.$clippable.css( {
					'margin-left': -( this.$element.offset().left - containerLeft ),
					width: containerWidth,
					'min-width': containerWidth
				} );
			}
		} else {
			this.getElementDocument().removeEventListener(
				'mouseup',
				this.onPopupDocumentMouseKeyUpHandler,
				true
			);
			this.getElementDocument().removeEventListener(
				'keyup',
				this.onPopupDocumentMouseKeyUpHandler,
				true
			);
			this.$element.removeClass( 'oo-ui-popupToolGroup-active' );
			this.$group.removeClass( 'oo-ui-popupToolGroup-active-tools' );
			this.$handle.attr( 'aria-expanded', false );
			this.togglePositioning( false );
			this.toggleClipping( false );
		}
		this.emit( 'active', this.active );
		this.updateThemeClasses();
	}
};
