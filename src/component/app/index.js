
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

  handleDeleteText = (e) => {
    this.setState({
      inputText : ''
    })
  }  

  handleDeleteTextItem = (e) => {
    const index = parseInt(e.target.getAttribute('data-index') || '-1', 10);

    let chars = [...this.state.inputText];
    
    if (index > -1) {
      chars.splice(index, 1);
    }


    this.setState({
      inputText : chars.join('')
    });
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
          <div className="input-text" onClick={this.handleDeleteTextItem} data-placeholder="문자나 이모지를 선택해주세요. 한번에 복사할 수 있습니다.">
            {[...this.state.inputText].map((text, index) => {
              return <span key={index} className="item" data-index={index} title="클릭하면 지워집니다.">{text}</span>
            })}
          </div>
          <div className="input-delete">
            <button className="btn large" onClick={this.handleDeleteText}><i className="icon icon-trashcan"></i></button>
          </div>          
        </div> 
      </div>
    );
  }
}

export default App;
