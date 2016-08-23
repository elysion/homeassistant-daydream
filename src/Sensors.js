import React, {Component} from 'react';
import './Sensors.css';

const h = React.DOM

class Sensors extends Component {
  render() {
    console.log(this.props.sensors)
    return h.ul({ className: 'item-list' },
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
