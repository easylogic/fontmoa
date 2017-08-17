
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

import googlefont from '../../util/googlefont'

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

  downloadAllGoogleFont = () => {
    googlefont.downloadAllGoogleFont(/* progress */ (targetFile, progress, total) => {
      //console.log(targetFile, progress, total);
    },/* done */ () => {
        console.log('구글 폰트를 다운로드 받았습니다.')
    });
  }

  downloadAllEarlyAccess = () => {
    googlefont.downloadAllEarlyAccess(/* progress */ (targetFile, progress, total) => {
      //console.log(targetFile, progress, total);
    },/* done */ () => {
        console.log('구글 Early Access 폰트를 다운로드 받았습니다.')
    });
  }  

  render() {

    return (
        <TabItem ref="tabItem" id={this.props.id}  active={this.props.active}>
          <div className="google-font-list">
            <div className="font-list">
              <MainFontList ref="mainList" refreshFontView={this.refreshFontView} downloadAll={this.downloadAllGoogleFont} />
              <EarlyAccessFontList ref="earlyList" refreshFontView={this.refreshFontView} downloadAll={this.downloadAllEarlyAccess} />
            </div>
            <FontView ref="fontView" />
          </div>
        </TabItem>
    );
  }
}

export default GoogleFontManager; 
