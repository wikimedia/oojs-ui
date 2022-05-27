/* globals Prism, javascriptStringify */
/**
 * @class
 * @extends OO.ui.Element
 *
 * @constructor
 */
window.Demo = function Demo() {
	var demo = this;

	// Parent constructor
	Demo.super.call( this );

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Normalization
	this.normalizeQuery();

	// Properties
	this.stylesheetLinks = this.getStylesheetLinks();
	this.mode = this.getCurrentMode();

	OO.ui.isMobile = function () {
		return demo.mode.platform === 'mobile';
	};
	OO.ui.theme = new OO.ui[ this.constructor.static.themes[ this.mode.theme ] + 'Theme' ]();

	this.$header = $( '<div>' );
	this.$menu = $( '<div>' );
	this.expandButton = new OO.ui.ToggleButtonWidget( {
		classes: [ 'demo-menuToggle' ],
		icon: 'menu',
		label: 'Menu',
		invisibleLabel: true
	} );
	this.pageSelect = new OO.ui.TabSelectWidget( {
		classes: [ 'demo-pageSelect' ],
		framed: false,
		items: [
			new OO.ui.TabOptionWidget( {
				data: 'widgets',
				label: 'Widgets'
			} ),
			new OO.ui.TabOptionWidget( {
				data: 'layouts',
				label: 'Layouts'
			} ),
			new OO.ui.TabOptionWidget( {
				data: 'dialogs',
				label: 'Dialogs'
			} ),
			new OO.ui.TabOptionWidget( {
				data: 'icons',
				label: 'Icons'
			} ),
			new OO.ui.TabOptionWidget( {
				data: 'toolbars',
				label: 'Toolbars'
			} )
		]
	} );
	this.themeSelect = new OO.ui.ButtonSelectWidget();
	Object.keys( this.constructor.static.themes ).forEach( function ( theme ) {
		demo.themeSelect.addItems( [
			new OO.ui.ButtonOptionWidget( {
				data: theme,
				label: demo.constructor.static.themes[ theme ]
			} )
		] );
	} );
	this.directionSelect = new OO.ui.ButtonSelectWidget().addItems( [
		new OO.ui.ButtonOptionWidget( {
			data: 'ltr',
			icon: 'textDirLTR',
			title: 'Switch to left-to-right direction demo'
		} ),
		new OO.ui.ButtonOptionWidget( {
			data: 'rtl',
			icon: 'textDirRTL',
			title: 'Switch to right-to-left direction demo'
		} )
	] );
	this.jsPhpSelect = new OO.ui.ButtonGroupWidget().addItems( [
		new OO.ui.ButtonWidget( { label: 'JS' } ).setActive( true ),
		new OO.ui.ButtonWidget( {
			label: 'PHP',
			href: 'demos.php' + this.getUrlQuery()
		} )
	] );
	this.platformSelect = new OO.ui.ButtonSelectWidget().addItems( [
		new OO.ui.ButtonOptionWidget( { data: 'desktop', label: 'Desktop' } ),
		new OO.ui.ButtonOptionWidget( { data: 'mobile', label: 'Mobile' } )
	] );

	this.linkDocs = new OO.ui.ButtonWidget( {
		classes: [ 'demo-menuLink', 'demo-menuLink-docs' ],
		label: 'Docs',
		icon: 'journal',
		href: '../js/',
		framed: false,
		flags: [ 'progressive' ]
	} );
	this.linkTutorials = new OO.ui.ButtonWidget( {
		classes: [ 'demo-menuLink', 'demo-menuLink-tutorials' ],
		label: 'Tutorials',
		icon: 'book',
		href: 'tutorials/index.html',
		framed: false,
		flags: [ 'progressive' ],
		rel: []
	} );

	// Events
	this.expandButton.on( 'change', OO.ui.bind( this.onExpandButtonChange, this ) );
	this.pageSelect.on( 'choose', OO.ui.bind( this.onPageSelectChoose, this ) );
	this.themeSelect.on( 'choose', OO.ui.bind( this.onModeChange, this ) );
	this.directionSelect.on( 'choose', OO.ui.bind( this.onModeChange, this ) );
	this.platformSelect.on( 'choose', OO.ui.bind( this.onModeChange, this ) );

	// Initialization
	this.pageSelect.selectItemByData( this.mode.page );
	this.themeSelect.selectItemByData( this.mode.theme );
	this.directionSelect.selectItemByData( this.mode.direction );
	this.platformSelect.selectItemByData( this.mode.platform );
	this.$menu
		.addClass( 'demo-menu' )
		.attr( 'role', 'navigation' )
		.append(
			this.expandButton.$element,
			this.themeSelect.$element,
			this.directionSelect.$element,
			this.jsPhpSelect.$element,
			this.platformSelect.$element,
			this.linkDocs.$element,
			this.linkTutorials.$element
		);
	this.$header
		.addClass( 'demo-header' )
		.attr( 'role', 'banner' )
		.append( $( '<h1>' ).text( 'OOUI' ) )
		.append( ' ' )
		.append( $( '<h2>' ).attr( 'dir', 'ltr' ).html( 'Demos <span>– Rapidly create web-applications in JS or PHP. Cross-browser, i18n and a11y ready.</span>' ) )
		.append( this.$menu, this.pageSelect.$element );
	this.$container = $( '<div>' ).addClass( 'demo-container' ).attr( 'role', 'main' );
	this.$element
		.addClass( 'demo-root' )
		.append( this.$header, this.$container );
	$( document.documentElement ).attr( 'dir', this.mode.direction );
	$( document.head ).append( this.stylesheetLinks );
	// The following classes are used here:
	// * oo-ui-theme-wikimediaui
	// * oo-ui-theme-apex
	$( document.body ).addClass( 'oo-ui-theme-' + this.mode.theme );
	// The following classes are used here:
	// * oo-ui-platform-mobile
	// * oo-ui-platform-desktop
	$( document.body ).addClass( 'oo-ui-platform-' + ( OO.ui.isMobile() ? 'mobile' : 'desktop' ) );
	OO.ui.getViewportSpacing = function () {
		return {
			// Contents of dialogs are shown on top of the fixed menu
			top: demo.mode.page === 'dialogs' ? 0 : demo.$menu.outerHeight(),
			right: 0,
			bottom: 0,
			left: 0
		};
	};
	if ( OO.ui.isMobile() ) {
		this.onExpandButtonChange( false );
	} else {
		// Hide the button on desktop
		this.expandButton.toggle( false );
		this.onExpandButtonChange( true );
	}
};

