import React, {Component} from 'react'
import cls from './HomeView.scss'
import {Row, Col, Card} from 'antd';

class HomeView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={cls.home}>
        <Row gutter={16}>
          <Col span={8} className={cls.card}>
            <Card title="Card title">
              <p>Card content</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Card title">
              <p>Card content</p>
            </Card></Col>
          <Col span={8}>
            <Card title="Card title">
              <p>Card content</p>
            </Card></Col>
        </Row>
      </div>
    );
  }
}

export default HomeView
