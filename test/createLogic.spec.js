// import {createLogic} from '..'
// import * as actions from './helpers/actions'

const adss = require('..')
const actions = require('./helpers/actions')

const { createLogic, services, servicesFactories } = adss
describe('createLogic', () => {
    it('exposes the public API', () => {
        const logic = createLogic()
        const methods = Object.keys(logic)
        expect(methods.length).toBe(4)
        expect(methods).toContain('dispatch')
        expect(methods).toContain('getState')
        expect(methods).toContain('subscribe')
        expect(methods).toContain('unsubscribe')
    })
    it('actions init', async () => {
        let mockCallback = jest.fn(state => {})
        const logic = createLogic()
        logic.subscribe(mockCallback)
        logic.dispatch(actions.init())
        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toEqual({y1:{ value: 0, v2: 'ssssss' }});
        expect(logic.getState()).toEqual({y1:{ value: 0, v2: 'ssssss' }})
        logic.unsubscribe(mockCallback)
    })
    it('actions subscribe', async () => {
        const logic = createLogic()
        logic.dispatch(actions.init())

        const mockCallback = jest.fn(state => {})
        logic.subscribe(mockCallback)
        await logic.dispatch(actions.incdec(2,3))
        const calls = mockCallback.mock.calls.length
        expect(logic.getState()).toEqual({y1:{ value: -1, v2: 'ssssss' }})
        logic.unsubscribe(mockCallback)
        await logic.dispatch(actions.incdec(2,3))
        expect(logic.getState()).toEqual({y1:{ value: -2, v2: 'ssssss' }})
        expect(mockCallback.mock.calls.length).toBe(calls);
    })
    it('actions incdec', async () => {
        const logic = createLogic()
        logic.dispatch(actions.init())

        const mockCallback = jest.fn(state => {})
        logic.subscribe(mockCallback)
        await logic.dispatch(actions.incdec(2,3))
        expect(mockCallback.mock.calls.length).toBe(2);
        expect(mockCallback.mock.calls[0][0]).toEqual({y1:{ value: 2, v2: 'ssssss' }});
        expect(mockCallback.mock.calls[1][0]).toEqual({y1:{ value: -1, v2: 'ssssss' }});
        expect(logic.getState()).toEqual({y1:{ value: -1, v2: 'ssssss' }})
        logic.unsubscribe(mockCallback)
    })

    it('actions incdecHolded', async () => {
        const logic = createLogic()
        logic.dispatch(actions.init())

        const mockCallback = jest.fn(state => {})
        logic.subscribe(mockCallback)
        await logic.dispatch(actions.incdecHolded(2,3))
        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toEqual({y1:{ value: -1, v2: 'ssssss' }});
        expect(logic.getState()).toEqual({y1:{ value: -1, v2: 'ssssss' }})
        logic.unsubscribe(mockCallback)
    })
    it('custom service', async () => {
        const logic = createLogic({}, {
            ...services,
            //todo: write servises for test
        })
    })
})