import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import {startSubmit, stopSubmit} from 'redux-form'
import {message, notification} from 'antd';
import config from 'utils/config'


// Constants
const Monitor_FETCH_REQUESTED = 'Monitor_FETCH_REQUESTED';
const Monitor_FETCH_SUCCESSED = 'Monitor_FETCH_SUCCESSED';
const Monitor_FETCH_FAILURE = 'Monitor_FETCH_FAILURE';

const Monitor_ON_Socket_Connection = 'socket/Monitor_ON_Socket_Connection';
const Monitor_Socket_News_Added = 'socket/Monitor_News_Added';


// Actions
function fetchMonitor(monitorOptions) {
  return {
    type: Monitor_FETCH_REQUESTED,
    monitorOptions,
  }
}

export const actions = {
  fetchMonitor,
};

// Action Handlers
const ACTION_HANDLERS = {
  [Monitor_FETCH_REQUESTED]: (state) => state.setIn(['isFetching'], true),
  [Monitor_FETCH_SUCCESSED]: (state, action) => state.setIn(['isFetching'], false)
    .set('monitorOptions', Immutable.fromJS(action.monitorOptions)),
  [Monitor_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  newsList: Immutable.List(),
  monitorOptions: Immutable.fromJS({}),
});
export default function monitorReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state
}


// Sagas
function* watchFetchMonitor() {
  while (true) {
    const {}=yield take(Monitor_FETCH_REQUESTED);

    yield put({type: 'Monitor_FETCH_SUCCESSED'});
    yield put({type: Monitor_ON_Socket_Connection});
  }
}
function* watchSocketNewsAdded() {
  while (true) {
    const {news} = yield take(Monitor_Socket_News_Added);

  }
}


export const sagas = [
  watchFetchMonitor,
  watchSocketNewsAdded,
];
