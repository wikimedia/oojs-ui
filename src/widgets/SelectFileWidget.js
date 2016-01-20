/**
 * SelectFileWidgets allow for selecting files, using the HTML5 File API. These
 * widgets can be configured with {@link OO.ui.mixin.IconElement icons} and {@link
 * OO.ui.mixin.IndicatorElement indicators}.
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
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.PendingElement
 * @mixins OO.ui.mixin.LabelElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string[]|null} [accept=null] MIME types to accept. null accepts all types.
 * @cfg {string} [placeholder] Text to display when no file is selected.
 * @cfg {string} [notsupported] Text to display when file support is missing in the browser.
 * @cfg {boolean} [droppable=true] Whether to accept files by drag and drop.
 * @cfg {boolean} [showDropTarget=false] Whether to show a drop target. Requires droppable to be true.
 * @cfg {boolean} [dragDropUI=false] Deprecated alias for showDropTarget
 * @cfg {Number} [thumbnailSizeLimit=20] File size limit in MiB above which to not try and show a
 *  preview (for performance)
 */
OO.ui.SelectFileWidget = function OoUiSelectFileWidget( config ) {
	var dragHandler;

	// TODO: Remove in next release
	if ( config && config.dragDropUI ) {
		config.showDropTarget = true;
	}

	// Configuration initialization
	config = $.extend( {
		accept: null,
		placeholder: OO.ui.msg( 'ooui-selectfile-placeholder' ),
		notsupported: OO.ui.msg( 'ooui-selectfile-not-supported' ),
		droppable: true,
		showDropTarget: false,
		thumbnailSizeLimit: 20
	}, config );

	// Parent constructor
	OO.ui.SelectFileWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.PendingElement.call( this, $.extend( {}, config, { $pending: this.$info } ) );
	OO.ui.mixin.LabelElement.call( this, $.extend( {}, config, { autoFitLabel: true } ) );

	// Properties
	this.$info = $( '<span>' );
	this.showDropTarget = config.showDropTarget;
	this.thumbnailSizeLimit = config.thumbnailSizeLimit;
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

	this.selectButton = new OO.ui.ButtonWidget( {
		classes: [ 'oo-ui-selectFileWidget-selectButton' ],
		label: OO.ui.msg( 'ooui-selectfile-button-select' ),
		disabled: this.disabled || !this.isSupported
	} );

	this.clearButton = new OO.ui.ButtonWidget( {
		classes: [ 'oo-ui-selectFileWidget-clearButton' ],
		framed: false,
		icon: 'close',
		disabled: this.disabled
	} );

	// Events
	this.selectButton.$button.on( {
		keypress: this.onKeyPress.bind( this )
	} );
	this.clearButton.connect( this, {
		click: 'onClearClick'
	} );
	if ( config.droppable ) {
		dragHandler = this.onDragEnterOrOver.bind( this );
		this.$element.on( {
			dragenter: dragHandler,
			dragover: dragHandler,
			dragleave: this.onDragLeave.bind( this ),
			drop: this.onDrop.bind( this )
		} );
	}

	// Initialization
	this.addInput();
	this.$label.addClass( 'oo-ui-selectFileWidget-label' );
	this.$info
		.addClass( 'oo-ui-selectFileWidget-info' )
		.append( this.$icon, this.$label, this.clearButton.$element, this.$indicator );

	if ( config.droppable && config.showDropTarget ) {
		this.selectButton.setIcon( 'upload' );
		this.$thumbnail = $( '<div>' ).addClass( 'oo-ui-selectFileWidget-thumbnail' );
		this.setPendingElement( this.$thumbnail );
		this.$dropTarget = $( '<div>' )
			.addClass( 'oo-ui-selectFileWidget-dropTarget' )
			.on( {
				click: this.onDropTargetClick.bind( this )
			} )
			.append(
				this.$thumbnail,
				this.$info,
				this.selectButton.$element,
				$( '<span>' )
					.addClass( 'oo-ui-selectFileWidget-dropLabel' )
					.text( OO.ui.msg( 'ooui-selectfile-dragdrop-placeholder' ) )
			);
		this.$element.append( this.$dropTarget );
	} else {
		this.$element
			.addClass( 'oo-ui-selectFileWidget' )
			.append( this.$info, this.selectButton.$element );
	}
	this.updateUI();
};

/* Setup */

OO.inheritClass( OO.ui.SelectFileWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.SelectFileWidget, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.SelectFileWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.SelectFileWidget, OO.ui.mixin.PendingElement );
OO.mixinClass( OO.ui.SelectFileWidget, OO.ui.mixin.LabelElement );

/* Static Properties */

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
		OO.ui.SelectFileWidget.static.isSupportedCache = $input[ 0 ].files !== undefined;
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
 * Focus the widget.
 *
 * Focusses the select file button.
 *
 * @chainable
 */
OO.ui.SelectFileWidget.prototype.focus = function () {
	this.selectButton.$button[ 0 ].focus();
	return this;
};

/**
 * Update the user interface when a file is selected or unselected
 *
 * @protected
 */
OO.ui.SelectFileWidget.prototype.updateUI = function () {
	var $label;
	if ( !this.isSupported ) {
		this.$element.addClass( 'oo-ui-selectFileWidget-notsupported' );
		this.$element.removeClass( 'oo-ui-selectFileWidget-empty' );
		this.setLabel( this.notsupported );
	} else {
		this.$element.addClass( 'oo-ui-selectFileWidget-supported' );
		if ( this.currentFile ) {
			this.$element.removeClass( 'oo-ui-selectFileWidget-empty' );
			$label = $( [] );
			$label = $label.add(
				$( '<span>' )
					.addClass( 'oo-ui-selectFileWidget-fileName' )
					.text( this.currentFile.name )
			);
			if ( this.currentFile.type !== '' ) {
				$label = $label.add(
					$( '<span>' )
						.addClass( 'oo-ui-selectFileWidget-fileType' )
						.text( this.currentFile.type )
				);
			}
			this.setLabel( $label );

			if ( this.showDropTarget ) {
				this.pushPending();
				this.loadAndGetImageUrl().done( function ( url ) {
					this.$thumbnail.css( 'background-image', 'url( ' + url + ' )' );
				}.bind( this ) ).fail( function () {
					this.$thumbnail.append(
						new OO.ui.IconWidget( {
							icon: 'attachment',
							classes: [ 'oo-ui-selectFileWidget-noThumbnail-icon' ]
						} ).$element
					);
				}.bind( this ) ).always( function () {
					this.popPending();
				}.bind( this ) );
				this.$dropTarget.off( 'click' );
			}
		} else {
			if ( this.showDropTarget ) {
				this.$dropTarget.off( 'click' );
				this.$dropTarget.on( {
					click: this.onDropTargetClick.bind( this )
				} );
				this.$thumbnail
					.empty()
					.css( 'background-image', '' );
			}
			this.$element.addClass( 'oo-ui-selectFileWidget-empty' );
			this.setLabel( this.placeholder );
		}
	}
};

/**
 * Get the URL of the image if the selected file is one
 *
 * @return {jQuery.Promise} Promise resolves with the image URL
 */
OO.ui.SelectFileWidget.prototype.loadAndGetImageUrl = function () {
	var deferred = $.Deferred(),
		file = this.currentFile,
		reader = new FileReader();

	if (
		file &&
		( OO.getProp( file, 'type' ) || '' ).indexOf( 'image/' ) === 0 &&
		file.size < this.thumbnailSizeLimit * 1024 * 1024
	) {
		reader.onload = function ( event ) {
			var img = document.createElement( 'img' );
			img.addEventListener( 'load', function () {
				if (
					img.naturalWidth === 0 ||
					img.naturalHeight === 0 ||
					img.complete === false
				) {
					deferred.reject();
				} else {
					deferred.resolve( event.target.result );
				}
			} );
			img.src = event.target.result;
		};
		reader.readAsDataURL( file );
	} else {
		deferred.reject();
	}

	return deferred.promise();
};

/**
 * Add the input to the widget
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
	this.$input.on( 'click', function ( e ) {
		// Prevents dropTarget to get clicked which calls
		// a click on this input
		e.stopPropagation();
	} );
	this.$input.attr( {
		tabindex: -1
	} );
	if ( this.accept ) {
		this.$input.attr( 'accept', this.accept.join( ', ' ) );
	}
	this.selectButton.$button.append( this.$input );
};

/**
 * Determine if we should accept this file
 *
 * @private
 * @param {string} File MIME type
 * @return {boolean}
 */
OO.ui.SelectFileWidget.prototype.isAllowedType = function ( mimeType ) {
	var i, mimeTest;

	if ( !this.accept || !mimeType ) {
		return true;
	}

	for ( i = 0; i < this.accept.length; i++ ) {
		mimeTest = this.accept[ i ];
		if ( mimeTest === mimeType ) {
			return true;
		} else if ( mimeTest.substr( -2 ) === '/*' ) {
			mimeTest = mimeTest.substr( 0, mimeTest.length - 1 );
			if ( mimeType.substr( 0, mimeTest.length ) === mimeTest ) {
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
	var file = OO.getProp( e.target, 'files', 0 ) || null;

	if ( file && !this.isAllowedType( file.type ) ) {
		file = null;
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
 * Handle drop target click events.
 *
 * @private
 * @param {jQuery.Event} e Key press event
 */
OO.ui.SelectFileWidget.prototype.onDropTargetClick = function () {
	if ( this.isSupported && !this.isDisabled() && this.$input ) {
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
	var itemOrFile,
		droppableFile = false,
		dt = e.originalEvent.dataTransfer;

	e.preventDefault();
	e.stopPropagation();

	if ( this.isDisabled() || !this.isSupported ) {
		this.$element.removeClass( 'oo-ui-selectFileWidget-canDrop' );
		dt.dropEffect = 'none';
		return false;
	}

	// DataTransferItem and File both have a type property, but in Chrome files
	// have no information at this point.
	itemOrFile = OO.getProp( dt, 'items', 0 ) || OO.getProp( dt, 'files', 0 );
	if ( itemOrFile ) {
		if ( this.isAllowedType( itemOrFile.type ) ) {
			droppableFile = true;
		}
	// dt.types is Array-like, but not an Array
	} else if ( Array.prototype.indexOf.call( OO.getProp( dt, 'types' ) || [], 'Files' ) !== -1 ) {
		// File information is not available at this point for security so just assume
		// it is acceptable for now.
		// https://bugzilla.mozilla.org/show_bug.cgi?id=640534
		droppableFile = true;
	}

	this.$element.toggleClass( 'oo-ui-selectFileWidget-canDrop', droppableFile );
	if ( !droppableFile ) {
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

	file = OO.getProp( dt, 'files', 0 );
	if ( file && !this.isAllowedType( file.type ) ) {
		file = null;
	}
	if ( file ) {
		this.setValue( file );
	}

	return false;
};

/**
 * @inheritdoc
 */
OO.ui.SelectFileWidget.prototype.setDisabled = function ( disabled ) {
	OO.ui.SelectFileWidget.parent.prototype.setDisabled.call( this, disabled );
	if ( this.selectButton ) {
		this.selectButton.setDisabled( disabled );
	}
	if ( this.clearButton ) {
		this.clearButton.setDisabled( disabled );
	}
	return this;
};
