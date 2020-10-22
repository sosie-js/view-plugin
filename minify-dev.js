const minify = require('@node-minify/core');
const terser = require('@node-minify/terser');


minify({
  compressor: terser,
  input: ['src/jsondiffpatch.umd.js', 'src/jsdiff.js'],
  output: [ 'dist/jsondiffpatch.umd.js', 'dist/jsdiff.js'],
  callback: function(err, min) {}
});
