import React from 'react';
import ReactDOM from 'react-dom';
import Sensors from './Sensors'
import {Switches, switchClicked} from './Switches'
import {Scenes, sceneClicked} from './Scenes'
import {SettingsButton, SettingsPanel, settingsClicked, entitySettings} from './Settings'
import './index.css';
import Bacon from 'baconjs'
import $ from 'jquery'
import R from 'ramda'
import {homeAssistantApiUrl, homeAssistantApiBearerToken} from './env'

const startsWith = R.invoker(1, 'startsWith');

$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Authorization', `Bearer ${homeAssistantApiBearerToken}`)
  }
})

const randomCoordinate = max => Math.round(Math.random() * max)

const coordinates = Bacon.once().map(() => ({ x: randomCoordinate(50), y: randomCoordinate(200) }))
const states = Bacon.fromPromise($.ajax(`${homeAssistantApiUrl}/states`))

const isRunnableEntity = R.pipe(R.prop('entity_id'), R.either(startsWith('scene'), startsWith('script')))
const isToggleableEntity = R.pipe(R.prop('entity_id'), R.anyPass([startsWith('input_boolean'), startsWith('switch'), startsWith('light')]))
const isShowableEntity = R.pipe(R.prop('entity_id'), startsWith('sensor'))

const scenesStream = states.map(R.filter(isRunnableEntity))
const switchesStream = states.map(R.filter(isToggleableEntity))
const sensorsStream = states.map(R.filter(isShowableEntity))

const mergeWithSettings = (settings, entities) => entities.map(entity => ({...entity, ...settings[entity.entity_id]}))
const scenesWithSettings = entitySettings.combine(scenesStream, mergeWithSettings)
const switchesWithSettings = entitySettings.combine(switchesStream, mergeWithSettings)
const sensorsWithSettings = entitySettings.combine(sensorsStream, mergeWithSettings)

const sceneDataForUI = data => ({
  name: data.name || data.attributes.friendly_name, 
  entityId: data.entity_id
})

const sensorDataForUI = data => ({
  name: data.name || data.attributes.friendly_name,
  value: data.state + (data.attributes.unit_of_measurement || '')
})

const switchDataForUI = data => ({
  name: data.name || data.attributes.friendly_name,
  entityId: data.entity_id,
  isOn: data.state === "on"
})

sceneClicked.onValue(entityId => 
  $.post(`${homeAssistantApiUrl}/services/homeassistant/turn_on`, JSON.stringify({entity_id: entityId})))

switchClicked.onValue(entityId => 
  $.post(`${homeAssistantApiUrl}/services/homeassistant/toggle`, JSON.stringify({entity_id: entityId})))

const isEnabled = entitySettings => ({entity_id}) => R.path([entity_id, 'enabled'], entitySettings)
const sortByName = R.sortBy(R.prop('name'))

Bacon.combineAsArray(coordinates, settingsClicked, scenesWithSettings, sensorsWithSettings, switchesWithSettings, entitySettings)
  .onValue(([xy, settingsOn, scenes, sensors, switches, entitySettings]) =>
  ReactDOM.render(
    <div>
      <SettingsButton/>
      {settingsOn ?
        <SettingsPanel {...{sensors, scenes, switches}}/> :
        <div id='wrapper' className='wrapper' style={{marginLeft: xy.x, marginTop: xy.y}}>
          <Sensors sensors={sortByName(sensors.filter(isEnabled(entitySettings)).map(sensorDataForUI))}/>
          <Scenes scenes={sortByName(scenes.filter(isEnabled(entitySettings)).map(sceneDataForUI))}/>
          <Switches switches={sortByName(switches.filter(isEnabled(entitySettings)).map(switchDataForUI))}/>
        </div>
      }
     </div>,
    document.getElementById('root')
  ))
