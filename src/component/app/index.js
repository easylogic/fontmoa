
import React, { Component } from 'react';
import './default.css';

import {Tabs} from '../../jui'

import FontManager from '../fontmanager'
import GlyfManager from '../glyfmanager'
import EmojiManager from '../emojimanager'
import StyleManager from '../stylemanager'
import CssManager from '../cssmanager'
import ExportManager from '../exportmanager'
import LicenseManager from '../licensemanager'

class App extends Component {

  render() { 

    return (
      <div className="app">
        <div className="app-header">
          <div className="logo">FontMoa</div>
          <div className="toolbar">
            메뉴들

          </div>
        </div>
        <div className="container">
            <Tabs full={true}>	
              <FontManager id="font" title="폰트" active={true} />
              <GlyfManager id="glyf" title="글자들" />              
              <EmojiManager id="emoji" title="이모지" />              
              <StyleManager id="style" title="꾸미기" />
              <CssManager id="css" title="CSS" />
              <ExportManager id="export "title="내보내기" />
              <LicenseManager id="license "title="라이센스 관리" right={true} />              
            </Tabs>
        </div>
      </div>
    );
  }
}

export default App;