/* Setup */

OO.inheritClass( Demo, OO.ui.Element );
OO.mixinClass( Demo, OO.EventEmitter );

/* Static Properties */

/**
 * Available pages.
 *
 * Populated by each of the page scripts in the `pages` directory.
 *
 * @static
 * @property {Object.<string,Function>} pages List of functions that render a page, keyed by
 *  symbolic page name
 */
Demo.static.pages = {};

/**
 * Available themes.
 *
 * Map of lowercase name to proper name. Lowercase names are used for linking to the
 * correct stylesheet file. Proper names are used to find the theme class.
 *
 * @static
 * @property {Object.<string,string>}
 */
Demo.static.themes = {
	wikimediaui: 'WikimediaUI', // Do not change this line or you'll break `grunt add-theme`
	apex: 'Apex'
};

/**
 * Available text directions.
 *
 * List of text direction descriptions, each containing a `fileSuffix` property used for linking to
 * the correct stylesheet file.
 *
 * @static
 * @property {Object.<string,Object>}
 */
Demo.static.directions = {
	ltr: { fileSuffix: '' },
	rtl: { fileSuffix: '.rtl' }
};

/**
 * Icon/indicator image data by theme.
 *
 * A collection of the 'images' properties from icon/indicator manifest files.
 *
 * @static
 * @property {Object.<string,Object>}
 */
