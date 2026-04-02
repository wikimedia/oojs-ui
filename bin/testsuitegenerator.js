'use strict';

const fs = require( 'fs' );
const { parseAnyPath } = require( './docparser' );

function makeClassInstancePlaceholder( klass, config ) {
	const payload = { class: klass, config: config };
	return '_placeholder_' + JSON.stringify( payload );
}

function findClass( classes, klass ) {
	return classes.find( ( c ) => c.name === klass );
}

function expandTypeToValues( classes, typeVal ) {
	// Values to test for each type
	const expandos = {
		null: [ null ],
		int: [ 0, -1, 300 ], // PHP code
		number: [ 0, -1, 300 ], // JS code
		bool: [ true, false ], // PHP code
		boolean: [ true, false ], // JS code
		string: [ 'Foo bar <b>HTML?</b>', '', ' ', '0' ],
		HtmlSnippet: [ 'Foo bar <b>HTML?</b>' ].map( ( v ) => makeClassInstancePlaceholder( 'HtmlSnippet', v ) ),
		PanelLayout: [ 'Foo bar <b>HTML?</b>', '' ].map( ( v ) => {
			const config = { content: [ v ] };
			return makeClassInstancePlaceholder( 'PanelLayout', config );
		} )
	};

	let types = typeVal.split( '|' );
	// For abstract classes (not "testable"), test a few different subclasses instead
	if ( types.includes( 'Widget' ) ) {
		types = types.filter( ( t ) => t !== 'Widget' );
		types.push( 'ButtonWidget', 'TextInputWidget' );
	}
	if ( types.includes( 'InputWidget' ) ) {
		types = types.filter( ( t ) => t !== 'InputWidget' );
		types.push( 'CheckboxInputWidget', 'TextInputWidget' );
	}

	const out = [];
	for ( let type of types ) {
		let asArray = false;
		if ( type.endsWith( '[]' ) ) {
			asArray = true;
			type = type.slice( 0, -2 );
		}

		let vals;
		if ( Object.prototype.hasOwnProperty.call( expandos, type ) ) {
			// Primitive. Run tests with the provided values.
			vals = expandos[ type ];
		} else if ( findClass( classes, type ) ) {
			// OOUI object. Test suite will instantiate one and run the test with it.
			const klass = findClass( classes, type );
			const constructor = ( klass.methods || [] ).find( ( m ) => m.name === '#constructor' );
			const params = constructor ? ( constructor.params || [] ) : [];
			const configPairs = params.map( ( configOption ) => {
				const values = expandTypeToValues( classes, configOption.type );
				const obj = {};
				obj[ configOption.name ] = values[ 0 ];
				return obj;
			} );
			const merged = Object.assign( {}, ...configPairs );
			vals = [ makeClassInstancePlaceholder( type, merged ) ];
		} else {
			// We don't know how to test this. The empty value will result in no
			// tests being generated for this combination of config values.
			vals = [];
		}

		if ( asArray ) {
			for ( const val of vals ) {
				out.push( [ val ] );
			}
		} else {
			out.push( ...vals );
		}
	}

	return out;
}

function findConfigSources( classes, className ) {
	if ( !className ) {
		return [];
	}
	let names = [ className ];
	let current = className;
	while ( current ) {
		const klass = findClass( classes, current );
		if ( !klass ) {
			break;
		}
		names = names.concat( findConfigSources( classes, klass.parent ) );
		for ( const mixedName of klass.mixes || [] ) {
			names = names.concat( findConfigSources( classes, mixedName ) );
		}
		current = klass.parent;
	}
	// Unique
	return Array.from( new Set( names ) );
}

function combinations( items, k ) {
	if ( k === 0 ) {
		return [ [] ];
	}
	if ( k > items.length ) {
		return [];
	}
	const out = [];
	for ( let i = 0; i <= items.length - k; i++ ) {
		const head = items[ i ];
		for ( const tail of combinations( items.slice( i + 1 ), k - 1 ) ) {
			out.push( [ head, ...tail ] );
		}
	}
	return out;
}

function cartesianProduct( arrays ) {
	if ( arrays.length === 0 ) {
		return [ [] ];
	}
	let acc = [ [] ];
	for ( const arr of arrays ) {
		const next = [];
		for ( const prefix of acc ) {
			for ( const item of arr ) {
				next.push( [ ...prefix, item ] );
			}
		}
		acc = next;
	}
	return acc;
}

