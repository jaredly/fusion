
var utils = require('utils')

module.exports = Fusion

function Fusion () {
  this.components = {}
}

Fusion.prototype = {
  register: function (component, filename, fixtures) {
    this.components[filename] = {
      cls: component,
      filename: filename,
      fixtures: fixtures
    }
  },
  listen: function () {
    document.addEventListener('contextmenu', function (e) {
      var target = e.target
        , component = utils.getReactComponentForNode(target)
      if (!component) return
    })
  },
}


