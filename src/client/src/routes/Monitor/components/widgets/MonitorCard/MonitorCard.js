/**
 * Created by berlin on 2017/3/9.
 */

import React, {
  Component,
  PropTypes,
} from 'react';
import {Card, Switch, Table, Badge} from 'antd';
import moment from 'moment';
import cls from './MonitorCard.scss'

class MonitorCard extends Component {
  render() {
    const columns = [
      {
        title: '时间',
        dataIndex: 'date',
        width: '28%',
        render: (text, record, index) => moment(record.date).format('MM-DD HH:mm:ss'),
      },
      {
        title: '标题',
        dataIndex: 'title',
        width: '72%',
        render: (text, record, index) =>
          <a href={record.url} target="_blank">{record.title + (record.subTitle ? record.subTitle : '')}</a>
      },
    ];

    return (
      <Card title={this.props.origin} className={cls.monitorCard}
            extra={
              <div>
                <Badge count={Object.keys(this.props.news).length} showZero overflowCount={999}
                       style={{backgroundColor: '#fff', color: '#999'}}/>
                <Switch checked disabled checkedChildren={'开'} unCheckedChildren={'关'}/>
                <i className={cls.iconMove + ' move-cursor'} title="Move"/>
              </div>
            }>
        <Table columns={columns} dataSource={this.props.news}
               pagination={false} size="small" bordered={false}/>
      </Card>
    );
  }
}

MonitorCard.propTypes = {
  origin: PropTypes.string.isRequired,
  news: PropTypes.array,
};
MonitorCard.defaultProps = {
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
};

export default MonitorCard;
