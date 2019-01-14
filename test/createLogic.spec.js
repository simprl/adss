// import {createLogic} from '..'
// import * as actions from './helpers/actions'

const adss = require('..')
const actions = require('./helpers/actions')

const { createLogic } = adss
describe('createLogic', () => {
    it('exposes the public API', () => {
        const logic = createLogic()
        const methods = Object.keys(logic)
        expect(methods.length).toBe(2)
        expect(methods).toContain('dispatch')
        expect(methods).toContain('getState')
    })
    it('actions', async () => {
        const logic = createLogic()
        let mockCallback = jest.fn(state => {})
        logic.dispatch(actions.init(), mockCallback)
        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toEqual({y1:{ value: 0, v2: 'ssssss' }});
        expect(logic.getState()).toEqual({y1:{ value: 0, v2: 'ssssss' }})

        mockCallback = jest.fn(state => {})
        await logic.dispatch(actions.incdec(2,3), mockCallback)
        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toEqual({y1:{ value: -1, v2: 'ssssss' }});
        expect(logic.getState()).toEqual({y1:{ value: -1, v2: 'ssssss' }})
    })
})