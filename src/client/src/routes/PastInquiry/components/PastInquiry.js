import React, {Component} from 'react'
import {Table} from 'antd';
import cls from './PastInquiry.scss'
import PastInquiryForm from './PastInquiryForm'

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
    const {global} = this.props;
    const columns = [
      {
        title: '日期',
        dataIndex: 'name',
        key: 'date',
      },
      {
        title: '来源',
        dataIndex: 'name',
        key: 'origin',
      },
      {
        title: '标题',
        dataIndex: 'name',
        key: 'title',
      },
      {
        title: '分类',
        dataIndex: 'name',
        key: 'category',
      },
      {
        title: '标签',
        dataIndex: 'name',
        key: 'tag',
      },
    ];

    return (
      <div className={cls.pastInquiry}>
        {/*query form*/}
        <PastInquiryForm origins={global.get('origin').toJS()}
                         pastInquiry={this.props.pastInquiry}
                         query={this.props.location.query}/>

        {/*search result*/}
        <Table columns={columns}/>
      </div>
    );
  }
}

PastInquiry.propTypes = {};
PastInquiry.defaultProps = {};

export default PastInquiry
