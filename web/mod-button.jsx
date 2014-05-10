/** @jsx React.DOM */

var ModTree = require('modtree').ModTree

var ModButton = module.exports = React.createClass({
  displayName: 'ModButton',
  getDefaultProps: function () {
    return {
      nodes: {},
      clickable: [],
      onSelect: function (name) {console.log('selecting', name)},
      options: {}
    }
  },
  getInitialState: function () {
    return {
      showing: false
    }
  },
  open: function () {
    this.setState({showing: true})
  },
  close: function () {
    this.setState({showing: false})
  },
  onSelect: function (name) {
    this.close()
    this.props.onSelect(name)
  },
  tree: function () {
    if (!this.state.showing) return
    return (
      <div className='mod-button_popup'>
        <button className='mod-button_close' onClick={this.close}>&times;</button>
        <ModTree
          nodes={this.props.nodes}
          clickable={this.props.clickable}
          onSelect={this.onSelect}
          options={this.props.options}/>
      </div>
    )
  },
  render: function () {
    return (
      <div className='mod-button'>
        <button className='mod-button_button'
          onClick={this.open}>Graph</button>
        {this.tree()}
      </div>
    )
  }
})

// vim: set tabstop=2 shiftwidth=2 expandtab:

