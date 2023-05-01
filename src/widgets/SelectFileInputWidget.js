/**
 * SelectFileInputWidgets allow for selecting files, using <input type="file">. These
 * widgets can be configured with {@link OO.ui.mixin.IconElement icons}, {@link
 * OO.ui.mixin.IndicatorElement indicators} and {@link OO.ui.mixin.TitledElement titles}.
 * Please see the [OOUI documentation on MediaWiki][1] for more information and examples.
 *
 * SelectFileInputWidgets must be used in HTML forms, as getValue only returns the filename.
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets
 *
 *     @example
 *     // A file select input widget.
 *     const selectFile = new OO.ui.SelectFileInputWidget();
 *     $( document.body ).append( selectFile.$element );
 *
 * @class
 * @extends OO.ui.InputWidget
 * @mixes OO.ui.mixin.RequiredElement
 * @mixes OO.ui.mixin.PendingElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {string[]|null} [config.accept=null] MIME types to accept. null accepts all types.
 * @param {boolean} [config.multiple=false] Allow multiple files to be selected.
 * @param {string} [config.placeholder] Text to display when no file is selected.
 * @param {Object} [config.button] Config to pass to select file button.
 * @param {Object|string|null} [config.icon=null] Icon to show next to file info
 * @param {boolean} [config.droppable=true] Whether to accept files by drag and drop.
 * @param {boolean} [config.buttonOnly=false] Show only the select file button, no info field.
 *  Requires showDropTarget to be false.
 * @param {boolean} [config.showDropTarget=false] Whether to show a drop target. Requires droppable
 *  to be true.
 * @param {number} [config.thumbnailSizeLimit=20] File size limit in MiB above which to not try and
 *  show a preview (for performance).
 */
OO.ui.SelectFileInputWidget = function OoUiSelectFileInputWidget( config ) {
	config = config || {};

	// Construct buttons before parent method is called (calling setDisabled)
	this.selectButton = new OO.ui.ButtonWidget( $.extend( {
		$element: $( '<label>' ),
		classes: [ 'oo-ui-selectFileInputWidget-selectButton' ],
		label: OO.ui.msg(
			config.multiple ?
				'ooui-selectfile-button-select-multiple' :
				'ooui-selectfile-button-select'
		)
	}, config.button ) );

	// Configuration initialization
	config = $.extend( {
		accept: null,
		placeholder: OO.ui.msg( 'ooui-selectfile-placeholder' ),
		$tabIndexed: this.selectButton.$tabIndexed,
		droppable: true,
		buttonOnly: false,
		showDropTarget: false,
		thumbnailSizeLimit: 20
	}, config );

	this.canSetFiles = true;
	// Support: Safari < 14
	try {
		// eslint-disable-next-line no-new
		new DataTransfer();
	} catch ( e ) {
		this.canSetFiles = false;
		config.droppable = false;
	}

	this.info = new OO.ui.SearchInputWidget( {
		classes: [ 'oo-ui-selectFileInputWidget-info' ],
		placeholder: config.placeholder,
		// Pass an empty collection so that .focus() always does nothing
		$tabIndexed: $( [] )
	} ).setIcon( config.icon );
	// Set tabindex manually on $input as $tabIndexed has been overridden.
	// Prevents field from becoming focused while tabbing.
	// We will also set the disabled attribute on $input, but that is done in #setDisabled.
	this.info.$input.attr( 'tabindex', -1 );
	// This indicator serves as the only way to clear the file, so it must be keyboard-accessible
	this.info.$indicator.attr( 'tabindex', 0 );

	// Parent constructor
	OO.ui.SelectFileInputWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.RequiredElement.call( this, $.extend( {}, {
		// TODO: Display the required indicator somewhere
		indicatorElement: null
	}, config ) );
	OO.ui.mixin.PendingElement.call( this );

	// Properties
	this.currentFiles = this.filterFiles( this.$input[ 0 ].files || [] );
	if ( Array.isArray( config.accept ) ) {
		this.accept = config.accept;
	} else {
		this.accept = null;
	}
	this.multiple = !!config.multiple;
	this.showDropTarget = config.droppable && config.showDropTarget;
	this.thumbnailSizeLimit = config.thumbnailSizeLimit;

	// Initialization
	this.fieldLayout = new OO.ui.ActionFieldLayout( this.info, this.selectButton, { align: 'top' } );

	this.$input
		.attr( {
			type: 'file',
			// this.selectButton is tabindexed
			tabindex: -1,
			// Infused input may have previously by
			// TabIndexed, so remove aria-disabled attr.
			'aria-disabled': null
		} );

	if ( this.accept ) {
		this.$input.attr( 'accept', this.accept.join( ', ' ) );
	}
	if ( this.multiple ) {
		this.$input.attr( 'multiple', '' );
	}
	this.selectButton.$button.append( this.$input );

	this.$element
		.addClass( 'oo-ui-selectFileInputWidget oo-ui-selectFileWidget' )
		.append( this.fieldLayout.$element );

	if ( this.showDropTarget ) {
		this.selectButton.setIcon( 'upload' );
		this.$element
			.addClass( 'oo-ui-selectFileInputWidget-dropTarget oo-ui-selectFileWidget-dropTarget' )
			.on( {
				click: this.onDropTargetClick.bind( this )
			} )
			.append(
				this.info.$element,
				this.selectButton.$element,
				$( '<span>' )
					.addClass( 'oo-ui-selectFileInputWidget-dropLabel oo-ui-selectFileWidget-dropLabel' )
					.text( OO.ui.msg(
						this.multiple ?
							'ooui-selectfile-dragdrop-placeholder-multiple' :
							'ooui-selectfile-dragdrop-placeholder'
					) )
			);
		if ( !this.multiple ) {
			this.$thumbnail = $( '<div>' ).addClass( 'oo-ui-selectFileInputWidget-thumbnail oo-ui-selectFileWidget-thumbnail' );
			this.setPendingElement( this.$thumbnail );
			this.$element
				.addClass( 'oo-ui-selectFileInputWidget-withThumbnail oo-ui-selectFileWidget-withThumbnail' )
				.prepend( this.$thumbnail );
		}
		this.fieldLayout.$element.remove();
	} else if ( config.buttonOnly ) {
		// Copy over any classes that may have been added already.
		// Ensure no events are bound to this.$element before here.
		this.selectButton.$element
			.addClass( this.$element.attr( 'class' ) )
			.addClass( 'oo-ui-selectFileInputWidget-buttonOnly oo-ui-selectFileWidget-buttonOnly' );
		// Set this.$element to just be the button
		this.$element = this.selectButton.$element;
	}

	// Events
	this.info.connect( this, { change: 'onInfoChange' } );
	this.selectButton.$button.on( {
		keypress: this.onKeyPress.bind( this )
	} );
	this.$input.on( {
		change: this.onFileSelected.bind( this ),
		click: function ( e ) {
			// Prevents dropTarget getting clicked which calls
			// a click on this input
			e.stopPropagation();
		}
	} );

	this.connect( this, { change: 'updateUI' } );
	if ( config.droppable ) {
		const dragHandler = this.onDragEnterOrOver.bind( this );
		this.$element.on( {
			dragenter: dragHandler,
			dragover: dragHandler,
			dragleave: this.onDragLeave.bind( this ),
			drop: this.onDrop.bind( this )
		} );
	}

	this.updateUI();
};

