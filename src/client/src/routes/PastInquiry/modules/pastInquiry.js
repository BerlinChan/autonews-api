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
const PastInquiry_SET_formValue = 'PastInquiry_SET_formValue';


// Actions
function onDestory() {
  return {
    type: PastInquiry_ON_destroy
  }
}
function fetchPastInquiry(origin = '', beginDate = new Date(moment().format('YYYY-MM-DD')), endDate = new Date(moment().add({day: 1}).format('YYYY-MM-DD')), keyword = '', current = 1, pageSize = 20) {
  return {
    type: PastInquiry_FETCH_REQUESTED,
    origin, beginDate, endDate, keyword, current, pageSize,
  }
}
function setFormValue(fields) {
  return {
    type: PastInquiry_SET_formValue,
    fields,
  }
}

export const actions = {
  fetchPastInquiry,
  onDestory,
  fetchOriginAndNews: globalActions.fetchOriginAndNews,
  setFormValue,
};

// Action Handlers
const ACTION_HANDLERS = {
  [PastInquiry_FETCH_REQUESTED]: (state) => state.setIn(['isFetching'], true),
  [PastInquiry_FETCH_SUCCESSED]: (state, action) => state.setIn(['isFetching'], false)
    .set('pastInquiryResult', Immutable.fromJS(action.data)),
  [PastInquiry_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
  [PastInquiry_SET_formValue]: (state, action) => state.set('form', state.get('form').mergeDeep(Immutable.fromJS(action.fields))),
  [PastInquiry_ON_destroy]: () => initialState,
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  pastInquiryResult: Immutable.fromJS({list: [], pagination: {}}),
  form: Immutable.fromJS({}),
});
export default function pastInquiryReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}


// Sagas
function* watchFetchPastInquiry() {
  while (true) {
    const {origin, beginDate, endDate, keyword, current, pageSize} = yield take(PastInquiry_FETCH_REQUESTED);

    const pastInquiry = yield call(request,
      config.API_SERVER + `pastInquiry?origin=${origin}&beginDate=${beginDate}&endDate=${endDate}&keyword=${keyword}&current=${current}&pageSize=${pageSize}`,
    );
    if (!pastInquiry.err) {
      yield put({type: PastInquiry_FETCH_SUCCESSED, data: pastInquiry.data.data});
    } else {
      let errBody = yield pastInquiry.err.response.statusText;
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
