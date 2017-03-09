import React, {Component} from 'react';
import {Card, Table, Button, Modal, Popconfirm, Icon, Select} from 'antd';
import '../../styles/core.scss'
import cls from'./CoreLayout.scss'

class CoreLayout extends Component {
  render() {
    return (
      <div className={cls.body}>
        <div className={cls.header}>header</div>
        <div>{this.props.children}</div>
        <div className={cls.footer}>footer</div>
      </div>
    )
  }
}

export default CoreLayout
