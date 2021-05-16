import React, {Component} from 'react';
import './Settings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTools } from '@fortawesome/free-solid-svg-icons'
import Bacon from 'baconjs'

const settingsClickedBus = new Bacon.Bus()
const settingsClicked = settingsClickedBus.toProperty(false)
const entitySettingsBus = new Bacon.Bus()

const getEntitySettings = () => JSON.parse(window.localStorage['entitySettings'] || '{}')
const entitySettings = entitySettingsBus.toProperty(getEntitySettings())

class SettingsButton extends Component {
  render() {
    return <label className='settings-switch'>
      <input type='checkbox' onClick={e => settingsClickedBus.push(e.target.checked)}/>
        <span className='settings-button'>
          <FontAwesomeIcon icon={faTools} style={{width: '100%', height: '100%'}} />
        </span>
      </label>
  }
}

const setEntitySettings = (id, settings) => {
  window.localStorage.setItem('entitySettings', JSON.stringify({...getEntitySettings(), [id]: settings}))
  entitySettingsBus.push(getEntitySettings())
}
const settingsForEntity = id => getEntitySettings()[id] || {}
const getSetting = (id, name, defaultValue = undefined) =>  settingsForEntity(id)[name] || defaultValue
const getName = id => getSetting(id, 'name')
const isEnabled = id => getSetting(id, 'enabled', false)
const setSettingForEntity = (id, name, value) => {
  setEntitySettings(id, {...settingsForEntity(id), [name]: value})
}
const setEnabled = (id, enabled) => setSettingForEntity(id, 'enabled', enabled)
const setName = (id, name) => setSettingForEntity(id, 'name', name)

class SettingsItem extends Component {
  constructor(props) {
    super()
    this.state = {enabled: isEnabled(props.id), name: getName(props.id)}
  }

  render() { 
    return <li>
      <label className='settings-switch'>
        <input type='checkbox' checked={this.state.enabled} onChange={e => {this.setState({enabled: e.target.checked}); setEnabled(this.props.id, e.target.checked)}} />
        <span className='settings-item'>
          <span className='settings-item-id'>{this.props.id}</span>
          <input placeholder={this.props.placeholder} className='settings-item-name' onChange={e => {this.setState({name: e.target.value}); setName(this.props.id, e.target.value)}} value={this.state.name} />
        </span>
      </label>
    </li>
  }
}

const renderItem = ({entity_id, title, attributes: {friendly_name}}) => <SettingsItem {...{id: entity_id, name: title, placeholder: friendly_name}} />

class SettingsPanel extends Component {
  render() {
    return <ul className='no-style-list'>
      <li>
        <h2>Sensors</h2>
        <ul className='no-style-list'>
          {this.props.sensors.map(renderItem)}
        </ul>
      </li>
      <li>
        <h2>Scenes</h2>
        <ul className='no-style-list'>
          {this.props.scenes.map(renderItem)}
        </ul>
      </li>
      <li>
        <h2>Switches</h2>
        <ul className='no-style-list'>
          {this.props.switches.map(renderItem)}
        </ul>
      </li>
    </ul>
  }
}

export {
  SettingsButton,
  SettingsPanel,
  settingsClicked,
  entitySettings
}