/* Setup */

OO.inheritClass( OO.ui.SelectFileInputWidget, OO.ui.InputWidget );
OO.mixinClass( OO.ui.SelectFileInputWidget, OO.ui.mixin.RequiredElement );
OO.mixinClass( OO.ui.SelectFileInputWidget, OO.ui.mixin.PendingElement );

/* Events */

/**
 * A change event is emitted when the currently selected files change
 *
 * @event OO.ui.SelectFileInputWidget#change
 * @param {File[]} currentFiles Current file list
 */

/* Static Properties */

// Set empty title so that browser default tooltips like "No file chosen" don't appear.
OO.ui.SelectFileInputWidget.static.title = '';

/* Methods */

/**
 * Get the current value of the field
 *
 * For single file widgets returns a File or null.
 * For multiple file widgets returns a list of Files.
 *
 * @return {File|File[]|null}
 */
OO.ui.SelectFileInputWidget.prototype.getValue = function () {
	return this.multiple ? this.currentFiles : this.currentFiles[ 0 ];
};

/**
 * Set the current file list
 *
 * Can only be set to a non-null/non-empty value if this.canSetFiles is true,
 * or if the widget has been set natively and we are just updating the internal
 * state.
 *
 * @param {File[]|null} files Files to select
 * @chainable
 * @return {OO.ui.SelectFileInputWidget} The widget, for chaining
 */
