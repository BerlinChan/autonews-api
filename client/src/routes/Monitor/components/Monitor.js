import React, {Component, PropTypes,} from 'react'
import cls from './Monitor.scss'
import {Row, Col,} from 'antd';
import MonitorCard from './widgets/MonitorCard/MonitorCard'


class Monitor extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchMonitor();
  }

  render() {
    const {monitor}=this.props;
    const columnNum = 3;//新闻监视器 card 列数

    return (
      <div className={cls.monitor}>

        {/*monitor dashboard*/}
        {Array.from({length: Math.floor(Object.keys(monitor.toJS().monitorConfigs).length / 3 + 1)}, () => 'berlin').map((item, rowIndex) => {
          return (
            <Row gutter={16} className={cls.rowMargin} key={rowIndex}>
              {Array.from({length: columnNum}, () => 'berlin').map((item, index) => {
                let configIndex = rowIndex * 3 + index;
                if (Object.keys(monitor.toJS().monitorConfigs).length > configIndex) {
                  let currentKey = Object.keys(monitor.toJS().monitorConfigs)[configIndex];
                  return (
                    <Col span={8} key={index}>
                      <MonitorCard {...monitor.toJS().newsList[currentKey]}/>
                    </Col>
                  );
                }
              })}
            </Row>
          );
        })}
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
