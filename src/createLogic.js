import * as servicesFactories from './servicesFactories'
//
// class CreateLogic {
//   constructor(services, servicesFactories){
//     this.state = {}
//     this.services = {
//       ...services,
//       getState: this.getState.bind(this)
//     }
//     this.servicesFactories = servicesFactories
//   }
//
//   getState() {
//     return this.state
//   }
//
//   dispatch(action, onStateChange) {
//     const context = {
//       onStateChange,
//       getState: this.getState.bind(this),
//       setState: (state) => {
//         this.state = state
//       }
//     }
//     const services = { ...this.services }
//     for(const [key, serviceFactory] of Object.entries(this.servicesFactories)) {
//       const service = serviceFactory(services, context)
//       if(service) {
//         services[key] = service
//       }
//     }
//
//     return action(services)
//   }
// }

export function createLogic (initServices = {}, _servicesFactories = servicesFactories) {
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