import intl from 'react-intl-universal'

import React, { Component } from 'react';
import './default.css';

import AutoUpdater from '../AutoUpdater'
import FontManager from '../FontManager'

import locales from '../../locales'
import menu from '../../menu'

const { remote } = window.require('electron'); 

class App extends Component {

  constructor () {
    super();

    this.autoUpdater = new AutoUpdater(this);

    this.state = {
      initDone: false,
      locale : remote.app.getLocale()
    }

  }

  isUpdateReady () {
    return this.autoUpdater.isUpdateReady();
  }

  checkingForUpdate () {
    return this.autoUpdater.checkingForUpdate();
  }

  componentDidMount () {
    this.loadLocales();
    this.loadMenu();
    this.changeSettings();
    this.initEvent();
  }

  initEvent () {
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

  changeSettings () {
    remote.getCurrentWindow().setSize(500, 600, true);
  }

  loadMenu () {
    menu.make(this);
  }

  loadLocales(locale = this.state.locale) {
    intl.init({
      currentLocale: locale, 
      locales,
    })
    .then(() => {
      this.setState({ locale,  initDone: true });
      this.loadMenu();
    });
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
