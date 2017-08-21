
import React, { Component } from 'react';
import './default.css';

import googlefont from '../../util/googlefont'

import MainFontList from './MainFontList'
import EarlyAccessFontList from './EarlyAccessFontList'
import FontView from './FontView'

class GoogleFontManager extends Component {

  constructor(props) {
    super(props);

    this.loadFontList();
  }

  loadFontList = () => {
    if (this.refs.mainList) this.refs.mainList.loadFontList()
    if (this.refs.earlyList) this.refs.earlyList.loadFontList()
  }

  refreshFontView = (font) => {
    if (this.refs.fontView) this.refs.fontView.refreshFontView(font);
  }

  downloadAllGoogleFont = () => {
    googlefont.downloadAllGoogleFont(/* progress */ (type, font, progress, total) => {
      console.log(type, progress, total);
    },/* done */ () => {
        console.log('구글 폰트를 다운로드 받았습니다.')
    });
  }

  downloadAllEarlyAccess = () => {
    googlefont.downloadAllEarlyAccess(/* progress */ (type, font, progress, total) => {
      console.log(type, progress, total);
    },/* done */ () => {
        console.log('구글 Early Access 폰트를 다운로드 받았습니다.')
    });
  }  

  render() {

    return (
        <div className="window hide googlefontmanager-window" id={this.props.id}>
          <div className="google-font-list">
            <div className="font-list">
              <MainFontList ref="mainList" refreshFontView={this.refreshFontView} downloadAll={this.downloadAllGoogleFont} />
              <EarlyAccessFontList ref="earlyList" refreshFontView={this.refreshFontView} downloadAll={this.downloadAllEarlyAccess} />
            </div>
            <FontView ref="fontView" />
          </div>
        </div>
    );
  }
}

export default GoogleFontManager; 
