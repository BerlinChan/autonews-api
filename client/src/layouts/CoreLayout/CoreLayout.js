import React, {Component} from 'react';
import {Layout, Menu} from 'antd';
import '../../styles/core.scss'
import cls from'./CoreLayout.scss'
import {Link} from 'react-router'
import {connect} from 'react-redux'

const {Header, Content, Footer} = Layout;

class CoreLayout extends Component {
  render() {
    return (
      <Layout className={cls.body}>
        <Header className={cls.header}>
          <div className={cls.logo}><a href="http://autonews.berlinchan.com/">【新闻源监控】</a></div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}
                style={{lineHeight: '64px', fontSize: '14px'}}>
            <Menu.Item key="1"><Link to="/">监控</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/about">关于</Link></Menu.Item>
          </Menu>
        </Header>

        <Content className={cls.content}>
          {this.props.children}
        </Content>

        <Footer className={cls.footer}>
          <span>
            {this.props.global.get('socketConnectStatus') == 'disconnect' ?
              <span style={{color: '#e66'}}>已离线</span> : <span>已连接服务器</span>}
            &nbsp;|&nbsp;
          </span>
          <span>有 {this.props.global.get('clientCount')} 位小编在线 |</span>
          <span> Code with <i className={cls.iconLove}/> by&nbsp;
            <a href="http://www.berlinchan.com" target="_blank">摄影师陈柏林</a>
          </span>
        </Footer>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  global: state.global
});
const mapActionCreators = {};

export default connect(mapStateToProps, mapActionCreators)(CoreLayout)
