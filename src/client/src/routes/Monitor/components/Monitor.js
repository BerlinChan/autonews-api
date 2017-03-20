import React, {Component, PropTypes,} from 'react'
import cls from './Monitor.scss'
import {Row, Col,} from 'antd';
import MonitorCard from './widgets/MonitorCard/MonitorCard'
import '../../../../node_modules/react-grid-layout/css/styles.css'
import '../../../../node_modules/react-resizable/css/styles.css'
import {Responsive, WidthProvider} from 'react-grid-layout';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Monitor extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchMonitor();
  }

  render() {
    const {monitor}=this.props;
    const originLength = monitor.toJS().origin.length;//monitor 个数
    const columnNum = 3;//新闻监视器 card 列数
    const rowNum = Math.floor(originLength / 3 + 1);//新闻监视器 card 行数
    // layout is an array of objects, see the demo for more complete usage
    let layouts = {lg: [], md: [], sm: [], xs: [], xxs: []};
    for (let row = 0; row < rowNum; row++) {
      for (let col = 0; col < columnNum; col++) {
        let width = {lg: 4, md: 4, sm: 3, xs: 4, xxs: 2};
        let height = 2;
        let configIndex = row * columnNum + col;
        if (originLength > configIndex) {
          let origin_key = monitor.toJS().origin[configIndex].key;
          layouts.lg.push({
            i: origin_key,
            x: col * width.lg,
            y: row * height,
            w: width.lg,
            h: height,
            minW: 3,
            minH: 2,
          });
          layouts.md.push({
            i: origin_key,
            x: col * width.md,
            y: row * height,
            w: width.md,
            h: height,
            minW: 3,
            minH: 2,
          });
          layouts.sm.push({
            i: origin_key,
            x: col * width.sm,
            y: row * height,
            w: width.sm,
            h: height,
            minW: 3,
            minH: 2,
          });
          layouts.xs.push({
            i: origin_key,
            x: col * width.xs,
            y: row * height,
            w: width.xs,
            h: height,
            minW: 3,
            minH: 2,
          });
          layouts.xxs.push({
            i: origin_key,
            x: col * width.xxs,
            y: row * height,
            w: width.xxs,
            h: height,
            minW: 3,
            minH: 2,
          });
        }
      }
    }

    return (
      <div className={cls.monitor}>

        {/*monitor dashboard*/}
        <ResponsiveReactGridLayout className={cls.rowMargin} layouts={layouts} draggableHandle=".move-cursor"
                                   breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                                   cols={{lg: 12, md: 12, sm: 6, xs: 4, xxs: 2}}>
          {monitor.toJS().origin.map((item, index) => {
              if (originLength > index) {
                let currentKey = item.key;
                return (
                  <div key={currentKey}>
                    <MonitorCard {...monitor.toJS().newsList[currentKey]} origin_key={currentKey}/>
                  </div>
                );
              }
            }
          )}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

Monitor.propTypes = {
  newsList: PropTypes.object,
  origin: PropTypes.array,
};
Monitor.defaultProps = {
  newsList: {},
  origin: [],
};

export default Monitor
