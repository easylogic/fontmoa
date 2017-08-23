import React from 'react';
import './default.css';

import { Window } from '../../ui'
import { common, fontdb }  from '../../util'

import FontListView from './fontlistview'


class FontManager extends Window {

  constructor (props) {
    super(props);

    this.state = { 
      files : [], 
      systemFolders: common.getSystemFolders(),
      style: {
        fontSize: '30px'
      },
      isDone: false
    }

    fontdb.getFiles(this.state.systemFolders[0].directory, (files) => {
      this.setState({ isDone : true,  files })
    })
  }

  setActive = (id) => {
    this.refs.tabItem.setActive(id);
  }

  refreshFiles = (files) => {
    this.refs.fontlistview.refreshFiles(files);
  }


  refreshFontView = (style) => {
    this.setState({ style })
  }

  refreshFontSize = (fontSize) => {
    this.refs.fontlistview.refreshFontSize(fontSize);
  }

  refreshFontContent = (content) => {
    this.refs.fontlistview.refreshFontContent(content);
  }

  refreshRowStyle = (rowStyle) => {
    this.refs.fontlistview.refreshRowStyle(rowStyle);
  }

  toggleActivation = (path, isActive) => {
      fontdb.toggleActivation(path, isActive)
  }

  toggleFavorite = (path, isAdd) => {
      fontdb.toggleFavorite(path, isAdd)
  }

  toggleView = () => {
    if (this.refs.tabItem) {
      this.refs.tabItem.tabItem.classList.toggle('show-directory')
    }

  }

  onKeyUpSearchText = (e) => {
    console.log(e);
  }

  render() {
    return (this.state.isDone && 
        <div className="window fontmanager-window font-manager" id={this.props.id}>
          <div className="app-menu">
            <div className="left">
              <span className="search-icon"><i className="material-icons">settings</i></span>              
              <div className="search-input">
                <input type="search" onKeyUp={this.onKeyUpSearchText} placeholder="Search" />
              </div>
            </div>
            <div className="right">
              <div className="radio-box">
                <span className="active"><i className="material-icons">view_list</i></span>                  
                <span><i className="material-icons">grid_on</i></span>
              </div>
            </div>
          </div>
          <div className="app-content">
              <FontListView ref="fontlistview" toggleActivation={this.toggleActivation}  toggleFavorite={this.toggleFavorite} fontStyle={this.state.style} files={this.state.files} />
          </div>
          <div className="app-toolbar">
            <div className="left tools">
              <div className="logo">FontMoa</div>
            </div>
            <div className="center tools">
              <input type="range" min="4" max="40" step="1" />
            </div>
            <div className="right tools">
              <span><i className="material-icons">folder_special</i></span>
            </div>
          </div>
        </div>
    );
  }
}

export default FontManager;
