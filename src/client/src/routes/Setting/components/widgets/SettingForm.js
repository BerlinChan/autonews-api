/**
 * Created by berlin on 2017/4/8.
 */
import React, {
  Component,
  PropTypes,
} from 'react';
import {Field, reduxForm} from 'redux-form';
import {Row, Col, Form, Input, Select, Button, Transfer} from 'antd';
const FormItem = Form.Item;

const validate = (values) => {
  const errors = {};
  if (!values.selectedOriginKeys.length)
    errors.selectedOriginKeys = '至少选择一个监控对象';

  return errors;
};

const TransferField = ({input, required, dataSource, label, labelSpan, wrapperSpan, meta: {touched, error}}) => {
  return (
    <FormItem label={label}
              labelCol={{span: labelSpan === undefined ? "8" : labelSpan}}
              wrapperCol={{span: wrapperSpan === undefined ? "16" : wrapperSpan}}
              validateStatus={(touched && error) ? "error" : ""}
              help={touched && error} required={required}>
      <Transfer
        titles={['可用监控对象', '已选择']}
        dataSource={dataSource}
        showSearch
        filterOption={(inputValue, option) => option.name.indexOf(inputValue) > -1}
        targetKeys={input.value}
        render={item => item.name}
        onChange={(targetKeys) => {
          input.onChange(targetKeys);
        }}/>
    </FormItem>
  )
};

class SettingForm extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  render() {
    const {origin, handleSubmit, submitting,} = this.props;
    const {getFieldDecorator} = this.props.form;

    return (
      <form onSubmit={handleSubmit}>
        <Field name="selectedOriginKeys" label=""
               labelSpan="0" wrapperSpan="24"
               dataSource={origin} required={true}
               onChange={(value) => {
                 console.log(value);
               }}
               component={TransferField}/>

        {/*buttons*/}
        <Row gutter={12}>
          <Col span={24} style={{marginBottom: '16px', textAlign: 'right'}}>
            <Button type="primary" htmlType="submit" loading={submitting}
                    style={{marginRight: '12px'}}>保存</Button>
            <Button loading={submitting}>重置为系统默认</Button>
          </Col>
        </Row>
      </form>
    );
  }
}

SettingForm.propTypes = {};
SettingForm.defaultProps = {};

export default reduxForm({
  form: 'settingForm',
  validate,
  enableReinitialize: true,
})(SettingForm);
