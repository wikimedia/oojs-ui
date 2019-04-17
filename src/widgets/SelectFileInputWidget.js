/**
 * SelectFileInputWidgets allow for selecting files, using <input type="file">. These
 * widgets can be configured with {@link OO.ui.mixin.IconElement icons}, {@link
 * OO.ui.mixin.IndicatorElement indicators} and {@link OO.ui.mixin.TitledElement titles}.
 * Please see the [OOUI documentation on MediaWiki] [1] for more information and examples.
 *
 * SelectFileInputWidgets must be used in HTML forms, as getValue only returns the filename.
 *
 *     @example
 *     // A file select input widget.
 *     var selectFile = new OO.ui.SelectFileInputWidget();
 *     $( document.body ).append( selectFile.$element );
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Widgets
 *
 * @class
 * @extends OO.ui.InputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string[]|null} [accept=null] MIME types to accept. null accepts all types.
 * @cfg {boolean} [multiple=false] Allow multiple files to be selected.
 * @cfg {string} [placeholder] Text to display when no file is selected.
 * @cfg {Object} [button] Config to pass to select file button.
 * @cfg {string} [icon] Icon to show next to file info
 */
OO.ui.SelectFileInputWidget = function OoUiSelectFileInputWidget( config ) {
	var widget = this;

	config = config || {};

	// Construct buttons before parent method is called (calling setDisabled)
	this.selectButton = new OO.ui.ButtonWidget( $.extend( {
		$element: $( '<label>' ),
		classes: [ 'oo-ui-selectFileInputWidget-selectButton' ],
		label: OO.ui.msg( 'ooui-selectfile-button-select' )
	}, config.button ) );

	// Configuration initialization
	config = $.extend( {
		accept: null,
		placeholder: OO.ui.msg( 'ooui-selectfile-placeholder' ),
		$tabIndexed: this.selectButton.$tabIndexed
	}, config );

	this.info = new OO.ui.SearchInputWidget( {
		classes: [ 'oo-ui-selectFileInputWidget-info' ],
		placeholder: config.placeholder,
		// Pass an empty collection so that .focus() always does nothing
		$tabIndexed: $( [] )
	} ).setIcon( config.icon );
	// Set tabindex manually on $input as $tabIndexed has been overridden
	this.info.$input.attr( 'tabindex', -1 );

	// Parent constructor
	OO.ui.SelectFileInputWidget.parent.call( this, config );

	// Properties
	this.currentFiles = this.filterFiles( this.$input[ 0 ].files || [] );
	if ( Array.isArray( config.accept ) ) {
		this.accept = config.accept;
	} else {
		this.accept = null;
	}
	this.multiple = !!config.multiple;

	// Events
	this.info.connect( this, { change: 'onInfoChange' } );
	this.selectButton.$button.on( {
		keypress: this.onKeyPress.bind( this )
	} );
	this.$input.on( {
		change: this.onFileSelected.bind( this ),
		// Support: IE11
		// In IE 11, focussing a file input (by clicking on it) displays a text cursor and scrolls
		// the cursor into view (in this case, it scrolls the button, which has 'overflow: hidden').
		// Since this messes with our custom styling (the file input has large dimensions and this
		// causes the label to scroll out of view), scroll the button back to top. (T192131)
		focus: function () {
			widget.$input.parent().prop( 'scrollTop', 0 );
		}
	} );
	this.connect( this, { change: 'updateUI' } );

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
		.addClass( 'oo-ui-selectFileInputWidget' )
		.append( this.fieldLayout.$element );

	this.updateUI();
};

/* Setup */

OO.inheritClass( OO.ui.SelectFileInputWidget, OO.ui.InputWidget );

/* Static properties */

// Set empty title so that browser default tooltips like "No file chosen" don't appear.
// On SelectFileWidget this tooltip will often be incorrect, so create a consistent
// experience on SelectFileInputWidget.
OO.ui.SelectFileInputWidget.static.title = '';

/* Methods */

/**
 * Get the filename of the currently selected file.
 *
 * @return {string} Filename
 */
OO.ui.SelectFileInputWidget.prototype.getFilename = function () {
	if ( this.currentFiles.length ) {
		return this.currentFiles.map( function ( file ) {
			return file.name;
		} ).join( ', ' );
	} else {
		// Try to strip leading fakepath.
		return this.getValue().split( '\\' ).pop();
	}
};

/**
 * @inheritdoc
 */
OO.ui.SelectFileInputWidget.prototype.setValue = function ( value ) {
	if ( value === undefined ) {
		// Called during init, don't replace value if just infusing.
		return;
	}
	if ( value ) {
		// We need to update this.value, but without trying to modify
		// the DOM value, which would throw an exception.
		if ( this.value !== value ) {
			this.value = value;
			this.emit( 'change', this.value );
		}
	} else {
		this.currentFiles = [];
		// Parent method
		OO.ui.SelectFileInputWidget.super.prototype.setValue.call( this, '' );
	}
};

/**
 * Handle file selection from the input.
 *
 * @protected
 * @param {jQuery.Event} e
 */
OO.ui.SelectFileInputWidget.prototype.onFileSelected = function ( e ) {
	this.currentFiles = this.filterFiles( e.target.files || [] );
};

/**
 * Update the user interface when a file is selected or unselected.
 *
 * @protected
 */
OO.ui.SelectFileInputWidget.prototype.updateUI = function () {
	this.info.setValue( this.getFilename() );
};

/**
 * Determine if we should accept this file.
 *
 * @private
 * @param {FileList|File[]} files Files to filter
 * @return {File[]} Filter files
 */
OO.ui.SelectFileInputWidget.prototype.filterFiles = function ( files ) {
	var accept = this.accept;

	function mimeAllowed( file ) {
		var i, mimeTest,
			mimeType = file.type;

		if ( !accept || !mimeType ) {
			return true;
		}

		for ( i = 0; i < accept.length; i++ ) {
			mimeTest = accept[ i ];
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
	OO.ui.SelectFileInputWidget.parent.prototype.setDisabled.call( this, disabled );

	this.selectButton.setDisabled( disabled );
	this.info.setDisabled( disabled );

	return this;
};
