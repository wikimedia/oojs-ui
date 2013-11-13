/*!
 * Build a distribution file
 *
 * Concatenates the list of input files, and performs
 * version/date placeholder replacements.
 */

/*jshint node:true */
module.exports = function ( grunt ) {

	grunt.registerMultiTask( 'build', function () {
		var isBad = false,
			compiled = '',
			name = this.data.dest,
			src = this.data.src,
			version = grunt.config( 'pkg.version' );

		src.forEach( function ( filepath ) {
			var text = grunt.file.read( __dirname + '/../../' + filepath );

			// Ensure files use only \n for line endings, not \r\n
			if ( /\x0d\x0a/.test( text ) ) {
				grunt.log.error( filepath + ': Incorrect line endings (\\r\\n)' );
				isBad = true;
			}

			compiled += text;
		} );

		if ( isBad ) {
			return false;
		}

		// Replace version and date placeholders
		compiled = compiled.replace( /@VERSION/g, version ).replace( /@DATE/g, new Date() );

		grunt.file.write( name, compiled );

		// Fail task if errors were logged.
		if ( this.errorCount ) {
			return false;
		}

		grunt.log.ok( 'File "' + name + '" created.' );
	} );
};
