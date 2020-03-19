import React, {Component} from 'react';
import './Sensors.css';

const pad = str => val => (str + val).slice(-str.length)
const pad00 = pad('00')

class Sensors extends Component {
  render() {

    var now = new Date()
    return <ul className='item-list'>
      {this.props.sensors.map((sensor, index) =>
        <li className='sensor-item' key={`sensor-${index}`}>
          <div className='sensor-item-header'>{sensor.name}</div>
          <div className='sensor-item-content'>{sensor.value}</div>
        </li>
      )}
    </ul>
  }
}

export default Sensors;
