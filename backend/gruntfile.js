module.exports = function (grunt) {
    grunt.initConfig({
        mochaTest: {
            test:{
                options:{
                    reporter: 'spec',
                    clearRequireCache: true
                },
                src: ['test/*.js'],
            },
            dev:{

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
                tasks: ['mochaTest'],
            },
        },
        env:{
            options:{

            },
            dev:{
                NODE_ENV: 'development',
            },
            test:{
                NODE_ENV:'test'
            }

        }

    });
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default',['env:test','mochaTest','']);
    grunt.registerTask('test',['env:test','mochaTest']);
}