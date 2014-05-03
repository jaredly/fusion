
var Mount = React.__internals.Mount
  , InstanceHandles = React.__internals.InstanceHandles

module.exports = {
  getReactComponentForNode: getReactComponentForNode
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

