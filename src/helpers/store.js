import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
import socketMiddleware from './socketMiddleware'

export default function configureStore(initialState) {
  return createStore(reducer, initialState,
    applyMiddleware(thunk, socketMiddleware)
  )
}