function parseArgs( argv ) {
	if ( argv.length === 0 || ( argv.length === 1 && ( argv[ 0 ] === '-h' || argv[ 0 ] === '--help' ) ) ) {
		return { help: true };
	}
	let outFile = null;
	const args = argv.slice();
	const oIndex = args.indexOf( '-o' );
	if ( oIndex !== -1 ) {
		outFile = args[ oIndex + 1 ];
		args.splice( oIndex, 2 );
	}
	if ( args.length !== 2 ) {
		return { help: true };
	}
	return { dirA: args[ 0 ], dirB: args[ 1 ], outFile };
}

function main() {
	const { help, dirA, dirB, outFile } = parseArgs( process.argv.slice( 2 ) );
	if ( help ) {
		process.stderr.write( `usage: node ${ process.argv[ 1 ] } <dirA> <dirB> -o <file>\n` );
		process.stderr.write( `       node ${ process.argv[ 1 ] } src php -o tests/JSPHP-suite.json\n` );
		process.exit( 1 );
	}

	const js = parseAnyPath( dirA );
	const php = parseAnyPath( dirB );

	const classNames = js.concat( php ).map( ( c ) => c.name ).sort();
	const classNamesUnique = Array.from( new Set( classNames ) );
	const classes = php.filter( ( c ) => classNamesUnique.includes( c.name ) );

	// Classes with different PHP and JS implementations.
	// We can still compare the PHP-infuse result to JS result, though.
	const infuseOnlyClasses = [
		'ComboBoxInputWidget',
		'SearchInputWidget',
		'RadioSelectInputWidget',
		'CheckboxMultiselectInputWidget',
		'NumberInputWidget',
		'SelectFileInputWidget'
	];

	const testableClasses = classes
		// Can't test abstract classes
		.filter( ( c ) => !c.abstract )
		// Can't test abstract
		.filter( ( c ) => c.parent && c.parent !== 'Theme' )
		// No top-level
		.filter( ( c ) => ![ 'Element', 'Widget', 'Layout', 'Theme' ].includes( c.name ) );

	const simpleString = [ '', 'Foo bar <b>HTML?</b>' ];

	// Values to test for specific config options, when not all values of given type are valid.
	// Empty array will result in no tests for this config option being generated.
	const sensibleValues = new Map( Object.entries( {
		align: [ 'top', 'inline', 'left' ],
		// Could also be 'auto', but this only sets an attribute
		dir: [ 'ltr', 'rtl' ],
		href: [ 'http://example.com/' ],
		'TextInputWidget.type': [ 'text', 'number', 'password', 'foo' ],
		autocomplete: [ true, false, 'foo' ],
		'ButtonInputWidget.type': [ 'button', 'submit', 'foo' ],
		'NumberInputWidget.step': [ '1' ],
		'NumberInputWidget.buttonStep': [ '2' ],
		'NumberInputWidget.pageStep': [ '10' ],
		'NumberInputWidget.min': [ '1', '3' ],
		'NumberInputWidget.max': [ '3', '5' ],
		// This overrides 'string[]|HtmlSnippet[]' from the doc comment
		'FieldLayout.errors': expandTypeToValues( [], 'string[]' ),
		'FieldLayout.notices': expandTypeToValues( [], 'string[]' ),
		'FieldLayout.warnings': [],
		// It is sufficient to test FieldLayout only
		'ActionFieldLayout.errors': [],
		'ActionFieldLayout.notices': [],
		'ActionFieldLayout.warnings': [],
		type: [ 'text', 'button' ],
		method: [ 'GET', 'POST' ],
		inputId: [ 'input-id' ],
		target: [ '_blank' ],
		accessKey: [ 'k' ],
		tabIndex: [ -1, 0, 100, '42' ],
		maxLength: [ 100 ],
		minLength: [ 100 ],
		icon: [ 'image' ],
		indicator: [ 'down' ],
		flags: [ 'progressive', 'primary' ],
		progress: [ 0, 50, 100, false ],
		options: [
			[],
			[ { data: 'a', label: 'A' } ],
			[ { data: 'a' }, { data: 'b' } ],
			[ { data: 'a', label: 'A' }, { data: 'b', label: 'B' } ]
		],
		// Multiselect is not tested anywhere yet
		multiselect: [],
		value: simpleString,
		title: simpleString,
		help: simpleString,
		menuPosition: [ 'before', 'after', 'top', 'bottom', 'invalid' ],
		// Usually makes no sense in JS
		autofocus: [],
		// CheckboxInputWidget: indeterminate makes no DOM changes
		indeterminate: [],
		// Too simple to test?
		action: [],
		enctype: [],
		name: [],
		// Don't try to set value/label on file widgets
		'SelectFileInputWidget.value': [],
		'SelectFileInputWidget.label': [],
		'SelectFileInputWidget.thumbnailSizeLimit': [ 10 ],
		'SelectFileInputWidget.placeholder': [ 'placeholder text' ],
		'SelectFileInputWidget.accept': [ [ 'image/png', 'image/jpeg' ] ],
		// These are defined by Element and would bloat the tests
		classes: [],
		id: [],
		content: [],
		text: [],
		// Test content on basic Panels
		// This overrides 'string[]|HtmlSnippet[]|Element[]' from the doc comment
		'PanelLayout.content': expandTypeToValues( [], 'string[]' ),
		// Only used internally
		preserveContent: [],
		// PHP LabelWidget isn't a TitledElement, so the output is different
		'LabelWidget.invisibleLabel': [],
		// This overrides 'string|HtmlSnippet' from the doc comment
		// TODO: this looks incorrect, this option doesn't look like it takes arrays.
		'TabPanelLayout.name': [ 'panelName' ],
		'TabPanelLayout.label': expandTypeToValues( [], 'string[]' ),
		// IndexLayout overrides contentPanel to be a StackLayout which there
		// are current no test values for, so don't use the inherited type
		// of PanelLayout from MenuLayout.
		'IndexLayout.contentPanel': [],
		// menuPanel contains a TabSelectWidget so must use preserveContent
		'IndexLayout.menuPanel': []
	} ) );

	const tests = {};
	let total = 0;

	for ( const klass of testableClasses ) {
		const className = klass.name;
		tests[ className ] = {
			infuseonly: infuseOnlyClasses.includes( className ),
			tests: []
		};

		const configSourceNames = findConfigSources( classes, className );
		const configSources = configSourceNames
			.map( ( name ) => findClass( classes, name ) )
			.filter( Boolean )
			.map( ( c ) => ( c.methods || [] ).find( ( m ) => m.name === '#constructor' ) );

		let config = [];
		for ( const source of configSources ) {
			if ( source && source.config ) {
				config = config.concat( source.config );
			}
		}
		// Unique by name, preserve order
		const seenConfigNames = new Set();
		config = config.filter( ( opt ) => {
			if ( seenConfigNames.has( opt.name ) ) {
				return false;
			}
			seenConfigNames.add( opt.name );
			return true;
		} );

		const constructor = ( klass.methods || [] ).find( ( m ) => m.name === '#constructor' );
		const requiredConfig = constructor ? ( constructor.params || [] ) : [];

		// Generate every possible configuration of configuration option sets
		const maxLength = Math.min( config.length, 2 );
		let configCombos = [];
		for ( let l = 0; l <= maxLength; l++ ) {
			configCombos = configCombos.concat( combinations( config, l ) );
		}

		// For each set, generate all possible values to use based on option's type
		let expandedCombos = [];
		for ( const subset of configCombos ) {
			const combined = subset.concat( requiredConfig );
			const expandedPerOption = combined.map( ( opt ) => {
				const key = className + '.' + opt.name;
				let values;
				if ( sensibleValues.has( key ) ) {
					values = sensibleValues.get( key );
				} else if ( sensibleValues.has( opt.name ) ) {
					values = sensibleValues.get( opt.name );
				} else {
					values = expandTypeToValues( testableClasses, opt.type );
				}
				return values.map( ( v ) => ( { name: opt.name, type: opt.type, value: v } ) );
			} );
			const tuples = cartesianProduct( expandedPerOption );
			expandedCombos = expandedCombos.concat( tuples );
		}

		const seen = new Set();
		for ( const tuple of expandedCombos ) {
			const key = JSON.stringify( tuple );
			if ( seen.has( key ) ) {
				continue;
			}
			seen.add( key );
			const configObj = {};
			for ( const item of tuple ) {
				configObj[ item.name ] = item.value;
			}
			tests[ className ].tests.push( {
				class: className,
				config: configObj
			} );
		}

		total += tests[ className ].tests.length;
	}

	process.stderr.write( `Generated ${ total } test cases.\n` );
	for ( const [ className, classTests ] of Object.entries( tests ) ) {
		process.stderr.write( `* ${ className }: ${ classTests.tests.length }\n` );
	}

	const json = JSON.stringify( tests, null, 2 ) + '\n';
	if ( outFile ) {
		fs.writeFileSync( outFile, json, { encoding: 'utf-8' } );
	} else {
		process.stdout.write( json );
	}
}

if ( require.main === module ) {
	main();
}
