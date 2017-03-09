import React, {Component} from 'react'
import {Card, Table, Button, Modal, Popconfirm} from 'antd';

class Monitor extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchMonitor();
  }

  render() {
    return (
      <div>
        hello Monitor
      </div>
    )
  }
}

Monitor.propTypes = {};
Monitor.defaultProps = {};

export default Monitor
