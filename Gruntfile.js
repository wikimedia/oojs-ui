/*!
 * Grunt file
 */

/*jshint node:true */
module.exports = function ( grunt ) {
	var modules = grunt.file.readYAML( 'build/modules.yaml' ),
		pkg = grunt.file.readJSON( 'package.json' ),
		themes = {
			apex: 'Apex',
			mediawiki: 'MediaWiki'
		},
		lessFiles = {},
		colorizeSvgFiles = {},
		requiredFiles = [],
		concatCssFiles = {},
		rtlFiles = {},
		lessTarget = grunt.option( 'graphics' ) || 'mixed',
		minBanner = '/*! OOjs UI v<%= pkg.version %> | http://oojs.mit-license.org */';

	grunt.loadNpmTasks( 'grunt-jsonlint' );
	grunt.loadNpmTasks( 'grunt-banana-checker' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-csslint' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-csscomb' );
	grunt.loadNpmTasks( 'grunt-exec' );
	grunt.loadNpmTasks( 'grunt-file-exists' );
	grunt.loadNpmTasks( 'grunt-cssjanus' );
	grunt.loadNpmTasks( 'grunt-jscs' );
	grunt.loadNpmTasks( 'grunt-tyops' );
	grunt.loadNpmTasks( 'grunt-karma' );
	grunt.loadNpmTasks( 'grunt-svg2png' );
	grunt.loadTasks( 'build/tasks' );

	( function () {
		var module, theme;
		function themify( str ) {
			return str.replace( /\{theme\}/g, theme ).replace( /\{Theme\}/g, themes[ theme ] );
		}
		for ( module in modules ) {
			if ( module.indexOf( '{theme}' ) !== -1 || module.indexOf( '{Theme}' ) !== -1 ) {
				for ( theme in themes ) {
					modules[ themify( module ) ] = {};
					if ( modules[ module ].scripts ) {
						modules[ themify( module ) ].scripts = modules[ module ].scripts.map( themify );
					}
					if ( modules[ module ].styles ) {
						modules[ themify( module ) ].styles = modules[ module ].styles.map( themify );
					}
				}
				delete modules[ module ];
			}
		}
	}() );

	( function () {
		var module;
		for ( module in modules ) {
			requiredFiles.push.apply( requiredFiles, modules[ module ].scripts || [] );
			requiredFiles.push.apply( requiredFiles, modules[ module ].styles || [] );
		}
	}() );

	( function () {
		var distFile, module, moduleStyleFiles;
		function rtlPath( fileName ) {
			return fileName.replace( /\.(\w+)$/, '.rtl.$1' );
		}
		// Generate all task targets required to process given file into a pair of CSS files (for LTR
		// and RTL), and return file name of LTR file.
		function processFile( fileName ) {
			var lessFileName, cssFileName, theme, path;
			path = require( 'path' );
			if ( path.extname( fileName ) === '.json' ) {
				lessFileName = fileName.replace( /\.json$/, '.less' ).replace( /^src/, 'dist/tmp' );
				theme = path.basename( path.dirname( fileName ) );

				colorizeSvgFiles[ fileName.replace( /.+\/(\w+)\/([\w-]+)\.(?:json|less)$/, '$1-$2' ) ] = {
					options: grunt.file.readJSON( fileName ),
					srcDir: 'src/themes/' + theme,
					destDir: 'dist/themes/' + theme,
					// This should not be needed, but our dist directory structure is weird
					cssPrependPath: 'themes/' + theme + '/',
					destLessFile: {
						ltr: lessFileName,
						rtl: rtlPath( lessFileName )
					}
				};

				cssFileName = fileName.replace( /\.json$/, '.css' ).replace( /^src/, 'dist/tmp' );
				lessFiles[ cssFileName ] = [ lessFileName ];
				lessFiles[ rtlPath( cssFileName ) ] = [ rtlPath( lessFileName ) ];
			} else {
				cssFileName = fileName.replace( /\.less$/, '.css' ).replace( /^src/, 'dist/tmp' );
				lessFiles[ cssFileName ] = [ fileName ];
				rtlFiles[ rtlPath( cssFileName ) ] = cssFileName;
			}
			return cssFileName;
		}
		for ( module in modules ) {
			if ( modules[ module ].styles ) {
				moduleStyleFiles = modules[ module ].styles;

				distFile = 'dist/' + module + '.css';

				concatCssFiles[ distFile ] = moduleStyleFiles.map( processFile );
				concatCssFiles[ rtlPath( distFile ) ] = concatCssFiles[ distFile ].map( rtlPath );
			}
		}
	}() );

	function strip( str ) {
		var path = require( 'path' );
		// http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
		// http://gruntjs.com/api/grunt.file#grunt.file.expandmapping
		return function ( dest, src ) {
			return path.join( dest, src.replace( str, '' ) );
		};
	}

	grunt.initConfig( {
		pkg: pkg,

		// Build
		clean: {
			build: 'dist/*',
			demos: 'demos/{composer.json,composer.lock,node_modules,dist,php,vendor}',
			tests: 'tests/{JSPHP-suite.json,JSPHP.test.js}',
			doc: 'docs/*',
			tmp: 'dist/tmp'
		},
		fileExists: {
			src: requiredFiles
		},
		tyops: {
			options: {
				typos: 'build/typos.json'
			},
			src: '{src,php}/**/*.{js,json,less,css}'
		},
		concat: {
			options: {
				banner: grunt.file.read( 'build/banner.txt' )
			},
			js: {
				files: {
					'dist/oojs-ui.js': modules[ 'oojs-ui' ].scripts,
					'dist/oojs-ui-apex.js': modules[ 'oojs-ui-apex' ].scripts,
					'dist/oojs-ui-mediawiki.js': modules[ 'oojs-ui-mediawiki' ].scripts
				}
			},
			css: {
				files: concatCssFiles
			},
			demoCss: {
				options: {
					banner: '/** This file is generated automatically. Do not modify it. */\n\n'
				},
				files: {
					'demos/styles/demo.rtl.css': 'demos/styles/demo.rtl.css'
				}
			}
		},

		// Build – Code
		uglify: {
			options: {
				banner: minBanner,
				sourceMap: true,
				sourceMapIncludeSources: true,
				report: 'gzip'
			},
			js: {
				expand: true,
				src: 'dist/*.js',
				ext: '.min.js',
				extDot: 'last'
			}
		},

		// Build – Styling
		less: {
			raster: {
				options: {
					modifyVars: {
						'oo-ui-distribution': 'raster',
						'oo-ui-default-image-ext': 'png'
					}
				},
				files: lessFiles
			},
			vector: {
				options: {
					modifyVars: {
						'oo-ui-distribution': 'vector',
						'oo-ui-default-image-ext': 'svg'
					}
				},
				files: lessFiles
			},
			mixed: {
				options: {
					modifyVars: {
						'oo-ui-distribution': 'mixed',
						'oo-ui-default-image-ext': 'png'
					}
				},
				files: lessFiles
			}
		},
		cssjanus: {
			options: {
				generateExactDuplicates: true
			},
			dist: {
				files: rtlFiles
			},
			demoCss: {
				files: {
					'demos/styles/demo.rtl.css': 'demos/styles/demo.css'
				}
			}
		},
		csscomb: {
			dist: {
				expand: true,
				src: 'dist/*.css'
			}
		},
		copy: {
			imagesCommon: {
				src: 'src/styles/images/*.cur',
				dest: 'dist/images/',
				expand: true,
				flatten: true
			},
			imagesApex: {
				src: 'src/themes/apex/images/**/*.{png,gif}',
				dest: 'dist/themes/apex/images/',
				expand: true,
				rename: strip( 'src/themes/apex/images/' )
			},
			imagesMediaWiki: {
				src: 'src/themes/mediawiki/images/**/*.{png,gif}',
				dest: 'dist/themes/mediawiki/images/',
				expand: true,
				rename: strip( 'src/themes/mediawiki/images/' )
			},
			i18n: {
				src: 'i18n/*.json',
				expand: true,
				dest: 'dist/'
			},
			jsduck: {
				// Don't publish devDependencies
				src: '{dist,node_modules/{' + Object.keys( pkg.dependencies ).join( ',' ) + '}}/**/*',
				dest: 'docs/',
				expand: true
			},
			demos: {
				// Make sure you update this if dependencies are added
				src: '{node_modules/{jquery,oojs}/dist/**/*,node_modules/es5-shim/*.js,composer.json,dist/**/*,php/**/*}',
				dest: 'demos/',
				expand: true
			},
			// Copys the necessary vendor/ files for demos without running "composer install"
			fastcomposerdemos: {
				// Make sure you update this if PHP dependencies are added
				src: 'vendor/{autoload.php,composer/**,mediawiki/at-ease/**}',
				dest: 'demos/',
				expand: true
			}
		},
		colorizeSvg: colorizeSvgFiles,
		svg2png: {
			dist: {
				src: 'dist/{images,themes}/**/*.svg'
			}
		},
		cssmin: {
			options: {
				keepSpecialComments: 0,
				banner: minBanner,
				compatibility: 'ie8',
				report: 'gzip'
			},
			dist: {
				expand: true,
				src: 'dist/*.css',
				ext: '.min.css',
				extDot: 'last'
			}
		},

		// Lint – Code
		jshint: {
			options: {
				jshintrc: true
			},
			dev: [
				'*.js',
				'{build,demos,src,tests}/**/*.js',
				'!demos/{dist,node_modules,vendor}/**/*.js',
				'!tests/JSPHP.test.js'
			]
		},
		jscs: {
			dev: [
				'<%= jshint.dev %>',
				'!demos/dist/**'
			]
		},

		// Lint – Styling
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: [
				'{demos,src}/**/*.css',
				'!demos/dist/**'
			]
		},

		// Lint – i18n
		banana: {
			all: 'i18n/'
		},
		jsonlint: {
			all: [
				'**/*.json',
				'!node_modules/**'
			]
		},

		// Test
		exec: {
			rubyTestSuiteGenerator: {
				command: 'ruby bin/testsuitegenerator.rb src php > tests/JSPHP-suite.json'
			},
			phpGenerateJSPHPForKarma: {
				command: 'composer update && php bin/generate-JSPHP-for-karma.php > tests/JSPHP.test.js'
			},
			demos: {
				command: 'composer update --no-dev',
				cwd: 'demos'
			}
		},
		karma: {
			options: {
				frameworks: [ 'qunit' ],
				files: [
					'node_modules/jquery/dist/jquery.js',
					'node_modules/oojs/dist/oojs.jquery.js',
					'dist/oojs-ui.js',
					'dist/oojs-ui-apex.js',
					'dist/oojs-ui-mediawiki.js',
					'tests/QUnit.assert.equalDomElement.js',
					'tests/**/*.test.js'
				],
				reporters: [ 'dots' ],
				singleRun: true,
				browserDisconnectTimeout: 5000,
				browserDisconnectTolerance: 2,
				autoWatch: false
			},
			main: {
				browsers: [ 'Chrome' ],
				preprocessors: {
					'dist/*.js': [ 'coverage' ]
				},
				reporters: [ 'dots', 'coverage' ],
				coverageReporter: { reporters: [
					{ type: 'html', dir: 'coverage/' },
					{ type: 'text-summary', dir: 'coverage/' }
				] }
			},
			other: {
				browsers: [ 'Firefox' ]
			}
		},

		// Development
		watch: {
			files: [
				'<%= jshint.dev %>',
				'<%= csslint.all %>',
				'src/**/*.less',
				'php/**/*.php',
				'.{csslintrc,jscsrc,jshintignore,jshintrc}'
			],
			tasks: 'quick-build'
		}
	} );

	grunt.registerTask( 'enable-source-maps', function () {
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
			grunt.config.set( 'pkg.version', grunt.config( 'pkg.version' ) + '-pre (' + stout.slice( 0, 10 ) + ')' );
			grunt.verbose.writeln( 'Added git HEAD to pkg.version' );
			done();
		} );
	} );

	grunt.registerTask( 'note-quick-build', function () {
		grunt.log.warn( 'You have built a no-frills, SVG-only, LTR-only version for development; some things will be broken.' );
	} );

	grunt.registerTask( 'build-code', [ 'concat:js' ] );
	grunt.registerTask( 'build-styling', [
		'colorizeSvg', 'less:' + lessTarget, 'cssjanus',
		'concat:css', 'concat:demoCss', 'csscomb',
		'copy:imagesCommon', 'copy:imagesApex', 'copy:imagesMediaWiki'
	].concat( lessTarget === 'vector' ? [] : [ 'svg2png' ] ) );
	grunt.registerTask( 'build-i18n', [ 'copy:i18n' ] );
	grunt.registerTask( 'build-tests', [ 'exec:rubyTestSuiteGenerator', 'exec:phpGenerateJSPHPForKarma' ] );
	grunt.registerTask( 'build', [
		'clean:build', 'fileExists', 'tyops', 'build-code', 'build-styling', 'build-i18n',
		'clean:tmp', 'demos'
	] );

	grunt.registerTask( 'git-build', [ 'enable-source-maps', 'pre-git-build', 'build' ] );

	// Quickly build a no-frills vector-only ltr-only version for development
	grunt.registerTask( 'quick-build', [
		'pre-git-build', 'clean:build', 'fileExists', 'tyops',
		'concat:js',
		'colorizeSvg', 'less:vector', 'concat:css',
		'copy:imagesCommon', 'copy:imagesApex', 'copy:imagesMediaWiki',
		'build-i18n', 'copy:demos', 'copy:fastcomposerdemos',
		'note-quick-build'
	] );

	// Completely useless stuff that we pretend to support
	grunt.registerTask( 'minify', [ 'uglify', 'cssmin' ] );

	grunt.registerTask( 'lint', [ 'jshint', 'jscs', 'csslint', 'jsonlint', 'banana' ] );
	grunt.registerTask( 'test', [ 'lint', 'git-build', 'build-tests', 'karma:main', 'karma:other' ] );
	grunt.registerTask( 'demos', [ 'clean:demos', 'copy:demos', 'exec:demos' ] );

	grunt.registerTask( 'default', 'test' );
};
