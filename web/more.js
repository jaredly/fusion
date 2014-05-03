
var Fusion = require('./fusion')
  , fusion = window.fusion = new Fusion()

fusion.listen()

var main = document.getElementById('main')

fusion.mount(main)


