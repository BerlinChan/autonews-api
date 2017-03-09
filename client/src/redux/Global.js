import {take, put, select, call} from 'redux-saga/effects'
import Immutable from 'immutable'
import request from 'utils/request'
import config from 'utils/config'
import cookie from 'react-cookie'

// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE'
export const GENDER_FETCH_REQUESTED = 'GENDER_FETCH_REQUESTED'
export const GENDER_FETCH_SUCCESSED = 'GENDER_FETCH_SUCCESSED'

export const BUSINESS_COUNTRY_FETCH_REQUESTED = 'BUSINESS_COUNTRY_FETCH_REQUESTED'
export const BUSINESS_COUNTRY_FETCH_SUCCESSED = 'BUSINESS_COUNTRY_FETCH_SUCCESSED'

export const GLOBAL_SET_TOKEN = 'GLOBAL_SET_TOKEN'
export const GLOBAL_SET_USERINFO = 'GLOBAL_SET_USERINFO'

export const GLOBAL_USERINFO_FETCH_REQUESTED = 'GLOBAL_USERINFO_FETCH_REQUESTED'

export function fetchGender() {
  return {
    type: GENDER_FETCH_REQUESTED
  }
}
export function fetchBusinessCountry() {
  return {
    type: BUSINESS_COUNTRY_FETCH_REQUESTED
  }
}

export function changeLanguage(value) {
  return {
    type: CHANGE_LANGUAGE,
    payload: value
  }
}
export function setUserinfo(userInfo) {
  return {
    type: GLOBAL_SET_USERINFO,
    payload: userInfo
  }
}

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  changeLanguage,
  fetchBusinessCountry,
  fetchGender,
  setUserinfo
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GENDER_FETCH_SUCCESSED]: (state, payload) =>
    state.setIn(['gender'], Immutable.fromJS(payload.data))
  ,
  [BUSINESS_COUNTRY_FETCH_SUCCESSED]: (state, payload) =>
    state.setIn(['businessCountry'], Immutable.fromJS(payload.data)),
  [GLOBAL_SET_TOKEN]: (state, payload) => {
    cookie.save('token', payload.token, {path: '/'});
    return state.setIn(['token'], payload.token)
  },
  [GLOBAL_SET_USERINFO]: (state, payload) => {
    cookie.save('userInfo', payload.data, {path: '/'});
    return state.setIn(['userInfo'], Immutable.fromJS(payload.data))
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Immutable.Map({
  gender: Immutable.List(),
  businessCountry: Immutable.List(),
  token: undefined,
  userInfo: Immutable.Map()
})
export default function globalReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}


// ------------------------------------
// Sagas
// ------------------------------------

export function* changeLanguageAsync() {
  while (true) {
    const {payload} = yield take(CHANGE_LANGUAGE)

  }
}

export function* fetchGenderAsync() {

  yield take(GENDER_FETCH_REQUESTED)

  let {data, err} = yield call(request,
    config.currentServer + `commonlist/enums/gender`
  )
  if (!err)
    yield put({type: GENDER_FETCH_SUCCESSED, data: data.data});
}
export function* fetchbusinessCountryAsync() {

  yield take(BUSINESS_COUNTRY_FETCH_REQUESTED)

  let {data, err} = yield call(request,
    config.currentServer + `commonlist/enums/businessCountry`
  )
  if (!err)
    yield put({type: BUSINESS_COUNTRY_FETCH_SUCCESSED, data: data.data});
}


export function* fetchUserInfo() {

  yield take(GLOBAL_USERINFO_FETCH_REQUESTED)

  let {data, err} = yield call(request,
    config.currentServer + `hr/user`
  )
  if (!err)
    yield put({type: GLOBAL_SET_USERINFO, data: data});
}


export const sagas = [
  changeLanguageAsync,
  fetchGenderAsync,
  fetchbusinessCountryAsync,
  fetchUserInfo
]
