import React, {Component} from 'react'
import {Row, Col, Card, Form, Input, DatePicker, Select, Table, Button, Modal, Popconfirm} from 'antd';
import cls from './PastInquiry.scss'

class PastInquiry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
    };
  }

  componentDidMount() {
    this.props.fetchPastInquiry();
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.props.onDestory();
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({endOpen: true});
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({endOpen: open});
  }


  render() {
    const {startValue, endValue, endOpen} = this.state;
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
        <Row gutter={12}>
          <Col span={10}>
            {/*query form*/}
            <Card title="搜索">
              <Form>
                <Select defaultValue="lucy" style={{width: 120}} onChange={this.handleChange}>
                  <Select.Option value="jack">Jack</Select.Option>
                  <Select.Option value="lucy">Lucy</Select.Option>
                  <Select.Option value="disabled" disabled>Disabled</Select.Option>
                  <Select.Option value="Yiminghe">yiminghe</Select.Option>
                </Select>

                <DatePicker
                  disabledDate={this.disabledStartDate}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  value={startValue}
                  placeholder="Start"
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  value={endValue}
                  placeholder="End"
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                />

                <Input placeholder="关键词"/>
                <Button type="primary">搜索</Button>
              </Form>

              {/*search result*/}
              <Table columns={columns} title={() => '结果'}/>
            </Card>
          </Col>

          <Col span={14}>
            {/*详情*/}
            <Card title="详情">
              详情
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

PastInquiry.propTypes = {};
PastInquiry.defaultProps = {};

export default PastInquiry
