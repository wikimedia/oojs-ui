/**
 * SelectFileWidgets allow for selecting files, using the HTML5 File API. These
 * widgets can be configured with {@link OO.ui.IconElement icons} and {@link
 * OO.ui.IndicatorElement indicators}.
 * Please see the [OOjs UI documentation on MediaWiki] [1] for more information and examples.
 *
 *     @example
 *     // Example of a file select widget
 *     var selectFile = new OO.ui.SelectFileWidget();
 *     $( 'body' ).append( selectFile.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOjs_UI/Widgets
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.IconElement
 * @mixins OO.ui.IndicatorElement
 * @mixins OO.ui.PendingElement
 * @mixins OO.ui.LabelElement
 * @mixins OO.ui.TabIndexedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string[]|null} [accept=null] MIME types to accept. null accepts all types.
 * @cfg {string} [placeholder] Text to display when no file is selected.
 * @cfg {string} [notsupported] Text to display when file support is missing in the browser.
 * @cfg {boolean} [droppable=true] Whether to accept files by drag and drop.
 */
OO.ui.SelectFileWidget = function OoUiSelectFileWidget( config ) {
	var dragHandler;

	// Configuration initialization
	config = $.extend( {
		accept: null,
		placeholder: OO.ui.msg( 'ooui-selectfile-placeholder' ),
		notsupported: OO.ui.msg( 'ooui-selectfile-not-supported' ),
		droppable: true
	}, config );

	// Parent constructor
	OO.ui.SelectFileWidget.super.call( this, config );

	// Properties (must be set before TabIndexedElement constructor call)
	this.$handle = $( '<span>' );

	// Mixin constructors
	OO.ui.IconElement.call( this, config );
	OO.ui.IndicatorElement.call( this, config );
	OO.ui.PendingElement.call( this, config );
	OO.ui.LabelElement.call( this, $.extend( config, { autoFitLabel: true } ) );
	OO.ui.TabIndexedElement.call( this, $.extend( {}, config, { $tabIndexed: this.$handle } ) );

	// Properties
	this.isSupported = this.constructor.static.isSupported();
	this.currentFile = null;
	if ( Array.isArray( config.accept ) ) {
		this.accept = config.accept;
	} else {
		this.accept = null;
	}
	this.placeholder = config.placeholder;
	this.notsupported = config.notsupported;
	this.onFileSelectedHandler = this.onFileSelected.bind( this );

	this.clearButton = new OO.ui.ButtonWidget( {
		classes: [ 'oo-ui-selectFileWidget-clearButton' ],
		framed: false,
		icon: 'remove',
		disabled: this.disabled
	} );

	// Events
	this.$handle.on( {
		keypress: this.onKeyPress.bind( this )
	} );
	this.clearButton.connect( this, {
		click: 'onClearClick'
	} );
	if ( config.droppable ) {
		dragHandler = this.onDragEnterOrOver.bind( this );
		this.$handle.on( {
			dragenter: dragHandler,
			dragover: dragHandler,
			dragleave: this.onDragLeave.bind( this ),
			drop: this.onDrop.bind( this )
		} );
	}

	// Initialization
	this.addInput();
	this.updateUI();
	this.$label.addClass( 'oo-ui-selectFileWidget-label' );
	this.$handle
		.addClass( 'oo-ui-selectFileWidget-handle' )
		.append( this.$icon, this.$label, this.clearButton.$element, this.$indicator );
	this.$element
		.addClass( 'oo-ui-selectFileWidget' )
		.append( this.$handle );
	if ( config.droppable ) {
		this.$element.addClass( 'oo-ui-selectFileWidget-droppable' );
	}
};

/* Setup */

OO.inheritClass( OO.ui.SelectFileWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.SelectFileWidget, OO.ui.IconElement );
OO.mixinClass( OO.ui.SelectFileWidget, OO.ui.IndicatorElement );
OO.mixinClass( OO.ui.SelectFileWidget, OO.ui.PendingElement );
OO.mixinClass( OO.ui.SelectFileWidget, OO.ui.LabelElement );
OO.mixinClass( OO.ui.SelectFileWidget, OO.ui.TabIndexedElement );

/* Static properties */

/**
 * Check if this widget is supported
 *
 * @static
 * @return {boolean}
 */
OO.ui.SelectFileWidget.static.isSupported = function () {
	var $input;
	if ( OO.ui.SelectFileWidget.static.isSupportedCache === null ) {
		$input = $( '<input type="file">' );
		OO.ui.SelectFileWidget.static.isSupportedCache = $input[0].files !== undefined;
	}
	return OO.ui.SelectFileWidget.static.isSupportedCache;
};

OO.ui.SelectFileWidget.static.isSupportedCache = null;

/* Events */

/**
 * @event change
 *
 * A change event is emitted when the on/off state of the toggle changes.
 *
 * @param {File|null} value New value
 */

/* Methods */

/**
 * Get the current value of the field
 *
 * @return {File|null}
 */
OO.ui.SelectFileWidget.prototype.getValue = function () {
	return this.currentFile;
};

/**
 * Set the current value of the field
 *
 * @param {File|null} file File to select
 */
OO.ui.SelectFileWidget.prototype.setValue = function ( file ) {
	if ( this.currentFile !== file ) {
		this.currentFile = file;
		this.updateUI();
		this.emit( 'change', this.currentFile );
	}
};

/**
 * Update the user interface when a file is selected or unselected
 *
 * @protected
 */
