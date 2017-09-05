import intl from 'react-intl-universal'

import React, { Component } from 'react';
import './default.css';

import FontManager from '../FontManager'

import locales from '../../locales'
import menu from '../../menu'

const { remote } = window.require('electron'); 

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
    this.loadMenu();
    this.changeSettings();

    document.ondragover = document.ondrop = (ev) => {
      ev.preventDefault()
    }
    
    document.body.ondrop = (ev) => {
      const files = [...ev.dataTransfer.files].map((it) => {
        return it.path
      })

      this.refs.font.dropFiles(files);      
      ev.preventDefault()

    }
  }

  changeMode (mode) {
    this.changeSettings();
  }

  changeSettings () {
    remote.getCurrentWindow().setSize(500, 600, true);
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

  selectMenuItem = (e) => {
    if (e.target.classList.contains('menubar-item')) {
      this.showWindow(e.target.getAttribute('target'));
    }
  }

  render() { 

    return (
      this.state.initDone && 
      <div className="app">
        <div className="container">
            <FontManager ref="font" />  
        </div>
      </div>
        
    );
  }
} 

export default App;
