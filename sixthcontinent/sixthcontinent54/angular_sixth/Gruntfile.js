module.exports = function (grunt) {
	grunt.initConfig({
		clean: {
			dist: ["dist/"]
		},
		jshint: {
			 dist: ['Gruntfile.js',/* 'app.js',*/ 'app/js/controllers/*'/*, 'app/js/factories/*', 'app/js/directives/*', 'app/js/filters/*', 'app/js/services/*'*/]
		},
		concat: {
			dist: {
				src: ["app/js/controllers/*.js", "app/js/directives/*.js", "app/js/factories/*.js", "app/js/filters/*.js", "app/js/services/*.js"],
				dest: "dist/app/js/scripts/scripts.js"
			}
		},
		ngmin: {
	        dist: {
	            src : ['dist/app/js/scripts/scripts.js'],
	            dest : 'dist/app/js/scripts/scripts.min.js'
	        }
    	},
		uglify: {
			options: {
				report: 'min',
            	mangle: false
			},
			scripts : {
	            files : {
	                'dist/app/js/scripts/scripts.uglify.min.js' : ['dist/app/js/scripts/scripts.min.js']
	            }
	        },
		},
		copy: {
			files1:{files :[{
					    src: 'index.html',
					    dest: 'dist/',
                        expand: true
					}]},
			files16:{files :[{
					    src: 'app/js/directives/*',
					    dest: 'dist/',
                        expand: true
					}]},
			files2:{files :[{
						src: 'app/js/lib/**',
						dest: 'dist/',
						expand: true
					}]},
			files3:{files :[{
						src: 'config_dev.js',
						dest: 'dist/',
					}]},
			files4:{files :[{
						src: '.htaccess',
						dest: 'dist/',
					}]},
			files5:{files :[{
						src: 'app.js*',
						dest: 'dist/',
					}]},
			files6:{files :[{
						src: 'app/assets/**',
						dest: 'dist/',
						expand: true
					}]},
			files7:{files :[{
						src: 'cloudsponge/*',
						dest: 'dist/',
						expand: true
					}]},
			files8:{files :[{
						src: 'designerHtmls/*',
						dest: 'dist/',
						expand: true
					}]},
			files9:{files :[{
						src: 'mail/*',
						dest: 'dist/',
						expand: true
					}]},
			files10:{files :[{
						src: 'php_view/*.php',
						dest: 'dist/',
						expand: true
					}]},
			files11:{files :[{
						src: 'test/*',
						dest: 'dist/test/*',
						expand: true
					}]},
			files12:{files :[{
						src: '*.png',
						dest: 'dist/',
						expand: true
					}]},
			files13:{files :[{
						src: 'php_view/classes/*.php',
						dest: 'dist/',
						expand: true
					}]},
			files14:{files :[{
						src: 'app/js/i18n/*',
						dest: 'dist/',
						expand: true
					}]},
			files15:{files :[{
						src: 'app/views/**',
						dest: 'dist/',
						expand: true
					}]},
			files17:{files :[{
						src: 'linkpreview/**',
						dest: 'dist/',
						expand: true
					}]}
		},
		karma: {
			dist: {
				configFile: "karma.conf.js"
			}
		},
		connect: {
			dist: {
				options: {
					port: 9001,
					base: 'dist/'
				}
			}
		},
		processhtml: {
		    options: {
		      data: {
		        message: 'Hello world!'
		      }
		    },
		    dist: {
		      files: {
		        'dist/index.html': ['index.html']
		      }
		    }
		}
	});
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-karma");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks('grunt-ngmin');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.registerTask("dist", ["clean", "concat", "ngmin", "uglify", "copy:files1", "copy:files2", "copy:files3", "copy:files4", "copy:files5", "copy:files6", "copy:files7", "copy:files8", "copy:files9", "copy:files12", "copy:files13", "copy:files10",  "copy:files14", "copy:files15",/* "copy:files16",*/"processhtml", "copy:files17"/*,"jshint"*/]);
};