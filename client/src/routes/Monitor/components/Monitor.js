import React, {Component, PropTypes,} from 'react'
import cls from './Monitor.scss'
import {Row, Col,} from 'antd';
import MonitorCard from './widgets/MonitorCard/MonitorCard'
import '../../../../node_modules/react-grid-layout/css/styles.css'
import '../../../../node_modules/react-resizable/css/styles.css'
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Monitor extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchMonitor();
  }

  render() {
    const {monitor}=this.props;
    const monitorLength = Object.keys(monitor.toJS().monitorConfigs).length;//monitor 个数
    const columnNum = 3;//新闻监视器 card 列数
    const rowNum = Math.floor(Object.keys(monitor.toJS().monitorConfigs).length / 3 + 1);//新闻监视器 card 行数
    // layout is an array of objects, see the demo for more complete usage
    let layouts = {md: []};
    for (let row = 0; row < rowNum; row++) {
      for (let col = 0; col < columnNum; col++) {
        let width = 4, height = 2;
        let configIndex = row * columnNum + col;
        if (monitorLength > configIndex) {
          layouts.md.push({
            i: Object.keys(monitor.toJS().newsList)[row * columnNum + col],
            x: col * width,
            y: row * height,
            w: width,
            h: height,
            minW: 3
          });
        }
      }
    }

    return (
      <div className={cls.monitor}>

        {/*monitor dashboard*/}
        <ResponsiveReactGridLayout className={cls.rowMargin} layouts={layouts}
                                   breakpoints={{md: 996}} cols={{md: 12}}>
          {Array.from({length: monitorLength}, () => 'berlin').map((item, index) => {
              if (monitorLength > index) {
                let currentKey = Object.keys(monitor.toJS().monitorConfigs)[index];
                return (
                  <div key={currentKey}><MonitorCard {...monitor.toJS().newsList[currentKey]}/></div>
                );
              }
            }
          )}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

Monitor.propTypes = {
  newsList: PropTypes.object,
  monitorConfigs: PropTypes.object,
};
Monitor.defaultProps = {
  newsList: {
    '1': {
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
  },
  monitorConfigs: {
    '1': {origin: '楚天都市报',},
    '2': {origin: '湖北日报',},
    '3': {origin: '三峡晚报',},
    '4': {origin: '楚天快报',},
    '5': {origin: '楚天金报',},
    '6': {origin: '腾讯大楚网',},
    '7': {origin: '楚天时报',},
  },
};

export default Monitor
