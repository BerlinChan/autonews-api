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
const Monitor_EMIT_REQUESTED = 'socket/Monitor_EMIT_REQUESTED';
const Monitor_EMIT_RECEIVED = 'Monitor_EMIT_RECEIVED';


// Actions
function fetchMonitor() {
  return {
    type: Monitor_FETCH_REQUESTED
  }
}
function emitMsg(msg) {
  return {
    type: Monitor_EMIT_REQUESTED,
    msg,
  }
}

export const actions = {
  fetchMonitor,
  emitMsg,
};

// Action Handlers
const ACTION_HANDLERS = {
  [Monitor_FETCH_REQUESTED]: (state) => state.setIn(['isFetching'], true),
  [Monitor_FETCH_SUCCESSED]: (state, payload) => state.setIn(['isFetching'], false),
  [Monitor_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
  [Monitor_EMIT_REQUESTED]: (state, action) => {
    console.log(1111, action.msg);
    return state;
  },
  [Monitor_EMIT_RECEIVED]: (state, action) => {
    console.log(2222, action.msg);
    return state;
  },
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  list: Immutable.fromJS([{key: '001'},]),
});
export default function monitorReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state
}


// Sagas
function* watchFetchMonitor() {
  while (true) {

    yield take(Monitor_FETCH_REQUESTED);
    // let {data, err} = yield call(asyncWait)
    // if (!err)

    yield put({type: 'Monitor_FETCH_SUCCESSED'});
    // else {
    //
    //   yield put({type: 'Monitor_FETCH_FAILURE', error: err.toString()})
    // }
  }
}
function* watchEmitReq() {
  while (true) {
    yield take(Monitor_EMIT_REQUESTED);
    console.log('emit fire')
  }
}
function* watchReceived() {
  while (true) {
    const {msg} = yield take(Monitor_EMIT_RECEIVED);
    console.log(234234234, msg);
  }
}


export const sagas = [
  watchFetchMonitor,
  watchEmitReq,
  watchReceived,
];
