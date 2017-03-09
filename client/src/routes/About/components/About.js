import React, {Component} from 'react'
import {Card, Table, Button, Modal, Popconfirm} from 'antd';

class About extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchAbout();
  }

  render() {
    return (
      <div>
        <h3>欢迎使用【新闻源监控】</h3>
        <div>该页面准实时监控如下新闻源</div>
        <ul>
          <li><a href="http://hb.qq.com/" target="_blank">腾讯·大楚网</a>新闻，包括: 要闻/宜昌/襄阳/黄石/十堰/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃</li>
          <li><a href="http://sxwb.cnhubei.com/cache/paper_sxwb.aspx" target="_blank">三峡晚报</a></li>
          <li><a href="http://ctdsb.cnhubei.com/cache/paper_ctdsb.aspx" target="_blank">楚天都市报</a></li>
          <li><a href="http://hbrb.cnhubei.com/cache/paper_hbrb.aspx" target="_blank">湖北日报</a></li>
          <li><a href="http://ctjb.cnhubei.com/cache/paper_ctjb.aspx" target="_blank">楚天金报</a></li>
          <li><a href="http://ctdsbxy.cnhubei.com/cache/paper_ctdsbxy.aspx" target="_blank">楚天快报</a></li>
          <li><a href="http://epaper.cnhubei.com/cache/paper_ctsb.aspx" target="_blank">楚天时报</a></li>
          <li>持续添加中……</li>
        </ul>
      </div>
    )
  }
}

About.propTypes = {};
About.defaultProps = {};

export default About
