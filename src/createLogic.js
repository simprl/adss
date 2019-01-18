import * as services from './services'
import * as servicesFactories from './servicesFactories'

const $$C = Symbol()
const $$CS = Symbol()

export function createLogic (_state = {}, initServices = services, _servicesFactories = servicesFactories) {
  initServices = {
    ...initServices,
    getState: () => _state,
  }
  {
    const properties = {}
    for (const [key, serviceFactory] of Object.entries(_servicesFactories)) {
      properties[key] = {
        get: function() {
          let service = this[$$CS].get(key)
          if (!service) {
            service = serviceFactory(this, this[$$C])
            this[$$CS].set(key, service)
          }
          return service
        }
      }
    }
    Object.defineProperties(initServices, properties)
  }
  let listeners = []

  const defContext = {
    fireStateChange: () => {
      for(const onchange of listeners) {
        onchange(_state)
      }
    },
    getState: () => _state,
    setState: (state) => {
        _state = state
    }
  }

  return {
    getState: () => _state,
    dispatch: (action) => {
      const services = Object.create(initServices)
      services[$$CS] = new Map()
      services[$$C] = Object.create(defContext)
      return action(services)
    },
    subscribe: (listener) => {
      listeners.push(listener)
    },
    unsubscribe: (listener) => {
      listeners = listeners.filter((item) => item !== listener)
    },
  }
}