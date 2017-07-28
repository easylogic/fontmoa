
import React, { Component } from 'react';
import './default.css';



import Category from '../category'
import FontListView from '../fontlistview'
import FontInfo from '../fontinfo'

import fontdb  from '../../util/fontdb'

const os = window.require('os')

class App extends Component {

  constructor () {
    super();

    this.state = { files : [], directory : "", systemFolders : this.getSystemFolders(), userFolders: [], font :{} }
  }

  getSystemFolders() {
    const platform = os.platform();
    switch (platform) {
      case "darwin" : 
        return [
            { name : '시스템 폴더', path : '/Library/Fonts'}
        ];
      case "win32" : 
        return [
          { name : '시스템 폴더', path : 'c:\\Windows\\Fonts'}
        ];
      default : 
        return []
    }
  }

  updateDirectory = (directory) => {
    fontdb.list(directory, (files) => {
      this.setState({ directory ,  files })
    })

  }

  updateFontInfo = (path) => {
     fontdb.findOne(path, (font) => {
      this.setState({ font })
    })
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <div className="logo">FontMoa</div>
          <div className="navbar">
            메뉴들

          </div>
        </div>
        <div className="app-menu">

        </div>
        <div className="app-sidebar">
          <Category refreshFiles={this.updateDirectory} systemFolders={this.state.systemFolders} />
          <FontInfo font={this.state.font} />
        </div>
        <div className="app-content">
          <FontListView files={this.state.files} directory={this.state.directory} refreshFontInfo={this.updateFontInfo} />
        </div>
      </div>
    );
  }
}

export default App;
