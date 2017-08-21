import React, { Component } from 'react';
import './default.css';

import FontListView from './fontlistview'
import Menubar from './menubar'

import common  from '../../util/common'


class FontManager extends Component {

  constructor () {
    super();

    this.state = { 
      files : [], 
      systemFolders: common.getSystemFolders(),
      userFolders: [], 
      favorite : [],
      library : [],
      font :{},
      style: {
        fontSize: '40px'
      } 
    }
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

  render() {
    return (
        <div className="window hide fontmanager-window font-manager" id={this.props.id}>
            <div className="app-menu">
              <Menubar toggleView={this.toggleView} refreshRowStyle={this.refreshRowStyle} />
            </div>
            <div className="app-content">
                <FontListView ref="fontlistview" toggleFavorite={this.toggleFavorite} fontStyle={this.state.style} files={this.state.files} />
            </div>
        </div>
    );
  }
}

export default FontManager;
