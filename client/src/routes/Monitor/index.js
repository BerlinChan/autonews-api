import { injectReducer } from 'store/reducers'
import { injectSagas } from 'store/sagas'

export default (store) => ({
  path: 'monitor',
  breadcrumbName:'Monitor',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([
      './containers/MonitorContainer',
      './modules/monitor'
    ], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const monitor = require('./containers/MonitorContainer').default
      const reducer = require('./modules/monitor').default
      const sagas = require('./modules/monitor').sagas
      /*  Add the reducer to the store on key 'monitor'  */
      injectReducer(store, { key: 'monitor', reducer })
      injectSagas(store, { key: 'monitor', sagas })
      /*  Return getComponent   */
      cb(null, monitor)

    /* Webpack named bundle   */
    }, 'monitor')
  }
})
