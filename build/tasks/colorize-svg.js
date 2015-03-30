/*!
 * Colorize SVG files.
 *
 * The task currently doesn't use the standard file specifying methods with this.filesSrc.
 * An option to do it may be added in the future.
 */

/*jshint node:true */

var Q = require( 'q' ),
	path = require( 'path' ),
	asyncTask = require( 'grunt-promise-q' );

module.exports = function ( grunt ) {

	asyncTask.registerMulti(
		grunt,
		'colorizeSvg',
		'Generate colored variants of SVG images',
		function () {
			var
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
				),
				imageList = source.getImageList(),
				originals = imageList.getLength();

			return imageList.generate(
				new Destination(
					data.destDir,
					data.destLessFile || path.join( data.destDir, 'images.less' )
				)
			).then( function ( processed ) {
				grunt.log.writeln(
					'Processed ' + originals + ' original SVG files into ' +
					processed + ' additional color variants.'
				);
			} );
		}
	);

	/* Classes */

	/**
	 * Image source.
	 *
	 * @class
	 *
	 * @constructor
	 * @param {string} path Directory containing source images
	 * @param {Object} images Lists of image configurations
	 * @param {Object} [variants] List of variant configurations, keyed by variant name
	 * @param {Object} [options] Additional options
	 */
	function Source( path, images, variants, options ) {
		this.path = path;
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
	 * @return ImageList Image list
	 */
	Source.prototype.getImageList = function () {
		return new ImageList(
			this.path,
			new VariantList( this.variants ),
			this.options,
			this.images
		);
	};

	/**
	 * Destination for images.
	 *
	 * @class
	 *
	 * @constructor
	 * @param {string} path Image path
	 * @param {string} stylesheetPath Stylesheet file path
	 */
	function Destination( path, stylesheetPath ) {
		this.path = path;
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
	 * Get path to file of generated Less stylesheet.
	 *
	 * @return {string} Destination path
	 */
	Destination.prototype.getStylesheetPath = function () {
		return this.stylesheetPath;
	};

	/**
	 * Source image.
	 *
	 * @class
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
	 * @return {Q.Promise} Promise resolved with generated CSS rules for original images and
	 *   generated image variants
	 */
	Image.prototype.generate = function ( destination ) {
		function flipPath( filePath ) {
			return filePath.replace( /-(ltr|rtl).svg$/, function ( match ) {
				return '-' + ( match[1] === 'rtl' ? 'ltr' : 'rtl' ) + '.svg';
			} );
		}

		// TODO Make configurable
		function getDeclarations( svg, fallback ) {
			return '.oo-ui-background-image-svg2(' +
				'\'' + ( cssPrependPath || '' ) + svg + '\', ' +
				'\'' + ( cssPrependPath || '' ) + fallback + '\'' +
				')';
		}

		var selector, declarations, destinationFilePath,
			deferred = Q.defer(),
			errors = 0,
			file = this.file,
			name = this.name,
			fileExtension = path.extname( file ),
			filePath = path.join( this.list.getPath(), file ),
			// TODO This should be configurable in task config, like in CSSJanus
			flippable = flipPath( filePath ) !== filePath,
			variable = fileExtension.toLowerCase() === '.svg',
			fallbackFile = variable ? file.replace( '.svg', '.png' ) : file,
			variants = this.list.getVariants(),
			cssClassPrefix = this.list.getCssClassPrefix(),
			cssSelectors = this.list.getCssSelectors(),
			cssPrependPath = this.list.options.cssPrependPath,
			rules = [],
			uncolorizableImages = [],
			unknownVariants = [];

		// Original
		destinationFilePath = path.join( destination.getPath(), file );
		selector = cssSelectors.selectorWithoutVariant
			.replace( /{prefix}/g, cssClassPrefix )
			.replace( /{name}/g, name )
			.replace( /{variant}/g, '' );
		declarations = getDeclarations( file, fallbackFile );
		rules.push( selector + ' {\n\t' + declarations + '\n}' );

		grunt.file.copy( filePath, destinationFilePath );
		if ( flippable ) {
			grunt.file.copy(
				flipPath( filePath ),
				flipPath( destinationFilePath )
			);
		}

		// Variants
		if ( variable ) {
			rules = rules.concat( this.variantNames.map( function ( variantName ) {
				var originalSvg, variantSvg,
					variant = variants.getVariant( variantName );

				if ( variant === undefined ) {
					unknownVariants.push( variantName );
					errors++;
					return;
				}

				originalSvg = grunt.file.read( filePath );
				// TODO: Do this in a safer and more clever way
				variantSvg = originalSvg.replace(
					/<svg[^>]*>/, '$&<style>* { fill: ' + variant.getColor() + ' }</style>'
				);

				if ( originalSvg === variantSvg ) {
					uncolorizableImages.push( file );
					errors++;
					return;
				}

				destinationFilePath = path.join(
					destination.getPath(),
					file.replace( fileExtension, '-' + variantName + fileExtension )
				);
				selector = cssSelectors.selectorWithVariant
					.replace( /{prefix}/g, cssClassPrefix )
					.replace( /{name}/g, name )
					.replace( /{variant}/g, variantName );
				declarations = getDeclarations(
					file.replace( fileExtension, '-' + variantName + fileExtension ),
					file.replace( fileExtension, '-' + variantName + ( variable ? '.png' : fileExtension ) )
				);

				grunt.file.write(
					destinationFilePath,
					variantSvg
				);

				if ( flippable ) {
					originalSvg = grunt.file.read( flipPath( filePath ) );
					variantSvg = originalSvg.replace(
						/<svg[^>]*>/, '$&<style>* { fill: ' + variant.getColor() + ' }</style>'
					);

					if ( originalSvg === variantSvg ) {
						uncolorizableImages.push( flipPath( file ) );
						errors++;
						return;
					}

					grunt.file.write(
						flipPath( destinationFilePath ),
						variantSvg
					);
					// TODO Report the correct number of files processed when flipping
				}
				return selector + ' {\n\t' + declarations + '\n}';
			} ) );
		}

		if ( errors ) {
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
			deferred.reject( 'Failed to generate ' + errors + ' images' );
		} else {
			deferred.resolve( rules );
		}

		return deferred.promise;
	};

	/**
	 * List of source images.
	 *
	 * @class
	 *
	 * @constructor
	 * @param {string} path Images path
	 * @param {VariantList} variants Variants list
	 * @param {Object} options Additional options
	 * @param {Object} data List of image configurations keyed by name
	 */
	function ImageList( path, variants, options, data ) {
		var key;

		this.list = {};
		this.path = path;
		this.variants = variants;
		this.options = options;

		for ( key in data ) {
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
	 * @return {VariantsList} Image variants
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
	 * @return {Q.Promise} Promise resolved with number of generated CSS rules for original images
	 *   and generated image variants
	 */
	ImageList.prototype.generate = function ( destination ) {
		var list = this.list,
			intro = this.getCssIntro();
		return Q.all( Object.keys( this.list ).map( function ( key ) {
			return list[ key ].generate( destination );
		} ) ).then( function ( rules ) {
			var stylesheetPath = destination.getStylesheetPath();
			grunt.file.write( stylesheetPath, intro + '\n' + rules.map( function ( value ) {
				return value.join( '\n' );
			} ).join( '\n' ) );
			grunt.log.writeln( 'Created "' + path.basename( stylesheetPath ) + '".' );
			return rules.length;
		} );
	};

	/**
	 * Image variant.
	 *
	 * @class
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
	 * @class
	 *
	 * @constructor
	 * @param {Object} list List of variant configurations keyed by name
	 */
	function VariantList( data ) {
		var key;

		this.list = {};
		this.globals = [];

		for ( key in data ) {
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

};
