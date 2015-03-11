/*!
 * Colorize SVG files.
 *
 * The task currently doesn't use the standard file specifying methods with this.filesSrc.
 * An option to do it may be added in the future.
 *
 *
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
			var originals = 0,
				data = this.data,
				options = this.options(),
				source = new Source(
					data.srcDir,
					options.images,
					options.variants,
					options.css
				),
				imageLists = source.getImageLists();

			return Q.all( Object.keys( imageLists ).map( function ( type ) {
				originals += imageLists[ type ].getLength();
				return imageLists[ type ].generate(
					new Destination( path.join( data.destDir, imageLists[ type ].css.path || type ), type )
				);
			} ) ).then( function ( sums ) {
				grunt.log.writeln(
					'Processed ' + originals + ' original SVG files into ' +
					sums.reduce( function ( a, b ) {
						return a + b;
					} ) +
					' additional color variants.'
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
	 * @param {Object} images Lists of image configurations, keyed by type
	 * @param {Object} variants List of variant configurations, keyed by type and variant name
	 * @param {Object} css List of CSS class configurations, keyed by type
	 */
	function Source( path, images, variants, css ) {
		this.path = path;
		this.images = images;
		this.variants = variants;
		this.css = css;
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
	 * Get image lists for each type.
	 *
	 * @return {Object.<string,ImageList>} Image lists
	 */
	Source.prototype.getImageLists = function () {
		var type,
			lists = {};

		for ( type in this.images ) {
			lists[ type ] = new ImageList(
				path.join( this.path, ( this.css[ type ] || {} ).path || type ),
				new VariantList( this.variants[ type ] || {} ),
				this.css[ type ] || {},
				this.images[ type ]
			);
		}

		return lists;
	};

	/**
	 * Destination for images.
	 *
	 * @class
	 *
	 * @constructor
	 * @param {string} path Image path
	 * @param {string} [stylesheetName] Stylesheet file name
	 */
	function Destination( path, stylesheetName ) {
		this.path = path;
		this.stylesheetName = stylesheetName || path.basename( this.path );
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
		return path.join( this.path, this.stylesheetName + '.less' );
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

		var params,
			deferred = Q.defer(),
			errors = 0,
			file = this.file,
			name = this.name,
			fileExtension = path.extname( file ),
			fileExtensionBase = fileExtension.slice( 1 ),
			fileNameBase = path.basename( file, fileExtension ),
			filePath = path.join( this.list.getPath(), file ),
			// TODO This should be configurable in task config, like in CSSJanus
			flippable = flipPath( filePath ) !== filePath,
			variable = fileExtensionBase.toLowerCase() === 'svg',
			variants = this.list.getVariants(),
			cssClassPrefix = this.list.getCssClassPrefix(),
			rules = [],
			uncolorizableImages = [],
			unknownVariants = [];

		// Original
		params = [ name, fileNameBase ];
		if ( !variable ) {
			params.push( fileExtensionBase );
		}
		grunt.file.copy( filePath, path.join( destination.getPath(), file ) );
		if ( flippable ) {
			grunt.file.copy(
				flipPath( filePath ),
				flipPath( path.join( destination.getPath(), file ) )
			);
		}
		rules.push( cssClassPrefix + '( ' + params.join( ', ' ) + ' );' );

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

				params = [ name, fileNameBase, variantName ];
				grunt.file.write(
					path.join(
						destination.getPath(),
						fileNameBase + '-' + variantName + fileExtension
					),
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
						flipPath( path.join(
							destination.getPath(),
							fileNameBase + '-' + variantName + fileExtension
						) ),
						variantSvg
					);
					// TODO Report the correct number of files processed when flipping
				}
				return cssClassPrefix + '-variant' + '( ' + params.join( ', ' ) + ' );';
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
	 * @param {Object} css CSS class configuration
	 * @param {Object} data List of image configurations keyed by name
	 */
	function ImageList( path, variants, css, data ) {
		var key;

		this.list = {};
		this.path = path;
		this.variants = variants;
		this.css = css;

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
		return this.css.classPrefix || '';
	};

	/**
	 * Get CSS file intro.
	 *
	 * @return {string} CSS file intro
	 */
	ImageList.prototype.getCssIntro = function () {
		return this.css.intro || '';
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
