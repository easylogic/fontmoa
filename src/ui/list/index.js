import React, { Component } from 'react'
import './default.css';

import ListItem from './item'

class List extends Component {

  render () {
    return (
      <div className="list">
        {this.props.items.map((item, index) => {
          return <ListItem item={item} onClick={this.props.onClick} key={index} />
        })}
      </div>
    )
  }
}

export default List