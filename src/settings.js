const homeAssistantApiUrl = 'http://'
const sensorEntities = {
  'sensor.sun': {
    title: 'Sun'
  },
} // sensors to be shown in the UI. Entity ids as keys, an object with title property for defining the text to be shown in the UI.

const switchEntities = {
  'switch.light_therapy_lamps_5': {
    title: 'Therapy lamps'
  }
}

const homeAssistantApiPassword = ''

export {
  homeAssistantApiUrl,
    sensorEntities,
    switchEntities,
    homeAssistantApiPassword
}
