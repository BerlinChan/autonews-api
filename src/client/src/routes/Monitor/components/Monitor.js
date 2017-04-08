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
    this.props.fetchMonitor();
  }

  componentWillUnmount() {
    this.props.onDestroy();
  }

  render() {
    const {monitor, global} = this.props;
    const gridLayoutConfig = global.toJS().gridLayoutConfig;

    return (
      <div className={cls.monitor}>
        {/*monitor dashboard*/}
        <ResponsiveReactGridLayout className={cls.rowMargin}
                                   draggableHandle=".move-cursor"
                                   layouts={global.toJS().userSetting.layouts}
                                   breakpoints={gridLayoutConfig.breakpoints}
                                   cols={gridLayoutConfig.gridCols}>
          {global.getIn(['userSetting', 'originKeys']).toJS().map((item, index) => {
              return (
                <div key={item} className={cls.layoutContent}>
                  <MonitorCard {...global.toJS().newsList[item]} origin_key={item}/>
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
