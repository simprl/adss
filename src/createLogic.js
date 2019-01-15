import * as services from './services'
import * as servicesFactories from './servicesFactories'

export function createLogic (initServices = services, _servicesFactories = servicesFactories) {
  let _state = {}
  initServices = {
    ...initServices,
    getState: () => _state,
  }

  let listeners = []

  const fireStateChange = () => {
    for(const onchange of listeners) {
      onchange(_state)
    }
  }

  return {
    getState: () => _state,
    dispatch: (action) => {
      const context = {
        fireStateChange,
        getState: () => _state,
        setState: (state) => {
          _state = state
        }
      }
      const services = { ...initServices }
      for(const [key, serviceFactory] of Object.entries(_servicesFactories)) {
        const service = serviceFactory(services, context)
        if(service) {
          services[key] = service
        }
      }

      return action(services)
    },
    subscribe: (listener) => {
      listeners.push(listener)
    },
    unsubscribe: (listener) => {
      listener = listeners.filter((item) => item !== listener)
    },
  }
}