Demo.static.imageLists = {};

/**
 * Available platforms.
 *
 * @static
 * @property {string[]}
 */
Demo.static.platforms = [ 'desktop', 'mobile' ];

/**
 * Default page.
 *
 * @static
 * @property {string}
 */
Demo.static.defaultPage = 'widgets';

/**
 * Default page.
 *
 * Set by one of the page scripts in the `pages` directory.
 *
 * @static
 * @property {string}
 */
Demo.static.defaultTheme = 'wikimediaui';

/**
 * Default page.
 *
 * Set by one of the page scripts in the `pages` directory.
 *
 * @static
 * @property {string}
 */
Demo.static.defaultDirection = 'ltr';

/**
 * Default platform.
 *
 * Set by one of the page scripts in the `pages` directory.
 *
 * @static
 * @property {string}
 */
Demo.static.defaultPlatform = 'desktop';

/* Methods */

/**
 * Load the demo page. Must be called after $element is attached.
 *
 * @return {jQuery.Promise} Resolved when demo is initialized
 */
Demo.prototype.initialize = function () {
	var demo = this,
		promises = this.stylesheetLinks.map( function ( el ) {
			return $( el ).data( 'load-promise' );
		} );

	// Helper function to get high resolution profiling data, where available.
	function now() {
		return ( window.performance && performance.now ) ? performance.now() : Date.now();
	}

	return $.when.apply( $, promises )
		.done( function () {
			var start = now();
			demo.constructor.static.pages[ demo.mode.page ]( demo );
			var end = now();
			window.console.log( 'Took ' + ( end - start ) + ' ms to build demo page.' );
		} )
		.fail( function () {
			demo.$element.append( $( '<p>' ).text( 'Demo styles failed to load.' ) );
		} );
};

/**
 * Handle mode change events (theme/directionality/platform)
 *
 * Will load a new demo.
 */
Demo.prototype.onModeChange = function () {
	this.updateHistoryState();
	$( window ).triggerHandler( 'popstate' );
};

/**
 * Handle choose events on the page select widget
 */
Demo.prototype.onPageSelectChoose = function () {
	this.updateHistoryState();
	this.$container.empty();
	var page = this.pageSelect.findSelectedItem().getData();
	this.constructor.static.pages[ page ]( this );
};

/**
 * Update the browser history state
 */
Demo.prototype.updateHistoryState = function () {
	var page = this.pageSelect.findSelectedItem().getData(),
		theme = this.themeSelect.findSelectedItem().getData(),
		direction = this.directionSelect.findSelectedItem().getData(),
		platform = this.platformSelect.findSelectedItem().getData();

	history.pushState(
		null,
		document.title,
		this.getUrlQuery( {
			page: page,
			theme: theme,
			direction: direction,
			platform: platform
		} )
	);
};

/**
 * Handle expand button change events.
 *
 * @param {boolean} value Whether the button is toggled on
 */
Demo.prototype.onExpandButtonChange = function ( value ) {
	// Show/hide everything in the menu, except this.pageDropdown
	this.themeSelect.toggle( value );
	this.directionSelect.toggle( value );
	this.jsPhpSelect.toggle( value );
	this.platformSelect.toggle( value );
	this.linkDocs.toggle( value );
	this.linkTutorials.toggle( value );
};

/**
 * Get URL query for given factors describing the demo's mode.
 *
 * @param {Object} [mode] Factors, defaults to values provided by #getCurrentMode
 * @param {string} [fragment] URL fragment, excluding the '#'
 * @return {string} URL query part, starting with '?'
 */
Demo.prototype.getUrlQuery = function ( mode, fragment ) {
	mode = $.extend( this.getCurrentMode(), mode );
	return '?page=' + mode.page +
		'&theme=' + mode.theme +
		'&direction=' + mode.direction +
		'&platform=' + mode.platform +
		// Preserve current URL 'fragment' part
		( fragment ? '#' + fragment : location.hash );
};

