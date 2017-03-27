import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import config from '../utils/config'
import cookie from 'react-cookie'
import {notification} from 'antd';
import moment from 'moment'

// Constants
const GLOBAL_SET_USERINFO = 'GLOBAL_SET_USERINFO';
const GLOBAL_USERINFO_FETCH_REQUESTED = 'GLOBAL_USERINFO_FETCH_REQUESTED';
const socket_Global_SET_clientCount = 'socket_Global_SET_clientCount';
const socket_Global_SET_SOCKET_STATUS = 'socket_Global_SET_SOCKET_STATUS';
const socket_global_ON_News_Added = 'socket_global_ON_News_Added';
const GLOBAL_FETCH_originAndNews_REQUESTED = 'GLOBAL_FETCH_originAndNews_REQUESTED';
const GLOBAL_SET_origin = 'GLOBAL_SET_origin';
const GLOBAL_PUSH_newsList = 'GLOBAL_PUSH_newsList';


function setUserinfo(userInfo) {
  return {
    type: GLOBAL_SET_USERINFO,
    payload: userInfo
  }
}
function fetchOriginAndNews() {
  return {
    type: GLOBAL_FETCH_originAndNews_REQUESTED,
  }
}

// Actions
export const actions = {
  setUserinfo,
  fetchOriginAndNews,
};

// Action Handlers
const ACTION_HANDLERS = {
  [GLOBAL_SET_USERINFO]: (state, payload) => {
    cookie.save('userInfo', payload.data, {path: '/'});
    return state.setIn(['userInfo'], Immutable.fromJS(payload.data));
  },
  [socket_Global_SET_clientCount]: (state, action) => state.set('clientCount', action.data),
  [socket_Global_SET_SOCKET_STATUS]: (state, action) => state.set('socketConnectStatus', action.data),
  [socket_global_ON_News_Added]: (state, action) => {
    let newList = state.getIn(['newsList', action.data.origin_key, 'list']).toJS();
    newList.unshift(action.data);

    return state.setIn(['newsList', action.data.origin_key, 'list'], Immutable.fromJS(newList));
  },
  [GLOBAL_SET_origin]: (state, action) => {
    let tempNewsList = {};
    action.data.length && action.data.forEach((item, index) => {
      tempNewsList[item.key] = {origin_name: item.name, list: [], isFetched: false};
    });

    return state.set('origin', Immutable.fromJS(action.data))
      .set('newsList', Immutable.fromJS(tempNewsList));
  },
  [GLOBAL_PUSH_newsList]: (state, action) => {
    let tempList = state.getIn(['newsList', action.origin, 'list']).toJS();
    tempList = tempList.concat(action.data);

    return state.setIn(['newsList', action.origin, 'list'], Immutable.fromJS(tempList))
      .setIn(['newsList', action.origin, 'isFetched'], true);
  },
};

// Reducer
const initialState = Immutable.Map({
  userInfo: Immutable.Map(),
  clientCount: 0,//客户端连接数
  socketConnectStatus: 'disconnect',//[disconnect | connect]
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
export default function globalReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state
}


// Sagas
function* fetchUserInfo() {
  yield take(GLOBAL_USERINFO_FETCH_REQUESTED)

  let {data, err} = yield call(request,
    config.API_SERVER + `/userInfo`
  );
  if (!err)
    yield put({type: GLOBAL_SET_USERINFO, data: data});
}
function* fetchGlobalOriginAndNews() {
  yield take(GLOBAL_FETCH_originAndNews_REQUESTED);

  //fetch origin list
  const originList = yield call(request,
    config.API_SERVER + `getOrigin`,
  );
  if (!originList.err) {
    yield put({type: GLOBAL_SET_origin, data: originList.data.data});
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
          return put({type: GLOBAL_PUSH_newsList, origin: newsOriginKeyArray[index], data: item.data.data});
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
}


export const sagas = [
  fetchUserInfo,
  fetchGlobalOriginAndNews,
];
