import React, {Component} from 'react'
import {Card, Table, Button, Modal, Transfer} from 'antd';
import cls from './Setting.scss'
import SettingForm from './widgets/SettingForm'

class Setting extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.fetchSetting();
  }

  componentWillUnmount() {
    this.props.onDestroy();
  }

  render() {
    const {global, setting, fetchSubmitForm} = this.props;

    return (
      <div className={cls.setting}>
        <SettingForm origin={global.get('origin').toJS()}
                     onSubmit={fetchSubmitForm}
                     initialValues={{selectedOriginKeys: global.getIn(['userSetting', 'originKeys']).toJS()}}/>
      </div>
    )
  }
}

Setting.propTypes = {};
Setting.defaultProps = {};

export default Setting
