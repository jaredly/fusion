/** @jsx React.DOM */

var Buttons = module.exports = React.createClass({
  displayName: 'Buttons',
  getDefaultProps: function () {
    return {
      value: '',
      onChange: function (what) {console.log('changed to ', what)},
      options: [['Default', '']]
    }
  },
  render: function () {
    var onChange = this.props.onChange
      , current = this.props.value
    return (
      <div className='fusion_buttons'>
        {
          this.props.options.map(function (option) {
            var cls = 'fusion_buttons_button'
            if (option[1] === current) cls += ' fusion_buttons_button--selected'
            return (
              <button
                className={cls}
                onClick={onChange.bind(null, option[1])}>{option[0]}</button>
            )
          })
        }
      </div>
    )
  }
})

/*
    <select onChange={this.selectProps} className='fusion-props' value={this.state.currentProps}>
      <option value='__default__'><em>default</em></option>
      {
        props.map(function (name) {
          return <option value={name}>{name}</option>
        })
      }
    </select>
*/

// vim: set tabstop=2 shiftwidth=2 expandtab:

