'use strict';

const fs = require( 'fs' );
const path = require( 'path' );

let badInputSeen = false;

function badInput( file, text ) {
	badInputSeen = true;
	process.stderr.write( `${ file }: unrecognized input: ${ text }\n` );
}

function cleanupClassName( className ) {
	return className.replace( /^OO\.ui\./, '' ).replace( /^mixin\./, '' );
}

function extractDefaultFromDescription( item ) {
	const match = item.description && item.description.match( /\(default: (.+?)\)\s*?$/i );
	if ( !match ) {
		return;
	}
	// Modify `item` in-place
	item.default = match[ 1 ];
	item.description = item.description.slice( 0, match.index );
}

function parseDir( dirName ) {
	const entries = fs.readdirSync( dirName ).sort();
	const out = [];
	for ( const entry of entries ) {
		if ( entry === '.' || entry === '..' ) {
			continue;
		}
		out.push( ...parseAnyPath( path.join( dirName, entry ) ) );
	}
	return out;
}

function maybeInsertEmptyDocblock( text ) {
	// ewwww
	// some docblocks are missing and we really need them
	const match = text.match( /^(class|trait)\b/m );
	if ( !match ) {
		return text;
	}
	const index = match.index;
	const before = text.slice( 0, index );
	if ( before.endsWith( '*/\n' ) ) {
		return text;
	}
	return before + '/**\n*/\n' + text.slice( index );
}

