import React, {Component} from 'react';
import './Sensors.css';

const h = React.DOM

const pad = str => val => (str + val).slice(-str.length)
const pad00 = pad('00')

class Sensors extends Component {
  render() {

    var now = new Date()
    return h.ul({ className: 'item-list' },
      h.li({
          className: 'sensor-item',
          key: `sensor-time`
        },
        h.div({
            className: 'sensor-item-header',
            style: {
              marginTop: 39,
              top: -14,
              position: 'relative'
            }
          }, (pad00(now.getHours()) + ':' + pad00(now.getMinutes()))
        )),
        this.props.sensors.map((sensor, index) =>
          h.li({
              className: 'sensor-item',
              key: `sensor-${index}`
            },
            h.div({ className: 'sensor-item-header' }, sensor.name),
            h.div({ className: 'sensor-item-content' }, sensor.value)
          )))
  }
}

export default Sensors;
