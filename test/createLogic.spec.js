// import {createLogic} from '..'
// import * as actions from './helpers/actions'

const adss = require('..')
const actions = require('./helpers/actions')

const { createLogic } = adss
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
    it('actions', async () => {
        let mockCallback = jest.fn(state => {})
        const logic = createLogic()
        logic.subscribe(mockCallback)
        logic.dispatch(actions.init())
        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toEqual({y1:{ value: 0, v2: 'ssssss' }});
        expect(logic.getState()).toEqual({y1:{ value: 0, v2: 'ssssss' }})
        logic.unsubscribe(mockCallback)

        mockCallback = jest.fn(state => {})
        logic.subscribe(mockCallback)
        await logic.dispatch(actions.incdec(2,3))
        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toEqual({y1:{ value: -1, v2: 'ssssss' }});
        expect(logic.getState()).toEqual({y1:{ value: -1, v2: 'ssssss' }})
        logic.unsubscribe(mockCallback)
    })
})