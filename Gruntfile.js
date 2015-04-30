"use strict";

var JASMINE_CMD = (process.platform === "win32"
                   ? "\"node_modules/.bin/jasmine-node.cmd\""
                   : "node_modules/.bin/jasmine-node");

var FIXTURES = "node_modules/zetzer/builder_specs/default";

module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-shell");

  grunt.loadTasks("tasks");

  grunt.registerTask("default", ["test", "jshint"]);
  grunt.registerTask("test", ["clean", "shell:jasmine"]);
  grunt.registerTask("testv", ["clean", "shell:jasmine_verbose"]);

  // Project configuration.
  grunt.initConfig({

    zetzer: {
      fixtures: {
        options: {
          partials: FIXTURES + "/includes",
          templates: FIXTURES + "/templates",
          dot_settings: {
            varname: 'it'
          },
          env: {
            parameter: "value"
          }
        },
        files: [{
          expand: true,
          cwd: FIXTURES + "/fixtures",
          src: "*.*",
          dest: "tmp",
          ext: ".html",
          flatten: true
        }]
      }
    },

    jshint: {
      all: [
        "Gruntfile.js",
        "tasks/*.js",
        "lib/*.js"
      ],
      options: {
        jshintrc: ".jshintrc",
      },
    },

    shell: {
      options: {
        stdout: true
      },
      jasmine: {
        command: JASMINE_CMD + " spec"
      },
      jasmine_verbose: {
        command: JASMINE_CMD + " --verbose spec"
      }
    },

    clean: {
      tmp: ["tmp"],
    }
  });
};
