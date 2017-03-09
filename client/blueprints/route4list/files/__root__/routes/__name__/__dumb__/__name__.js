import React,{Component} from 'react'
import {Card, Table, Button, Modal, Popconfirm} from 'antd';

export class  <%= pascalEntityName %> extends Component
{

  constructor(props) {
      super(props);

      this.columns = [{
      title: 'Key',
      dataIndex: 'key',
      key: 'key'
    }, {
      title: 'Operation',
      render: (text, record)=>(
      <span>
      <Popconfirm placement="topLeft" title="Are you sure to delete the position?"
      onConfirm={()=>{}}
      okText="Yes" cancelText="No">
      <a href="#" style={{width: 60}}>Delete</a>
      </Popconfirm>
      </span>
      ),
      width:100

    }];

}

  componentDidMount()
  {
  this.props.fetch<%= pascalEntityName %>();
  }
  render()
  {
    return(
      <Card >
    <Table size="middle" columns={this.columns} pagination={false}
    dataSource={this.props.<%= realEntityName %>.get('list').toJS()}
    loading={this.props.<%= realEntityName %>.get('isFetching')}
    />
      </Card>
    )
  }
}

<%= pascalEntityName %>.propTypes = {
}

export default <%= pascalEntityName %>
