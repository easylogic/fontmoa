import React, { Component } from 'react';
import './App.css';

import Category from './component/category'
import FontListView from './component/fontlistview'

class App extends Component {

  constructor () {
    super();

    this.state = { files : [] }
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
          <Category updateDirectory={this.updateDirectory} />
        </div>
        <div className="app-content">
          <FontListView files={this.state.files} />
        </div>
      </div>
    );
  }
}

export default App;
