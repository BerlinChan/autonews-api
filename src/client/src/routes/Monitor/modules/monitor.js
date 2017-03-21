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
      tempNewsList[item.key] = {origin_name: item.name, list: [], isFetched: false};
    });

    return state.set('origin', Immutable.fromJS(action.data))
      .set('newsList', Immutable.fromJS(tempNewsList));
  },
  [Monitor_PUSH_newsList]: (state, action) => {
    let tempList = state.getIn(['newsList', action.origin, 'list']).toJS();
    tempList = tempList.concat(action.data);

    return state.setIn(['newsList', action.origin, 'list'], Immutable.fromJS(tempList))
      .setIn(['newsList', action.origin, 'isFetched'], true);
  },

};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  newsList: Immutable.fromJS({
    /*'ctdsb': {
     origin_name: '楚天都市报',
     isFetched: false,
     list: [
     {title: 'title', url: 'url', origin_key: 'origin', date: new Date()},
     ]
     },*/
  }),
  origin: Immutable.List(
    /* [
     {"_id": "58caa435de0f2f724e27148", "key": "ctdsb", "name": "楚天都市报"},
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

    //fetch today news list with origin
    const newsOriginKeyArray = originList.data.data.map(item => item.key);
    if (newsOriginKeyArray && newsOriginKeyArray.length) {
      const listResults = yield newsOriginKeyArray.map(item => call(request,
        config.API_SERVER + `getSpecificList?beginDate=${new Date(moment().format('YYYY-MM-DD'))}&endDate=${new Date(moment().add({days: 1}).format('YYYY-MM-DD'))}&origin_key=${item}`,
      ));
      if (listResults && listResults.length) {
        yield listResults.map((item, index) => {
          if (!item.err) {
            return put({type: 'Monitor_PUSH_newsList', origin: newsOriginKeyArray[index], data: item.data.data});
          } else {
            let errBody = item.err.response.json();
            return notification.error({
              message: 'Error',
              description: errBody.msg,
            });
          }
        });
      }
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