OO.ui.SelectFileWidget.prototype.updateUI = function () {
	if ( !this.isSupported ) {
		this.$element.addClass( 'oo-ui-selectFileWidget-notsupported' );
		this.$element.removeClass( 'oo-ui-selectFileWidget-empty' );
		this.setLabel( this.notsupported );
	} else if ( this.currentFile ) {
		this.$element.removeClass( 'oo-ui-selectFileWidget-empty' );
		this.setLabel( this.currentFile.name +
			( this.currentFile.type !== '' ? OO.ui.msg( 'ooui-semicolon-separator' ) + this.currentFile.type : '' )
		);
	} else {
		this.$element.addClass( 'oo-ui-selectFileWidget-empty' );
		this.setLabel( this.placeholder );
	}

	if ( this.$input ) {
		this.$input.attr( 'title', this.getLabel() );
	}
};

/**
 * Add the input to the handle
 *
 * @private
 */
OO.ui.SelectFileWidget.prototype.addInput = function () {
	if ( this.$input ) {
		this.$input.remove();
	}

	if ( !this.isSupported ) {
		this.$input = null;
		return;
	}

	this.$input = $( '<input type="file">' );
	this.$input.on( 'change', this.onFileSelectedHandler );
	this.$input.attr( {
		tabindex: -1,
		title: this.getLabel()
	} );
	if ( this.accept ) {
		this.$input.attr( 'accept', this.accept.join( ', ' ) );
	}
	this.$handle.append( this.$input );
};

/**
 * Determine if we should accept this file
 *
 * @private
 * @param {File} file
 * @return {boolean}
 */
OO.ui.SelectFileWidget.prototype.isFileAcceptable = function ( file ) {
	var i, mime, mimeTest;

	if ( !this.accept || file.type === '' ) {
		return true;
	}

	mime = file.type;
	for ( i = 0; i < this.accept.length; i++ ) {
		mimeTest = this.accept[i];
		if ( mimeTest === mime ) {
			return true;
		} else if ( mimeTest.substr( -2 ) === '/*' ) {
			mimeTest = mimeTest.substr( 0, mimeTest.length - 1 );
			if ( mime.substr( 0, mimeTest.length ) === mimeTest ) {
				return true;
			}
		}
	}

	return false;
};

/**
 * Handle file selection from the input
 *
 * @private
 * @param {jQuery.Event} e
 */
OO.ui.SelectFileWidget.prototype.onFileSelected = function ( e ) {
	var file = null;

	if ( e.target.files && e.target.files[0] ) {
		file = e.target.files[0];
		if ( !this.isFileAcceptable( file ) ) {
			file = null;
		}
	}

	this.setValue( file );
	this.addInput();
};

/**
 * Handle clear button click events.
 *
 * @private
 */
OO.ui.SelectFileWidget.prototype.onClearClick = function () {
	this.setValue( null );
	return false;
};

/**
 * Handle key press events.
 *
 * @private
 * @param {jQuery.Event} e Key press event
 */
OO.ui.SelectFileWidget.prototype.onKeyPress = function ( e ) {
	if ( this.isSupported && !this.isDisabled() && this.$input &&
		( e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER )
	) {
		this.$input.click();
		return false;
	}
};

/**
 * Handle drag enter and over events
 *
 * @private
 * @param {jQuery.Event} e Drag event
 */
OO.ui.SelectFileWidget.prototype.onDragEnterOrOver = function ( e ) {
	var file = null,
		dt = e.originalEvent.dataTransfer;

	e.preventDefault();
	e.stopPropagation();

	if ( this.isDisabled() || !this.isSupported ) {
		this.$element.removeClass( 'oo-ui-selectFileWidget-canDrop' );
		dt.dropEffect = 'none';
		return false;
	}

	if ( dt && dt.files && dt.files[0] ) {
		file = dt.files[0];
		if ( !this.isFileAcceptable( file ) ) {
			file = null;
		}
	} else if ( dt && dt.types && $.inArray( 'Files', dt.types ) ) {
		// We know we have files so set 'file' to something truthy, we just
		// can't know any details about them.
		// * https://bugzilla.mozilla.org/show_bug.cgi?id=640534
		file = 'Files exist, but details are unknown';
	}
	if ( file ) {
		this.$element.addClass( 'oo-ui-selectFileWidget-canDrop' );
	} else {
		this.$element.removeClass( 'oo-ui-selectFileWidget-canDrop' );
		dt.dropEffect = 'none';
	}

	return false;
};

/**
 * Handle drag leave events
 *
 * @private
 * @param {jQuery.Event} e Drag event
 */
OO.ui.SelectFileWidget.prototype.onDragLeave = function () {
	this.$element.removeClass( 'oo-ui-selectFileWidget-canDrop' );
};

/**
 * Handle drop events
 *
 * @private
 * @param {jQuery.Event} e Drop event
 */
OO.ui.SelectFileWidget.prototype.onDrop = function ( e ) {
	var file = null,
		dt = e.originalEvent.dataTransfer;

	e.preventDefault();
	e.stopPropagation();
	this.$element.removeClass( 'oo-ui-selectFileWidget-canDrop' );

	if ( this.isDisabled() || !this.isSupported ) {
		return false;
	}

	if ( dt && dt.files && dt.files[0] ) {
		file = dt.files[0];
		if ( !this.isFileAcceptable( file ) ) {
			file = null;
		}
	}
	if ( file ) {
		this.setValue( file );
	}

	return false;
};

/**
 * @inheritdoc
 */
OO.ui.SelectFileWidget.prototype.setDisabled = function ( state ) {
	OO.ui.SelectFileWidget.super.prototype.setDisabled.call( this, state );
	if ( this.clearButton ) {
		this.clearButton.setDisabled( state );
	}
	return this;
};