/**
 * Get a list of mode factors.
 *
 * Factors are a mapping between symbolic names used in the URL query and internal information used
 * to act on those symbolic names.
 *
 * Factor lists are in URL order: page, theme, direction, platform. Page contains the symbolic
 * page name, others contain file suffixes.
 *
 * @return {Object[]} List of mode factors, keyed by symbolic name
 */
Demo.prototype.getFactors = function () {
	var factors = [ {}, {}, {}, {} ];

	var key;
	for ( key in this.constructor.static.pages ) {
		factors[ 0 ][ key ] = key;
	}
	for ( key in this.constructor.static.themes ) {
		factors[ 1 ][ key ] = '-' + key;
	}
	for ( key in this.constructor.static.directions ) {
		factors[ 2 ][ key ] = this.constructor.static.directions[ key ].fileSuffix;
	}
	this.constructor.static.platforms.forEach( function ( platform ) {
		factors[ 3 ][ platform ] = '';
	} );

	return factors;
};

/**
 * Get a list of default factors.
 *
 * Factor defaults are in URL order: page, theme, direction, platform. Each contains a symbolic
 * factor name which should be used as a fallback when the URL query is missing or invalid.
 *
 * @return {Object[]} List of default factors
 */
Demo.prototype.getDefaultFactorValues = function () {
	return [
		this.constructor.static.defaultPage,
		this.constructor.static.defaultTheme,
		this.constructor.static.defaultDirection,
		this.constructor.static.defaultPlatform
	];
};

/**
 * Parse the current URL query into factor values.
 *
 * @return {string[]} Factor values in URL order: page, theme, direction, platform
 */
Demo.prototype.getCurrentFactorValues = function () {
	var factors = this.getDefaultFactorValues(),
		order = [ 'page', 'theme', 'direction', 'platform' ],
		query = location.search.slice( 1 ).split( '&' );
	for ( var i = 0; i < query.length; i++ ) {
		var parts = query[ i ].split( '=', 2 );
		var index = order.indexOf( parts[ 0 ] );
		if ( index !== -1 ) {
			factors[ index ] = decodeURIComponent( parts[ 1 ] );
		}
	}
	return factors;
};

/**
 * Get the current mode.
 *
 * Generated from parsed URL query values.
 *
 * @param {string[]} [factorValues] Values to use instead of getCurrentFactorValues
 * @return {Object} List of factor values keyed by factor name
 */
Demo.prototype.getCurrentMode = function ( factorValues ) {
	factorValues = factorValues || this.getCurrentFactorValues();

	return {
		page: factorValues[ 0 ],
		theme: factorValues[ 1 ],
		direction: factorValues[ 2 ],
		platform: factorValues[ 3 ]
	};
};

/**
 * Get link elements for the current mode.
 *
 * @return {HTMLElement[]} List of link elements
 */
Demo.prototype.getStylesheetLinks = function () {
	var factors = this.getFactors(),
		urls = [];

	// Translate modes to filename fragments
	var fragments = this.getCurrentFactorValues().map( function ( val, index ) {
		return factors[ index ][ val ];
	} );

	// Theme styles
	urls.push( 'dist/oojs-ui' + fragments.slice( 1 ).join( '' ) + '.css' );

	// Demo styles
	urls.push( 'styles/demo' + fragments[ 2 ] + '.css' );

	// Add link tags
	var links = urls.map( function ( url ) {
		var
			link = document.createElement( 'link' ),
			$link = $( link ),
			deferred = $.Deferred();
		$link.data( 'load-promise', deferred.promise() );
		$link.on( {
			load: deferred.resolve,
			error: deferred.reject
		} );
		link.rel = 'stylesheet';
		link.href = url;
		return link;
	} );

	return links;
};

