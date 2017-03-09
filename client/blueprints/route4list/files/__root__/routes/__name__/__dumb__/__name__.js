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
      <div>
   hello <%= pascalEntityName %>
      </div>
    )
  }
}

<%= pascalEntityName %>.propTypes = {};
<%= pascalEntityName %>.defaultProps = {};

export default <%= pascalEntityName %>