OO.ui.SelectFileInputWidget.prototype.setValue = function ( files ) {
	if ( files === undefined || typeof files === 'string' ) {
		// Called during init, don't replace value if just infusing.
		return this;
	}

	if ( files && !this.multiple ) {
		files = files.slice( 0, 1 );
	}

	function comparableFile( file ) {
		// Use extend to convert to plain objects so they can be compared.
		// File objects contains name, size, timestamp and mime type which
		// should be unique.
		return $.extend( {}, file );
	}

	if ( !OO.compare(
		files && files.map( comparableFile ),
		this.currentFiles && this.currentFiles.map( comparableFile )
	) ) {
		this.currentFiles = files || [];
		this.emit( 'change', this.currentFiles );
	}

	if ( this.canSetFiles ) {
		// Convert File[] array back to FileList for setting DOM value
		const dataTransfer = new DataTransfer();
		Array.prototype.forEach.call( this.currentFiles || [], function ( file ) {
			dataTransfer.items.add( file );
		} );
		this.$input[ 0 ].files = dataTransfer.files;
	} else {
		if ( !files || !files.length ) {
			// We're allowed to set the input value to empty string
			// to clear.
			OO.ui.SelectFileInputWidget.super.prototype.setValue.call( this, '' );
		}
		// Otherwise we assume the caller was just calling setValue with the
		// current state of .files in the DOM.
	}

	return this;
};

/**
 * Get the filename of the currently selected file.
 *
 * @return {string} Filename
 */
OO.ui.SelectFileInputWidget.prototype.getFilename = function () {
	return this.currentFiles.map( function ( file ) {
		return file.name;
	} ).join( ', ' );
};

/**
 * Handle file selection from the input.
 *
 * @protected
 * @param {jQuery.Event} e
 */
OO.ui.SelectFileInputWidget.prototype.onFileSelected = function ( e ) {
	const files = this.filterFiles( e.target.files || [] );
	this.setValue( files );
};

/**
 * Disable InputWidget#onEdit listener, onFileSelected is used instead.
 *
 * @inheritdoc
 */
OO.ui.SelectFileInputWidget.prototype.onEdit = function () {};

/**
 * Update the user interface when a file is selected or unselected.
 *
 * @protected
 */
OO.ui.SelectFileInputWidget.prototype.updateUI = function () {
	// Too early
	if ( !this.selectButton ) {
		return;
	}

	this.info.setValue( this.getFilename() );

	if ( this.currentFiles.length ) {
		this.$element.removeClass( 'oo-ui-selectFileInputWidget-empty' );

		if ( this.showDropTarget ) {
			if ( !this.multiple ) {
				this.pushPending();
				this.loadAndGetImageUrl( this.currentFiles[ 0 ] ).done( function ( url ) {
					this.$thumbnail.css( 'background-image', 'url( ' + url + ' )' );
				}.bind( this ) ).fail( function () {
					this.$thumbnail.append(
						new OO.ui.IconWidget( {
							icon: 'attachment',
							classes: [ 'oo-ui-selectFileInputWidget-noThumbnail-icon oo-ui-selectFileWidget-noThumbnail-icon' ]
						} ).$element
					);
				}.bind( this ) ).always( function () {
					this.popPending();
				}.bind( this ) );
			}
			this.$element.off( 'click' );
		}
	} else {
		if ( this.showDropTarget ) {
			this.$element.off( 'click' );
			this.$element.on( {
				click: this.onDropTargetClick.bind( this )
			} );
			if ( !this.multiple ) {
				this.$thumbnail
					.empty()
					.css( 'background-image', '' );
			}
		}
		this.$element.addClass( 'oo-ui-selectFileInputWidget-empty' );
	}
};

/**
 * If the selected file is an image, get its URL and load it.
 *
 * @param {File} file File
 * @return {jQuery.Promise} Promise resolves with the image URL after it has loaded
 */
