
var d = React.DOM

function clone(a) {
  var b = {}
  for (var c in a) {
    b[c] = a[c]
  }
  return b
}

var StateWrapper = module.exports = React.createClass({
  displayName: 'StateWrapper',
  getDefaultProps: function () {
    return {
      cls: null,
      props: {},
      wrap: true
    }
  },
  getInitialState: function () {
    var name = this.getPropName()
    return {value: this.props.props[name]}
  },
  componentWillReceiveProps: function (props) {
    var name = this.getPropName()
    this.setState({value: props.props[name]})
  },
  getCallbackName: function () {
    return this.props.wrap === true ? 'onChange' : this.props.wrap.callback
  },
  getPropName: function () {
    return this.props.wrap === true ? 'value' : this.props.wrap.prop
  },
  onChange: function (value) {
    this.setState({value: value})
    console.log('[state wrapper : onChange]', value)
  },
  resetState: function () {
    if (!this.refs.display.state) return
    this.refs.display.replaceState(this.refs.display.getInitialState())
  },
  render: function () {
    if (!this.props.cls) return d.div({}, 'No component provided')
    var name = this.getPropName()
      , props = clone(this.props.props)
    props[name] = this.state.value
    props[this.getCallbackName()] = this.onChange
    props.ref = 'display'
    return this.props.cls(props)
  }
})

