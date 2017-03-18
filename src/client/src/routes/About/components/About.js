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
        <h2>欢迎使用【新闻源监控】</h2>
        <br/>

        <h3>What</h3>
        <hr/>
        <p>准实时监控新闻源更新，通知编辑第一时间处理。本页面打开时，会实时接收抓取到的新闻，但之前抓取的不显示，查询往期内容功能还在开发</p>
        <p>汇总零散资源，将信息集中呈现，供编辑筛选、处理</p>
        <br/>

        <h4>数据来源如下：</h4>
        <ul>
          <li><a href="http://hb.qq.com/" target="_blank">腾讯·大楚网</a>新闻，包括: 要闻/宜昌/襄阳/黄石/十堰/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃</li>
          <li><a href="http://sxwb.cnhubei.com/cache/paper_sxwb.aspx" target="_blank">三峡晚报</a></li>
          <li><a href="http://ctdsb.cnhubei.com/cache/paper_ctdsb.aspx" target="_blank">楚天都市报</a></li>
          <li><a href="http://hbrb.cnhubei.com/cache/paper_hbrb.aspx" target="_blank">湖北日报</a></li>
          <li><a href="http://ctjb.cnhubei.com/cache/paper_ctjb.aspx" target="_blank">楚天金报</a></li>
          <li><a href="http://ctdsbxy.cnhubei.com/cache/paper_ctdsbxy.aspx" target="_blank">楚天快报</a></li>
          <li><a href="http://epaper.cnhubei.com/cache/paper_ctsb.aspx" target="_blank">楚天时报</a></li>
          <li><a href="http://cjrb.cjn.cn/" target="_blank">长江日报</a></li>
          <li><a href="http://whwb.cjn.cn/" target="_blank">武汉晚报</a></li>
          <li><a href="http://whcb.cjn.cn/" target="_blank">武汉晨报</a></li>
          <li>添加中……</li>
        </ul>
        <br/>

        <h3>Future</h3>
        <hr/>
        <ul>
          <li>筛选</li>
          <li>编辑</li>
          <li>转载</li>
          <li>统计</li>
          <li>交流</li>
          <li>设置</li>
          <li>反馈</li>
        </ul>
        <br/>

        <h3>Why</h3>
        <hr/>
        <p>
          加过一个群，名叫"苦逼的网编停不下来"的群，是6年前我在一房产网站做编辑的时候，群里都是全国各地站点的编辑们。大家在群里讨论工作、发闹骚，最热闹时每天群里会有上千条消息。
        </p>
        <p>
          断断续续做记者、编辑约6年时间，觉得网络编辑还算件有乐趣的工作。每天早上打开电脑，从各处搜集信息，然后筛选、编辑、归类、比较、分析、排序、制作封面配图、发布，最后得到有序的新闻条目、房产行业信息和漂亮的页面，心里有大大的满足感。
        </p>
        <p>
          但编辑中有大量枯燥重复的工作，汇总零散信息、人工值守新闻更新、复制粘贴。3年前有过用自动采集方案来代替的想法，简单弄过一段时间"按键精灵""火车头采集"，但技术实力不过关，实际工作中并没起到什么作用。
        </p>
        <p>现在虽然不做编辑工作，但作为一个 Coding for Make a Better World 的 Web Developer，我觉得这会是一项有意义、有挑战的工作。</p>
        <p>计算机简直是做这些辛苦工作的最佳"人选"，所以可爱的小编们就能解放生产力，将更多精力投入到思考、学习、设计、撰写等方面，将编辑工作更提高一个层次。</p>
        <p>"苦逼的小编"也可以停下来，有更多时间优雅的喝咖啡。感觉生活都变更美好了呢:)</p>
        <br/>

        <h3>Release Note</h3>
        <hr/>
        <ul>
          <li>Last Update: 2017-03-11</li>
          <li>Current Version: 0.0.2</li>
        </ul>
      </div>
    )
  }
}

About.propTypes = {};
About.defaultProps = {};

export default About
