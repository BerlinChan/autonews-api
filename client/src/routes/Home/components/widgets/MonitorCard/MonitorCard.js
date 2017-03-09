/**
 * Created by berlin on 2017/3/9.
 */

import React, {
  Component,
  PropTypes,
} from 'react';
import {Card, Switch, Table} from 'antd';
import moment from 'moment';
import cls from './MonitorCard.scss'

class MonitorCard extends Component {
  render() {
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '时间',
        dataIndex: 'date',
        render: (text, record, index) => moment(record.date).format('MM-DD hh:mm:ss'),
      },
    ];

    return (
      <Card title={this.props.origin} className={cls.monitorCard}
            extra={<Switch checked disabled checkedChildren={'开'} unCheckedChildren={'关'}/>}>
        <Table columns={columns} dataSource={this.props.dataSource}
               pagination={false} size="small" bordered={false}/>
      </Card>
    );
  }
}

MonitorCard.propTypes = {
  origin: PropTypes.string.isRequired,
  dataSource: PropTypes.array.isRequired,
};
MonitorCard.defaultProps = {
  origin: '楚天都市报',
  dataSource: [
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
