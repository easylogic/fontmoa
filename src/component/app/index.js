
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

const { clipboard } = window.require('electron');

class App extends Component {

  constructor () {
    super();

    this.state = {
      inputText : ""
    }
  }

  appendInputText = (text) => {
    this.setState({
      inputText : this.state.inputText + text 
    })
  }

  handleInputText = (e) => {
    this.setState({
      inputText : e.target.innerHTML 
    })
  }

  handleCopyText = (e) => {
    const copyText = this.state.inputText;
    clipboard.writeText(copyText);
  }

  render() { 

    return (
      <div className="app">
        <div className="container">
            <div className="logo">FontMOA</div>
            <Tabs full={true} styles={{paddingLeft: '150px'}}>	
              <FontManager id="font" title="폰트" active={true} appendInputText={this.appendInputText} />
              <GlyfManager id="glyf" title="글자들"  appendInputText={this.appendInputText}/>              
              <EmojiManager id="emoji" title="Emoji 5.0"  appendInputText={this.appendInputText}/>              
              <StyleManager id="style" title="꾸미기"  appendInputText={this.appendInputText}/>
              <CssManager id="css" title="CSS"  appendInputText={this.appendInputText}/>
              <ExportManager id="export "title="내보내기"  appendInputText={this.appendInputText}/>
              <LicenseManager id="license "title="라이센스 관리" right={true}  appendInputText={this.appendInputText}/>              
            </Tabs>
        </div>
        <div className="app-input">
          <div className="input-copy">
            <button className="btn large" onClick={this.handleCopyText}>Copy</button>
          </div>
          <div className="input-text">{this.state.inputText}</div>
        </div>
      </div>
    );
  }
}

export default App;