function parseFile( fileName ) {
	if ( !/\.(php|js)$/.test( fileName ) ) {
		return [];
	}
	const fileType = fileName.endsWith( '.php' ) ? 'php' : 'js';
	let text = fs.readFileSync( fileName, { encoding: 'utf-8' } );

	text = maybeInsertEmptyDocblock( text );

	// Find all documentation blocks, together with the following line
	// (unless it contains another docblock)
	const docblockRegex = /\/\*\*[\s\S]+?\*\/\n[ \t]*(?:(?=\/\*\*)|.*)/g;
	const docblocks = text.match( docblockRegex ) || [];

	let currentClass = null;
	const output = [];
	let previousItem = { description: '' }; // Dummy

	for ( const block of docblocks ) {
		let kind = null;
		const data = {
			name: null,
			description: '',
			parent: null,
			mixes: [],
			methods: [],
			properties: [],
			events: [],
			params: [],
			config: [],
			visibility: 'public',
			type: null
		};

		const validForAll = new Set( [ 'name', 'description' ] );
		const validPerKind = {
			class: new Set( [ ...validForAll, 'parent', 'mixes', 'methods', 'properties', 'events', 'abstract' ] ),
			method: new Set( [ ...validForAll, 'params', 'config', 'return', 'visibility', 'static' ] ),
			property: new Set( [ ...validForAll, 'type', 'static' ] ),
			event: new Set( [ ...validForAll, 'params' ] )
		};

		let jsClassConstructor = false;
		let jsClassConstructorDesc = '';
		let phpTraitConstructor = false;
		let parsingPhpConfigOptions = false;
		let ignore = false;

		const splitIndex = block.indexOf( '*/' );
		const comment = splitIndex === -1 ? block : block.slice( 0, splitIndex );
		const codeLine = splitIndex === -1 ? '' : block.slice( splitIndex + 2 );

		for ( let commentLine of comment.split( '\n' ) ) {
			if ( commentLine.trim() === '/**' ) {
				continue;
			}
			// Strip leading '*' and whitespace
			commentLine = commentLine.replace( /^[ \t]*\*[ \t]?/, '' );

			const matchKeyword = commentLine.match( /^@([\w-]+)(?:[ \t]+(.+))?/ );
			const matchPhpConfig = commentLine.match( /^ *- (\S+) &?(?:\.\.\.)?\$config(?:\['(\w+)'\])?( .+)?$/ );

			if ( !matchKeyword && parsingPhpConfigOptions && matchPhpConfig ) {
				const [ , type, config, description ] = matchPhpConfig;
				data.config.push( {
					name: config,
					type: cleanupClassName( type ),
					description: description || ''
				} );
				previousItem = data.config[ data.config.length - 1 ];
				extractDefaultFromDescription( previousItem );
				continue;
			}

			if ( !matchKeyword ) {
				// This is a continuation of previous item's description
				previousItem.description = ( previousItem.description || '' ) + commentLine + '\n';
				if ( fileType === 'php' ) {
					extractDefaultFromDescription( previousItem );
				}
				continue;
			}

			parsingPhpConfigOptions = false;
			const keyword = matchKeyword[ 1 ];
			const content = matchKeyword[ 2 ];

			// Handle JS class/constructor conundrum
			if ( keyword === 'class' || keyword === 'constructor' ) {
				jsClassConstructor = true;
			}

			switch ( keyword ) {
				case 'constructor':
					// Handle JS class/constructor conundrum
					jsClassConstructorDesc = data.description;
					data.description = '';
					kind = 'method';
					break;
				case 'class':
					kind = 'class';
					if ( content && content.trim() !== '' ) {
						data.name = cleanupClassName( content.trim() );
					}
					break;
				case 'method':
					kind = 'method';
					break;
				case 'property':
				case 'var': {
					kind = 'property';
					const match = content && content.match( /^\{?(.+?)\}?( .+)?$/ );
					if ( !match ) {
						badInput( fileName, commentLine );
						break;
					}
					const [ , type, description ] = match;
					data.type = type;
					if ( description ) {
						data.description = description;
					}
					break;
				}
				case 'event':
					kind = 'event';
					data.name = content.trim();
					break;
				case 'extends':
					data.parent = cleanupClassName( content.trim() );
					break;
				case 'mixes':
					data.mixes.push( cleanupClassName( content.trim() ) );
					break;
				case 'param':
					if ( fileType === 'js' ) {
						const match = content.match( /^\{(?:\.\.\.)?(.+?)\} \[?(config\.)?([\w.$]+?)(?:=(.+?))?\]?( .+)?$/ );
						if ( !match ) {
							badInput( fileName, commentLine );
							break;
						}
						const [ , type, isConfig, name, def, description ] = match;
						// Ignore the "Configuration options" parameter
						if ( type === 'Object' && name === 'config' ) {
							break;
						}
						const key = isConfig ? 'config' : 'params';
						data[ key ].push( {
							name,
							type: cleanupClassName( type ),
							description: description || '',
							default: def
						} );
						previousItem = data[ key ][ data[ key ].length - 1 ];
					} else {
						// PHP
						const match = content.match( /^(\S+) &?(?:\.\.\.)?\$(\w+)( .+)?$/ );
						if ( !match ) {
							badInput( fileName, commentLine );
							break;
						}
						const [ , type, name, description ] = match;
						// Ignore the "Configuration options" parameter
						parsingPhpConfigOptions = type === 'array' && name === 'config';
						if ( parsingPhpConfigOptions ) {
							break;
						}
						data.params.push( {
							name,
							type: cleanupClassName( type ),
							description: description || ''
						} );
						previousItem = data.params[ data.params.length - 1 ];
						extractDefaultFromDescription( previousItem );
					}
					break;
				case 'return': {
					let match;
					if ( fileType === 'js' ) {
						match = content && content.match( /^\{(.+?)\}( .+)?$/ );
					} else {
						match = content && content.match( /^(\S+)( .+)?$/ );
					}
					if ( !match ) {
						badInput( fileName, commentLine );
						break;
					}
					const [ , type, description ] = match;
					data.return = {
						type: cleanupClassName( type ),
						description: description || ''
					};
					previousItem = data.return;
					break;
				}
				case 'private':
					data.visibility = 'private';
					break;
				case 'protected':
					data.visibility = 'protected';
					break;
				case 'static':
					data.static = true;
					break;
				case 'abstract':
					data.abstract = true;
					break;
				case 'ignore':
				case 'inheritdoc':
					ignore = true;
					break;
				case 'inheritable':
				case 'deprecated':
				case 'namespace':
				case 'throws':
				case 'chainable':
				case 'fires':
				case 'memberof':
				case 'see':
				case 'uses':
				case 'param-taint':
				case 'suppress':
				case 'phpcs':
					break;
				default:
					if ( /^phan-/.test( keyword ) ) {
						break;
					}
					badInput( fileName, commentLine );
			}
		}

		if ( ignore ) {
			continue;
		}

		if ( codeLine && codeLine.trim() !== '' ) {
			if ( fileType === 'js' ) {
				const match = codeLine.match( /(?:(static|prototype|mixin)\.)?(\w+) =/ );
				if ( !match ) {
					badInput( fileName, codeLine.trim() );
					continue;
				}
				const [ , kindHint, name ] = match;
				if ( kindHint === 'static' ) {
					data.static = true;
				}
				if ( kindHint && !kind ) {
					kind = { static: 'property', prototype: 'method' }[ kindHint ];
				}
				if ( kindHint === 'mixin' ) {
					data.mixin = true;
				}
				data.name = data.name || cleanupClassName( name );
			} else {
				const match = codeLine.match( /\s*(?:(public|protected|private)\s)?(?:(static)\s)?(function\s|class\s|trait\s|\$)(\w+)(?:\sextends\s(\w+))?/ );
				if ( !match ) {
					badInput( fileName, codeLine.trim() );
					continue;
				}
				const [ , visibility, staticKeyword, kindToken, name, parent ] = match;
				const kindTokenTrim = kindToken.trim();
				kind = { $: 'property', function: 'method', class: 'class', trait: 'class' }[ kindTokenTrim ];
				data.visibility = { private: 'private', protected: 'protected', public: 'public' }[ visibility ] || 'public';
				if ( kindTokenTrim === 'trait' ) {
					data.mixin = true;
				}
				if ( staticKeyword ) {
					data.static = true;
				}
				if ( parent ) {
					data.parent = cleanupClassName( parent );
				}
				data.name = data.name || cleanupClassName( name );
				if ( kind === 'method' && data.name === 'initialize' + ( currentClass ? currentClass.name : '' ) ) {
					phpTraitConstructor = true;
				}
			}
		}

		// Handle JS class/constructor conundrum
		if ( kind === 'class' || jsClassConstructor ) {
			if ( currentClass ) {
				output.push( currentClass );
			}
			currentClass = {};
			for ( const [ key, value ] of Object.entries( data ) ) {
				if ( validPerKind.class.has( key ) ) {
					currentClass[ key ] = value;
				}
			}
			if ( jsClassConstructorDesc !== '' ) {
				currentClass.description = jsClassConstructorDesc;
			}
			previousItem = currentClass;
		}

		// Standardize
		// (also handle fake constructors for traits)
		if ( data.name === '__construct' || jsClassConstructor || phpTraitConstructor ) {
			data.name = '#constructor';
		}

		// Put into the current class
		if ( kind && kind !== 'class' ) {
			const destKey = { method: 'methods', property: 'properties', event: 'events' }[ kind ];
			if ( currentClass && destKey ) {
				const filtered = {};
				for ( const [ key, value ] of Object.entries( data ) ) {
					if ( validPerKind[ kind ].has( key ) ) {
						filtered[ key ] = value;
					}
				}
				currentClass[ destKey ].push( filtered );
				previousItem = filtered;
			}
		}
	}

	// This is evil, assumes we only have one class in a file, but we'd need a
	// proper parser to do it better.
	// Note, we remove everything before the first "{\n" to make sure we
	// don't parse `use` imports.
	if ( currentClass && fileType === 'php' ) {
		let stripped = text;
		stripped = stripped.replace( /^[\s\S]+?\{\n/m, '' );
		const useRegex = /^[ \t]*use (\w+)(?: ?\{|;)/gm;
		let match;
		while ( ( match = useRegex.exec( stripped ) ) !== null ) {
			currentClass.mixes.push( cleanupClassName( match[ 1 ] ) );
		}
		// Unique
		currentClass.mixes = Array.from( new Set( currentClass.mixes ) );
	}

	if ( currentClass ) {
		output.push( currentClass );
	}

	return output;
}

function parseAnyPath( inputPath ) {
	let result;
	if ( fs.statSync( inputPath ).isDirectory() ) {
		result = parseDir( inputPath );
	} else {
		result = parseFile( inputPath );
	}
	if ( badInputSeen ) {
		process.stderr.write( 'Unrecognized inputs encountered, stopping.\n' );
		process.exit( 1 );
	}
	return result;
}

module.exports = {
	parseAnyPath
};
