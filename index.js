
var through = require('through')
  , path = require('path')
  , fs = require('fs')
  // , _ = require('lodash')

module.exports = fusion

function fusion(file) {
  var text = ''
  return through(function (chunk) {
    text += chunk.toString()
  }, function end() {
    if (text.indexOf('module.exports = React.createClass') === -1) {
      this.queue(text)
      this.queue(null)
      return
    }
    var ext = path.extname(file)
    var jsonFixture = file.slice(0, -ext.length) + '.json'
    if (fs.existsSync(jsonFixture)) {
      text += '\n\nmodule.exports._fixture = require("' + jsonFixture + '");'
      text += '\nif (window.fusion) window.fusion.register(module.exports, "' + file + '");\n'
    }
    this.queue(text)
    this.queue(null)
  })
}

/**
function fusion(b, options) {
  options = _.extend({
    filename: null,
    stream: null,
  }, options || {})
  if (!options.stream && !options.filename) {
    throw new Error('Must specify either a filename or stream to send CSS to');
  }

  // here's where the fun starts. handle bundle events
  b.on('bundle', function(bundle) {
    var fixtures = '';

    bundle.on('transform', function(tr, file) {
      if (tr._name && tr._name == 'transformLess') {
        lessData += '@import "' + file + '";\n';
      }
    });

    bundle.on('end', function() {
      regenerate(lessData, bundle);
    });
  });
}

function Fusion(infile, outfile, options) {
  this.infile = infile
  this.outfile = outfile
  this.o = _.extend({
    party: 'hard'
  }, options)
  this.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  this.rl.on('line', this.handleInput.bind(this))
}

Fusion.prototype = {
  run: function () {
    this.startTime = Date.now()
    var time = (new Date).toTimeString().split(' ')[0]
    process.stdout.write(time + ' Compiling...')
    

  },
  // you can trigger manually
  handleInput: function (line) {
    if (['run', 'r', 'build', 'b'].indexOf(line.toLowerCase()) === -1) return
    this.run()
  }
}

module.exports = function (file) {
  var data = ''
  return through(function (chunk) {
    data += chunk.toString()
  }, function done() {
    this.queue(
  })
}
**/

