import * as services from './services'
import * as servicesFactories from './servicesFactories'

export function createLogic (initServices = services, _servicesFactories = servicesFactories) {
  let _state = {}
  initServices = {
    ...initServices,
    getState: () => _state,
  }

  return {
    getState: () => _state,
    dispatch: (action, onStateChange) => {
      const context = {
        onStateChange,
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
  }
}