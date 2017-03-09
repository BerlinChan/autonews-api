import {applyMiddleware, compose, createStore} from 'redux'
import {routerMiddleware} from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import makeRootReducer from './reducers'
import {injectSagas} from './sagas'
export default (initialState = {}, history) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const sagaMiddleware = createSagaMiddleware()
  const middleware = [sagaMiddleware, routerMiddleware(history)]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEBUG__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  window.store = store;
  store.asyncReducers = {}
  store.asyncSagas = {}
  store.runSaga = (saga) => {
    sagaMiddleware.run(saga)
  }
  const sagas = require('redux/Global').sagas;
  injectSagas(store, {key: 'global', sagas})

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
