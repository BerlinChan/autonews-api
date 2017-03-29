import React, {Component} from 'react'
import {Table, Card} from 'antd';
import cls from './PastInquiry.scss'
import PastInquiryForm from './PastInquiryForm'
import moment from 'moment'

class PastInquiry extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.props.fetchPastInquiry();
    this.props.fetchOriginAndNews();
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.props.onDestory();
  }

  render() {
    const {global, pastInquiry} = this.props;
    const pastInquiryResult = pastInquiry.get('pastInquiryResult').toJS();
    const formData = pastInquiry.get('form').toJS();
    const columns = [
      {
        title: '日期',
        key: 'date',
        render: (text, record, index) => moment(record.date).format('MM-DD HH:mm:ss'),
      },
      {
        title: '来源',
        dataIndex: 'origin_name',
        key: 'origin_name',
      },
      {
        title: '标题',
        key: 'title',
        render: (text, record, index) => <a href={record.url} target="_blank">{record.title + (record.subTitle ? (' ' +
        record.subTitle) : '')}</a>,
      },
      {
        title: '分类',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: '标签',
        dataIndex: 'tag',
        key: 'tag',
      },
    ];
    const pagination = {
      current: pastInquiryResult.pagination.current,
      total: pastInquiryResult.pagination.total,
      pageSize: pastInquiryResult.pagination.pageSize,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30'],
      onChange: (page, pageSize) => this.props.fetchPastInquiry(formData.origin.value.join(','), new Date(formData.rangeTimePicker.value[0]), new Date(formData.rangeTimePicker.value[1]), formData.keyword.value, page || 0, pageSize || 20),
      onShowSizeChange: (page, pageSize) => this.props.fetchPastInquiry(formData.origin.value.join(','), new Date(formData.rangeTimePicker.value[0]), new Date(formData.rangeTimePicker.value[1]), formData.keyword.value, page || 0, pageSize || 20),
    };

    return (
      <div className={cls.pastInquiry}>
        {/*query form*/}
        <PastInquiryForm origins={global.get('origin').toJS()}
                         fetchPastInquiry={this.props.fetchPastInquiry}
                         setFormValue={this.props.setFormValue}
                         query={this.props.location.query}/>

        {/*search result*/}
        <Card>
          <Table columns={columns} rowKey={(record) => record.url} pagination={pagination}
                 dataSource={pastInquiryResult.list}/>
        </Card>
      </div>
    );
  }
}

PastInquiry.propTypes = {};
PastInquiry.defaultProps = {};

export default PastInquiry
