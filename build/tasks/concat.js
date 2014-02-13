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
			var variant, text, buffer;

			if ( typeof filepath !== 'object' ) {
				filepath = { 'default': filepath };
			}

			// Store buffer before we enter this loop so that when we branch for a new variant,
			// that variant must not include the "default" chunk for filepath currently being
			// iterated over. This can happen when the loop iterates over 'default' first.
			// This avoids a bug where the following filepath would result in "foo" containing both
			// default and foo, whereas "bar" would correctly only contain bar:
			//     { bar: 'bar.css', default: 'fallback.css', foo: 'foo.css' }
			buffer = compiled['default'];

			for ( variant in filepath ) {
				text = grunt.file.read( __dirname + '/../../' + filepath[variant] );

				// Ensure files use only \n for line endings, not \r\n
				if ( /\x0d\x0a/.test( text ) ) {
					grunt.log.error( filepath + ': Incorrect line endings (\\r\\n)' );
					isBad = true;
				}

				if ( compiled[variant] === undefined ) {
					// Discovered new variant. Branch from the default variant.
					compiled[variant] = buffer;
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
