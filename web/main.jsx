/** @jsx React.DOM */

var Main = module.exports = React.createClass({
  displayName: 'Main',
  getDefaultProps: function () {
    return {
      components: {},
      filename: null,
      load: function () {throw 'override'}
    }
  },
  getInitialState: function () {
    var names = Object.keys(this.props.components)
      , component = this.props.components[names[0]]
    return {
      currentComponent: names[0],
      currentProps: '__default__',
      propsName: '',
      propsRaw: this.getRawData(names[0], '__default__')
    }
  },
  changeProps: function (e) {
    this.setState({propsRaw: e.target.value})
  },
  selectComponent: function (e) {
    var name = e.target.value
    if (name === this.state.currentComponent) return
    var component = this.props.components[name]
    this.setState({
      propsName: '',
      currentProps: '__default__',
      currentComponent: name,
      propsRaw: this.getRawData(name, '__default__')
    })
  },
  selectProps: function (e) {
    var name = e.target.value
    if (name === this.state.currentProps) return
    this.setState({
      propsName: name === '__default__' ? '' : name,
      currentProps: name,
      propsRaw: this.getRawData(this.state.currentComponent, name)
    }, this.resetChild)
  },
  getRawData: function (comp, name) {
    var component = this.props.components[comp]
      , data = {}
    if (name === '__default__' && component.cls.componentConstructor.prototype.getDefaultProps) {
      data = component.cls.componentConstructor.prototype.getDefaultProps()
    } else {
      data = component.fixture[name]
    }
    return JSON.stringify(data, null, 2)
  },
  changePropsName: function (e) {
    this.setState({propsName: e.target.value})
  },
  applyProps: function () {
    var data
    try {
      data = JSON.parse(this.state.propsRaw)
    } catch (e) {
      return this.setState({propsError: 'JSON parse error: ' + e.message})
    }
    if (!this.state.propsName) {
      return this.setState({propsError: 'Fixture name cannot be ampty'})
    }
    if (this.state.currentProps === '__default__') {
      return this.setState({propsError: 'Cannot change default props'})
    }
    if (this.state.propsName !== this.state.currentProps) {
      if (this.props.components[this.state.currentComponent].fixture[this.state.propsName]) {
        return this.setState({propsError: 'Name already taken: ' + this.state.propsName})
      }
    }
    this.props.changeFixture(
      this.state.currentComponent,
      this.state.currentProps,
      this.state.propsName,
      data,
      this.resetChild
    )
    this.setState({
      currentProps: this.state.propsName
    })
  },
  newProps: function () {
    var data
    try {
      data = JSON.parse(this.state.propsRaw)
    } catch (e) {
      return this.setState({propsError: 'JSON parse error: ' + e.message})
    }
    if (this.props.components[this.state.currentComponent].fixture[this.state.propsName]) {
      return this.setState({propsError: 'Name already taken: ' + this.state.propsName})
    }
    this.props.newFixture(
      this.state.currentComponent,
      this.state.propsName,
      data,
      this.resetChild
    )
    this.setState({
      currentProps: this.state.propsName
    })
  },
  changePropsRaw: function (e) {
    this.setState({
      propsRaw: e.target.value
    })
  },
  /*
  componentWillReceiveProps: function (oprops, ostate) {
    this.resetChild()
  },
  */
  resetChild: function () {
    if (!this.refs.display.state) return
    this.refs.display.replaceState(this.refs.display.getInitialState())
  },
  render: function () {
    var components = this.props.components
      , names = Object.keys(components)
      , current = this.props.components[this.state.currentComponent]
      , props = Object.keys(current.fixture)
      , cprops = this.state.currentProps === '__default__' ? {} : current.fixture[this.state.currentProps]
      , prefix = commonPrefix(names)
    cprops.ref = 'display'
    return (
      <div className='fusion-main'>
        <div ref='display' className='fusion-display'>
          {current.cls(cprops)}
        </div>
        <div className='fusion-sidebar'>
          <div>
            <button onClick={this.props.close}>Close</button>
            <button onClick={this.props.reload}>Reload</button>
          </div>
          <select onChange={this.selectComponent} className='fusion-components' value={this.state.currentComponent}>
            {
              names.map(function(name) {
                return <option value={name}>{name.slice(prefix.length)}</option>
              })
            }
          </select>
          <select onChange={this.selectProps} className='fusion-props' value={this.state.currentProps}>
            <option value='__default__'><em>default</em></option>
            {
              props.map(function (name) {
                return <option value={name}>{name}</option>
              })
            }
          </select>
          <input value={this.state.propsName} onChange={this.changePropsName}/>
          <textarea
            className='fusion-props-raw'
            onChange={this.changePropsRaw}
            value={this.state.propsRaw}></textarea>
          {this.state.propsError || false}
          {this.state.currentProps === '__default__' ? false : React.DOM.button({onClick: this.applyProps}, 'Apply')}
          <button onClick={this.newProps}>Save as New</button>
        </div>
      </div>
    )
  }
})

function commonPrefix(names) {
  var common = names[0]
  for (var i=1; i<names.length; i++) {
    if (names[i].indexOf(common) === 0) continue
    for (var j=1; j < common.length; j++) {
      if (names[i].indexOf(common.slice(0, -j)) === 0) {
        common = common.slice(0, -j)
        break
      }
    }
  }
  return common
}

// vim: set tabstop=2 shiftwidth=2 expandtab:

