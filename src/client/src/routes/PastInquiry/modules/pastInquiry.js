import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import {notification} from 'antd';
import config from 'utils/config'
import moment from 'moment'
import {actions as globalActions} from '../../../redux/Global'

// Constants
const PastInquiry_FETCH_REQUESTED = 'PastInquiry_FETCH_REQUESTED';
const PastInquiry_FETCH_SUCCESSED = 'PastInquiry_FETCH_SUCCESSED';
const PastInquiry_FETCH_FAILURE = 'PastInquiry_FETCH_FAILURE';
const PastInquiry_ON_destroy = 'PastInquiry_ON_destroy';


// Actions
function onDestory() {
  return {
    type: PastInquiry_ON_destroy
  }
}
function fetchPastInquiry(origin = '', startDate = new Date(moment().format('YYYY-MM-DD')), endDate = new Date(moment().add({day: 1}).format('YYYY-MM-DD')), keyword = '', pageIndex = 0, pageSize = 20) {
  return {
    type: PastInquiry_FETCH_REQUESTED,
    origin, startDate, endDate, keyword, pageIndex, pageSize,
  }
}

export const actions = {
  fetchPastInquiry,
  onDestory,
  fetchOriginAndNews: globalActions.fetchOriginAndNews,
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
  pagination: Immutable.fromJS({}),
});
export default function pastInquiryReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}


// Sagas
function* watchFetchPastInquiry() {
  while (true) {
    const {origin, startDate, endDate, keyword, pageIndex, pageSize} = yield take(PastInquiry_FETCH_REQUESTED);

    const originList = yield call(request,
      config.API_SERVER + `pastInquiry?origin=${origin}&startDate=${startDate}&endDate=${endDate}&keyword=${keyword}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    );
    if (!originList.err) {
      yield put({type: PastInquiry_FETCH_SUCCESSED})
    } else {
      let errBody = yield originList.err.response.statusText;
      notification.error({
        message: 'Error',
        description: errBody,
      });
    }
  }
}


export const sagas = [
  watchFetchPastInquiry,
];
