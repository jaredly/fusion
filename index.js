
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
    if (fs.existsSync(jsonFixture)) {
      text += '\nif (window.fusion) window.fusion.register(module.exports, "' + file + '", require("' + jsonFixture + '"));'
    }
    this.queue(text)
    this.queue(null)
  })
}

