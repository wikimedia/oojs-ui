/**
 * @class
 * @extends {OO.ui.Element}
 *
 * @constructor
 */
OO.ui.Demo = function OoUiDemo() {
	// Parent
	OO.ui.Demo.super.call( this );

	// Normalization
	this.normalizeHash();

	// Properties
	this.stylesheetLinks = this.getStylesheetLinks();
	this.mode = this.getCurrentMode();
	this.$menu = this.$( '<div>' );
	this.pageDropdown = new OO.ui.DropdownWidget( {
		$: this.$,
		menu: {
			items: [
				new OO.ui.MenuOptionWidget( 'dialogs',  { $: this.$, label: 'Dialogs' } ),
				new OO.ui.MenuOptionWidget( 'icons',  { $: this.$, label: 'Icons' } ),
				new OO.ui.MenuOptionWidget( 'toolbars',  { $: this.$, label: 'Toolbars' } ),
				new OO.ui.MenuOptionWidget( 'widgets',  { $: this.$, label: 'Widgets' } )
			]
		},
		classes: [ 'oo-ui-demo-pageDropdown' ]
	} );
	this.pageMenu = this.pageDropdown.getMenu();
	this.themeSelect = new OO.ui.ButtonSelectWidget( { $: this.$ } ).addItems( [
		new OO.ui.ButtonOptionWidget( 'apex', { $: this.$, label: 'Apex' } ),
		new OO.ui.ButtonOptionWidget( 'mediawiki', { $: this.$, label: 'MediaWiki' } )
	] );
	this.graphicsSelect = new OO.ui.ButtonSelectWidget( { $: this.$ } ).addItems( [
		new OO.ui.ButtonOptionWidget( 'vector', { $: this.$, label: 'Vector' } ),
		new OO.ui.ButtonOptionWidget( 'raster', { $: this.$, label: 'Raster' } )
	] );
	this.directionSelect = new OO.ui.ButtonSelectWidget( { $: this.$ } ).addItems( [
		new OO.ui.ButtonOptionWidget( 'ltr', { $: this.$, label: 'LTR' } ),
		new OO.ui.ButtonOptionWidget( 'rtl', { $: this.$, label: 'RTL' } )
	] );

	// Events
	this.pageMenu.on( 'choose', OO.ui.bind( this.onModeChange, this ) );
	this.themeSelect.on( 'choose', OO.ui.bind( this.onModeChange, this ) );
	this.graphicsSelect.on( 'choose', OO.ui.bind( this.onModeChange, this ) );
	this.directionSelect.on( 'choose', OO.ui.bind( this.onModeChange, this ) );

	// Initialization
	this.pageMenu.selectItem( this.pageMenu.getItemFromData( this.mode.page ) );
	this.themeSelect.selectItem( this.themeSelect.getItemFromData( this.mode.theme ) );
	this.graphicsSelect.selectItem( this.graphicsSelect.getItemFromData( this.mode.graphics ) );
	this.directionSelect.selectItem( this.directionSelect.getItemFromData( this.mode.direction ) );
	this.$menu
		.addClass( 'oo-ui-demo-menu' )
		.append(
			this.pageDropdown.$element,
			this.themeSelect.$element,
			this.graphicsSelect.$element,
			this.directionSelect.$element
		);
	this.$element
		.addClass( 'oo-ui-demo' )
		.append( this.$menu );
	$( 'body' ).addClass( 'oo-ui-' + this.mode.direction );
	$( 'head' ).append( this.stylesheetLinks );
	this.constructor.static.pages[this.mode.page]( this );
	OO.ui.theme = new ( this.constructor.static.themes[this.mode.theme].theme )();
};

/* Setup */

OO.inheritClass( OO.ui.Demo, OO.ui.Element );

/* Static Properties */

/**
 * Available pages.
 *
 * Populated by each of the page scripts in the `pages` directory.
 *
 * @static
 * @property {Object.<string,Function>} pages List of functions that render a page, keyed by
 *   symbolic page name
 */
OO.ui.Demo.static.pages = {};

/**
 * Available themes.
 *
 * List of theme descriptions, each contianing a `fileSuffix` property used for linking to the
 * correct stylesheet file and a `theme` property containing a theme class
 *
 * @static
 * @property {Object.<string,Object>}
 */
OO.ui.Demo.static.themes = {
	apex: {
		fileSuffix: '-apex',
		theme: OO.ui.ApexTheme || OO.ui.Theme
	},
	mediawiki: {
		fileSuffix: '-mediawiki',
		theme: OO.ui.MediaWikiTheme || OO.ui.Theme
	}
};

