import intl from 'react-intl-universal'

import React, { Component } from 'react';
import './default.css';

import {Tabs, TabItem} from '../../jui'

import Category from './category'
import FontListView from './fontlistview'
import Menubar from './menubar'
import Toolbar from './toolbar'

import fontdb  from '../../util/fontdb'
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
        <TabItem ref="tabItem" className="font-manager" id={this.props.id}  active={this.props.mini !== true && this.props.active}>
            <div className="app-menu">
              <Menubar toggleView={this.toggleView} refreshRowStyle={this.refreshRowStyle} />
            </div>
            <div className="app-sidebar">
              <Category ref="category" refreshFiles={this.refreshFiles} />              
            </div>
            <div className="app-content">
                <FontListView ref="fontlistview" toggleFavorite={this.toggleFavorite} fontStyle={this.state.style} files={this.state.files} />
            </div>
            <div className="app-toolbar">
              <Toolbar refreshRowStyle={this.refreshRowStyle} refreshFontStyle={this.refreshFontView} refreshFontSize={this.refreshFontSize} refreshFontContent={this.refreshFontContent} />
            </div>            
        </TabItem>
    );
  }
}

export default FontManager;
