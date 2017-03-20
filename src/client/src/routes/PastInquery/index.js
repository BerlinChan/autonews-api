import {injectReducer} from 'store/reducers'
import {injectSagas} from 'store/sagas'

export default (store) => ({
  path: 'pastInquery',
  breadcrumbName: 'PastInquery',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './containers/PastInqueryContainer',
      './modules/pastInquery'
    ], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const pastInquery = require('./containers/PastInqueryContainer').default;
      const reducer = require('./modules/pastInquery').default;
      const sagas = require('./modules/pastInquery').sagas;
      /*  Add the reducer to the store on key 'pastInquery'  */
      injectReducer(store, {key: 'pastInquery', reducer});
      injectSagas(store, {key: 'pastInquery', sagas});
      /*  Return getComponent   */
      cb(null, pastInquery);

      /* Webpack named bundle   */
    }, 'pastInquery')
  }
})
