import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import {startSubmit, stopSubmit} from 'redux-form'
import {message, notification} from 'antd';
import config from '../../../utils/config'

// Constants
const Monitor_FETCH_REQUESTED = 'Monitor_FETCH_REQUESTED';
const Monitor_FETCH_SUCCESSED = 'Monitor_FETCH_SUCCESSED';
const Monitor_FETCH_FAILURE = 'Monitor_FETCH_FAILURE';

const socket_Monitor_ON_News_Added = 'socket_Monitor_ON_News_Added';

// Actions
function fetchMonitor() {
  return {
    type: Monitor_FETCH_REQUESTED,
  }
}

export const actions = {
  fetchMonitor,
};

// Action Handlers
const ACTION_HANDLERS = {
  [Monitor_FETCH_REQUESTED]: (state) => state.setIn(['isFetching'], true),
  [Monitor_FETCH_SUCCESSED]: (state, action) => state.set('isFetching', false)
    .set('origin', Immutable.fromJS(action.data)),
  [Monitor_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
  [socket_Monitor_ON_News_Added]: (state, action) => {
    let newList = state.getIn(['newsList', action.data.origin_key, 'list']).toJS();
    newList.unshift(action.data);

    return state.setIn(['newsList', action.data.origin_key, 'list'], Immutable.fromJS(newList));
  },
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  newsList: Immutable.fromJS({
    'ctdsb': {
      origin_name: '楚天都市报',
      list: [
        {
          title: 'title',
          url: 'url',
          origin_key: 'origin',//来源
          date: new Date(),
        },
      ]
    },
    'hbrb': {
      origin_name: '湖北日报',
      list: [
        {
          title: 'title',
          url: 'url',
          origin_key: 'origin',//来源
          date: new Date(),
        },
      ]
    },
    'sxwb': {
      origin_name: '三峡晚报',
      list: [
        {
          title: 'title',
          url: 'url',
          origin_key: 'origin',//来源
          date: new Date(),
        },
      ]
    },
    'ctkb': {
      origin_name: '楚天快报',
      list: [
        {
          title: 'title',
          url: 'url',
          origin_key: 'origin',//来源
          date: new Date(),
        },
      ]
    },
    'ctjb': {
      origin_name: '楚天金报',
      list: [
        {
          title: 'title',
          url: 'url',
          origin_key: 'origin',//来源
          date: new Date(),
        },
      ]
    },
    'txdcw': {
      origin_name: '腾讯大楚网',
      list: [
        {
          title: 'title',
          url: 'url',
          origin_key: 'origin',//来源
          date: new Date(),
        },
      ]
    },
    'ctsb': {
      origin_name: '楚天时报',
      list: [
        {
          title: 'title',
          url: 'url',
          origin_key: 'origin',//来源
          date: new Date(),
        },
      ]
    },
  }),
  origin: Immutable.List(),
});
export default function monitorReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state
}


// Sagas
function* watchFetchMonitor() {
  while (true) {
    const {}=yield take(Monitor_FETCH_REQUESTED);

    let {data, err} = yield call(request,
      config.API_SERVER + `getOrigin`,
    );

    if (!err) {
      yield put({type: 'Monitor_FETCH_SUCCESSED', data: data.data});
    } else {
      let errBody = yield err.response.json();
      notification.error({
        message: 'Error',
        description: errBody.msg,
      });
    }
  }
}
function* watchSocketNewsAdded() {
  while (true) {
    const {news} = yield take(socket_Monitor_ON_News_Added);

  }
}


export const sagas = [
  watchFetchMonitor,
  watchSocketNewsAdded,
];
