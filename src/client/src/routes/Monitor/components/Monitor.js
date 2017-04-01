import React, {Component, PropTypes,} from 'react'
import cls from './Monitor.scss'
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
    window.scrollTo(0, 0);
    this.props.fetchOriginAndNews();
  }

  componentWillUnmount() {
    this.props.onDestroy();
  }

  render() {
    const {monitor, global} = this.props;
    const gridCols = {lg: 12, md: 12, sm: 6, xs: 2};//grid cols, 栅格列数
    const monitorWidth = {lg: 3, md: 4, sm: 3, xs: 2};//每监视器栅格宽
    const monitorHeight = {lg: 2, md: 2, sm: 2, xs: 2};//每监视器栅格高
    // layout is an array of objects, see the demo for more complete usage
    let layouts = {lg: [], md: [], sm: [], xs: []};
    for (let i in layouts) {
      let currentX = 0;
      let currentY = 0;
      for (let j = 0; j < global.toJS().origin.length; j++) {
        let colsPerRow = gridCols[i] / monitorWidth[i];
        layouts[i].push({
          i: global.toJS().origin[j].key,
          x: currentX * monitorWidth[i],
          y: currentY * monitorHeight[i],
          w: monitorWidth[i],
          h: monitorHeight[i],
          minW: monitorWidth[i],
          minH: 2,
        });
        if (currentX >= colsPerRow - 1) {
          currentX = 0;
          currentY += 1;
        } else {
          currentX += 1;
        }
      }
    }

    return (
      <div className={cls.monitor}>
        {/*monitor dashboard*/}
        <ResponsiveReactGridLayout className={cls.rowMargin} layouts={layouts} draggableHandle=".move-cursor"
                                   breakpoints={{lg: 1440, md: 1024, sm: 425, xs: 0}}
                                   cols={gridCols}>
          {global.toJS().origin.map((item, index) => {
              let currentKey = item.key;
              return (
                <div key={currentKey} className={cls.layoutContent}>
                  <MonitorCard {...global.toJS().newsList[currentKey]} origin_key={currentKey}/>
                </div>
              );
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
