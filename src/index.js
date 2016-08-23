import React from 'react';
import ReactDOM from 'react-dom';
import Sensors from './Sensors'
import {Scenes, sceneClicked} from './Scenes'
import './index.css';
import Bacon from 'baconjs'
import $ from 'jquery'
import R from 'ramda'
import {homeAssistantApiUrl, sensorEntities, homeAssistantApiPassword} from './settings'

const startsWith = R.invoker(1, 'startsWith');
const h = React.DOM

const headers = {
  'x-ha-access': homeAssistantApiPassword,
  'content-type': 'application/json'
}

const randomCoordinate = max => Math.round(Math.random() * max)

const coordinates = Bacon.once().map(() => ({ x: randomCoordinate(50), y: randomCoordinate(200) }))
const sensorStreams = sensorEntities
  .map(entity => Bacon.fromPromise($.ajax({
    url: `${homeAssistantApiUrl}/states/${entity}`,
    headers: headers
  })))

const scenes = Bacon.fromPromise($.ajax({
  url: `${homeAssistantApiUrl}/states`,
  headers: headers
}))
  .map(R.filter(R.pipe(R.prop('entity_id'), startsWith('scene'))))
  .map(R.map(data => ({name: data.attributes.friendly_name, entityId: data.entity_id})))

const sensorData = Bacon.combineAsArray(sensorStreams).log('values').map(R.map(data => ({
  name: data.attributes.friendly_name,
  value: data.state + data.attributes.unit_of_measurement
})))

sceneClicked.onValue(entityId => {
  $.post(`${homeAssistantApiUrl}/services/homeassistant/turn_on`, JSON.stringify({entity_id: entityId}))
})

Bacon.combineAsArray(coordinates, sensorData, scenes).onValue(([xy, sensors, scenes]) =>
  ReactDOM.render(
    h.div({
      id: 'wrapper',
      className: 'wrapper',
      style: {
        marginLeft: xy.x,
        marginTop: xy.y
      }
    },
      React.createElement(Sensors, {sensors}),
      React.createElement(Scenes, {scenes})),
    document.getElementById('root')
  ))
