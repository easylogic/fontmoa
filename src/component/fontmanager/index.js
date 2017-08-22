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
        fontSize: '40px'
      } 
    }

    fontdb.getFiles(this.state.systemFolders[0].directory, (files) => {
      this.setState({
        files 
      })
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

  toggleFavorite = (path, isAdd) => {
    this.refs.category.toggleFavorite(path, isAdd);
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
    return (
        <div className="window fontmanager-window font-manager" id={this.props.id}>
            <div className="app-menu">
              <div className="left">
                <div className="search-input">
                  <span className="icon">※</span>
                  <input type="search" onKeyUp={this.onKeyUpSearchText} placeholder="Search word" />
                </div>
              </div>
              <div className="right">
                <div className="radio-box">
                  <span className="active">Row</span>                  
                  <span>Grid</span>
                </div>
              </div>
            </div>
            <div className="app-content">
                <FontListView ref="fontlistview" toggleFavorite={this.toggleFavorite} fontStyle={this.state.style} files={this.state.files} />
            </div>
        </div>
    );
  }
}

export default FontManager;
