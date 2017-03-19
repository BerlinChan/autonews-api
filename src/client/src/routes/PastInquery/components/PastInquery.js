import React,{Component} from 'react'
import {Card, Table, Button, Modal, Popconfirm} from 'antd';

class  PastInquery extends Component
{
  constructor(props) {
      super(props);
}

  componentDidMount()
  {
  this.props.fetchPastInquery();
  }

  render()
  {
    return(
      <div>
   hello PastInquery
      </div>
    )
  }
}

PastInquery.propTypes = {};
PastInquery.defaultProps = {};

export default PastInquery
