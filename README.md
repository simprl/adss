# ADSS
Action->Dispatch->Services->Store flow
## Installation
```sh
npm install --save adss
```
## Usage
Create logic object:
```js
import { createLogic } from 'adss'
const logic = createLogic()
```
Now you can take state:
```js
logic.getState()
```
Or dispatch action:
```js
const action = actions.action1(value1, value2) 
logic.dispatch(action)
```
Action is a function that call available services 
```js
const actionX = (services) => {
    const { getState, setState, dispatch, serviceX, ...otherServices }  = services
    const state = getState()
    setState((state) => ({...state, v1: arg1}) ) 
    dispatch(actionY) //dispatch another action
    serviceX()  //call your own service
}
```
For create actions use HOF:
```js
const initValue = () => ({ setState }) => {
    setState((state) => ({...state, v1: 0}) ) 
}
const incrementValue = (v) => ({ setState }) => {
    setState((state) => ({...state, v1: state.v1 + v}) ) 
}
const multiplyValue = (v) => ({ setState }) => {
    setState((state) => ({...state, v1: state.v1 * v}) ) 
}
const incMultValue = (inc, mult) => ({ dispatch }) => {
    dispatch(incrementValue(inc))
    dispatch(multiplyValue(mult))
}
const incMultValueOnce = (inc, mult) => ({ hold }) => { 
    hold(({ dispatch }) => {
        dispatch(incrementValue(inc))
        dispatch(multiplyValue(mult))
    })
}
```
You can use callback if you want to change something each time when store changed
```js
const onStateChangeCallback = (state) => conslole.log(state)
logic.subscribe(onStateChangeCallback)

logic.dispatch(actions.initValue())
// callback call once


logic.dispatch(actions.incMultValue(2,5))
// callback call twice
// because setState service will call twice


logic.dispatch(actions.incMultValueOnce(2,5))
// callback call once
// because 'setState' service held by 'hold' service


logic.unsubscribe(onStateChangeCallback)
```
Callback will help if we need rerender something in view each time when state change

You can set initial state, your own services and servicesFactories:
```js
import { createLogic, services, servicesFactories } from 'adss'
const initialState = {}
const myServices = {
    ...services,
    log: (text) => console.log(text)
}
const myServicesFactories = {
    ...servicesFactories,
    logState: (services, dispatchContext) => {
        dispatchContext.myCounter = 1
        return () => console.log(dispatchContext.myCounter, dispatchContext.getState())
    }
}
const logic = createLogic({}, myServices, myServicesFactories)
```

## How to write actions
It is proposed to use one file to aggregate logic of one part of the business logic. 
This file contains:
- updater
- selectors
- actions
- init action

### Updater part
```js
export const updater = (reducer) => (store) => ({...store, partX: reducer(store.partX)})
```
This is HOF that describe how to update main store. 
It get global state and return new one with changed only one part.
You can use immutable js or other libraries for implement this

### Selectors part
```js
export const selector = (store) => store.partX
export const selectPartXSum = (store) => store.partX.v1 + store.partX.v2
```
This function describe how to select part from the main store.
You can use reselect or other libraries for implement this

### Actions part
```js
const stateAction = (reducer) => ({setState}) => setState(updater(reducer))

const incrementValue = (v) => stateAction((state) => ({...state, v1: state.v1 + v}) )

const multiplyValue = (v) => stateAction((state) => ({...state, v1: state.v1 * v}) )

const incMultValue = (inc, mult) => ({ dispatch }) => {
    dispatch(incrementValue(inc))
    dispatch(multiplyValue(mult))
}

const incMultValueOnce = (inc, mult) => ({ hold }) => { 
    hold(({ dispatch }) => {
        dispatch(incrementValue(inc))
        dispatch(multiplyValue(mult))
    })
}
```
These is action creators that return actions. Action use defined services for change state

### Init actions part
```js
const init = () => stateAction((state) => ({...state, v1: 0}) )
```
This is init action creator. You should dispatch it when init application

## Connect to React

Use npm module react-adss

## License
MIT