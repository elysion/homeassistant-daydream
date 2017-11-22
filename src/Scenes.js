import React, {Component} from 'react';
import './Scenes.css';
import Bacon from 'baconjs'
import classNames from 'classnames'

const h = React.DOM

const sceneClickedBus = new Bacon.Bus()
const sceneClicked = sceneClickedBus.toProperty()

class Scenes extends Component {
  render() {
    var that = this
    return h.ul({ className: 'item-list' },
      this.props.scenes.map((scene, index) =>
        h.li({
          key: `scene-${index}`,
          className: classNames({
            'scene-item': true
          }),
          onClick: () => sceneClickedBus.push(scene.entityId)
        },
          h.div({ className: 'scene-item-content' }, scene.name))))
  }
}

export {
  Scenes,
  sceneClicked
};
