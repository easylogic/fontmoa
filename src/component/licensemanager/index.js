
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

class LicenseManager extends Component {

  setActive = (id) => {
    this.refs.tabItem.setActive(id);
  }

  render() {

    return (
        <TabItem ref="tabItem" id={this.props.id}  active={this.props.active}>
          폰트 라이센스의 문제점들
        </TabItem>
    );
  }
}

export default LicenseManager; 
