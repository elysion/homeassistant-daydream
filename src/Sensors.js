import React, {Component} from 'react';
import './Sensors.css';

class Sensors extends Component {
  render() {

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
