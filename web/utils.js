
var Mount = React.__internals.Mount
  , InstanceHandles = React.__internals.InstanceHandles

module.exports = {
  getReactComponentForNode: getReactComponentForNode,
  addScript: addScript,
  addCss: addCss
}

function getReactComponentForNode(node) {
  var id = Mount.getID(node)
  if (!id) return
  var rid = InstanceHandles.getReactRootIDFromNodeID(id)
  if (!rid) return
  var root = Mount._instancesByReactRootID[rid]
    , parent = root
    , pid = rid
  while (pid !== id) {
    next = InstanceHandles._getNextDescendantID(pid, id)
    parent = parent._renderedComponent._renderedChildren[next]
    pid += next
  }
  while (!parent.constructor._fixtures) {
    parent = parent._owner
  }
}

function addScript(src, done) {
  var script = document.createElement('script')
    , loaded = false
  script.addEventListener('error', function (e) {
    loaded = true
    done(e || true)
  })
  script.addEventListener('load', function () {
    loaded = true
    done(null)
  })
  setTimeout(function () {
    if (!loaded) done('timeout')
  }, 2000)
  script.async = false
  script.src = src
  document.body.appendChild(script)
}

function addCss(src, id, done) {
  if (arguments.length === 2) {
    done = id
    id = 'injected-css'
  }
  done = done || function () {}
  var prev
  if (prev = document.getElementById(id)) {
    prev.parentNode.removeChild(prev)
  }
  var link = document.createElement('link')
    , laoded = false
  link.addEventListener('error', function (e) {
    loaded = true
    done(e || true)
  })
  link.addEventListener('load', function () {
    loaded = true
    done(null)
  })
  setTimeout(function () {
    if (!loaded) done('timeout')
  }, 2000)
  link.href = src
  link.rel = 'stylesheet'
  link.id = id
  document.head.appendChild(link)
}

