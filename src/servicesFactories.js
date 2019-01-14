export const dispatch = (services) => (action) => action(services)

export const setState = (services, dispatchContext) => (reducer) => {
  const prevState = dispatchContext.getState()
  const newState = reducer(dispatchContext.getState())
  if(prevState !== newState) {
    dispatchContext.setState(newState)
    dispatchContext.onStateChange && dispatchContext.onStateChange(newState)
  }
}

export const hold = (services, dispatchContext) => {
  const { onStateChange } = dispatchContext
  if(onStateChange) {
    Object.assign(dispatchContext, {
      holdLevel: 0,
      changedInHold: false,
      onStateChange: (state) => {
        if(dispatchContext.holdLevel === 0) {
          onStateChange(state)
        } else {
          dispatchContext.changedInHold = true
        }
      }
    })
    return async (f) => {
      dispatchContext.holdLevel++
      await f(services)
      dispatchContext.holdLevel--
      if(dispatchContext.holdLevel === 0 && dispatchContext.changedInHold) {
        dispatchContext.changedInHold = false
        onStateChange(dispatchContext.getState())
      }
    }
  } else {
    return (f) => f(services)
  }
}