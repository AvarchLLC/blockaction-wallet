module.exports = function (grunt) {
    grunt.initConfig({
        mochaTest: {
            test:{
                options:{
                    reporter: 'spec',
                    clearRequireCache: true
                },
                src: ['test/*.js']
            }
        },

        watch:{
            js:{
                options:{
                    spawn:true,
                    interrupt:true,
                    debounceDelay: 250,
                },
                files:['gruntfile.js','test/*.js'],
                tasks: ['mochaTest']
            }
        }

    });
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default',['mochaTest']);
    grunt.registerTask('test',['mochaTest']);
}