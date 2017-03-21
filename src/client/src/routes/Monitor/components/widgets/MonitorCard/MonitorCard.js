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
import  {Table, Column, Cell}  from 'fixed-data-table';
import 'fixed-data-table/dist/fixed-data-table.min.css'

const DateCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {moment(data.getObjectAt(rowIndex)[col].date).format('MM-DD HH:mm:ss')}
  </Cell>
);

const TitleCell = ({rowIndex, data, col, ...props}) => {
  console.log(rowIndex, data, col);
  const record = data.getObjectAt(rowIndex)[col];
  return (
    <Cell {...props}>
      <a href={record.url} target="_blank">{record.title + (record.subTitle ? record.subTitle : '')}</a>
    </Cell>
  )
};

class MonitorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseEnter: false,
      listSnap: [],
    };
  }

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
                <Switch checked={!this.state.mouseEnter} disabled checkedChildren={'开'} unCheckedChildren={'关'}/>
                <i className={cls.iconMove + ' move-cursor'} title="Move"/>
              </div>
            }>
        {/* TODO: scroll height responsive*/}
        <div onMouseEnter={() => this.setState({mouseEnter: true, listSnap: this.props.list})}
             onMouseLeave={() => this.setState({mouseEnter: false, listSnap: []})}>
          <Table
            rowHeight={50}
            headerHeight={50}
            rowsCount={this.props.list.length}
            width={1000}
            height={400}
            {...this.props}>
            <Column
              header={<Cell>日期</Cell>}
              cell={<DateCell data={this.state.mouseEnter ? this.state.listSnap : this.props.list} col="date"/>}
              width={100}
            />
            <Column
              header={<Cell>标题</Cell>}
              cell={<TitleCell data={this.state.mouseEnter ? this.state.listSnap : this.props.list} col="title"/>}
              width={100}
            />
          </Table>
        </div>
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
