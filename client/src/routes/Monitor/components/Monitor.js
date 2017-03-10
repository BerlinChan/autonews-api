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
    const columnNum = 3;//新闻监视器 card 列数

    return (
      <div className={cls.monitor}>

        {/*monitor dashboard*/}
        {Array.from({length: Math.floor(Object.keys(this.props.monitorOptions).length / 3 + 1)}, () => 'berlin').map((item, rowIndex) => {
          return (
            <Row gutter={16} className={cls.rowMargin} key={rowIndex}>
              {Array.from({length: columnNum}, () => 'berlin').map((item, index) => {
                return (
                  <Col span={8} key={index}>
                    <MonitorCard {...this.props.monitorOptions[(Object.keys(this.props.monitorOptions))[rowIndex * 3 + index]]}/>
                  </Col>
                );
              })}
            </Row>
          );
        })}
      </div>
    );
  }
}

Monitor.propTypes = {
  newsList: PropTypes.array.isRequired,
  monitorOptions: PropTypes.object,
};
Monitor.defaultProps = {
  newsList: [
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
  monitorOptions: {
    '1': {origin: '楚天都市报',},
    '2': {origin: '湖北日报',},
    '3': {origin: '三峡晚报',},
    '4': {origin: '楚天快报',},
    '5': {origin: '楚天时报',},
    '6': {origin: '楚天金报',},
    '7': {origin: '腾讯大楚网',},
  },
};

export default Monitor
