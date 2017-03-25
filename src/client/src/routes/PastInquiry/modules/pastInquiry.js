import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import {startSubmit, stopSubmit} from 'redux-form'
import {message, notification} from 'antd';
import config from 'utils/config'


// Constants
const PastInquiry_FETCH_REQUESTED = 'PastInquiry_FETCH_REQUESTED';
const PastInquiry_FETCH_SUCCESSED = 'PastInquiry_FETCH_SUCCESSED';
const PastInquiry_FETCH_FAILURE = 'PastInquiry_FETCH_FAILURE';
const PastInquiry_ON_destroy = 'PastInquiry_ON_destroy';


// Actions
function fetchPastInquiry() {
  return {
    type: PastInquiry_FETCH_REQUESTED
  }
}
function onDestory() {
  return {
    type: PastInquiry_ON_destroy
  }
}

export const actions = {
  fetchPastInquiry,
  onDestory,
};

// Action Handlers
const ACTION_HANDLERS = {
  [PastInquiry_FETCH_REQUESTED]: (state) => state.setIn(['isFetching'], true),
  [PastInquiry_FETCH_SUCCESSED]: (state, payload) => state.setIn(['isFetching'], false),
  [PastInquiry_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
  [PastInquiry_ON_destroy]: () => initialState,
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  list: Immutable.fromJS([{key: '001'},]),
});
export default function pastInquiryReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}


// Sagas
function* watchFetchPastInquiry() {
  while (true) {

    yield take(PastInquiry_FETCH_REQUESTED)
    // let {data, err} = yield call(asyncWait)
    // if (!err)

    yield put({type: 'PastInquiry_FETCH_SUCCESSED'})
    // else {
    //
    //   yield put({type: 'PastInquiry_FETCH_FAILURE', error: err.toString()})
    // }
  }
}


export const sagas = [
  watchFetchPastInquiry,
];
