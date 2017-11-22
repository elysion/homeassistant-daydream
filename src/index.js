import React from 'react';
import ReactDOM from 'react-dom';
import Sensors from './Sensors'
import {Switches, switchClicked} from './Switches'
import {Scenes, sceneClicked} from './Scenes'
import './index.css';
import Bacon from 'baconjs'
import $ from 'jquery'
import R from 'ramda'
import {homeAssistantApiUrl, sensorEntities, switchEntities, homeAssistantApiPassword} from './settings'

const startsWith = R.invoker(1, 'startsWith');
const h = React.DOM

const headers = {
  'x-ha-access': homeAssistantApiPassword,
  'content-type': 'application/json'
}

const randomCoordinate = max => Math.round(Math.random() * max)

const coordinates = Bacon.once().map(() => ({ x: randomCoordinate(50), y: randomCoordinate(200) }))

const getEntityStateStreams = entityIds => 
  Bacon.combineAsArray(R.keys(entityIds)
    .map(entity => Bacon.fromPromise($.ajax({
      url: `${homeAssistantApiUrl}/states/${entity}`,
      headers: headers
    }))))

const sensorStatesStream = getEntityStateStreams(sensorEntities)
const switchStatesStream = getEntityStateStreams(switchEntities)

const scenes = Bacon.fromPromise($.ajax({
  url: `${homeAssistantApiUrl}/states`,
  headers: headers
}))
  .map(R.filter(R.pipe(R.prop('entity_id'), startsWith('scene'))))
  .map(R.map(data => ({name: data.attributes.friendly_name, entityId: data.entity_id})))

const sensorData = sensorStatesStream.map(R.map(data => ({
  name: sensorEntities[data.entity_id].title,
  entityId: data.entity_id,
  value: data.state + (data.attributes.unit_of_measurement || '')
})))

const switchData = switchStatesStream.map(R.map(data => ({
  name: switchEntities[data.entity_id].title,
  isOn: data.state === "on"
})))

sceneClicked.onValue(entityId => 
  $.post(`${homeAssistantApiUrl}/services/homeassistant/turn_on`, JSON.stringify({entity_id: entityId})))

switchClicked.onValue(entityId => 
  $.post(`${homeAssistantApiUrl}/services/homeassistant/toggle`, JSON.stringify({entity_id: entityId})))

Bacon.combineAsArray(coordinates, sensorData, switchData, scenes).onValue(([xy, sensors, switches, scenes]) =>
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
      React.createElement(Scenes, {scenes}),
      React.createElement(Switches, {switches})),
    document.getElementById('root')
  ))
