
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

class StyleManager extends Component {

  constructor (props) {
    super(props);

    this.state = {
      story : "",
      style : {
        fontSize : 10,
        fontWeight: 100,
        lineHeight: 1,
      }
    }
  }

  setActive = (id) => {
    this.refs.tabItem.setActive(id);
  }
  render() {

    return (
        <TabItem ref="tabItem" id={this.props.id}  active={this.props.active}>
          <div className="sm-content">
            <div className="sm-style-tools">
              <div className="tool">
                <label>Font Size</label>
                <input type="range" min="10" max="100"  min-string="10px" max-string="100px" step="1" />
              </div>
              <div className="tool">
                <label>Line Height</label>
                <input type="range" min="0" max="50" step="0.01"  min-string="0px" max-string="50px" />
              </div>  
              <div className="tool">
                <label>Font Weight</label>
                <input type="range" min="100" max="900" unit="" step="100" />
              </div>                            
            </div>
            <div className="sm-story">
              <textarea defaultValue={this.state.story}></textarea>
            </div>
          </div>
        </TabItem>
    );
  }
}

export default StyleManager;