/**
 * Normalize the URL query.
 */
Demo.prototype.normalizeQuery = function () {
	var factors = this.getFactors(),
		modes = this.getDefaultFactorValues();

	var factorValues = this.getCurrentFactorValues();
	factors.forEach( function ( factor, i ) {
		var factorValue = factorValues[ i ];
		if ( factor[ factorValue ] !== undefined ) {
			modes[ i ] = factorValue;
		}
	} );

	// Backwards-compatibility with old URLs that used the 'fragment' part to link to demo sections:
	// if a fragment is specified and it describes valid factors, turn the URL into the new style.
	var match = location.hash.match( /^#(\w+)-(\w+)-(\w+)(?:-(\w+))?$/ );
	if ( match ) {
		factorValues = Array.prototype.slice.call( match, 1 );
		// Backwards-compatibility with changed theme name (I8ee1fab4)
		if ( factorValues[ 1 ] === 'mediawiki' ) {
			factorValues[ 1 ] = 'wikimediaui';
		}
		// Backwards-compatibility with old graphics distributions (Ic6309b4e)
		if ( factorValues[ 2 ] === 'mixed' || factorValues[ 2 ] === 'vector' || factorValues[ 2 ] === 'raster' ) {
			factorValues[ 2 ] = factorValues[ 3 ];
			factorValues[ 3 ] = null;
		}
		// Backwards-compatibility with no platforms (Idc49819c)
		if ( !factorValues[ 3 ] ) {
			factorValues[ 3 ] = 'desktop';
		}
		var valid = factors.every( function ( factor, i ) {
			var factorValue = factorValues[ i ];
			return factor[ factorValue ] !== undefined;
		} );
		if ( valid ) {
			location.hash = '';
			modes = factorValues;
		}
	}

	// Update query
	history.replaceState( null, document.title, this.getUrlQuery( this.getCurrentMode( modes ) ) );
};

/**
 * Destroy demo.
 */
Demo.prototype.destroy = function () {
	// Theme classes documented in setup
	// eslint-disable-next-line mediawiki/class-doc
	$( document.body )
		.removeClass( 'oo-ui-ltr oo-ui-rtl' )
		.removeClass( 'oo-ui-theme-' + this.mode.theme )
		.removeClass( 'oo-ui-platform-mobile oo-ui-platform-desktop' );
	$( this.stylesheetLinks ).remove();
	this.$element.remove();
	this.emit( 'destroy' );
};

/**
 * Build a console for interacting with an element.
 *
 * @param {OO.ui.Layout} layout
 * @param {string} layoutName Variable name for layout
 * @param {string} widgetName Variable name for layout's field widget
 * @param {boolean} showLayoutCode FieldsetLayout code is shown
 * @return {jQuery} Console interface element
 */
Demo.prototype.buildConsole = function ( layout, layoutName, widgetName, showLayoutCode ) {
	var console = window.console;
	var $input, $log, $console, $code;

	function exec( str ) {
		if ( str.indexOf( 'return' ) !== 0 ) {
			str = 'return ' + str;
		}
		var func, ret;
		try {
			// eslint-disable-next-line no-new-func
			func = new Function( layoutName, widgetName, 'item', str );
			ret = { value: func( layout, layout.fieldWidget, layout.fieldWidget ) };
		} catch ( error ) {
			ret = {
				value: undefined,
				error: error
			};
		}
		return ret;
	}

	function submit() {
		var val = $input.val();
		$input.val( '' );
		$input[ 0 ].focus();
		var result = exec( val );

		var logval = String( result.value );
		if ( logval === '' ) {
			logval = '""';
		}

		$log.append(
			$( '<div>' )
				.addClass( 'demo-console-log-line demo-console-log-line-input' )
				.text( val ),
			$( '<div>' )
				.addClass( 'demo-console-log-line demo-console-log-line-return' )
				.text( logval || result.value )
		);

		if ( result.error ) {
			$log.append( $( '<div>' ).addClass( 'demo-console-log-line demo-console-log-line-error' ).text( result.error ) );
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

	function getCode( item, toplevel ) {
		var items = [],
			demoLinks = [],
			docLinks = [];

		function getConstructorName( widget ) {
			var isDemoWidget = widget.constructor.name.indexOf( 'Demo' ) === 0;
			return ( isDemoWidget ? 'Demo.' : 'OO.ui.' ) + widget.constructor.name.slice( 4 );
		}

		// If no item was passed we shouldn't show a code block
		if ( item === undefined ) {
			return false;
		}

		var config = item.initialConfig;

		// Prevent the default config from being part of the code
		var defaultConfig;
		if ( item instanceof OO.ui.ActionFieldLayout ) {
			defaultConfig = (
				new item.constructor(
					new OO.ui.TextInputWidget(),
					new OO.ui.ButtonWidget()
				)
			).initialConfig;
		} else if ( item instanceof OO.ui.FieldLayout ) {
			defaultConfig = ( new item.constructor( new OO.ui.ButtonWidget() ) ).initialConfig;
		} else {
			defaultConfig = ( new item.constructor() ).initialConfig;
		}
		Object.keys( defaultConfig ).forEach( function ( key ) {
			if ( config[ key ] === defaultConfig[ key ] ) {
				delete config[ key ];
			} else if (
				typeof config[ key ] === 'object' && typeof defaultConfig[ key ] === 'object' &&
				OO.compare( config[ key ], defaultConfig[ key ] )
			) {
				delete config[ key ];
			}
		} );

		config = javascriptStringify( config, function ( obj, indent, stringify ) {
			if ( obj instanceof Function ) {
				// Get function's source code, with extraneous indentation removed
				return obj.toString().replace( /^\t\t\t\t\t\t/gm, '' );
			} else if ( obj instanceof $ ) {
				if ( $.contains( item.$element[ 0 ], obj[ 0 ] ) ) {
					// If this element appears inside the generated widget,
					// assume this was something like `$label: $( '<p>Text</p>' )`
					return '$( ' + javascriptStringify( obj.prop( 'outerHTML' ) ) + ' )';
				} else {
					// Otherwise assume this was something like `$overlay: $( '#overlay' )`
					return '$( ' + javascriptStringify( '#' + obj.attr( 'id' ) ) + ' )';
				}
			} else if ( obj instanceof OO.ui.HtmlSnippet ) {
				return 'new OO.ui.HtmlSnippet( ' + javascriptStringify( obj.toString() ) + ' )';
			} else if ( obj instanceof OO.ui.Element ) {
				return getCode( obj );
			} else {
				return stringify( obj );
			}
		}, '\t' );

		// The generated code needs to include different arguments, based on the object type
		items.push( item );
		var params;
		if ( item instanceof OO.ui.ActionFieldLayout ) {
			params = getCode( item.fieldWidget ) + ', ' + getCode( item.buttonWidget );
			items.push( item.fieldWidget );
			items.push( item.buttonWidget );
		} else if ( item instanceof OO.ui.FieldLayout ) {
			params = getCode( item.fieldWidget );
			items.push( item.fieldWidget );
		} else {
			params = '';
		}
		if ( config !== '{}' ) {
			params += ( params ? ', ' : '' ) + config;
		}
		var out = 'new ' + getConstructorName( item ) + '(' +
			( params ? ' ' : '' ) + params + ( params ? ' ' : '' ) +
			')';

		if ( toplevel ) {
			for ( var i = 0; i < items.length; i++ ) {
				item = items[ i ];
				// The code generated for Demo widgets cannot be copied and used
				var url;
				if ( item.constructor.name.indexOf( 'Demo' ) === 0 ) {
					url =
						'https://gerrit.wikimedia.org/g/oojs/ui/+/master/demos/classes/' +
						item.constructor.name.slice( 4 ) + '.js';
					demoLinks.push( url );
				} else {
					url = 'https://doc.wikimedia.org/oojs-ui/master/js/#!/api/' + getConstructorName( item );
					url = '[' + url + '](' + url + ')';
					docLinks.push( url );
				}
			}
		}

		return (
			( docLinks.length ? '// See documentation at: \n// ' : '' ) +
			docLinks.join( '\n// ' ) + ( docLinks.length ? '\n' : '' ) +
			( demoLinks.length ? '// See source code:\n// ' : '' ) +
			demoLinks.join( '\n// ' ) + ( demoLinks.length ? '\n' : '' ) +
			out
		);
	}

	var $toggle = $( '<span>' )
		.addClass( 'demo-console-toggle' )
		.attr( 'title', 'Toggle console' )
		.on( 'click', function ( e ) {
			var code;
			e.preventDefault();
			// eslint-disable-next-line no-jquery/no-class-state
			$console.toggleClass( 'demo-console-collapsed demo-console-expanded' );
			// eslint-disable-next-line no-jquery/no-class-state
			if ( $console.hasClass( 'demo-console-expanded' ) ) {
				$input[ 0 ].focus();
				if ( console && console.log ) {
					window[ layoutName ] = layout;
					window[ widgetName ] = layout.fieldWidget;
					console.log( '[demo]', 'Globals ' + layoutName + ', ' + widgetName + ' have been set' );
					console.log( '[demo]', layout );

					if ( showLayoutCode === true ) {
						code = getCode( layout, true );
					} else {
						code = getCode( layout.fieldWidget, true );
					}

					if ( code ) {
						$code.text( code );
						Prism.highlightElement( $code[ 0 ] );
					} else {
						$code.remove();
					}
				}
			}
		} );

	$log = $( '<div>' )
		.addClass( 'demo-console-log' );

	var $label = $( '<label>' )
		.addClass( 'demo-console-label' );

	$input = $( '<input>' )
		.addClass( 'demo-console-input' )
		.prop( 'placeholder', '... (predefined: ' + layoutName + ', ' + widgetName + ')' );

	var $submit = $( '<div>' )
		.addClass( 'demo-console-submit' )
		.text( '↵' )
		.on( 'click', submit );

	var $form = $( '<form>' ).on( 'submit', function ( e ) {
		e.preventDefault();
		submit();
	} );

	$code = $( '<code>' ).addClass( 'language-javascript' );

	var $pre = $( '<pre>' )
		.addClass( 'demo-sample-code' )
		.append( $code );

	$console = $( '<div>' )
		.addClass( 'demo-console demo-console-collapsed' )
		.append(
			$toggle,
			$log,
			$form.append(
				$label.append(
					$input
				),
				$submit
			),
			$pre
		);

	return $console;
};

/**
 * Build a link to this example.
 *
 * @param {OO.ui.Layout} item
 * @return {jQuery} Link interface element
 */
Demo.prototype.buildLinkExample = function ( item ) {
	if ( item.$label.text() === '' ) {
		item = this.getElementGroup();
		if ( !item ) {
			return $( [] );
		}
	}
	var fragment = item.elementId;
	if ( !fragment ) {
		var label = item.$label.text();
		fragment = label.replace( /[^\w]+/g, '-' ).replace( /^-|-$/g, '' );
	}

	if ( !( item instanceof Demo.LinkedFieldsetLayout ) ) {
		item.$element.addClass( 'demo-linked-field' );

		// Move anchor down below floating header.
		item.$element.removeAttr( 'id' );
		item.$header.append(
			$( '<span>' )
				.addClass( 'demo-linked-field-anchor' )
				.attr( 'id', fragment )
		);
	}

	var $linkExample = $( '<a>' )
		.addClass( 'demo-link-example' )
		.attr( 'title', 'Link to this example' )
		.attr( 'href', '#' + fragment );

	return $linkExample;
};
