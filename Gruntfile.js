/*!
 * Grunt file
 */

/*jshint node:true */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat-sourcemaps' );
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

				// Concat isn't doing much other than prepending the banner...
				concatCssFiles[ distFile ] = distFile;
			}
		}
	}() );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		clean: {
			dist: 'dist/*'
		},
		recess: {
			dist: {
				options: {
					compile: true
				},
				files: recessFiles
			}
		},
		concat: {
			options: {
				banner: grunt.file.read( 'build/banner.txt' )
			},
			css: {
				files: concatCssFiles
			},
			js: {
				dest: 'dist/oojs-ui.js',
				src: modules['oojs-ui'].scripts
			}
		},
		copy: {
			images: {
				src: 'src/styles/images/**/*.*',
				strip: 'src/styles/images',
				dest: 'dist/images'
			},
			imagesAgora: {
				src: 'src/themes/agora/images/**/*.*',
				strip: 'src/themes/agora/images',
				dest: 'dist/themes/agora/images'
			},
			i18n: {
				src: 'i18n/*.json',
				dest: 'dist'
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			dev: [ '*.js', '{build,demos,src,test}/**/*.js' ],
			dist: 'dist/**/*.js'
		},
		jscs: {
			dev: [
				'<%= jshint.dev %>',
				'!demos/{dist,lib}/**'
			]
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: [
				'{demos,src}/**/*.css',
				'!demos/{dist,lib}/**'
			]
		},
		banana: {
			all: 'i18n/'
		},
		qunit: {
			all: 'test/index.html'
		},
		watch: {
			files: [
				'<%= jshint.dev %>',
				'<%= csslint.all %>',
				'{demos,src}/**/*.less',
				'<%= qunit.all %>',
				'.{csslintrc,jscsrc,jshintignore,jshintrc}'
			],
			tasks: 'test'
		}
	} );

	grunt.registerTask( 'pre-test', function () {
		// Only create Source maps when doing a git-build for testing and local
		// development. Distributions for export should not, as the map would
		// be pointing at "../src".
		grunt.config.set( 'concat.js.options.sourceMap', true );
		grunt.config.set( 'concat.js.options.sourceMapStyle', 'link' );
	} );

	grunt.registerTask( 'pre-git-build', function () {
		var done = this.async();
		require( 'child_process' ).exec( 'git rev-parse HEAD', function ( err, stout, stderr ) {
			if ( !stout || err || stderr ) {
				grunt.log.err( err || stderr );
				done( false );
				return;
			}
			grunt.config.set( 'pkg.version', grunt.config( 'pkg.version' ) + '-pre (' + stout.substr( 0, 10 ) + ')' );
			grunt.verbose.writeln( 'Added git HEAD to pgk.version' );
			done();
		} );
	} );

	grunt.registerTask( 'build', [ 'clean', 'recess', 'concat', 'copy' ] );
	grunt.registerTask( 'git-build', [ 'pre-git-build', 'build' ] );
	grunt.registerTask( 'test', [ 'pre-test', 'git-build', 'jshint', 'jscs', 'csslint', 'banana', 'qunit' ] );
	grunt.registerTask( 'default', 'test' );
};
