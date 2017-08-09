import intl from 'react-intl-universal'

import React, { Component } from 'react';
import './default.css';

import {Tabs} from '../../jui'

import FontManager from '../fontmanager'
import GlyfManager from '../glyfmanager'
import EmojiManager from '../emojimanager'
import LicenseManager from '../licensemanager'

import CopyText from './CopyText'

import locales from '../../locales'
import menu from '../../menu'


const { remote } = window.require('electron');

class App extends Component {

  constructor () {
    super();

    this.state = {
      mini: false,
      inputText : "",
      initDone: false,
      locale : remote.app.getLocale()
    }
  }

  componentDidMount () {
    this.loadLocales();
    this.loadMenu();
    this.changeSettings();
  }

  changeMode (mode) {
    this.setState({ mini : mode === 'mini' })

    this.changeSettings();

  }

  changeSettings () {
    if (this.state.mini) {
      if (this.refs.tabs) this.refs.tabs.setActive('emoji');
      remote.getCurrentWindow().setSize(400, 400, true);
    } else {
      if (this.refs.tabs) this.refs.tabs.setActive('font');
      remote.getCurrentWindow().setSize(1000, 700, true);
    }
  }

  loadMenu () {
    menu.make(this);
  }

  loadLocales(locale = this.state.locale) {
    intl.init({
      currentLocale: locale, // TODO: determine locale here
      locales,
    })
    .then(() => {
      this.setState({ locale,  initDone: true });
      this.loadMenu();
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
            <Tabs ref="tabs" full={true} styles={tabStyle}>	
              <FontManager style={{display: this.state.mini ? 'none' : 'block'}} mini={this.state.mini}  id="font" title={intl.get('app.tab.font.title')} active={fontManagerActive} appendInputText={this.appendInputText} />
              <GlyfManager style={{display: 'block'}} mini={this.state.mini}  id="glyf" title={intl.get('app.tab.glyphs.title')}  appendInputText={this.appendInputText}/>              
              <EmojiManager style={{display: 'block'}} mini={this.state.mini}  id="emoji" title={intl.get('app.tab.emoji.title')} active={emojiManagerActive}  appendInputText={this.appendInputText}/>              
              <LicenseManager style={{display: this.state.mini ? 'none' : 'block'}} mini={this.state.mini}  id="license "title={intl.get('app.tab.license.title')} right={true}  appendInputText={this.appendInputText}/>              
            </Tabs>
        </div>
        <CopyText ref="copyText" />
      </div>
    );
  }
}

export default App;
