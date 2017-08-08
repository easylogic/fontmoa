
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

class CssManager extends Component {

  setActive = (id) => {
    this.refs.tabItem.setActive(id);
  }  
  render() {

    return (
        <TabItem ref="tabItem"  id={this.props.id}  active={this.props.active}>
          <div  className="cm-content">

              <p><a href="https://en.wikipedia.org/wiki/Red">사랑</a></p>
              <p><a href="https://en.wikipedia.org/wiki/Blue">평화</a></p>
              <p><a href="https://en.wikipedia.org/wiki/Yellow">정의의</a></p>
              <p><a href="https://en.wikipedia.org/wiki/Green">이름으로</a></p>
              <p><a href="https://en.wikipedia.org/wiki/Orange_(colour)">널 용서하지</a></p>
              <p><a href="https://en.wikipedia.org/wiki/Violet_(color)">않겠다.</a></p>

          </div>
        </TabItem>
    );
  }
}

export default CssManager;
