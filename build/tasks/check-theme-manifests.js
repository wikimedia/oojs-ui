/*!
 * Ensure icon/indicator manifests match between themes.
 */

'use strict';

module.exports = function ( grunt ) {
	grunt.registerTask( 'check-theme-manifests', 'Check theme icon/indicator manifest parity', () => {
		const themeNames = [ 'wikimediaui', 'apex' ];

		const allFiles = new Set();
		const themeFiles = {};
		for ( const themeName of themeNames ) {
			const files = grunt.file.expand( { cwd: 'src/themes/' + themeName }, [ '*.json' ] );
			themeFiles[ themeName ] = files;
			files.forEach( ( file ) => allFiles.add( file ) );
		}

		const errors = [];
		[ 'icons', 'indicators' ].forEach( ( type ) => {
			const allKeys = new Set();
			const keysByTheme = {};
			for ( const themeName of themeNames ) {
				keysByTheme[ themeName ] = keysByTheme[ themeName ] || new Set();
				for ( const fileName of allFiles ) {
					const filePath = 'src/themes/' + themeName + '/' + fileName;
					const manifest = grunt.file.readJSON( filePath );
					const manifestType = ( manifest.selectorWithoutVariant || manifest.prefix ).includes( 'indicator' ) ? 'indicators' : 'icons';
					if ( manifestType !== type ) {
						continue;
					}
					const keys = Object.keys( manifest.images );
					keys.forEach( ( key ) => keysByTheme[ themeName ].add( key ) );
					keys.forEach( ( key ) => allKeys.add( key ) );
				}
			}

			for ( const key of allKeys ) {
				const missingInThemes = themeNames.filter( ( themeName ) => (
					!keysByTheme[ themeName ].has( key )
				) );
				if ( missingInThemes.length ) {
					errors.push(
						`'${ key }' missing in ${ missingInThemes.join( ', ' ) } ${ type }`
					);
				}
			}
		} );

		if ( errors.length ) {
			errors.forEach( ( line ) => grunt.log.error( line ) );
			grunt.fatal( 'Theme icon/indicator manifest mismatch.' );
		}

		grunt.log.ok( 'Theme icon/indicator manifests match.' );
	} );
};
