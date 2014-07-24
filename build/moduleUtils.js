/*!
 * Utility methods for interpreting the modules.json manifest.
 */

/*jshint node:true */
module.exports = {
	/**
	 * Expand an array of file paths and variant-objects into
	 * a flattened list by variant.
	 *
	 *     input = [
	 *         'foo.js',
	 *         'bar.js',
	 *         { default: 'baz-fallback.js', svg: 'baz-svg.js', }.
	 *         'quux.js'
	 *     ]
	 *
	 *     output = {
	 *         default: [
	 *             'foo.js',
	 *             'bar.js'
	 *             'baz-fallback.js'
	 *             'quux.js'
	 *         ],
	 *         svg: [
	 *             'foo.js',
	 *             'bar.js'
	 *             'baz-svg.js'
	 *             'quux.js'
	 *         ]
	 *     ]
	 *
	 * @param {Array} resources List of expandable resources
	 * @return {Array} Flat list of file paths
	 */
	expandResources: function ( resources ) {
		// Figure out what the different css targets will be,
		// we need this to be shared between the recess task
		// (which will compile the less code) and the concat task
		// (which will prepend intro.css without it being stripped
		// like recess would).
		var targets = { default: [] };
		resources.forEach( function ( filepath ) {
			var variant, buffer;
			if ( typeof filepath !== 'object' ) {
				filepath = { default: filepath };
			}
			// Fetch copy of buffer before filepath/variant loop, otherwise
			// it can incorrectly include the default file in a non-default variant.
			buffer = targets.default.slice();
			for ( variant in filepath ) {
				if ( !targets[ variant ] ) {
					targets[ variant ] = buffer.slice();
				}
				targets[ variant ].push( filepath[ variant ] );
			}

		} );
		return targets;
	}
};
