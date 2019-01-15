export const dispatch = (services) => (action) => action(services)

export const setState = (services, dispatchContext) => (reducer) => {
  const prevState = dispatchContext.getState()
  const newState = reducer(dispatchContext.getState())
  if(prevState !== newState) {
    dispatchContext.setState(newState)
    dispatchContext.fireStateChange && dispatchContext.fireStateChange(newState)
  }
}

export const hold = (services, dispatchContext) => {
  const { fireStateChange } = dispatchContext
  if(fireStateChange) {
    Object.assign(dispatchContext, {
      holdLevel: 0,
      changedInHold: false,
      fireStateChange: () => {
        if(dispatchContext.holdLevel === 0) {
          fireStateChange()
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
        fireStateChange()
      }
    }
  } else {
    return (f) => f(services)
  }
}