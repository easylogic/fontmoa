
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

import MainFontList from './MainFontList'
import EarlyAccessFontList from './EarlyAccessFontList'
import FontView from './FontView'

class GoogleFontManager extends Component {

  constructor(props) {
    super(props);

    this.loadFontList();
  }

  setActive = (id) => {
    this.refs.tabItem.setActive(id);

    if (this.props.id === id) {
      this.loadFontList();
    }
  }

  loadFontList = () => {
    if (this.refs.mainList) this.refs.mainList.loadFontList()
    if (this.refs.earlyList) this.refs.earlyList.loadFontList()
  }

  refreshFontView = (font) => {
    if (this.refs.fontView) this.refs.fontView.refreshFontView(font);
  }

  render() {

    return (
        <TabItem ref="tabItem" id={this.props.id}  active={this.props.active}>
          <div className="google-font-list">
            <div className="font-list">
              <MainFontList ref="mainList" refreshFontView={this.refreshFontView} />
              <EarlyAccessFontList ref="earlyList" refreshFontView={this.refreshFontView} />
            </div>
            <FontView ref="fontView" />
          </div>
        </TabItem>
    );
  }
}

export default GoogleFontManager; 
