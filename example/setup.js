
var d = React.DOM

var Party = React.createClass({
  getDefaultProps: function () {
    return {
      name: 'Jim',
      number: 3
    }
  },
  render: function () {
    var children = []
    for (var i=0; i<this.props.number; i++) {
      children.push(d.span({key: i}, 'Something ' + i*i))
    }
    return d.div({},
      d.span({}, this.props.name),
      0 === this.props.number ? 'No children' : children)
  }
})

React.renderComponent(fusionlib.Main({
  components: {
    'party.jsx': {
      cls: Party,
      fixture: {
        simple: {
          name: 'Sue',
          number: 2
        },
        none: {
          name: 'Steve',
          number: 0
        }
      }
    }
  },
  changeFixture: function () {},
  newFixture: function () {},
}), document.getElementById('main'))


