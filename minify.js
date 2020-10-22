const minify = require('@node-minify/core');
const terser = require('@node-minify/terser');


minify({
  compressor: terser,
  input: ['src/index.js','src/sample.js', 'src/jsondiffpatch.umd.js', 'src/jsdiff.js'],
  output: ['dist/bundle.js','dist/sample.js', 'dist/jsondiffpatch.umd.js', 'dist/jsdiff.js'],
  callback: function(err, min) {}
});
