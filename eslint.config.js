'use strict';

const { defineConfig, globalIgnores } = require( 'eslint/config' );
const html = require( 'eslint-plugin-html' );
const mediawiki = require( 'eslint-plugin-mediawiki' );
const wikimedia = require( 'eslint-config-wikimedia/flat' );

// Library code (was src/.eslintrc.json)
const srcConfig = [
	...wikimedia( 'client', 'jquery', 'jsdoc' ),
	{
		plugins: { mediawiki },
		languageOptions: {
			globals: {
				OO: 'writable'
			}
		},
		rules: {
			'mediawiki/msg-doc': 'error',
			'no-jquery/no-visibility': 'error',
			'no-jquery/no-done-fail': 'off',
			'es-x/no-regexp-prototype-flags': 'off'
		}
	}
];

// Directories with their own config, which other configs don't apply to.
// These were directories with `"root": true` in .eslintrc.json.
const rootDirs = {
	build: [ 'build/**' ],
	src: [ 'src/**' ],
	tests: [ 'tests/**' ],
	demos: [ 'demos/**' ]
};

module.exports = defineConfig( [
	globalIgnores( [
		// Build
		'coverage/',
		'dist/',
		'docs/',
		'vendor/',
		'demos/dist/',
		'demos/vendor/',

		// Test data
		'tests/JSPHP-suite.json',
		'tests/JSPHP.test.js'
	] ),

	// Gruntfile.js, bin scripts, etc.
	{
		ignores: Object.values( rootDirs ).flat(),
		extends: [ wikimedia( 'server', 'jsdoc' ) ]
	},
	{
		files: [ 'bin/testsuitegenerator.js', 'bin/docparser.js' ],
		rules: {
			'security/detect-non-literal-fs-filename': 'off',
			'security/detect-unsafe-regex': 'off',
			'n/no-process-exit': 'off'
		}
	},

	// Build scripts
	{
		files: rootDirs.build,
		extends: [ wikimedia( 'server' ) ]
	},

	// Library code
	{
		files: rootDirs.src,
		extends: srcConfig
	},

	// QUnit tests
	{
		files: rootDirs.tests,
		extends: [ wikimedia( 'client', 'jquery', 'qunit' ) ],
		languageOptions: {
			globals: {
				OO: 'readonly'
			}
		},
		rules: {
			'no-jquery/no-class-state': 'off'
		}
	},

	// Demos
	{
		files: [ 'demos/**/*.js', 'demos/**/*.html' ],
		extends: [ srcConfig, wikimedia( 'mediawiki', 'jquery' ) ],
		plugins: { html },
		languageOptions: {
			globals: {
				Demo: 'writable'
			}
		},
		settings: {
			'html/indent': '+tab',
			'html/report-bad-indent': 'error'
		}
	},
	{
		files: [ 'demos/**/*.html' ],
		languageOptions: {
			sourceType: 'script'
		}
	},
	{
		files: [ 'demos/tutorials/**' ],
		languageOptions: {
			globals: {
				Tutorials: 'writable',
				Widgets: 'writable',
				Prism: 'readonly'
			}
		}
	}
] );
