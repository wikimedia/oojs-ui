/*!
 * Grunt file
 */

/*jshint node:true */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-csslint' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-recess' );
	grunt.loadTasks( 'build/tasks' );

	var modules = grunt.file.readJSON( 'build/modules.json' ),
		moduleUtils = require( './build/moduleUtils' ),
		styleTargets = moduleUtils.expandResources( modules['oojs-ui'].styles ),
		recessFiles = {},
		concatCssFiles = {};
		( function () {
			var distFile, target;
			for ( target in styleTargets ) {

				distFile = target === 'default' ?
					'dist/oojs-ui.css' :
					'dist/oojs-ui.' + target + '.css';

				recessFiles[ distFile ] = styleTargets[ target ];

				// Concat isn't doing much other than expanding v@VERSION...
				concatCssFiles[ 'css-' + target ] = {
					dest: distFile,
					src: [ distFile ]
				};
			}
		}() );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		clean: {
			dist: ['dist/*/', 'dist/*.*']
		},
		recess: {
			dist: {
				options: {
					compile: true
				},
				files: recessFiles
			}
		},
		concat: grunt.util._.extend( concatCssFiles, {
			js: {
				dest: 'dist/oojs-ui.js',
				src: modules['oojs-ui'].scripts
			}
		} ),
		copy: {
			images: {
				src: 'src/styles/images/**/*.*',
				strip: 'src/styles/images',
				dest: 'dist/images'
			},
			i18n: {
				src: 'i18n/*.json',
				dest: 'dist'
			}
		},
		jshint: {
			options: JSON.parse( grunt.file.read( '.jshintrc' )
				.replace( /\/\*(?:(?!\*\/)[\s\S])*\*\//g, '' ).replace( /\/\/[^\n\r]*/g, '' ) ),
			all: ['*.js', '{build,demos,dist,src,test}/**/*.js']
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: '{demos,src}/**/*.css',
		},
		qunit: {
			all: ['test/index.html']
		},
		watch: {
			files: [
				'<%= jshint.all %>',
				'<%= csslint.all %>',
				'<%= qunit.all %>',
				'.{jshintrc,jshintignore}'
			],
			tasks: ['test']
		}
	} );

	grunt.registerTask( 'build', ['clean', 'recess', 'concat', 'copy'] );
	grunt.registerTask( 'test', ['git-build', 'build', 'jshint', 'csslint', 'qunit'] );
	grunt.registerTask( 'default', 'test' );
};
