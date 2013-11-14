/*!
 * Build a distribution file
 *
 * Concatenates the list of input files, and performs
 * version/date placeholder replacements.
 */

/*jshint node:true */
module.exports = function ( grunt ) {

	grunt.registerMultiTask( 'concat', function () {
		var variant,
			variantVersion,
			variantFileName,
			isBad = false,
			compiled = {
				'default': ''
			},
			fileName = this.data.dest,
			src = this.data.src,
			version = grunt.config( 'pkg.version' );

		src.forEach( function ( filepath ) {
			var variant, text;

			if ( typeof filepath !== 'object' ) {
				filepath = { 'default': filepath };
			}

			for ( variant in filepath ) {
				if ( compiled[variant] === undefined ) {
					compiled[variant] = compiled['default'];
				}

				text = grunt.file.read( __dirname + '/../../' + filepath[variant] );

				// Ensure files use only \n for line endings, not \r\n
				if ( /\x0d\x0a/.test( text ) ) {
					grunt.log.error( filepath + ': Incorrect line endings (\\r\\n)' );
					isBad = true;
				}

				compiled[variant] += text;
			}
		} );

		if ( isBad ) {
			return false;
		}

		for ( variant in compiled ) {

			if ( variant === 'default' ) {
				variantVersion = version;
				variantFileName = fileName;
			} else {
				// Transform:
				// - "v1.0.0-pre (hash)" -> "v1.0.0-pre-variant (git)"
				// - "v1.0.0"            -> "v1.0.0-variant"
				variantVersion = version.replace(/(\s|$)/, '-' + variant + '$1');

				// Turn example.foo.css into example.foo.variant.css
				variantFileName = fileName.split('.');
				variantFileName.splice( -1, 0, variant );
				variantFileName = variantFileName.join('.');
			}

			// Replace version and date placeholders
			compiled[variant] = compiled[variant].replace( /@VERSION/g, variantVersion ).replace( /@DATE/g, new Date() );

			grunt.file.write( variantFileName, compiled[variant] );
			grunt.log.ok( 'File "' + variantFileName + '" created.' );
		}

		// Fail task if errors were logged.
		if ( this.errorCount ) {
			return false;
		}

	} );

};
