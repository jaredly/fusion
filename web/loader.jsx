/** @jsx React.DOM */

var Main = require('./main.jsx')
  , utils = require('./utils')

var Loader = module.exports = React.createClass({
  displayName: 'Loader',
  getInitialState: function () {
    var hash = window.location.hash
      , filename = ''
      , cssname = ''
      , loading = ''
      , parts
    if (hash && hash.indexOf('||') !== -1) {
      parts = hash.slice(1).split('||')
      filename = parts[0]
      cssname = parts[1]
    }
    return {
      filename: filename,
      cssname: cssname,
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
  changeCss: function (e) {
    this.setState({cssname: e.target.value})
  },
  changeName: function (e) {
    this.setState({filename: e.target.value})
  },
  register: function (component, file, data) {
    var components = this.state.components
    components[file] = {
      cls: component,
      file: file,
      fixture: data
    }
    this.setState({components: components})
  },
  load: function (filename, cssname) {
    window.location.hash = '#' + filename + '||' + cssname
    this.setState({
      filename: filename,
      cssname: cssname,
      components: {},
      loading: true
    })
    utils.addScript(filename, function (err) {
      if (err) {
        this.setState({
          loading: false,
          error: 'failed to load',
          fresh: true
        })
        return
      }
      this.setState({
        loading: false,
        fresh: false
      })
    }.bind(this))
    utils.addCss(cssname, function (err) {
      if (err) {
        console.error('Failed to load css!!!', err)
      }
    })
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
      error: 'failed to load',
      fresh: true
    })
  },
  loadit: function () {
    this.load(this.state.filename, this.state.cssname)
  },
  reload: function () {
    this.load(this.state.filename, this.state.cssname)
  },
  changeFixture: function (comp, pname, name, data, done) {
    var c = this.state.components[comp]
    if (pname !== name) {
      if (c.fixture[name]) return false
      delete c.fixture[pname]
    }
    c.fixture[name] = data
    // TODO update, don't mutate
    this.setState({components: this.state.components}, done)
  },
  newFixture: function (comp, name, data, done) {
    var c = this.state.components[comp]
    if (c.fixture[name]) return false
    c.fixture[name] = data
    // TODO update, don't mutate
    this.setState({components: this.state.components}, done)
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
        <input placeholder='JS Bundle' onChange={this.changeName} value={this.state.filename}/>
        <input placeholder='CSS Bundle' onChange={this.changeCss} value={this.state.cssname}/>
        <button onClick={this.loadit}>Load</button>
        {this.state.error && React.DOM.span({className: 'fusion-load-error'}, this.state.error)}
      </div>
    )
  }
})

// vim: set tabstop=2 shiftwidth=2 expandtab:

