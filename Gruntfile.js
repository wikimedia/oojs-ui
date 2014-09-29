/*!
 * Grunt file
 */

/*jshint node:true */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-banana-checker' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat-sourcemaps' );
	grunt.loadNpmTasks( 'grunt-contrib-csslint' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-csscomb' );
	grunt.loadNpmTasks( 'grunt-file-exists' );
	grunt.loadNpmTasks( 'grunt-cssjanus' );
	grunt.loadNpmTasks( 'grunt-jscs' );
	grunt.loadNpmTasks( 'grunt-svg2png' );
	grunt.loadTasks( 'build/tasks' );

	var modules = grunt.file.readJSON( 'build/modules.json' ),
		styleTargets = {
			'oojs-ui-apex': modules['oojs-ui-apex'].styles,
			'oojs-ui-minerva': modules['oojs-ui-minerva'].styles,
			'oojs-ui-mediawiki': modules['oojs-ui-mediawiki'].styles
		},
		lessFiles = {
			default: {},
			svg: {}
		},
		originalLessFiles = {},
		concatCssFiles = {},
		rtlFiles = {
			'demos/styles/demo.rtl.css': 'demos/styles/demo.css'
		};

	( function () {
		var distFile, target, module;
		// We compile LESS copied to a different directory
		function fixLessDirectory( fileName ) {
			return fileName.replace( /^src\//, 'dist-temp/' );
		}
		for ( module in styleTargets ) {
			for ( target in lessFiles ) {
				distFile = target === 'default' ?
					'dist/' + module + '.css' :
					'dist/' + module + '.' + target + '.css';

				originalLessFiles[distFile] = styleTargets[module];
				lessFiles[target][distFile] = styleTargets[module].map( fixLessDirectory );

				// Concat isn't doing much other than prepending the banner...
				concatCssFiles[ distFile ] = distFile;
				rtlFiles[ distFile.replace( '.css', '.rtl.css' ) ] = distFile;
			}
		}
	}() );

	function merge( target/*, sources...*/ ) {
		var
			sources = Array.prototype.slice.call( arguments, 1 ),
			len = sources.length,
			i = 0,
			source, prop;

		for ( ; i < len; i++ ) {
			source = sources[i];
			if ( source ) {
				for ( prop in source ) {
					target[prop] = source[prop];
				}
			}
		}

		return target;
	}

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		clean: {
			dist: 'dist/*',
			temp: 'dist-temp/*'
		},
		fileExists: {
			code: modules['oojs-ui'].scripts,
			apex: [].concat(
				originalLessFiles['dist/oojs-ui-apex.css'],
				originalLessFiles['dist/oojs-ui-apex.svg.css']
			),
			minerva: [].concat(
				originalLessFiles['dist/oojs-ui-minerva.css'],
				originalLessFiles['dist/oojs-ui-minerva.svg.css']
			),
			mediawiki: [].concat(
				originalLessFiles['dist/oojs-ui-mediawiki.css'],
				originalLessFiles['dist/oojs-ui-mediawiki.svg.css']
			)
		},
		less: {
			distDefault: {
				options: {
					ieCompat: true,
					report: 'gzip',
					modifyVars: {
						'oo-ui-default-image-ext': 'png'
					}
				},
				files: lessFiles.default
			},
			distSvg: {
				options: {
					ieCompat: false,
					report: 'gzip',
					modifyVars: {
						'oo-ui-default-image-ext': 'svg'
					}
				},
				files: lessFiles.svg
			}
		},
		cssjanus: {
			dist: {
				files: rtlFiles
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
				files: {
					'dist/oojs-ui.js': modules['oojs-ui'].scripts,
					'dist/oojs-ui-apex.js': modules['oojs-ui-apex'].scripts,
					'dist/oojs-ui-minerva.js': modules['oojs-ui-minerva'].scripts,
					'dist/oojs-ui-mediawiki.js': modules['oojs-ui-mediawiki'].scripts
				}
			}
		},
		csscomb: {
			core: {
				files: {
					'dist/oojs-ui.css': [ 'dist/oojs-ui.css' ],
					'dist/oojs-ui.rtl.css': [ 'dist/oojs-ui.rtl.css' ],
					'dist/oojs-ui.svg.css': [ 'dist/oojs-ui.svg.css' ],
					'dist/oojs-ui.svg.rtl.css': [ 'dist/oojs-ui.svg.rtl.css' ]
				}
			},
			apex: {
				files: {
					'dist/oojs-ui-apex.css': [ 'dist/oojs-ui-apex.css' ],
					'dist/oojs-ui-apex.rtl.css': [ 'dist/oojs-ui-apex.rtl.css' ]
				}
			},
			minerva: {
				files: {
					'dist/oojs-ui-minerva.css': [ 'dist/oojs-ui-minerva.css' ],
					'dist/oojs-ui-minerva.rtl.css': [ 'dist/oojs-ui-minerva.rtl.css' ]
				}
			}
		},
		copy: {
			imagesApex: {
				src: 'src/themes/apex/images/**/*.{png,gif}',
				strip: 'src/themes/apex/images',
				dest: 'dist/themes/apex/images'
			},
			imagesMinerva: {
				src: 'src/themes/minerva/images/**/*.{png,gif}',
				strip: 'src/themes/minerva/images',
				dest: 'dist/themes/minerva/images'
			},
			imagesMediaWiki: {
				src: 'src/themes/mediawiki/images/**/*.{png,gif}',
				strip: 'src/themes/mediawiki/images',
				dest: 'dist/themes/mediawiki/images'
			},
			i18n: {
				src: 'i18n/*.json',
				dest: 'dist'
			},
			lessTemp: {
				src: 'src/**/*.less',
				strip: 'src',
				dest: 'dist-temp'
			},
			svg: {
				src: 'dist-temp/**/*.svg',
				strip: 'dist-temp',
				dest: 'dist'
			}
		},
		colorizeSvg: {
			imagesApex: {
				options: merge(
					grunt.file.readJSON( 'build/images.json' ),
					grunt.file.readJSON( 'src/themes/apex/images.json' )
				),
				files: {
					src: 'src/themes/apex/images',
					dest: 'dist-temp/themes/apex/images'
				}
			},
			imagesMinerva: {
				options: merge(
					grunt.file.readJSON( 'build/images.json' ),
					grunt.file.readJSON( 'src/themes/minerva/images.json' )
				),
				files: {
					src: 'src/themes/minerva/images',
					dest: 'dist-temp/themes/minerva/images'
				}
			},
			imagesMediaWiki: {
				options: merge(
					grunt.file.readJSON( 'build/images.json' ),
					grunt.file.readJSON( 'src/themes/mediawiki/images.json' )
				),
				files: {
					src: 'src/themes/mediawiki/images',
					dest: 'dist-temp/themes/mediawiki/images'
				}
			}
		},
		svg2png: {
			images: {
				files: [
					{
						cwd: 'dist/',
						src: '**/*.svg',
						dest: 'dist/'
					}
				]
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			dev: [ '*.js', '{build,demos,src,tests}/**/*.js' ],
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
			all: 'tests/index.html'
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

	grunt.registerTask( 'build', [
		'clean',
		'fileExists', // src
		'copy:lessTemp', 'colorizeSvg', // src → dist-temp
		'less', 'copy:svg', // dist-temp → dist
		'copy:imagesApex', 'copy:imagesMinerva', 'copy:imagesMediaWiki', // src → dist
		'copy:i18n', // i18n → dist
		'concat', 'cssjanus', 'csscomb', 'svg2png' // dist → dist
	] );
	grunt.registerTask( 'git-build', [ 'pre-git-build', 'build' ] );
	grunt.registerTask( 'lint', [ 'jshint', 'jscs', 'csslint', 'banana' ] );
	grunt.registerTask( 'test', [ 'pre-test', 'git-build', 'lint', 'qunit' ] );
	grunt.registerTask( 'default', 'test' );
};
