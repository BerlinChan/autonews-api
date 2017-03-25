import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import {startSubmit, stopSubmit} from 'redux-form'
import {message, notification} from 'antd';
import config from 'utils/config'


// Constants
const PastInquery_FETCH_REQUESTED = 'PastInquery_FETCH_REQUESTED';
const PastInquery_FETCH_SUCCESSED = 'PastInquery_FETCH_SUCCESSED';
const PastInquery_FETCH_FAILURE = 'PastInquery_FETCH_FAILURE';
const PastInquery_ON_destory = 'PastInquery_ON_destory';


// Actions
function fetchPastInquery() {
  return {
    type: PastInquery_FETCH_REQUESTED
  }
}
function onDestory() {
  return {
    type: PastInquery_ON_destory
  }
}

export const actions = {
  fetchPastInquery,
  onDestory,
};

// Action Handlers
const ACTION_HANDLERS = {
  [PastInquery_FETCH_REQUESTED]: (state) => state.setIn(['isFetching'], true),
  [PastInquery_FETCH_SUCCESSED]: (state, payload) => state.setIn(['isFetching'], false),
  [PastInquery_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
  [PastInquery_ON_destory]: () => initialState,
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  list: Immutable.fromJS([{key: '001'},]),
});
export default function pastInqueryReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}


// Sagas
function* watchFetchPastInquery() {
  while (true) {

    yield take(PastInquery_FETCH_REQUESTED)
    // let {data, err} = yield call(asyncWait)
    // if (!err)

    yield put({type: 'PastInquery_FETCH_SUCCESSED'})
    // else {
    //
    //   yield put({type: 'PastInquery_FETCH_FAILURE', error: err.toString()})
    // }
  }
}


export const sagas = [
  watchFetchPastInquery,
];
