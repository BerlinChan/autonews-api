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
      <Card title={this.props.origin_name} className={cls.monitorCard}
            extra={
              <div>
                <Badge count={this.props.list.length} showZero overflowCount={999}
                       style={{backgroundColor: '#fff', color: '#999'}}/>
                <Switch checked disabled checkedChildren={'开'} unCheckedChildren={'关'}/>
                <i className={cls.iconMove + ' move-cursor'} title="Move"/>
              </div>
            }>
        <Table columns={columns} dataSource={this.props.list} scroll={{y: 220}}
               pagination={false} size="small" bordered={false}/>
      </Card>
    );
  }
}

MonitorCard.propTypes = {
  origin_key: PropTypes.string,
  origin_name: PropTypes.string.isRequired,
  list: PropTypes.array,
};
MonitorCard.defaultProps = {
  origin_key: '',
  origin_name: '楚天都市报',
  list: [
    {
      title: 'title',
      url: 'url',
      origin_key: 'origin',//来源
      date: new Date(),
    },
  ]
};

export default MonitorCard;
