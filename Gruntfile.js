/*!
 * Grunt file
 */

module.exports = function ( grunt ) {
	var modules = grunt.file.readYAML( 'build/modules.yaml' ),
		pkg = grunt.file.readJSON( 'package.json' ),
		themes = {
			mediawiki: 'MediaWiki',
			apex: 'Apex'
		},
		lessFiles = {},
		lessTargets = {},
		colorizeSvgFiles = {},
		requiredFiles = [],
		concatCssFiles = {},
		concatJsFiles = {},
		concatOmnibus = {},
		rtlFiles = {},
		minBanner = '/*! OOjs UI v<%= pkg.version %> | http://oojs.mit-license.org */';

	grunt.loadNpmTasks( 'grunt-banana-checker' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-csscomb' );
	grunt.loadNpmTasks( 'grunt-cssjanus' );
	grunt.loadNpmTasks( 'grunt-exec' );
	grunt.loadNpmTasks( 'grunt-file-exists' );
	grunt.loadNpmTasks( 'grunt-image' );
	grunt.loadNpmTasks( 'grunt-jsonlint' );
	grunt.loadNpmTasks( 'grunt-karma' );
	grunt.loadNpmTasks( 'grunt-stylelint' );
	grunt.loadNpmTasks( 'grunt-svg2png' );
	grunt.loadNpmTasks( 'grunt-tyops' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadTasks( 'build/tasks' );

	( function () {
		var distFile, module, moduleDef, theme, moduleStyleFiles;

		for ( theme in themes ) {
			lessFiles[ theme ] = {};
		}

		function themify( str ) {
			return str.replace( /\{theme\}/g, theme ).replace( /\{Theme\}/g, themes[ theme ] );
		}
		function exists( file ) {
			// Only pass one argument, otherwise grunt.file.exists() will try to join them
			return grunt.file.exists( file );
		}
		for ( module in modules ) {
			if ( module.indexOf( '{theme}' ) !== -1 || module.indexOf( '{Theme}' ) !== -1 ) {
				for ( theme in themes ) {
					moduleDef = {};
					moduleDef.theme = theme;
					if ( modules[ module ].scripts ) {
						moduleDef.scripts = modules[ module ].scripts
							.map( themify )
							.filter( exists );
					}
					if ( modules[ module ].styles ) {
						moduleDef.styles = modules[ module ].styles
							.map( themify )
							.filter( exists );
					}

					if (
						( moduleDef.scripts && moduleDef.scripts.length ) ||
						( moduleDef.styles && moduleDef.styles.length )
					) {
						modules[ themify( module ) ] = moduleDef;
					}
				}
				delete modules[ module ];
			}
		}

		for ( module in modules ) {
			requiredFiles.push.apply( requiredFiles, modules[ module ].scripts || [] );
			requiredFiles.push.apply( requiredFiles, modules[ module ].styles || [] );
		}

		function rtlPath( fileName ) {
			return fileName.replace( /\.(\w+)$/, '.rtl.$1' );
		}
		// Generate all task targets required to process given file into a pair of CSS files (for LTR
		// and RTL), and return file name of LTR file.
		function processFile( fileName ) {
			var lessFileName, cssFileName, path;
			path = require( 'path' );
			if ( path.extname( fileName ) === '.json' ) {
				lessFileName = fileName.replace( /\.json$/, '.less' ).replace( /^src/, 'dist/tmp' );

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

				cssFileName = fileName.replace( /\.json$/, '.css' ).replace( /^src/, 'dist/tmp/' + theme );
				lessFiles[ theme ][ cssFileName ] = [ lessFileName ];
				lessFiles[ theme ][ rtlPath( cssFileName ) ] = [ rtlPath( lessFileName ) ];
			} else {
				cssFileName = fileName.replace( /\.less$/, '.css' ).replace( /^src/, 'dist/tmp/' + theme );
				lessFiles[ theme ][ cssFileName ] = [ fileName ];
				rtlFiles[ rtlPath( cssFileName ) ] = cssFileName;
			}
			return cssFileName;
		}
		for ( module in modules ) {
			if ( modules[ module ].styles ) {
				moduleStyleFiles = modules[ module ].styles;
				theme = modules[ module ].theme;

				distFile = 'dist/' + module + '.css';

				concatCssFiles[ distFile ] = moduleStyleFiles.map( processFile );
				concatCssFiles[ rtlPath( distFile ) ] = concatCssFiles[ distFile ].map( rtlPath );
			}
			if ( modules[ module ].scripts ) {
				distFile = 'dist/' + module + '.js';
				concatJsFiles[ distFile ] = modules[ module ].scripts.slice();
				concatJsFiles[ distFile ].unshift( 'src/intro.js.txt' );
				concatJsFiles[ distFile ].push( 'src/outro.js.txt' );
			}
		}

		// Define 'less' task targets - we need a target for each theme because of different import paths
		lessTargets = {
			options: {
				modifyVars: {
					// Changed dynamically by 'set-graphics' task
					'oo-ui-distribution': 'mixed',
					'oo-ui-default-image-ext': 'png'
				}
			}
		};
		for ( theme in lessFiles ) {
			lessTargets[ theme ] = {
				options: {
					paths: [ '.', 'src/themes/' + theme ]
				},
				files: lessFiles[ theme ]
			};
		}

		// Composite files
		concatOmnibus[ 'dist/oojs-ui.js' ] = [
			'dist/oojs-ui-core.js',
			'dist/oojs-ui-widgets.js',
			'dist/oojs-ui-toolbars.js',
			'dist/oojs-ui-windows.js'
		];
		for ( theme in themes ) {
			concatOmnibus[ themify( 'dist/oojs-ui-{theme}.css' ) ] = [
				'dist/oojs-ui-core-{theme}.css',
				'dist/oojs-ui-widgets-{theme}.css',
				'dist/oojs-ui-toolbars-{theme}.css',
				'dist/oojs-ui-windows-{theme}.css',
				'dist/oojs-ui-images-{theme}.css'
			].map( themify );
			concatOmnibus[ rtlPath( themify( 'dist/oojs-ui-{theme}.css' ) ) ] =
				concatOmnibus[ themify( 'dist/oojs-ui-{theme}.css' ) ].map( rtlPath );
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
			build: 'build/modules.yaml',
			src: '{src,php}/**/*.{js,json,less,css}'
		},
		concat: {
			options: {
				banner: grunt.file.read( 'build/banner.txt' )
			},
			js: {
				files: concatJsFiles
			},
			css: {
				files: concatCssFiles
			},
			omnibus: {
				options: {
					banner: ''
				},
				files: concatOmnibus
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
		less: lessTargets,
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
			imagesThemes: {
				src: 'src/themes/*/images/**/*.{png,gif}',
				dest: 'dist/',
				expand: true,
				rename: strip( 'src/' )
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
			// This task gets dynamically disabled by 'set-graphics', if not needed
			dist: {
				src: 'dist/{images,themes}/**/*.svg'
			}
		},
		'svg2png-off': {
			dist: {
				src: []
			}
		},
		image: {
			dist: {
				options: {
					zopflipng: true,
					pngout: true,
					optipng: true,
					advpng: true,
					pngcrush: true
				},
				expand: true,
				src: 'dist/**/*.png'
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
		eslint: {
			dev: [
				'*.js',
				'{build,demos,src,tests}/**/*.js',
				'!demos/{dist,node_modules,vendor}/**/*.js',
				'!tests/JSPHP.test.js'
			]
		},
		jsonlint: {
			all: [
				'*.json',
				'{build,demos,src,tests,i18n}/**/*.json',
				'!demos/{dist,node_modules,vendor}/**/*.json'
			]
		},

		// Lint – Styling
		stylelint: {
			options: {
				syntax: 'less'
			},
			dev: [
				'{demos,src}/**/*.css',
				'{demos,src}/**/*.less',
				'!demos/dist/**',
				'!demos/styles/demo.rtl.css'
			]
		},

		// Lint – i18n
		banana: {
			all: 'i18n/'
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
					'tests/QUnit.assert.equalDomElement.js',
					'node_modules/jquery/dist/jquery.js',
					'node_modules/oojs/dist/oojs.jquery.js',
					'dist/oojs-ui.js',
					'dist/oojs-ui-apex.js',
					'dist/oojs-ui-mediawiki.js',
					'tests/TestTimer.js',
					'tests/core.test.js',
					'tests/Element.test.js',
					'tests/Process.test.js',
					'tests/mixins/FlaggedElement.test.js',
					'tests/JSPHP.test.js'
				],
				reporters: [ 'dots' ],
				singleRun: true,
				browserDisconnectTimeout: 5000,
				browserDisconnectTolerance: 2,
				autoWatch: false,
				browserNoActivityTimeout: 60 * 1000
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
				'<%= eslint.dev %>',
				'<%= stylelint.dev %>',
				'<%= jsonlint.all %>',
				'src/**/*.less',
				'php/**/*.php',
				'.{stylelintrc,eslintrc.json}'
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

	grunt.registerTask( 'set-graphics', function ( graphics ) {
		graphics = graphics || grunt.option( 'graphics' ) || 'mixed';
		grunt.config.set(
			'less.options.modifyVars.oo-ui-distribution',
			graphics
		);
		grunt.config.set(
			'less.options.modifyVars.oo-ui-default-image-ext',
			graphics === 'vector' ? 'svg' : 'png'
		);
		if ( graphics === 'vector' ) {
			grunt.task.renameTask( 'svg2png', 'svg2png-off' );
			grunt.registerTask( 'svg2png', function () {} );
		}
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
		'colorizeSvg', 'set-graphics', 'less', 'cssjanus',
		'concat:css', 'concat:demoCss', 'csscomb',
		'copy:imagesCommon', 'copy:imagesThemes',
		'svg2png'
	] );
	grunt.registerTask( 'build-i18n', [ 'copy:i18n' ] );
	grunt.registerTask( 'build-tests', [ 'exec:rubyTestSuiteGenerator', 'exec:phpGenerateJSPHPForKarma' ] );
	grunt.registerTask( 'build', [
		'clean:build', 'fileExists', 'tyops', 'build-code', 'build-styling', 'build-i18n',
		'concat:omnibus',
		'clean:tmp', 'demos'
	] );

	grunt.registerTask( 'git-build', [ 'enable-source-maps', 'pre-git-build', 'build' ] );

	// Quickly build a no-frills vector-only ltr-only version for development
	grunt.registerTask( 'quick-build', [
		'pre-git-build', 'clean:build', 'fileExists', 'tyops',
		'concat:js',
		'colorizeSvg', 'set-graphics:vector', 'less', 'concat:css',
		'copy:imagesCommon', 'copy:imagesThemes',
		'build-i18n', 'concat:omnibus', 'copy:demos', 'copy:fastcomposerdemos',
		'note-quick-build'
	] );

	// Minification tasks for the npm publish step
	grunt.registerTask( 'minify', [ 'uglify', 'image', 'cssmin' ] );
	grunt.registerTask( 'publish-build', [ 'build', 'minify' ] );

	grunt.registerTask( 'lint', [ 'eslint', 'stylelint', 'jsonlint', 'banana' ] );

	// Run this before opening "tests/index.php"
	grunt.registerTask( 'prep-test', [ 'lint', 'git-build', 'build-tests' ] );

	grunt.registerTask( '_test', [ 'prep-test', 'karma:main', 'karma:other' ] );
	grunt.registerTask( '_ci', [ '_test', 'minify', 'demos' ] );
	grunt.registerTask( 'demos', [ 'clean:demos', 'copy:demos', 'exec:demos' ] );

	/* eslint-disable no-process-env */
	if ( process.env.JENKINS_HOME ) {
		grunt.registerTask( 'test', '_ci' );
	} else {
		grunt.registerTask( 'test', '_test' );
	}
	/* eslint-enable no-process-env */

	grunt.registerTask( 'default', 'test' );
};
