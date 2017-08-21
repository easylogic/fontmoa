import intl from 'react-intl-universal'

import React, { Component } from 'react';
import './default.css';

import Home from '../home'
import Category from '../category'
import FontManager from '../fontmanager'
import FontInfo from '../fontinfo'
import GlyfManager from '../glyfmanager'
import EmojiManager from '../emojimanager'
import GoogleFontManager from '../googlefontmanager'
import StyleManager from '../stylemanager'

//import CopyText from './CopyText'
//import FontToolbar from './FontToolbar'

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
      remote.getCurrentWindow().setSize(420, 600, true);
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

  showWindow = (id) => {
    if (this.currentWindow) this.currentWindow.hide();
    this.refs[id].show();
    this.currentWindow = this.refs[id];
  }

  render() { 

    return (
      this.state.initDone && 
      <div className="app">
        <div className="container">
            <Home ref="home" showWindow={this.showWindow} />
            <Category ref="category" />
            <FontManager ref="font" />  
            <FontInfo ref="fontInfo" />   
            <GlyfManager ref="glyf"/>            
            <EmojiManager ref="emoji" />                          
            <GoogleFontManager ref="googlefont" />      
            <StyleManager ref="style" />
        </div>
      </div>
        
    );
  }
}

export default App;
