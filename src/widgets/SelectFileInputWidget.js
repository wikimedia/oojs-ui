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
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.PendingElement
 * @mixins OO.ui.mixin.LabelElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string[]|null} [accept=null] MIME types to accept. null accepts all types.
 * @cfg {string} [placeholder] Text to display when no file is selected.
 */
OO.ui.SelectFileInputWidget = function OoUiSelectFileInputWidget( config ) {
	// Construct buttons before parent method is called (calling setDisabled)
	this.selectButton = new OO.ui.ButtonWidget( {
		$element: $( '<label>' ),
		classes: [ 'oo-ui-selectFileInputWidget-selectButton' ],
		label: OO.ui.msg( 'ooui-selectfile-button-select' )
	} );
	this.clearButton = new OO.ui.ButtonWidget( {
		classes: [ 'oo-ui-selectFileInputWidget-clearButton' ],
		framed: false,
		icon: 'clear'
	} );

	// Configuration initialization
	config = $.extend( {
		accept: null,
		placeholder: OO.ui.msg( 'ooui-selectfile-placeholder' ),
		$tabIndexed: this.selectButton.$tabIndexed
	}, config );

	// Parent constructor
	OO.ui.SelectFileInputWidget.parent.call( this, config );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.PendingElement.call( this, $.extend( {
		$pending: this.$info
	}, config ) );
	OO.ui.mixin.LabelElement.call( this, config );

	// Properties
	this.$info = $( '<span>' );
	this.currentFile = null;
	if ( Array.isArray( config.accept ) ) {
		this.accept = config.accept;
	} else {
		this.accept = null;
	}
	this.placeholder = config.placeholder;
	this.onFileSelectedHandler = this.onFileSelected.bind( this );

	// Events
	this.selectButton.$button.on( {
		keypress: this.onKeyPress.bind( this )
	} );
	this.clearButton.connect( this, {
		click: 'onClearClick'
	} );
	this.connect( this, { change: 'updateUI' } );

	// Initialization
	this.setupInput();
	this.$label.addClass( 'oo-ui-selectFileInputWidget-label' );
	this.$info
		.addClass( 'oo-ui-selectFileInputWidget-info' )
		.append( this.$icon, this.$label, this.clearButton.$element, this.$indicator );

	this.$element
		.addClass( 'oo-ui-selectFileInputWidget' )
		.append( this.$info, this.selectButton.$element );

	this.updateUI();
};

/* Setup */

OO.inheritClass( OO.ui.SelectFileInputWidget, OO.ui.InputWidget );
OO.mixinClass( OO.ui.SelectFileInputWidget, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.SelectFileInputWidget, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.SelectFileInputWidget, OO.ui.mixin.PendingElement );
OO.mixinClass( OO.ui.SelectFileInputWidget, OO.ui.mixin.LabelElement );

/* Methods */

/**
 * Get the filename of the currently selected file.
 *
 * @return {string} Filename
 */
OO.ui.SelectFileInputWidget.prototype.getFilename = function () {
	if ( this.currentFile ) {
		return this.currentFile.name;
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
		this.currentFile = null;
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
	var file = OO.getProp( e.target, 'files', 0 ) || null;

	if ( file && !this.isAllowedType( file.type ) ) {
		file = null;
	}

	this.currentFile = file;
};

/**
 * Update the user interface when a file is selected or unselected.
 *
 * @protected
 */
OO.ui.SelectFileInputWidget.prototype.updateUI = function () {
	var filename = this.getFilename();

	if ( filename ) {
		this.$element.removeClass( 'oo-ui-selectFileInputWidget-empty' );
		this.setLabel(
			$( '<span>' )
				.addClass( 'oo-ui-selectFileInputWidget-fileName' )
				.text( filename )
		);

	} else {
		this.$element.addClass( 'oo-ui-selectFileInputWidget-empty' );
		this.setLabel( this.placeholder );
	}
};

/**
 * Setup the input element.
 *
 * @protected
 */
OO.ui.SelectFileInputWidget.prototype.setupInput = function () {
	this.$input
		.attr( {
			type: 'file',
			// this.selectButton is tabindexed
			tabindex: -1,
			// Infused input may have previously by
			// TabIndexed, so remove aria-disabled attr.
			'aria-disabled': null
		} )
		.on( 'change', this.onFileSelectedHandler );

	if ( this.accept ) {
		this.$input.attr( 'accept', this.accept.join( ', ' ) );
	}
	this.selectButton.$button.append( this.$input );
};

/**
 * Determine if we should accept this file.
 *
 * @private
 * @param {string} mimeType File MIME type
 * @return {boolean}
 */
OO.ui.SelectFileInputWidget.prototype.isAllowedType = function ( mimeType ) {
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
 * Handle clear button click events.
 *
 * @private
 * @return {undefined/boolean} False to prevent default if event is handled
 */
OO.ui.SelectFileInputWidget.prototype.onClearClick = function () {
	this.setValue( null );
	return false;
};

/**
 * Handle key press events.
 *
 * @private
 * @param {jQuery.Event} e Key press event
 * @return {undefined/boolean} False to prevent default if event is handled
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

	if ( this.selectButton ) {
		this.selectButton.setDisabled( disabled );
	}
	if ( this.clearButton ) {
		this.clearButton.setDisabled( disabled );
	}
	return this;
};
