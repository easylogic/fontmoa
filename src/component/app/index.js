import intl from 'react-intl-universal'

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

import locales from '../../locales'


const { clipboard, remote } = window.require('electron');

class App extends Component {

  constructor () {
    super();

    this.state = {
      inputText : "",
      initDone: false,
      locale : remote.app.getLocale()
    }
  }

  componentDidMount () {
    this.loadLocales();
  }

  loadLocales(locale = this.state.locale) {
    intl.init({
      currentLocale: locale, // TODO: determine locale here
      locales,
    })
    .then(() => {
	    this.setState({
        locale, 
        initDone: true
      });
    });
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

  onChangeLocale = () => {

    const locale = this.state.locale === 'en' ? 'ko' : 'en'
    this.loadLocales(locale);
  }

  render() { 

    return (
      this.state.initDone && 
      <div className="app">
        <div className="container">
            <div className="logo" onClick={this.onChangeLocale}>{intl.get('app.title')}</div>
            <Tabs full={true} styles={{paddingLeft: '150px'}}>	
              <FontManager id="font" title={intl.get('app.tab.font.title')} active={true} appendInputText={this.appendInputText} />
              <GlyfManager id="glyf" title={intl.get('app.tab.glyphs.title')}  appendInputText={this.appendInputText}/>              
              <EmojiManager id="emoji" title={intl.get('app.tab.emoji.title')}  appendInputText={this.appendInputText}/>              
              <StyleManager id="style" title={intl.get('app.tab.style.title')}  appendInputText={this.appendInputText}/>
              <CssManager id="css" title={intl.get('app.tab.css.title')}  appendInputText={this.appendInputText}/>
              <ExportManager id="export "title={intl.get('app.tab.export.title')}  appendInputText={this.appendInputText}/>
              <LicenseManager id="license "title={intl.get('app.tab.license.title')} right={true}  appendInputText={this.appendInputText}/>              
            </Tabs>
        </div>
        <div className="app-input">
          <div className="input-copy">
            <button className="btn large" onClick={this.handleCopyText}>{intl.get('app.inputCopy.text')}</button>
          </div>
          <div className="input-text" onClick={this.handleDeleteTextItem} data-placeholder={intl.get('app.inputText.placeholder')}>
            {[...this.state.inputText].map((text, index) => {
              return <span key={index} className="item" data-index={index} title={intl.get('app.inputText.item.title')}>{text}</span>
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
