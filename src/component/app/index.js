import intl from 'react-intl-universal'

import React, { Component } from 'react';
import './default.css';

import {Tabs} from '../../jui'

import FontManager from '../fontmanager'
import GlyfManager from '../glyfmanager'
import EmojiManager from '../emojimanager'
import GoogleFontManager from '../googlefontmanager'

import CopyText from './CopyText'
import FontToolbar from './FontToolbar'

import locales from '../../locales'
import menu from '../../menu'


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
    this.loadMenu();
    this.changeSettings();
  }

  changeMode (mode) {
    this.setState({ mini : mode === 'mini' })

    this.changeSettings();

  }

  changeSettings () {
    if (this.state.mini) {
      //if (this.refs.tabs) this.refs.tabs.setActive('emoji');
      remote.getCurrentWindow().setSize(400, 600, true);
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

  render() { 

    let tabStyle = {paddingLeft: '5px'};

    return (
      this.state.initDone && 
      <div className="app mini">
        <div className="container">
            <div className="logo">{intl.get('app.title')}</div>
            <Tabs ref="tabs" full={true} styles={tabStyle}>	
              <FontManager id="font" title={intl.get('app.tab.font.title')} active={true} appendInputText={this.appendInputText} />
              <GlyfManager id="glyf" title={intl.get('app.tab.glyphs.title')}  appendInputText={this.appendInputText}/>              
              <EmojiManager id="emoji" title={intl.get('app.tab.emoji.title')} appendInputText={this.appendInputText}/>              
              <GoogleFontManager id="googlefont" title={intl.get('app.tab.googlefont.title')}  appendInputText={this.appendInputText}/>      
            </Tabs>
        </div>
        <div className="toolbar-bottom">
            <CopyText ref="copyText" />
            <FontToolbar ref="fmToolbar" />
        </div>      
      </div>
        
    );
  }
}

export default App;
