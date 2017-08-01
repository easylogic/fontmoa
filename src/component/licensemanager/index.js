
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

class LicenseManager extends Component {
  render() {

    return (
        <TabItem active={this.props.active}>
          폰트 라이센스의 문제점들
        </TabItem>
    );
  }
}

export default LicenseManager; 
