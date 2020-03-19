import React, {Component} from 'react';
import './Scenes.css';
import Bacon from 'baconjs'
import classNames from 'classnames'

const sceneClickedBus = new Bacon.Bus()
const sceneClicked = sceneClickedBus.toProperty()

class Scenes extends Component {
  render() {
    return <ul className='item-list'>
      {this.props.scenes.map((scene, index) =>
        <li key={`scene-${index}`} className={classNames({'scene-item': true})} onClick={() => sceneClickedBus.push(scene.entityId)}>
          <div className='scene-item-content'>{scene.name}</div>
        </li>
      )}
    </ul>
  }
}

export {
  Scenes,
  sceneClicked
}
