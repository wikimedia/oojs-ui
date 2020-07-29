/*!
 * Grunt file
 */

/* eslint-env node, es6 */
module.exports = function ( grunt ) {
	var modules = grunt.file.readYAML( 'build/modules.yaml' ),
		pkg = grunt.file.readJSON( 'package.json' ),
		themes = {
			wikimediaui: 'WikimediaUI', // Do not change this line or you'll break `grunt add-theme`
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
		minBanner = '/*! OOUI v<%= pkg.version %> | http://oojs.mit-license.org */';

	grunt.loadNpmTasks( 'grunt-banana-checker' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-cssjanus' );
	grunt.loadNpmTasks( 'grunt-exec' );
	grunt.loadNpmTasks( 'grunt-file-exists' );
	grunt.loadNpmTasks( 'grunt-karma' );
	grunt.loadNpmTasks( 'grunt-stylelint' );
	grunt.loadNpmTasks( 'grunt-svgmin' );
	grunt.loadNpmTasks( 'grunt-tyops' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-string-replace' );
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
		// Generate all task targets required to process given file into a pair of CSS files (for
		// LTR and RTL), and return file name of LTR file.
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

		// Define 'less' task targets - we need a target for each theme because of different import
		// paths
		lessTargets = {
			options: {
				// Throw errors if we try to calculate mixed units, like `px` and `em` values.
				strictUnits: true,
				// Force LESS v3.0.0+ to let us use mixins before we later upgrade to @plugin
				// architecture.
				javascriptEnabled: true
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

	if ( !grunt.option( 'template' ) ) {
		grunt.option( 'template', 'MISSING' );
	}
	if ( !grunt.option( 'name' ) ) {
		grunt.option( 'name', 'MISSING' );
	}

	grunt.initConfig( {
		pkg: pkg,

		// Build
		clean: {
			build: 'dist/*',
			demos: 'demos/{composer.json,composer.lock,node_modules,dist,php,vendor}',
			tests: 'tests/JSPHP.test.js',
			coverage: 'coverage/*',
			doc: 'docs/*',
			tmp: 'dist/tmp'
		},
		fileExists: {
			src: requiredFiles.filter( function ( f ) {
				return f.startsWith( 'src/' );
			} )
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
				options: {
					sourceMap: true,
					sourceMapName: function ( concatFileName ) {
						return concatFileName + '.map.json';
					}
				},
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
			i18nMessages: {
				options: {
					banner: '',
					process: true
				},
				files: {
					'dist/tmp/src/core-messages.js': 'src/core-messages.js.txt'
				}
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
		copy: {
			imagesCommon: {
				src: 'src/styles/images/*.cur',
				dest: 'dist/images/',
				expand: true,
				flatten: true
			},
			imagesThemes: {
				src: 'src/themes/*/{*.json}',
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
				src: '{node_modules/{jquery,oojs}/dist/**/*,composer.json,dist/**/*,php/**/*,node_modules/{prismjs,javascript-stringify}/**/*}',
				dest: 'demos/',
				expand: true
			},
			dist: {
				src: [
					'AUTHORS.txt',
					'LICENSE-MIT',
					'README.md',
					'History.md'
				],
				dest: 'dist/'
			},
			wikimediauibasevars: {
				flatten: true,
				src: [
					'node_modules/wikimedia-ui-base/wikimedia-ui-base.less'
				],
				dest: 'dist/wikimedia-ui-base.less'
			},
			// Copies the necessary vendor/ files for demos without running "composer install"
			fastcomposerdemos: {
				src: 'vendor/**',
				dest: 'demos/',
				expand: true
			}
		},
		colorizeSvg: colorizeSvgFiles,
		// SVG Optimization
		svgmin: {
			options: {
				js2svg: {
					indent: '\t',
					pretty: true
				},
				multipass: true,
				plugins: [ {
					cleanupIDs: false
				}, {
					removeDesc: false
				}, {
					removeRasterImages: true
				}, {
					removeTitle: false
				}, {
					removeViewBox: false
				}, {
					removeXMLProcInst: false
				}, {
					sortAttrs: true
				} ]
			},
			srcSvgs: {
				files: [ {
					expand: true,
					cwd: 'src',
					src: [
						'**/*.svg'
					],
					dest: 'src',
					ext: '.svg'
				} ]
			},
			distSvgs: {
				options: {
					js2svg: {
						pretty: false
					}
				},
				files: [ {
					expand: true,
					cwd: 'dist',
					src: [
						'**/*.svg'
					],
					dest: 'dist',
					ext: '.svg'
				} ]
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
			options: {
				reportUnusedDisableDirectives: true,
				extensions: [ '.js', '.json' ],
				cache: true
			},
			dev: [
				'**/*.{js,json}',
				'!{coverage,dist,docs,node_modules,vendor,demos/{dist,node_modules,vendor}}/**',
				'!tests/JSPHP.test.js'
			],
			html: {
				options: {
					// TODO: reportUnusedDisableDirectives doesn't work with plugin-html
					// (https://github.com/BenoitZugmeyer/eslint-plugin-html/issues/111)
					// Once that is fixed, merge dev and html
					reportUnusedDisableDirectives: false
				},
				src: [
					'**/*.html',
					'!{coverage,dist,docs,node_modules,vendor,demos/{dist,node_modules,vendor}}/**',
					'!tests/JSPHP.test.js'
				]
			}
		},

		// Lint – Styling
		stylelint: {
			options: {
				syntax: 'less'
			},
			dev: [
				'{demos,src}/**/*.{css,less}',
				'!demos/dist/**',
				'!demos/styles/demo.rtl.css',
				'!demos/vendor/**'
			]
		},

		// Lint – i18n
		banana: {
			all: 'i18n/'
		},

		// Test
		exec: {
			rubyTestSuiteGenerator: {
				command: 'ruby bin/testsuitegenerator.rb src php -o tests/JSPHP-suite.json'
			},
			phpGenerateJSPHPForKarma: {
				command: 'composer update --ansi --no-progress && php bin/generate-JSPHP-for-karma.php > tests/JSPHP.test.js'
			},
			demos: {
				command: 'composer update --ansi --no-progress --no-dev',
				cwd: 'demos'
			},
			composer: {
				command: 'composer update --ansi --no-progress --prefer-dist --profile -v && composer --ansi test'
			}
		},
		karma: {
			options: {
				customLaunchers: {
					ChromeCustom: {
						base: 'ChromeHeadless',
						// Chrome requires --no-sandbox in Docker/CI.
						// WMF CI images expose CHROMIUM_FLAGS which sets that.
						flags: ( process.env.CHROMIUM_FLAGS || '' ).split( ' ' )
					}
				},
				frameworks: [ 'qunit' ],
				files: [
					'tests/QUnit.assert.equalDomElement.js',
					'tests/JSPHP-generator.js',
					'node_modules/jquery/dist/jquery.js',
					'node_modules/oojs/dist/oojs.jquery.js',
					'dist/oojs-ui-core.js',
					'dist/oojs-ui-widgets.js',
					'dist/oojs-ui-windows.js',
					'dist/oojs-ui-toolbars.js',
					'dist/oojs-ui-apex.js',
					'dist/oojs-ui-wikimediaui.js',
					'tests/TestTimer.js',
					'tests/config.js',
					'tests/core.test.js',
					'tests/Element.test.js',
					'tests/Process.test.js',
					'tests/windows.test.js',
					'tests/mixins/*.test.js',
					'tests/widgets/*.test.js',
					'tests/JSPHP.test.js'
				],
				reporters: [ 'dots' ],
				singleRun: true,
				browserDisconnectTimeout: 5 * 60 * 1000,
				browserDisconnectTolerance: 2,
				autoWatch: false,
				browserNoActivityTimeout: 5 * 60 * 1000
			},
			main: {
				browsers: [ 'ChromeCustom' ],
				preprocessors: {
					'dist/*.js': [ 'coverage' ]
				},
				reporters: [ 'dots', 'coverage', 'karma-remap-istanbul' ],
				coverageReporter: { type: 'in-memory' },
				remapIstanbulReporter: {
					reports: {
						'text-summary': null,
						clover: 'coverage/clover.xml',
						html: 'coverage/'
					}
				}
			},
			other: {
				browsers: [ 'FirefoxHeadless' ]
			}
		},

		// Development
		watch: {
			files: [
				'<%= eslint.dev %>',
				'<%= stylelint.dev %>',
				'src/**/*.less',
				'php/**/*.php',
				'.{stylelintrc,eslintrc.json}'
			],
			tasks: 'quick-build'
		},

		// Adding new theme
		'string-replace': {
			newTheme: {
				files: [
					{
						expand: true,
						src: 'src/themes/<%= grunt.option( "template" ).toLowerCase() %>/**/*.{less,json,svg,gif}',
						dest: 'src/themes/<%= grunt.option( "name" ).toLowerCase() %>/',
						rename: strip( 'src/themes/' + grunt.option( 'template' ).toLowerCase() + '/' )
					},
					{
						src: 'src/themes/<%= grunt.option( "template" ).toLowerCase() %>/<%= grunt.option( "template" ) %>Theme.js',
						dest: 'src/themes/<%= grunt.option( "name" ).toLowerCase() %>/<%= grunt.option( "name" ) %>Theme.js'
					},
					{
						src: 'php/themes/<%= grunt.option( "template" ) %>Theme.php',
						dest: 'php/themes/<%= grunt.option( "name" ) %>Theme.php'
					}
				],
				options: {
					replacements: [
						{
							pattern: new RegExp( '\\b' + grunt.option( 'template' ) + '\\b', 'g' ),
							replacement: grunt.option( 'name' )
						},
						{
							pattern: new RegExp( '\\b' + grunt.option( 'template' ) + 'Theme\\b', 'g' ),
							replacement: grunt.option( 'name' ) + 'Theme'
						},
						{
							pattern: new RegExp( '\\b' + grunt.option( 'template' ).toLowerCase() + '\\b', 'g' ),
							replacement: grunt.option( 'name' ).toLowerCase()
						}
					]
				}
			},
			updateGruntfile: {
				files: {
					'Gruntfile.js': 'Gruntfile.js'
				},
				options: {
					replacements: [ {
						pattern: /\t\t\twikimediaui: 'WikimediaUI',/,
						replacement: '\t\t\t<%= grunt.option( "name" ).toLowerCase() %>: \'<%= grunt.option( "name" ) %>\',\n$&'
					} ]
				}
			},
			updateDemoIndex: {
				files: {
					'demos/index.html': 'demos/index.html'
				},
				options: {
					replacements: [ {
						pattern: /(\t*)<script src="dist\/oojs-ui-wikimediaui.js"><\/script>/,
						replacement: '$1<script src="dist/oojs-ui-<%= grunt.option( "name" ).toLowerCase() %>.js"></script>\n$&'
					} ]
				}
			},
			updateDemoJs: {
				files: {
					'demos/demo.js': 'demos/demo.js'
				},
				options: {
					replacements: [ {
						pattern: /(\t*)wikimediaui: 'WikimediaUI',/,
						replacement: '$1<%= grunt.option( "name" ).toLowerCase() %>: \'<%= grunt.option( "name" ) %>\',\n$&'
					} ]
				}
			},
			updateDemoPhp: {
				files: {
					'demos/demos.php': 'demos/demos.php'
				},
				options: {
					replacements: [ {
						pattern: /(\t*)'wikimediaui' => 'WikimediaUI',/,
						replacement: '$1\'<%= grunt.option( "name" ).toLowerCase() %>\' => \'<%= grunt.option( "name" ) %>\',\n$&'
					} ]
				}
			}
		}
	} );

	grunt.registerTask( 'git-status', function () {
		var done = this.async();
		// Are there unstaged changes?
		require( 'child_process' ).exec( 'git ls-files --modified', function ( err, stdout, stderr ) {
			var ret = err || stderr || stdout;
			if ( ret ) {
				grunt.log.error( 'Unstaged changes in these files:' );
				grunt.log.error( ret );
				done( false );
			} else {
				grunt.log.ok( 'No unstaged changes.' );
				done();
			}
		} );
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

	grunt.registerTask( 'build-code', [ 'concat:i18nMessages', 'concat:js' ] );
	grunt.registerTask( 'build-styling', [
		'colorizeSvg', 'less', 'cssjanus',
		'concat:css', 'concat:demoCss',
		'copy:imagesCommon', 'copy:imagesThemes'
	] );
	grunt.registerTask( 'build-i18n', [ 'copy:i18n' ] );
	grunt.registerTask( 'build-tests', [ 'exec:rubyTestSuiteGenerator', 'exec:phpGenerateJSPHPForKarma' ] );
	grunt.registerTask( 'build', [
		'clean:build', 'fileExists', 'tyops', 'build-code', 'build-styling', 'build-i18n',
		'concat:omnibus',
		'copy:dist',
		'copy:wikimediauibasevars',
		'clean:tmp', 'demos'
	] );

	grunt.registerTask( 'git-build', [ 'pre-git-build', 'build' ] );

	// Quickly build a no-frills vector-only ltr-only version for development
	grunt.registerTask( 'quick-build', [
		'pre-git-build', 'clean:build', 'fileExists', 'tyops',
		'build-code',
		'colorizeSvg', 'less', 'concat:css',
		'copy:imagesCommon', 'copy:imagesThemes',
		'build-i18n', 'concat:omnibus', 'copy:demos', 'copy:fastcomposerdemos',
		'note-quick-build'
	] );
	grunt.registerTask( 'quick-build-code', [ 'build-code', 'copy:demos' ] );

	// Minification tasks for the npm publish step.
	grunt.registerTask( 'minify', [ 'uglify', 'svgmin:distSvgs', 'cssmin' ] );
	// Note that this skips "git-build", so version numbers are final and don't have a git hash.
	grunt.registerTask( 'publish-build', [ 'build', 'minify' ] );

	grunt.registerTask( 'lint', [ 'eslint', 'stylelint', 'banana' ] );

	// Run this before opening "tests/index.php"
	grunt.registerTask( 'prep-test', [ 'lint', 'git-build', 'build-tests' ] );

	grunt.registerTask( '_test', [ 'prep-test', 'clean:coverage', 'karma:main' /* T190200 , 'karma:other' */ ] );
	grunt.registerTask( '_ci', [ '_test', 'minify', 'demos', 'exec:composer', 'git-status' ] );
	grunt.registerTask( 'demos', [ 'clean:demos', 'copy:demos', 'exec:demos' ] );

	grunt.registerTask( 'add-theme-check', function () {
		if ( grunt.option( 'template' ) === 'MISSING' ) {
			grunt.fatal( '`grunt add-theme` requires a --template=Foo option.' );
		}
		if ( grunt.option( 'name' ) === 'MISSING' ) {
			grunt.fatal( '`grunt add-theme` requires a --name=Foo option.' );
		}
	} );
	grunt.registerTask( 'add-theme', [ 'add-theme-check', 'string-replace' ] );

	if ( process.env.JENKINS_HOME ) {
		grunt.registerTask( 'test', '_ci' );
	} else {
		grunt.registerTask( 'test', '_test' );
	}

	grunt.registerTask( 'default', 'test' );
};
