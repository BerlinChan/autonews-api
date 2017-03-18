import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import {startSubmit, stopSubmit} from 'redux-form'
import {message, notification} from 'antd';
import config from '../../../utils/config'
import moment from 'moment'

// Constants
const Monitor_FETCH_REQUESTED = 'Monitor_FETCH_REQUESTED';
const Monitor_FETCH_SUCCESSED = 'Monitor_FETCH_SUCCESSED';
const Monitor_FETCH_FAILURE = 'Monitor_FETCH_FAILURE';
const Monitor_SET_origin = 'Monitor_SET_origin';
const Monitor_PUSH_newsList = 'Monitor_PUSH_newsList';

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
  [Monitor_FETCH_SUCCESSED]: (state, action) => state.set('isFetching', false),
  [Monitor_FETCH_FAILURE]: (state, action) => state.setIn(['isFetching'], false),
  [socket_Monitor_ON_News_Added]: (state, action) => {
    let newList = state.getIn(['newsList', action.data.origin_key, 'list']).toJS();
    newList.unshift(action.data);

    return state.setIn(['newsList', action.data.origin_key, 'list'], Immutable.fromJS(newList));
  },
  [Monitor_SET_origin]: (state, action) => {
    let tempNewsList = {};
    action.data.length && action.data.forEach((item, index) => {
      tempNewsList[item.key] = {origin_name: item.name, list: []};
    });

    return state.set('origin', Immutable.fromJS(action.data))
      .set('newsList', Immutable.fromJS(tempNewsList));
  },
  [Monitor_PUSH_newsList]: (state, action) => {
    let tempList = state.get('newsList').toJS();
    action.data.length && action.data.forEach((item, index) => {
      tempList[item.origin_key].list.push({...item, key: item._id});
    });

    return state.set('newsList', Immutable.fromJS(tempList));
  },

};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  newsList: Immutable.fromJS({
    /*  'ctdsb': {
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
     },*/
  }),
  origin: Immutable.List(
    /* [
     {"_id": "58caa435de0f2f724e27148", "key": "ctdsb", "name": "楚天都市报"},
     {"_id": "58caa435de0f2f724e2e7149", "key": "hbrb", "name": "湖北日报"},
     {"_id": "58caa435de0f2f724e2e714a", "key": "sxwb", "name": "三峡晚报"},
     {"_id": "58caa435de0f2f724e2e714b", "key": "ctkb", "name": "楚天快报"},
     {"_id": "58caa435de0f2f724e2e714c", "key": "ctjb", "name": "楚天金报"},
     {"_id": "58caa435de0f2f724e2e714d", "key": "txdcw", "name": "腾讯大楚网"},
     {"_id": "58caa435de0f2f724e2e714e", "key": "ctsb", "name": "楚天时报"},
     ] */
  ),
});
export default function monitorReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state
}


// Sagas
function* watchFetchMonitor() {
  while (true) {
    const {}=yield take(Monitor_FETCH_REQUESTED);

    //fetch origin list
    const originList = yield call(request,
      config.API_SERVER + `getOrigin`,
    );
    if (!originList.err) {
      yield put({type: 'Monitor_SET_origin', data: originList.data.data});
    } else {
      let errBody = yield originList.err.response.json();
      notification.error({
        message: 'Error',
        description: errBody.msg,
      });
    }

    //fetch today news list
    const newsList = yield call(request,
      config.API_SERVER + `getSpecificList?beginDate=${new Date(moment().format('YYYY-MM-DD'))}&endDate=${new Date(moment().add({days: 1}).format('YYYY-MM-DD'))}&origin_key=ctdsb,ctjb,ctkb,ctsb,txdcw,hbrb,sxwb`,
    );
    if (!newsList.err) {
      yield put({type: 'Monitor_PUSH_newsList', data: newsList.data.data});
    } else {
      let errBody = yield newsList.err.response.json();
      notification.error({
        message: 'Error',
        description: errBody.msg,
      });
    }

    yield put({type: 'Monitor_FETCH_SUCCESSED', data: originList.data.data});
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
