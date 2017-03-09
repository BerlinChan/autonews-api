import React,{Component} from 'react'
import {Card, Table, Button, Modal, Popconfirm} from 'antd';

class  <%= pascalEntityName %> extends Component
{
  constructor(props) {
      super(props);

}

  componentDidMount()
  {
  this.props.fetch<%= pascalEntityName %>();
  }
  render()
  {
    return(
      <Card >
   hello world
      </Card>
    )
  }
}

<%= pascalEntityName %>.propTypes = {
};

export default <%= pascalEntityName %>