/**
 * Available graphics formats.
 *
 * List of graphics format descriptions, each contianing a `fileSuffix` property used for linking
 * to the correct stylesheet file.
 *
 * @static
 * @property {Object.<string,Object>}
 */
OO.ui.Demo.static.graphics = {
	vector: { fileSuffix: '.svg' },
	raster: { fileSuffix: '' }
};

/**
 * Available text directions.
 *
 * List of text direction descriptions, each contianing a `fileSuffix` property used for linking to
 * the correct stylesheet file.
 *
 * @static
 * @property {Object.<string,Object>}
 */
OO.ui.Demo.static.directions = {
	ltr: { fileSuffix: '' },
	rtl: { fileSuffix: '.rtl' }
};

/**
 * Default page.
 *
 * Set by one of the page scripts in the `pages` directory.
 *
 * @static
 * @property {string|null}
 */
OO.ui.Demo.static.defaultPage = null;

/**
 * Default page.
 *
 * Set by one of the page scripts in the `pages` directory.
 *
 * @static
 * @property {string}
 */
OO.ui.Demo.static.defaultTheme = 'apex';

/**
 * Default page.
 *
 * Set by one of the page scripts in the `pages` directory.
 *
 * @static
 * @property {string}
 */
OO.ui.Demo.static.defaultGraphics = 'vector';

/**
 * Default page.
 *
 * Set by one of the page scripts in the `pages` directory.
 *
 * @static
 * @property {string}
 */
OO.ui.Demo.static.defaultDirection = 'ltr';

/* Methods */

/**
 * Handle mode change events.
 *
 * Will load a new page.
 */
OO.ui.Demo.prototype.onModeChange = function () {
	var page = this.pageMenu.getSelectedItem().getData(),
		theme = this.themeSelect.getSelectedItem().getData(),
		direction = this.directionSelect.getSelectedItem().getData(),
		graphics = this.graphicsSelect.getSelectedItem().getData();

	location.hash = '#' + [ page, theme, graphics, direction ].join( '-' );
};

/**
 * Get a list of mode factors.
 *
 * Factors are a mapping between symbolic names used in the URL hash and internal information used
 * to act on those symbolic names.
 *
 * Factor lists are in URL order: page, theme, graphics, direction. Page contains the symbolic
 * page name, others contain file suffixes.
 *
 * @return {Object[]} List of mode factors, keyed by symbolic name
 */
OO.ui.Demo.prototype.getFactors = function () {
	var key,
		factors = [ {}, {}, {}, {} ];

	for ( key in this.constructor.static.pages ) {
		factors[0][key] = key;
	}
	for ( key in this.constructor.static.themes ) {
		factors[1][key] = this.constructor.static.themes[key].fileSuffix;
	}
	for ( key in this.constructor.static.graphics ) {
		factors[2][key] = this.constructor.static.graphics[key].fileSuffix;
	}
	for ( key in this.constructor.static.directions ) {
		factors[3][key] = this.constructor.static.directions[key].fileSuffix;
	}

	return factors;
};

/**
 * Get a list of default factors.
 *
 * Factor defaults are in URL order: page, theme, graphics, direction. Each contains a symbolic
 * factor name which should be used as a fallback when the URL hash is missing or invalid.
 *
 * @return {Object[]} List of default factors
 */
OO.ui.Demo.prototype.getDefaultFactorValues = function () {
	return [
		this.constructor.static.defaultPage,
		this.constructor.static.defaultTheme,
		this.constructor.static.defaultGraphics,
		this.constructor.static.defaultDirection
	];
};

/**
 * Parse the current URL hash into factor values.
 *
 * @return {string[]} Factor values in URL order: page, theme, graphics, direction
 */
OO.ui.Demo.prototype.getCurrentFactorValues = function () {
	return location.hash.substr( 1 ).split( '-' );
};

/**
 * Get the current mode.
 *
 * Generated from parsed URL hash values.
 *
 * @return {Object} List of factor values keyed by factor name
 */
OO.ui.Demo.prototype.getCurrentMode = function () {
	var factorValues = this.getCurrentFactorValues();

	return {
		page: factorValues[0],
		theme: factorValues[1],
		graphics: factorValues[2],
		direction: factorValues[3]
	};
};

/**
 * Get link elements for the current mode.
 *
 * @return {HTMLElement[]} List of link elements
 */
