
import React, { Component } from 'react';
import './App.css';



import Category from './component/category'
import FontListView from './component/fontlistview'

const os = window.require('os')

class App extends Component {

  constructor () {
    super();

    this.state = { files : [], systemFolders : this.getSystemFolders() }
  }

  getSystemFolders() {
    const platform = os.platform();
    console.log(platform)
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

  updateDirectory = (files) => {
    console.log(files)
    this.setState({
      files: files 
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
          <Category updateDirectory={this.updateDirectory} systemFolders={this.state.systemFolders} />
        </div>
        <div className="app-content">
          <FontListView files={this.state.files} />
        </div>
      </div>
    );
  }
}

export default App;
