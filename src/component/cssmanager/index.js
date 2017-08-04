
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

class CssManager extends Component {

  setActive = (id) => {
    this.refs.tabItem.setActive(id === this.props.id);
  }  
  render() {

    return (
        <TabItem ref="tabItem" active={this.props.active}>
          
        </TabItem>
    );
  }
}

export default CssManager;
