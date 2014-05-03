/** @jsx React.DOM */

var Main = require('./main.jsx')

var Loader = module.exports = React.createClass({
  displayName: 'Loader',
  getInitialState: function () {
    return {
      filename: '',
      loading: false,
      fresh: true,
      error: null,
      components: {}
    }
  },
  componentDidMount: function () {
    window.fusion = {
      register: this.register
    }
  },
  changeName: function (e) {
    this.setState({filename: e.target.name})
  },
  register: function (component, file, data) {
    var components = this.state.components
    components[file] = {
      cls: components,
      file: file,
      fixture: data
    }
    this.setState({components: components})
  },
  load: function (filename) {
    this.setState({
      filename: filename,
      components: {},
      loading: true
    })
    var script = document.createElement('script')
    script.src = filename
    script.addEventListener('error', this.loadError)
    script.addEventListener('load', this.loaded)
    document.body.appendChild(script)
  },
  loaded: function () {
    this.setState({
      loading: false,
      fresh: false
    })
  },
  loadError: function (e) {
    console.log('load error')
    this.setState({
      loading: false,
      error: 'failed to load'
      fresh: true
    })
  },
  loadit: function () {
    this.load(this.state.filename)
  },
  reload: function () {
    this.load(this.state.filename)
  },
  changeFixture: function (comp, pname, name, data) {
    var c = this.state.components[comp]
    if (c.fixtures[name]) return false
    if (pname !== name) {
      delete c.fixtures[pname]
    }
    c.fixtures[name] = data
    // TODO update, don't mutate
    this.setState({components: this.state.components})
  },
  newFixture: function (comp, name, data) {
    var c = this.state.components[comp]
    if (c.fixtures[name]) return false
    c.fixtures[name] = data
    // TODO update, don't mutate
    this.setState({components: this.state.components})
  },
  close: function () {
    this.setState({
      fresh: true,
      error: null,
      components: {},
    })
  },
  render: function () {
    if (this.state.loading) {
      return <div className='fusion-loader fusion-loader--loading'>Loading...</div>
    }
    if (!this.state.fresh) {
      return Main({
        components: this.state.components,
        // filename: this.state.filename,
        changeFixture: this.changeFixture,
        newFixture: this.newFixture,
        reload: this.reload,
        close: this.close
      })
    }
    return (
      <div className='fusion-loader'>
        <p>
          Enter the path of the bundled javascript file. Will be loaded via
          script tag, so if you're currently on a local file:// then it needs to
          be there too.
        </p>
        <input onChange={this.changeName} value={this.state.filename}/>
        <button onClick={this.loadit}>Load</button>
      </div>
    )
  }
})

// vim: set tabstop=2 shiftwidth=2 expandtab:

