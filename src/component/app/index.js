
import React, { Component } from 'react';
import './default.css';

import {Tabs, TabItem} from '../../jui'

import Category from '../category'
import FontListView from '../fontlistview'
import FontInfo from '../fontinfo'
import Menubar from '../menubar'

import fontdb  from '../../util/fontdb'



const os = window.require('os') 

class App extends Component {

  constructor () {
    super();

    this.state = { 
      files : [], 
      directory : "", 
      systemFolders : this.getSystemFolders(), 
      userFolders: [], 
      font :{},
      style: {
        fontSize: '40px'
      } 
    }
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

  refreshFontView = (style) => {
    this.setState({ style })
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <div className="logo">FontMoa</div>
          <div className="toolbar">
            메뉴들

          </div>
        </div>
        <div className="container">
            <Tabs full={true}>	
              <TabItem id="font" title="Font" active={true}>
                  <div className="app-menu">
                    <Menubar refreshFontStyle={this.refreshFontView} />
                  </div>
                  <div className="app-sidebar">
                    <Category refreshFiles={this.updateDirectory} systemFolders={this.state.systemFolders} />
                    <FontInfo font={this.state.font} />
                  </div>
                  <div className="app-content">
                    <FontListView fontStyle={this.state.style} files={this.state.files} directory={this.state.directory} refreshFontInfo={this.updateFontInfo} />
                  </div>
              </TabItem>
              <TabItem id="style" title="Style">
                Style Manager
              </TabItem>
              <TabItem id="css" title="CSS">
                Css Manager
              </TabItem>
              <TabItem id="export "title="Export">
                Export Manager
              </TabItem>
            </Tabs>
        </div>
      </div>
    );
  }
}

export default App;
