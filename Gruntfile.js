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
	grunt.loadTasks( 'build/tasks' );

	var modules = grunt.file.readJSON( 'build/modules.json' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		clean: {
			dist: ['dist/*/', 'dist/*.*']
		},
		concat: {
			js: {
				dest: 'dist/oojs-ui.js',
				src: modules['oojs-ui'].scripts
			},
			css: {
				dest: 'dist/oojs-ui.css',
				src: modules['oojs-ui'].styles
			}
		},
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
			all: ['*.js', '{build,dist,src,test}/**/*.js']
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: 'src/**/*.css',
		},
		qunit: {
			all: ['test/index.html']
		},
		watch: {
			files: ['<%= jshint.all %>', '<%= qunit.all %>', '.{jshintrc,jshintignore}'],
			tasks: ['test']
		}
	} );

	grunt.registerTask( 'build', ['clean', 'concat', 'copy'] );
	grunt.registerTask( 'test', ['git-build', 'build', 'jshint', 'csslint', 'qunit'] );
	grunt.registerTask( 'default', 'test' );
};
