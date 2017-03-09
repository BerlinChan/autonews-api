import React, {Component} from 'react';
import {Layout, Menu} from 'antd';
import '../../styles/core.scss'
import cls from'./CoreLayout.scss'
import {Link} from 'react-router'

const {Header, Content, Footer} = Layout;

class CoreLayout extends Component {
  render() {
    return (
      <Layout className={cls.body}>
        <Header className={cls.header}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{lineHeight: '64px'}}>
            <Menu.Item key="1"><Link to="/">监控</Link></Menu.Item>
            <Menu.Item key="2">筛选(待开发)</Menu.Item>
            <Menu.Item key="3">编辑(待开发)</Menu.Item>
            <Menu.Item key="4">转载(待开发)</Menu.Item>
            <Menu.Item key="5">统计(待开发)</Menu.Item>
            <Menu.Item key="6">设置(待开发)</Menu.Item>
            <Menu.Item key="7">反馈(待开发)</Menu.Item>
            <Menu.Item key="8"><Link to="/about">关于</Link></Menu.Item>
          </Menu>
        </Header>

        <Content className={cls.content}>
          {this.props.children}
        </Content>

        <Footer className={cls.footer}>
          <span>有  位小编在线 |</span>
          <span> Code with <i className={cls.iconLove}/> by&nbsp;
            <a href="http://www.berlinchan.com" target="_blank">摄影师陈柏林</a>
          </span>
        </Footer>
      </Layout>
    )
  }
}

export default CoreLayout
