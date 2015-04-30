"use strict";

var file = require("../file");

var parse_setup = require("zetzer/parse");
var compilers_setup = require("zetzer/compilers");
var process_file_setup = require("zetzer/process");
var default_options = require("zetzer/defaults");

var _ = require("lodash");

module.exports = function(grunt) {

  grunt.registerMultiTask("zetzer", "HTML compilation from separate components with doT and Markdown", zetzer);

  function zetzer () {

    var options = this.options(_.merge({}, default_options, {
      partials: ".",
      templates: ".",
      env: {},
      dot_settings: {},
      marked_settings: {}
    }));

    var parse = parse_setup(options.meta_data_separator);

    var compile =  compilers_setup({
      read_content: _.compose(parse.content, grunt.file.read),
      compilers: [
        require("zetzer/dot")({
          settings: options.dot_settings || options.dot_template_settings
        }),
        require("zetzer/markdown")({
          settings: options.marked_settings
        })
      ]
    });

    var process_file = new process_file_setup({
      options: options,
      compile: compile,
      read_header: _.compose(parse.header, grunt.file.read),
      find_closest_match: file.find_closest_match
    });

    this.files.forEach(function (mapping) {
      var result = process_file(mapping.src).toString();
      grunt.file.write(mapping.dest, result);
    });
  }
};
