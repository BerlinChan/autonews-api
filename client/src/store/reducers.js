import {combineReducers} from 'redux'
import {routerReducer as router} from 'react-router-redux'
import {reducer as formReducer} from 'redux-form'
import global from 'redux/Global'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    form: formReducer,
    router,
    global,
    ...asyncReducers
  })
}

export const injectReducer = (store, {key, reducer}) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer