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
    const {global, setting, onSubmitForm, onResetDefault} = this.props;

    return (
      <div className={cls.setting}>
        <Card>
          <SettingForm origin={global.get('origin').toJS()}
                       onSubmit={onSubmitForm}
                       onResetDefault={onResetDefault}
                       initialValues={{selectedOriginKeys: global.getIn(['userSetting', 'originKeys']).toJS()}}/>
        </Card>
      </div>
    )
  }
}

Setting.propTypes = {};
Setting.defaultProps = {};

export default Setting
