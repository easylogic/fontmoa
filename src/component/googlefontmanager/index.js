
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'
import googlefont from '../../util/googlefont'

class GoogleFontManager extends Component {

  constructor(props) {
    super(props);

    this.state = {
      font : {},
      items : [],
      categories : [],
      languages : [],
    }

    this.loadFontList();
  }

  setActive = (id) => {
    this.refs.tabItem.setActive(id);

    if (this.props.id === id) {
      this.loadFontList();
    }
  }

  loadFontList = () => {
    googlefont.loadGoogleFontList(() => {
      googlefont.getGoogleFontList((json) => {
        console.log(json); 
        this.setState(json)
      })
    });
  }

  onClickFontItem = (e) => {
    const index = parseInt(e.target.getAttribute('data-index'), 10);

    this.setState({
      font : this.state.items[index],
    })
  }

  render() {

    return (
        <TabItem ref="tabItem" id={this.props.id}  active={this.props.active}>
          <div className="google-font-list">
            <div className="font-list" onClick={this.onClickFontItem}>
              {this.state.items.map((font, index) => {
                  return <div className="font-item" key={index} data-index={index}>{font.family}</div>
              })}
            </div>
            <div className="font-view">
              <pre>{JSON.stringify(this.state.font, null, 4)}</pre>
            </div>
          </div>
        </TabItem>
    );
  }
}

export default GoogleFontManager; 
