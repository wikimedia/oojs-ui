/*!
 * Colorize SVG files.
 *
 * The task currently doesn't use the standard file specifying methods with this.filesSrc.
 * An option to do it may be added in the future.
 */

'use strict';

const Q = require( 'q' ),
	path = require( 'path' ),
	asyncTask = require( 'grunt-promise-q' );

module.exports = function ( grunt ) {

	/* Classes */

	/**
	 * Destination for images.
	 *
	 * @class Destination
	 *
	 * @constructor
	 * @param {string} imagePath Image path
	 * @param {Object} stylesheetPath Stylesheet file path
	 * @param {string} stylesheetPath.ltr Stylesheet file path, left-to-right
	 * @param {string} stylesheetPath.rtl Stylesheet file path, right-to-left
	 */
	function Destination( imagePath, stylesheetPath ) {
		this.path = imagePath;
		this.stylesheetPath = stylesheetPath;
	}

	/**
	 * Get image destination directory.
	 *
	 * @return {string} Destination path
	 */
	Destination.prototype.getPath = function () {
		return this.path;
	};

	/**
	 * Get path to file of generated LESS stylesheet.
	 *
	 * @param {string} textDirection Text direction to get stylesheet path for, 'ltr' or 'rtl'
	 * @return {string} Destination path
	 */
	Destination.prototype.getStylesheetPath = function ( textDirection ) {
		return this.stylesheetPath[ textDirection ];
	};

	/**
	 * Source image.
	 *
	 * @class Image
	 *
	 * @constructor
	 * @param {Object} list Image list
	 * @param {string} name Image name
	 * @param {Object} data Image options
	 */
	function Image( list, name, data ) {
		this.list = list;
		this.name = name;
		this.file = data.file;
		this.variantNames = ( data.variants || [] )
			.concat( this.list.getVariants().getGlobalVariantNames() )
			.filter( function ( variant, index, variants ) {
				return variants.indexOf( variant ) === index;
			} );
	}

	/**
	 * Generate CSS and images.
	 *
	 * @param {Destination} destination Destination
	 * @return {Q.Promise}
	 */
	Image.prototype.generate = function ( destination ) {
		// TODO Make configurable

		const file = typeof this.file === 'string' ?
				{ ltr: this.file, rtl: this.file } :
				{
					ltr: this.file.ltr || this.file.default,
					rtl: this.file.rtl || this.file.default
				},
			deferred = Q.defer(),
			name = this.name,
			sourcePath = this.list.getPath(),
			destinationPath = destination.getPath(),
			variants = this.list.getVariants(),
			cssClassPrefix = this.list.getCssClassPrefix(),
			cssSelectors = this.list.getCssSelectors(),
			cssPrependPath = this.list.options.cssPrependPath,
			originalSvg = {},
			rules = {
				ltr: [],
				rtl: []
			},
			files = {},
			uncolorizableImages = [],
			unknownVariants = [];

		function getDeclarations( primary ) {
			return '.oo-ui-background-image(' +
				'\'' + ( cssPrependPath || '' ) + primary + '\'' +
				')';
		}

		function variantizeFileName( fileName, variantName ) {
			if ( variantName ) {
				return fileName.replace( /\.(\w+)$/, '-' + variantName + '.$1' );
			}
			return fileName;
		}

		const fileLangs = this.file.lang || {};
		// Expand shorthands:
		// { "en,de,fr": "foo.svg" } → { "en": "foo.svg", "de": "foo.svg", "fr": "foo.svg" }
		const moreLangs = Object.keys( fileLangs ).reduce( function ( langs, langList ) {
			langList.split( ',' ).forEach( function ( lang ) {
				langs[ lang ] = fileLangs[ langList ];
			} );
			return langs;
		}, {} );

		// Original
		const selectorWithoutVariant = cssSelectors.selectorWithoutVariant
			.replace( /{prefix}/g, cssClassPrefix )
			.replace( /{name}/g, name )
			.replace( /{variant}/g, '' );

		for ( const direction in file ) {
			const declarations = getDeclarations( file[ direction ] );
			rules[ direction ].push( selectorWithoutVariant + ' {\n\t' + declarations + '\n}' );

			originalSvg[ direction ] = grunt.file.read(
				path.join( sourcePath, file[ direction ] )
			);
			files[ path.join( destinationPath, file[ direction ] ) ] = originalSvg[ direction ];

			for ( const lang in moreLangs ) {
				// This will not work for selectors ending in a pseudo-element.
				const langSelector = ':lang(' + lang + ')';
				const decls = getDeclarations( moreLangs[ lang ] );
				rules[ direction ].push(
					'/* @noflip */\n' +
					selectorWithoutVariant.replace( /,|$/g, langSelector + '$&' ) +
					' {\n\t' + decls + '\n}'
				);

				originalSvg[ 'lang-' + lang ] = grunt.file.read(
					path.join( sourcePath, moreLangs[ lang ] )
				);
				files[ path.join( destinationPath, moreLangs[ lang ] ) ] = originalSvg[ 'lang-' + lang ];
			}
		}

		// Variants
		this.variantNames.forEach( function ( variantName ) {
			const variant = variants.getVariant( variantName );

			if ( variant === undefined ) {
				unknownVariants.push( variantName );
				return;
			}

			const selectorWithVariant = cssSelectors.selectorWithVariant
				.replace( /{prefix}/g, cssClassPrefix )
				.replace( /{name}/g, name )
				.replace( /{variant}/g, variantName );

			for ( const direction in file ) {
				const declarations = getDeclarations(
					variantizeFileName( file[ direction ], variantName )
				);
				rules[ direction ].push( selectorWithVariant + ' {\n\t' + declarations + '\n}' );

				// TODO: Do this using proper DOM manipulation, not regexp magic
				const variantSvg = originalSvg[ direction ]
					.replace( /<\/title>/, '$&<g fill="' + variant.getColor() + '">' )
					.replace( /<\/svg>/, '</g>$&' );

				if ( originalSvg[ direction ] === variantSvg ) {
					uncolorizableImages.push( file[ direction ] );
					continue;
				}

				const destinationFilePath = path.join(
					destinationPath,
					variantizeFileName( file[ direction ], variantName )
				);
				files[ destinationFilePath ] = variantSvg;

				for ( const lang in moreLangs ) {
					const langSelector = ':lang(' + lang + ')';
					const decls = getDeclarations(
						variantizeFileName( moreLangs[ lang ], variantName )
					);
					rules[ direction ].push(
						'/* @noflip */\n' +
						selectorWithVariant.replace( /,|$/g, langSelector + '$&' ) +
						' {\n\t' + decls + '\n}'
					);

					// TODO: Do this using proper DOM manipulation, not regexp magic
					const variantSvgLang = originalSvg[ 'lang-' + lang ]
						.replace( /<svg[^>]*>/, '$&<g fill="' + variant.getColor() + '">' )
						.replace( /<\/svg>/, '</g>$&' );

					if ( originalSvg[ 'lang-' + lang ] === variantSvgLang ) {
						uncolorizableImages.push( moreLangs[ lang ] );
						continue;
					}

					const destinationFilePathLang = path.join(
						destinationPath,
						variantizeFileName( moreLangs[ lang ], variantName )
					);
					files[ destinationFilePathLang ] = variantSvgLang;
				}
			}
		} );

		if ( unknownVariants.length || uncolorizableImages.length ) {
			if ( unknownVariants.length ) {
				grunt.log.error(
					unknownVariants.length +
					' unknown variants requested: ' +
					unknownVariants.join( ', ' )
				);
			}
			if ( uncolorizableImages.length ) {
				grunt.log.error(
					uncolorizableImages.length +
					' invalid source images: ' +
					uncolorizableImages.join( ', ' )
				);
			}
			deferred.reject( 'Failed to generate some images' );
		} else {
			deferred.resolve( {
				rules: rules,
				files: files
			} );
		}

		return deferred.promise;
	};

	/**
	 * List of source images.
	 *
	 * @class ImageList
	 *
	 * @constructor
	 * @param {string} imagePath Images path
	 * @param {VariantList} variants Variants list
	 * @param {Object} options Additional options
	 * @param {Object} data List of image configurations keyed by name
	 */
	function ImageList( imagePath, variants, options, data ) {
		this.list = {};
		this.path = imagePath;
		this.variants = variants;
		this.options = options;

		for ( const key in data ) {
			this.list[ key ] = new Image( this, key, data[ key ] );
		}
	}

	/**
	 * Get image path.
	 *
	 * @return {string} Image path
	 */
	ImageList.prototype.getPath = function () {
		return this.path;
	};

	/**
	 * Get image variants.
	 *
	 * @return {VariantList} Image variants
	 */
	ImageList.prototype.getVariants = function () {
		return this.variants;
	};

	/**
	 * Get CSS class prefix.
	 *
	 * @return {string} CSS class prefix
	 */
	ImageList.prototype.getCssClassPrefix = function () {
		return this.options.prefix || '';
	};

	/**
	 * Get CSS selectors.
	 *
	 * @return {Object.<string, string>} CSS selectors
	 */
	ImageList.prototype.getCssSelectors = function () {
		return {
			selectorWithoutVariant: this.options.selectorWithoutVariant || '.{prefix}-{name}',
			selectorWithVariant: this.options.selectorWithVariant || '.{prefix}-{name}-{variant}'
		};
	};

	/**
	 * Get CSS file intro.
	 *
	 * @return {string} CSS file intro
	 */
	ImageList.prototype.getCssIntro = function () {
		return this.options.intro || '';
	};

	/**
	 * Get number of images in list.
	 *
	 * @return {number} List length
	 */
	ImageList.prototype.getLength = function () {
		return Object.keys( this.list ).length;
	};

	/**
	 * Generate images and CSS.
	 *
	 * @param {Destination} destination Destination
	 * @return {Q.Promise} Promise resolved with number of generated SVG files
	 */
	ImageList.prototype.generate = function ( destination ) {
		const list = this.list,
			intro = this.getCssIntro();
		return Q.all( Object.keys( this.list ).map( function ( key ) {
			return list[ key ].generate( destination );
		} ) ).then( function ( data ) {
			const dataFormat = {
				files: {},
				rules: {
					ltr: [],
					rtl: []
				}
			};

			data = data.reduce( function ( a, b ) {
				for ( const destinationFilePath in b.files ) {
					// This de-duplicates the entries, as the same file can be used by many Images
					a.files[ destinationFilePath ] = b.files[ destinationFilePath ];
				}
				a.rules.ltr = a.rules.ltr.concat( b.rules.ltr );
				a.rules.rtl = a.rules.rtl.concat( b.rules.rtl );
				return a;
			}, dataFormat );

			for ( const textDirection in data.rules ) {
				const stylesheetPath = destination.getStylesheetPath( textDirection );
				grunt.file.write(
					stylesheetPath,
					intro + '\n' + data.rules[ textDirection ].join( '\n' )
				);
				grunt.log.writeln( 'Created "' + stylesheetPath + '".' );
			}
			for ( const destinationFilePath in data.files ) {
				grunt.file.write( destinationFilePath, data.files[ destinationFilePath ] );
			}

			return Object.keys( data.files ).length;
		} );
	};

	/**
	 * Image variant.
	 *
	 * @class Variant
	 *
	 * @constructor
	 * @param {VariantList} list Variant list
	 * @param {string} name Variant name
	 * @param {Object} data Variant options
	 */
	function Variant( list, name, data ) {
		// Properties
		this.list = list;
		this.name = name;
		this.color = data.color;
		this.global = data.global;
	}

	/**
	 * Check if variant is global.
	 *
	 * @return {boolean} Variant is global
	 */
	Variant.prototype.isGlobal = function () {
		return this.global;
	};

	/**
	 * Get variant color.
	 *
	 * @return {string} CSS color expression
	 */
	Variant.prototype.getColor = function () {
		return this.color;
	};

	/**
	 * List of variants.
	 *
	 * @class VariantList
	 *
	 * @constructor
	 * @param {Object} data List of variant configurations keyed by name
	 */
	function VariantList( data ) {
		this.list = {};
		this.globals = [];

		for ( const key in data ) {
			this.list[ key ] = new Variant( this, key, data[ key ] );
			if ( this.list[ key ].isGlobal() ) {
				this.globals.push( key );
			}
		}
	}

	/**
	 * Get names of global variants.
	 *
	 * @return {string[]} Global variant names
	 */
	VariantList.prototype.getGlobalVariantNames = function () {
		return this.globals;
	};

	/**
	 * Get variant by name.
	 *
	 * @param {string} name Variant name
	 * @return {Variant|undefined} Variant with matching name, or undefined of none exists.
	 */
	VariantList.prototype.getVariant = function ( name ) {
		return this.list[ name ];
	};

	/**
	 * Get number of variants in list.
	 *
	 * @return {number} List length
	 */
	VariantList.prototype.getLength = function () {
		return Object.keys( this.list ).length;
	};

	/**
	 * Image source.
	 *
	 * @class Source
	 *
	 * @constructor
	 * @param {string} imagePath Directory containing source images
	 * @param {Object} images Lists of image configurations
	 * @param {Object} [variants] List of variant configurations, keyed by variant name
	 * @param {Object} [options] Additional options
	 */
	function Source( imagePath, images, variants, options ) {
		this.path = imagePath;
		this.images = images;
		this.variants = variants || {};
		this.options = options || {};
	}

	/**
	 * Get the path to source images directory.
	 *
	 * @return {string} Path
	 */
	Source.prototype.getPath = function () {
		return this.path;
	};

	/**
	 * Get image list.
	 *
	 * @return {ImageList} Image list
	 */
	Source.prototype.getImageList = function () {
		return new ImageList(
			this.path,
			new VariantList( this.variants ),
			this.options,
			this.images
		);
	};

	asyncTask.registerMulti(
		grunt,
		'colorizeSvg',
		'Generate colored variants of SVG images',
		function () {
			const
				data = this.data,
				options = this.options(),
				source = new Source(
					data.srcDir,
					options.images,
					options.variants,
					{
						intro: options.intro,
						prefix: options.prefix,
						cssPrependPath: data.cssPrependPath,
						selectorWithoutVariant: options.selectorWithoutVariant || options.selector,
						selectorWithVariant: options.selectorWithVariant || options.selector
					}
				);

			return source.getImageList().generate(
				new Destination(
					data.destDir,
					data.destLessFile || {
						ltr: path.join( data.destDir, 'images.less' ),
						rtl: path.join( data.destDir, 'images.rtl.less' )
					}
				)
			).then( function ( totalFiles ) {
				grunt.log.writeln( 'Created ' + totalFiles + ' SVG files.' );
			} );
		}
	);

};
