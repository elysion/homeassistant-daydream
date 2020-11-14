import React, {Component} from 'react';
import './Switches.css';
import Bacon from 'baconjs'
import classNames from 'classnames'

const h = React.DOM

const switchClickedBus = new Bacon.Bus()
const switchClicked = switchClickedBus.toProperty()

class Switches extends Component {
  state = {}
  isOn(sw) {
    return this.state[sw.entityId] && this.state[sw.entityId].isOn !== undefined ? this.state[sw.entityId].isOn : sw.isOn
  }
  render() {
    return <ul className='item-list'>{
      this.props.switches.map((sw, index) =>
        <li
          key={`switch-${index}`}
          className={classNames({
            'switch-item': true,
            'switch-item__is-on': this.isOn(sw)
          })}
          onClick={() => {
            switchClickedBus.push(sw.entityId)
            this.setState({[sw.entityId]: {isOn: !this.isOn(sw)}})
          }}>
          <div className='switch-item-content'>{sw.name}</div>
        </li>
      )
    }</ul>
  }
}

export {
  Switches,
  switchClicked
};
