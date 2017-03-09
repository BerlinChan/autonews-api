import React, {Component, PropTypes,} from 'react'
import cls from './HomeView.scss'
import {Row, Col,} from 'antd';
import MonitorCard from './widgets/MonitorCard/MonitorCard'

class HomeView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let rows = new Array(Math.floor(this.props.monitors.length / 3 + 1));

    return (
      <div className={cls.monitor}>
        {[1, 2, 3].map((item, rowIndex) => {
          return (
            <Row gutter={16} className={cls.rowMargin} key={rowIndex}>
              {[1, 2, 3].map((item, index) => {
                return (
                  <Col span={8} key={index}>
                    <MonitorCard {...this.props.monitors[rowIndex * 3 + index]}/>
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

HomeView.propTypes = {
  allDataSource: PropTypes.array.isRequired,
};
HomeView.defaultProps = {
  allDataSource: [
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

  monitors: [
    {origin: '楚天都市报',},
    {origin: '湖北日报',},
    {origin: '三峡晚报',},
    {origin: '楚天快报',},
    {origin: '楚天时报',},
    {origin: '楚天金报',},
    {origin: '腾讯大楚网',},
  ],
};

export default HomeView