OO.ui.Demo.prototype.getStylesheetLinks = function () {
	var i, len, link, fragments,
		factors = this.getFactors(),
		urls = [],
		links = [];

	// Translate modes to filename fragments
	fragments = this.getCurrentFactorValues().map( function ( val, index ) {
		return factors[index][val];
	} );

	// Theme styles
	urls.push( '../dist/oojs-ui' + fragments.slice( 1 ).join( '' ) + '.css' );
	// Demo styles
	urls.push( 'styles/demo' + fragments[3] + '.css' );

	// Add link tags
	for ( i = 0, len = urls.length; i < len; i++ ) {
		link = document.createElement( 'link' );
		link.setAttribute( 'rel', 'stylesheet' );
		link.setAttribute( 'href', urls[i] );
		links.push( link );
	}
	return links;
};

/**
 * Normalize the URL hash.
 */
OO.ui.Demo.prototype.normalizeHash = function () {
	var i, len, factorValues,
		modes = [],
		factors = this.getFactors(),
		defaults = this.getDefaultFactorValues();

	factorValues = this.getCurrentFactorValues();
	for ( i = 0, len = factors.length; i < len; i++ ) {
		modes[i] = factors[i][factorValues[i]] !== undefined ? factorValues[i] : defaults[i];
	}

	// Update hash
	location.hash = modes.join( '-' );
};

/**
 * Destroy demo.
 */
OO.ui.Demo.prototype.destroy = function () {
	$( 'body' ).removeClass( 'oo-ui-ltr oo-ui-rtl' );
	$( this.stylesheetLinks ).remove();
	this.$element.remove();
};

/**
 * Build a console for interacting with an element.
 *
 * @param {OO.ui.Element} item
 * @param {string} key Variable name for item
 * @param {string} [item.label=""]
 * @return {jQuery} Console interface element
 */
OO.ui.Demo.prototype.buildConsole = function ( item, key ) {
	var $toggle, $log, $label, $input, $submit, $console, $form,
		console = window.console;

	function exec( str ) {
		var func, ret;
		/*jshint evil:true */
		if ( str.indexOf( 'return' ) !== 0 ) {
			str = 'return ' + str;
		}
		try {
			func = new Function( key, 'item', str );
			ret = { value: func( item, item ) };
		} catch ( error ) {
			ret = {
				value: undefined,
				error: error
			};
		}
		return ret;
	}

	function submit() {
		var val, result, logval;

		val = $input.val();
		$input.val( '' );
		$input[0].focus();
		result = exec( val );

		logval = String( result.value );
		if ( logval === '' ) {
			logval = '""';
		}

		$log.append(
			$( '<div>' )
				.addClass( 'oo-ui-demo-console-log-line oo-ui-demo-console-log-line-input' )
				.text( val ),
			$('<div>')
				.addClass( 'oo-ui-demo-console-log-line oo-ui-demo-console-log-line-return' )
				.text( logval || result.value )
		);

		if ( result.error ) {
			$log.append( $('<div>').addClass( 'oo-ui-demo-console-log-line oo-ui-demo-console-log-line-error' ).text( result.error ) );
		}

		if ( console && console.log ) {
			console.log( '[demo]', result.value );
			if ( result.error ) {
				if ( console.error ) {
					console.error( '[demo]', String( result.error ), result.error );
				} else {
					console.log( '[demo] Error: ', result.error );
				}
			}
		}

		// Scrol to end
		$log.prop( 'scrollTop', $log.prop( 'scrollHeight' ) );
	}

	$toggle = $( '<span>' )
		.addClass( 'oo-ui-demo-console-toggle' )
		.attr( 'title', 'Toggle console' )
		.on( 'click', function ( e ) {
			e.preventDefault();
			$console.toggleClass( 'oo-ui-demo-console-collapsed oo-ui-demo-console-expanded' );
			if ( $input.is( ':visible' ) ) {
				$input[0].focus();
				if ( console && console.log ) {
					window[ key ] = item;
					console.log( '[demo]', 'Global ' + key + ' has been set' );
					console.log( '[demo]', item );
				}
			}
		} );

	$log = $( '<div>' )
		.addClass( 'oo-ui-demo-console-log' );

	$label = $( '<label>' )
		.addClass( 'oo-ui-demo-console-label' );

	$input = $( '<input>' )
		.addClass( 'oo-ui-demo-console-input' )
		.prop( 'placeholder', '... (predefined: ' + key + ')' );

	$submit = $( '<div>' )
		.addClass( 'oo-ui-demo-console-submit' )
		.text( '↵' )
		.on( 'click', submit );

	$form = $( '<form>' ).on( 'submit', function ( e ) {
		e.preventDefault();
		submit();
	} );

	$console = $( '<div>' )
		.addClass( 'oo-ui-demo-console oo-ui-demo-console-collapsed' )
		.append(
			$toggle,
			$log,
			$form.append(
				$label.append(
					$input
				),
				$submit
			)
		);

	return $console;
};
