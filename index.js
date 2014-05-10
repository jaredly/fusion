
var through = require('through')
  , path = require('path')
  , fs = require('fs')

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
      , jsFixture = file.slice(0, -ext.length) + '.fix.js'
    if (fs.existsSync(jsonFixture)) {
      text += '\nif (window.fusion) window.fusion.register(module.exports, "' + file + '", require("' + jsonFixture + '"));'
      console.log('fixtured', file)
    } else if (fs.existsSync(jsFixture)) {
      text += '\nif (window.fusion) window.fusion.register(module.exports, "' + file + '", require("' + jsFixture + '"));'
      console.log('fixtured', file, '(js)')
    } else {
      text += '\nif (window.fusion) window.fusion.register(module.exports, "' + file + '", false);'
    }
    text += '\nmodule.exports._file_origin = "' + file + '";'
    this.queue(text)
    this.queue(null)
  })
}

