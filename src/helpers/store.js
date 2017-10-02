import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
import socketMiddleware from './socketMiddleware'

// import getRootReducer from "./reducers";
// export default function getStore(navReducer) {
//     const store = createStore(
//         getRootReducer(navReducer),
//         undefined,
//         applyMiddleware(thunk)
//     );

//     return store;
// }


export default function configureStore(initialState) {
  return createStore(reducer, initialState,
      applyMiddleware(thunk, socketMiddleware)
  )
  // createStore(reducer, [preloadedState], [enhancer]) // preloadedState - when init from background
}
