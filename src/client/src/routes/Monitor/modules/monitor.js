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
const socket_Monitor_ON_initMonitorConfigs = 'socket_Monitor_ON_initMonitorConfigs';

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
    let newList = state.getIn(['newsList', action.data.key, 'news']).toJS();
    newList.unshift(action.data.news);

    return state.setIn(['newsList', action.data.key, 'news'], Immutable.List(newList));
  },
  [socket_Monitor_ON_initMonitorConfigs]: (state, action) => state.set('monitorConfigs', Immutable.fromJS(action.data)),
};

// Reducer
const initialState = Immutable.Map({
  isFetching: false,
  newsList: Immutable.fromJS({
    '1': {
      key: '1',
      origin: '楚天都市报',
      news: [
        {
          title: 'title',
          url: 'url',
          subCategory: 'subCategory',//子分类、子栏目、子版面、子频道
          origin: 'origin',//来源
          content: 'content',//正文内容
          authorName: 'authorName',
          editorName: 'editorName',
          date: new Date(),
          crawledDate: new Date(),//抓取日期
        },
      ],
    },
    '2': {
      origin: '湖北日报',
      news: [
        {
          title: 'title',
          url: 'url',
          subCategory: 'subCategory',//子分类、子栏目、子版面、子频道
          origin: 'origin',//来源
          content: 'content',//正文内容
          authorName: 'authorName',
          editorName: 'editorName',
          date: new Date(),
          crawledDate: new Date(),//抓取日期
        },
      ],
    },
    '3': {
      origin: '三峡晚报',
      news: [
        {
          title: 'title',
          url: 'url',
          subCategory: 'subCategory',//子分类、子栏目、子版面、子频道
          origin: 'origin',//来源
          content: 'content',//正文内容
          authorName: 'authorName',
          editorName: 'editorName',
          date: new Date(),
          crawledDate: new Date(),//抓取日期
        },
      ],
    },
    '4': {
      origin: '楚天快报',
      news: [
        {
          title: 'title',
          url: 'url',
          subCategory: 'subCategory',//子分类、子栏目、子版面、子频道
          origin: 'origin',//来源
          content: 'content',//正文内容
          authorName: 'authorName',
          editorName: 'editorName',
          date: new Date(),
          crawledDate: new Date(),//抓取日期
        },
      ],
    },
    '5': {
      origin: '楚天金报',
      news: [
        {
          title: 'title',
          url: 'url',
          subCategory: 'subCategory',//子分类、子栏目、子版面、子频道
          origin: 'origin',//来源
          content: 'content',//正文内容
          authorName: 'authorName',
          editorName: 'editorName',
          date: new Date(),
          crawledDate: new Date(),//抓取日期
        },
      ],
    },
    '6': {
      origin: '腾讯大楚网',
      news: [
        {
          title: 'title',
          url: 'url',
          subCategory: 'subCategory',//子分类、子栏目、子版面、子频道
          origin: 'origin',//来源
          content: 'content',//正文内容
          authorName: 'authorName',
          editorName: 'editorName',
          date: new Date(),
          crawledDate: new Date(),//抓取日期
        },
      ],
    },
    '7': {
      origin: '楚天时报',
      news: [
        {
          title: 'title',
          url: 'url',
          subCategory: 'subCategory',//子分类、子栏目、子版面、子频道
          origin: 'origin',//来源
          content: 'content',//正文内容
          authorName: 'authorName',
          editorName: 'editorName',
          date: new Date(),
          crawledDate: new Date(),//抓取日期
        },
      ],
    },
  }),
  monitorConfigs: Immutable.fromJS({
    '1': {origin: '楚天都市报',},
    '2': {origin: '湖北日报',},
    '3': {origin: '三峡晚报',},
    '4': {origin: '楚天快报',},
    '5': {origin: '楚天金报',},
    '6': {origin: '腾讯大楚网',},
    '7': {origin: '楚天时报',},
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
