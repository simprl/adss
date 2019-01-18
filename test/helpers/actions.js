const updater = (reducer) => (store) => ({...store, y1: reducer(store.y1)})

const selector = (store) => store.y1

const stateAction = (reducer) => ({setState}) => setState(updater(reducer))

const init = () => stateAction(() => ({ value: 0, v2: 'ssssss' }))

const increment = (value) => stateAction((state) => ({...state, value: state.value + value }))

const decrement = (value) => stateAction((state) => ({...state, value: state.value - value }))

const incdec = (value1, value2) => async ({hold, dispatch}) => {
    dispatch(increment(value1))
    await delay(1000)
    dispatch(decrement(value2))
}

const incdecHolded = (value1, value2) => async ({hold, dispatch}) => {
    await hold(async ({dispatch}) => {
        dispatch(increment(value1))
        await delay(1000)
        dispatch(decrement(value2))
    })
}

const delay  = (t) => new Promise((resolve) => setTimeout(resolve, t))

const setV2 = (v2) => stateAction((state) => ({...state, v2 }))

exports.init = init
exports.increment = increment
exports.decrement = decrement
exports.incdec = incdec
exports.incdecHolded = incdecHolded
exports.setV2 = setV2