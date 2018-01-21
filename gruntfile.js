module.exports = function(grunt){
	grunt.initConfig({
		less: {
			development: {
				options: {
					compress:	true,
					ieCompat:	false
				},
				files: {
					'web/css/style.css': 'app/resources/less/style.less'
				}
			}
		},
		watch: {
			less: {
				files: 'app/resources/less/**/*.less',
				tasks: ['less']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-less');	// grunt less
	grunt.loadNpmTasks('grunt-contrib-watch');	// grunt watch
};