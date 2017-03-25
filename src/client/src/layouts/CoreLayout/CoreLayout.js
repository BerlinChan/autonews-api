import React, {Component} from 'react';
import {Layout, Menu, Icon, Dropdown} from 'antd';
import '../../styles/core.scss'
import cls from'./CoreLayout.scss'
import {Link} from 'react-router'
import {connect} from 'react-redux'

const {Header, Content, Footer} = Layout;

class CoreLayout extends Component {
  constructor(props) {
    super(props);
    this.getMenu = this.getMenu.bind(this);
  }

  getMenu(mode = "vertical") {
    return (
      <Menu theme="dark" mode={mode} selectedKeys={[this.props.location.pathname]} className={cls.menu}>
        <Menu.Item key="/"><Link to="/">当日监控</Link></Menu.Item>
        <Menu.Item key="pastInquery"><Link to="/pastInquery">往期查询</Link></Menu.Item>
        <Menu.Item key="about"><Link to="/about">关于</Link></Menu.Item>
      </Menu>
    );
  }

  render() {

    return (
      <Layout className={cls.body}>
        <Header className={cls.header}>
          <div className={cls.logo}><a href="http://autonews.berlinchan.com/">【新闻源监控】</a></div>

          <div className={cls.horizontalMenu}>
            {this.getMenu('horizontal')}
          </div>
          <Dropdown overlay={this.getMenu('vertical')} placement="bottomRight">
            <Icon type="bars" style={{color: '#fff'}} className={cls.verticalMenu}/>
          </Dropdown>
        </Header>

        <Content className={cls.content}>
          {this.props.children}
        </Content>

        <Footer className={cls.footer}>
          <span>
            监控服务:&nbsp;
            {this.props.global.get('socketConnectStatus') == 'disconnect' ?
              <span className={cls.warning}>停机</span> : <span>运行中</span>}
          </span>&nbsp;|&nbsp;
{/*
          <span>有 {this.props.global.get('clientCount')} 位小编在线</span>&nbsp;|&nbsp;
*/}
          <span>Code with <i className={cls.iconLove}/> by&nbsp;
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
