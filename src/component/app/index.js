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

import CopyText from './CopyText'

import locales from '../../locales'


const { remote } = window.require('electron');

class App extends Component {

  constructor () {
    super();

    this.state = {
      mini: true,
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

  appendInputText = (text, fontFamily) => {
    this.refs.copyText.appendInputText(text, fontFamily);
  }

  onChangeLocale = () => {

    const locale = this.state.locale === 'en' ? 'ko' : 'en'
    this.loadLocales(locale);
  }

  render() { 

    let className = 'app';

    if (this.state.mini) {
      className += ' mini';
    }

    let tabStyle = {paddingLeft: '150px'};
    if (this.state.mini) {
      tabStyle.paddingLeft = '0px';
      tabStyle.marginTop = '5px';
    }

    let fontManagerActive = (this.state.mini ? false : true); 
    let emojiManagerActive = (this.state.mini ? true : false); 
 


    return (
      this.state.initDone && 
      <div className={className}>
        <div className="container">
            <div className="logo" onClick={this.onChangeLocale}>{intl.get('app.title')}</div>
            <Tabs full={true} styles={tabStyle}>	
              <FontManager style={{display: this.state.mini ? 'none' : 'block'}} mini={this.state.mini}  id="font" title={intl.get('app.tab.font.title')} active={fontManagerActive} appendInputText={this.appendInputText} />
              <GlyfManager style={{display: this.state.mini ? 'block' : 'none'}} mini={this.state.mini}  id="glyf" title={intl.get('app.tab.glyphs.title')}  appendInputText={this.appendInputText}/>              
              <EmojiManager style={{display: this.state.mini ? 'block' : 'none'}} mini={this.state.mini}  id="emoji" title={intl.get('app.tab.emoji.title')} active={emojiManagerActive}  appendInputText={this.appendInputText}/>              
              <StyleManager style={{display: this.state.mini ? 'none' : 'block'}} mini={this.state.mini}  id="style" title={intl.get('app.tab.style.title')}  appendInputText={this.appendInputText}/>
              <CssManager style={{display: this.state.mini ? 'none' : 'block'}} mini={this.state.mini}  id="css" title={intl.get('app.tab.css.title')}  appendInputText={this.appendInputText}/>
              <ExportManager style={{display: this.state.mini ? 'none' : 'block'}} mini={this.state.mini}  id="export "title={intl.get('app.tab.export.title')}  appendInputText={this.appendInputText}/>
              <LicenseManager style={{display: this.state.mini ? 'none' : 'block'}} mini={this.state.mini}  id="license "title={intl.get('app.tab.license.title')} right={true}  appendInputText={this.appendInputText}/>              
            </Tabs>
        </div>
        <CopyText ref="copyText" />
      </div>
    );
  }
}

export default App;
