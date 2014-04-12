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
	grunt.loadNpmTasks( 'grunt-banana-checker' );
	grunt.loadNpmTasks( 'grunt-jscs-checker' );
	grunt.loadNpmTasks( 'grunt-recess' );
	grunt.loadTasks( 'build/tasks' );

	var modules = grunt.file.readJSON( 'build/modules.json' ),
		moduleUtils = require( './build/moduleUtils' ),
		styleTargets = {
			'oojs-ui': moduleUtils.expandResources( modules['oojs-ui'].styles ),
			'oojs-ui-apex': moduleUtils.expandResources( modules['oojs-ui-apex'].styles ),
			'oojs-ui-agora': moduleUtils.expandResources( modules['oojs-ui-agora'].styles )
		},
		recessFiles = {},
		concatCssFiles = {};
		( function () {
			var distFile, target, module;
			for ( module in styleTargets ) {
				for ( target in styleTargets[module] ) {
					distFile = target === 'default' ?
						'dist/' + module + '.css' :
						'dist/' + module + '.' + target + '.css';

					recessFiles[distFile] = styleTargets[module][target];

					// Concat isn't doing much other than expanding v@VERSION...
					concatCssFiles[ module + '-css-' + target ] = {
						dest: distFile,
						src: [ distFile ]
					};
				}
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
		jscs: {
			src: [
				'<%= jshint.all %>',
				'!demos/{dist,lib}/**',
				'!src/intro.js',
				'!src/outro.js'
			]
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: [
				'{demos,src}/**/*.css',
				'!demos/{dist,lib}/**'
			],
		},
		banana: {
			all: 'i18n/'
		},
		qunit: {
			all: ['test/index.html']
		},
		watch: {
			files: [
				'<%= jshint.all %>',
				'<%= csslint.all %>',
				'{demos,src}/**/*.less',
				'<%= qunit.all %>',
				'.{jshintrc,jshintignore}'
			],
			tasks: ['test']
		}
	} );

	grunt.registerTask( 'build', ['clean', 'recess', 'concat', 'copy'] );
	grunt.registerTask( 'test', ['git-build', 'build', 'jshint', 'jscs', 'csslint', 'banana', 'qunit'] );
	grunt.registerTask( 'default', 'test' );
};
