import intl from 'react-intl-universal'

import React, { Component } from 'react';
import './default.css';

import AutoUpdater from '../AutoUpdater'
import LoadingView from '../LoadingView'
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
      isUpdateReady : false, 
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

    this.setState({
      isUpdateReady : this.isUpdateReady()
    })
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

  updateStatusForAutoUpdate () {
    this.setState({ isUpdateReady: true })
    this.loadMenu();
  }

  showLoading (title) {
    this.refs.loadingView.show(title);
  }

  hideLoading (delay) {
    this.refs.loadingView.hide(delay);
  }

  getDefaultFontStyle () {
    return this.refs.font.getDefaultFontStyle();
  }

  render() { 

    return (
      this.state.initDone && 
      <div className="app">
        <div className="container">
            <FontManager ref="font" app={this} />  
            <LoadingView ref="loadingView"/>
        </div>
      </div>
        
    );
  }
} 

export default App;
