/*!
 * Check for missing message documentation
 *
 * Concatenates the list of input files, and performs
 * version/date placeholder replacements.
 */

/*jshint node:true */
module.exports = function ( grunt ) {
	grunt.registerMultiTask( 'messageDocumentation', function () {
		var path = require( 'path' ),
			options = this.options( {
				sourceFile: 'en.json',
				documentationFile: 'qqq.json'
			} ),
			messageCount = 0,
			ok = true;

		this.filesSrc.forEach( function ( dir ) {
			var documentationMessagesMetadataIndex,
				sourceMessagesMetadataIndex,
				documentationMessages = grunt.file.readJSON( path.resolve( dir, options.documentationFile ) ),
				documentationMessageKeys = Object.keys( documentationMessages ),
				sourceMessages = grunt.file.readJSON( path.resolve( dir, options.sourceFile ) ),
				sourceMessageKeys = Object.keys( sourceMessages ),
				failedMessageCount = 0;

			messageCount += sourceMessageKeys.length;

			sourceMessagesMetadataIndex = sourceMessageKeys.indexOf( '@metadata' );
			if ( sourceMessagesMetadataIndex === -1 ) {
				grunt.log.error( 'Source file lacks a metadata block.' );
				ok = false;
				return;
			}
			sourceMessageKeys.splice( sourceMessagesMetadataIndex, 1 );

			documentationMessagesMetadataIndex = documentationMessageKeys.indexOf( '@metadata' );
			if ( documentationMessagesMetadataIndex === -1 ) {
				grunt.log.error( 'Documentation file lacks a metadata block.' );
				ok = false;
				return;
			}
			documentationMessageKeys.splice( documentationMessagesMetadataIndex, 1 );

			sourceMessageKeys.forEach( function ( msgKey ) {
				if ( documentationMessageKeys.indexOf( msgKey ) === -1 ) {
					grunt.log.error( 'Message "' + msgKey + '" lacks documentation.' );
					failedMessageCount++;
				}
			} );

			if ( failedMessageCount > 0 ) {
				grunt.log.error(
					failedMessageCount + ' message' + ( failedMessageCount > 1 ? 's lack' : ' lacks' ) +
						' documentation.'
				);
				ok = false;
			}
		} );

		if ( !ok ) {
			return false;
		}

		grunt.log.ok( messageCount + ' message' + ( messageCount > 1 ? 's' : '') + ' checked.' );
	} );
};