OO.ui.SelectFileInputWidget.prototype.loadAndGetImageUrl = function ( file ) {
	const deferred = $.Deferred(),
		reader = new FileReader();

	if (
		( OO.getProp( file, 'type' ) || '' ).indexOf( 'image/' ) === 0 &&
		file.size < this.thumbnailSizeLimit * 1024 * 1024
	) {
		reader.onload = function ( event ) {
			const img = document.createElement( 'img' );
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
 * Determine if we should accept this file.
 *
 * @private
 * @param {FileList|File[]} files Files to filter
 * @return {File[]} Filter files
 */
OO.ui.SelectFileInputWidget.prototype.filterFiles = function ( files ) {
	const accept = this.accept;

	function mimeAllowed( file ) {
		const mimeType = file.type;

		if ( !accept || !mimeType ) {
			return true;
		}

		for ( let i = 0; i < accept.length; i++ ) {
			let mimeTest = accept[ i ];
			if ( mimeTest === mimeType ) {
				return true;
			} else if ( mimeTest.slice( -2 ) === '/*' ) {
				mimeTest = mimeTest.slice( 0, mimeTest.length - 1 );
				if ( mimeType.slice( 0, mimeTest.length ) === mimeTest ) {
					return true;
				}
			}
		}
		return false;
	}

	return Array.prototype.filter.call( files, mimeAllowed );
};

/**
 * Handle info input change events
 *
 * The info widget can only be changed by the user
 * with the clear button.
 *
 * @private
 * @param {string} value
 */
OO.ui.SelectFileInputWidget.prototype.onInfoChange = function ( value ) {
	if ( value === '' ) {
		this.setValue( null );
	}
};

/**
 * Handle key press events.
 *
 * @private
 * @param {jQuery.Event} e Key press event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.SelectFileInputWidget.prototype.onKeyPress = function ( e ) {
	if ( !this.isDisabled() && this.$input &&
		( e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER )
	) {
		// Emit a click to open the file selector.
		this.$input.trigger( 'click' );
		// Taking focus from the selectButton means keyUp isn't fired, so fire it manually.
		this.selectButton.onDocumentKeyUp( e );
		return false;
	}
};

/**
 * @inheritdoc
 */
OO.ui.SelectFileInputWidget.prototype.setDisabled = function ( disabled ) {
	// Parent method
	OO.ui.SelectFileInputWidget.super.prototype.setDisabled.call( this, disabled );

	this.selectButton.setDisabled( disabled );
	this.info.setDisabled( disabled );

	// Always make the input element disabled, so that it can't be found and focused,
	// e.g. by OO.ui.findFocusable.
	// The SearchInputWidget can otherwise be enabled normally.
	this.info.$input.attr( 'disabled', true );

	return this;
};

/**
 * Handle drop target click events.
 *
 * @private
 * @param {jQuery.Event} e Key press event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.SelectFileInputWidget.prototype.onDropTargetClick = function () {
	if ( !this.isDisabled() && this.$input ) {
		this.$input.trigger( 'click' );
		return false;
	}
};

/**
 * Handle drag enter and over events
 *
 * @private
 * @param {jQuery.Event} e Drag event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.SelectFileInputWidget.prototype.onDragEnterOrOver = function ( e ) {
	let hasDroppableFile = false;

	const dt = e.originalEvent.dataTransfer;

	e.preventDefault();
	e.stopPropagation();

	if ( this.isDisabled() ) {
		this.$element.removeClass( [
			'oo-ui-selectFileInputWidget-canDrop',
			'oo-ui-selectFileWidget-canDrop',
			'oo-ui-selectFileInputWidget-cantDrop'
		] );
		dt.dropEffect = 'none';
		return false;
	}

	// DataTransferItem and File both have a type property, but in Chrome files
	// have no information at this point.
	const itemsOrFiles = dt.items || dt.files;
	const hasFiles = !!( itemsOrFiles && itemsOrFiles.length );
	if ( hasFiles ) {
		if ( this.filterFiles( itemsOrFiles ).length ) {
			hasDroppableFile = true;
		}
	// dt.types is Array-like, but not an Array
	} else if ( Array.prototype.indexOf.call( OO.getProp( dt, 'types' ) || [], 'Files' ) !== -1 ) {
		// File information is not available at this point for security so just assume
		// it is acceptable for now.
		// https://bugzilla.mozilla.org/show_bug.cgi?id=640534
		hasDroppableFile = true;
	}

	this.$element.toggleClass( 'oo-ui-selectFileInputWidget-canDrop oo-ui-selectFileWidget-canDrop', hasDroppableFile );
	this.$element.toggleClass( 'oo-ui-selectFileInputWidget-cantDrop', !hasDroppableFile && hasFiles );
	if ( !hasDroppableFile ) {
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
OO.ui.SelectFileInputWidget.prototype.onDragLeave = function () {
	this.$element.removeClass( [
		'oo-ui-selectFileInputWidget-canDrop',
		'oo-ui-selectFileWidget-canDrop',
		'oo-ui-selectFileInputWidget-cantDrop'
	] );
};

/**
 * Handle drop events
 *
 * @private
 * @param {jQuery.Event} e Drop event
 * @return {undefined|boolean} False to prevent default if event is handled
 */
OO.ui.SelectFileInputWidget.prototype.onDrop = function ( e ) {
	const dt = e.originalEvent.dataTransfer;

	e.preventDefault();
	e.stopPropagation();
	this.$element.removeClass( [
		'oo-ui-selectFileInputWidget-canDrop',
		'oo-ui-selectFileWidget-canDrop',
		'oo-ui-selectFileInputWidget-cantDrop'
	] );

	if ( this.isDisabled() ) {
		return false;
	}

	const files = this.filterFiles( dt.files || [] );
	this.setValue( files );

	return false;
};

// Deprecated alias
OO.ui.SelectFileWidget = function OoUiSelectFileWidget() {
	OO.ui.warnDeprecation( 'SelectFileWidget: Deprecated alias, use SelectFileInputWidget instead.' );
	OO.ui.SelectFileWidget.super.apply( this, arguments );
};

OO.inheritClass( OO.ui.SelectFileWidget, OO.ui.SelectFileInputWidget );
