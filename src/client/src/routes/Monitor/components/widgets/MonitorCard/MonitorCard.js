/**
 * Created by berlin on 2017/3/9.
 */

import React, {
  Component,
  PropTypes,
} from 'react';
import {Card, Switch, Badge, Spin} from 'antd';
import moment from 'moment';
import cls from './MonitorCard.scss'
import  {Table, Column, Cell}  from 'fixed-data-table';
import 'fixed-data-table/dist/fixed-data-table.min.css'
import Dimensions from 'react-dimensions'

const DateCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {moment(data[rowIndex].date).format('MM-DD HH:mm:ss')}
  </Cell>
);

const TitleCell = ({rowIndex, data, col, ...props}) => {
  const record = data[rowIndex];
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
        <Spin spinning={!this.props.isFetched}
              onMouseEnter={() => this.setState({mouseEnter: true, listSnap: this.props.list})}
              onMouseLeave={() => this.setState({mouseEnter: false, listSnap: []})}>
          {this.props.list.length ? <Table
              headerHeight={24} rowHeight={30}
              rowsCount={this.props.list.length}
              width={this.props.containerWidth}
              height={this.props.containerHeight - 48}
              {...this.props}>
              <Column
                header={<Cell className={cls.tableHeader}>日期</Cell>}
                cell={<DateCell data={this.state.mouseEnter ? this.state.listSnap : this.props.list} col="date"/>}
                width={.28 * this.props.containerWidth}
              />
              <Column
                header={<Cell className={cls.tableHeader}>标题</Cell>}
                cell={<TitleCell data={this.state.mouseEnter ? this.state.listSnap : this.props.list} col="title"/>}
                width={.72 * this.props.containerWidth}
              />
            </Table> :
            <div className={cls.empty}>暂无数据</div>}
        </Spin>
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

export default Dimensions({elementResize: true})(MonitorCard);
