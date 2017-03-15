import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import config from '../utils/config'
import cookie from 'react-cookie'

// Constants
const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
const GLOBAL_SET_USERINFO = 'GLOBAL_SET_USERINFO';
const GLOBAL_USERINFO_FETCH_REQUESTED = 'GLOBAL_USERINFO_FETCH_REQUESTED';
const Global_SET_clientCount = 'socket/Global_SET_clientCount';
const Global_SET_SOCKET_STATUS = 'socket/Global_SET_SOCKET_STATUS';


function changeLanguage(value) {
  return {
    type: CHANGE_LANGUAGE,
    payload: value
  }
}
function setUserinfo(userInfo) {
  return {
    type: GLOBAL_SET_USERINFO,
    payload: userInfo
  }
}

// Actions
export const actions = {
  changeLanguage,
  setUserinfo,
};

// Action Handlers
const ACTION_HANDLERS = {
  [Global_SET_clientCount]: (state, action) => state.set('clientCount', action.data),
  [GLOBAL_SET_USERINFO]: (state, payload) => {
    cookie.save('userInfo', payload.data, {path: '/'});
    return state.setIn(['userInfo'], Immutable.fromJS(payload.data));
  },
  [Global_SET_SOCKET_STATUS]: (state, action) => state.set('socketConnectStatus', action.data),
};

// Reducer
const initialState = Immutable.Map({
  clientCount: 0,//客户端连接数
  socketConnectStatus: 'disconnect',
  userInfo: Immutable.Map(),
});
export default function globalReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state
}


// Sagas
function* changeLanguageAsync() {
  while (true) {
    const {payload} = yield take(CHANGE_LANGUAGE)

  }
}
function* fetchUserInfo() {
  yield take(GLOBAL_USERINFO_FETCH_REQUESTED)

  let {data, err} = yield call(request,
    config.API_SERVER + `/userInfo`
  );
  if (!err)
    yield put({type: GLOBAL_SET_USERINFO, data: data});
}


export const sagas = [
  changeLanguageAsync,
  fetchUserInfo,
];
