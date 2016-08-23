import React, {Component} from 'react';
import './Scenes.css';
import Bacon from 'baconjs'
import classNames from 'classnames'

const h = React.DOM

const sceneClickedBus = new Bacon.Bus()
const sceneClicked = sceneClickedBus.toProperty()

class Scenes extends Component {
  state = {pressed: ''}
  render() {
    var that = this
    return h.ul({ className: 'item-list' },
      this.props.scenes.map((scene, index) =>
        h.li({
          key: `scene-${index}`,
          className: classNames({
            'scene-item': true,
            'scene-item_pressed': this.state.pressed === scene.entityId
          }),
          onClick: () => sceneClickedBus.push(scene.entityId),
          onMouseDown: function () {that.setState({pressed: scene.entityId})},
          onMouseUp: function () {that.setState({pressed: ''})}
        },
          h.div({ className: 'scene-item-content' }, scene.name))))
  }
}

export {
  Scenes,
  sceneClicked
};
