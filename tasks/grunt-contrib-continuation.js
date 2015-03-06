'use strict';

var path = require("path");
var continuation = require("continuation");
var coffeescript = require('coffee-script');
var livescript = require('LiveScript');

var compile = function(grunt, options, src, dest) {
  var code = grunt.file.read(src);
  var ext = path.extname(src);
  try {
    if (ext === '.coffee') {
      //Coffee-script support
      if (!coffeescript) {
        console.error('CoffeeScript not found. Use: npm install -g coffee-script');
        process.exit(-1);
      }
      code = coffeescript.compile(code);
    } else if (ext === '.ls') {
      //LiveScript support
      if (!livescript) {
        console.error('LiveScript not found. Use: npm install -g LiveScript');
        process.exit(-1);
      }
      code = livescript.compile(code);
    }
    code = continuation.compile(code, options);
  } catch (err) {
    console.error('In file', src);
    console.error(err.stack);
    process.exit(-1);
  }

  // Write the destination file.
  grunt.file.write(dest, code);

  // Print a success message.
  grunt.log.writeln('File "' + dest + '" created.');
};

module.exports = function(grunt) {

  grunt.registerMultiTask('continuation', 'Compile .coffee/.ls/.js files with continuation.', function() {
    var options = this.options({});

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Iterate over all source file.
      f.src.filter(function(src) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(src)) {
          grunt.log.warn('Source file "' + src + '" not found.');
          return false;
        } else {
          compile(grunt, options, src, f.dest);
          return true;
        }
      });
    });
  });

};
