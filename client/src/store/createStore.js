import {applyMiddleware, compose, createStore} from 'redux'
import {routerMiddleware} from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import makeRootReducer from './reducers'
import {injectSagas} from './sagas'
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import config from '../utils/config'
function optimisticExecute(action, emit, next, dispatch) {
  emit('action', action);
  next(action);
}
let socket = io(config.API_SERVER);

export default (initialState = {}, history) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const socketIoMiddleware = createSocketIoMiddleware(socket, "socket/");
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [socketIoMiddleware, sagaMiddleware, routerMiddleware(history)];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];
  if (__DEBUG__) {
    const devToolsExtension = window.devToolsExtension;
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
  );
  window.store = store;
  store.asyncReducers = {};
  store.asyncSagas = {};
  store.runSaga = (saga) => {
    sagaMiddleware.run(saga)
  };
  const sagas = require('redux/Global').sagas;
  injectSagas(store, {key: 'global', sagas});
  injectSagas(store,
    {key: 'monitor', sagas: require('../routes/Monitor/modules/monitor').sagas}
  );

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
