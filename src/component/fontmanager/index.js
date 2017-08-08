import intl from 'react-intl-universal'

import React, { Component } from 'react';
import './default.css';

import {Tabs, TabItem} from '../../jui'

import Category from './category'
import FontListView from './fontlistview'
import FontInfo from './fontinfo'
import Menubar from './menubar'

import fontdb  from '../../util/fontdb'
import common  from '../../util/common'


class FontManager extends Component {

  constructor () {
    super();

    this.state = { 
      files : [], 
      directory : "", 
      systemFolders: common.getSystemFolders(),
      userFolders: [], 
      favorite : [],
      font :{},
      style: {
        fontSize: '40px'
      } 
    }

    this.refreshFolder()
  }

  setActive = (id) => {
    this.refs.tabItem.setActive(id);
  }

  updateDirectory = (directory) => {
    fontdb.list(directory, (files) => {
      this.setState({ directory ,  files })
    })

  }

  updateFontInfo = (path) => {
     fontdb.findOne(path, (font) => {
      //this.setState({ font })
      this.refs.fontInfo.updateFontInfo(font);
    })
  }

  refreshFontView = (style) => {
    this.setState({ style })
  }

  refreshFontSize = (fontSize) => {
    this.refs.fontlistview.refreshFontSize(fontSize);
  }

  refreshFontContent = (content) => {
    this.refs.fontlistview.refreshFontCont(content);
  }

  handleAddFolder = (directory) => {
      fontdb.addFolder(directory, () => {
          this.refreshFolder();
      });
  }

  refreshFolder = () => {
    fontdb.folderList((list) => {
      this.setState({
        userFolders: list
      })
    })
  }

  render() {
    return (
        <TabItem ref="tabItem" id={this.props.id}  active={this.props.mini !== true && this.props.active}>
            <div className="app-menu">
                <Menubar refreshFontStyle={this.refreshFontView} refreshFontSize={this.refreshFontSize} refreshFontContent={this.refreshFontContent} />
            </div>
            <div className="app-sidebar">
                <Tabs full={true} >
                    <TabItem id="category" title={intl.get('fontmanager.category.directory.title')} active={true}>
                        <Category 
                            refreshFiles={this.updateDirectory} 
                            refreshDirectory={this.refreshFolder} 
                            handleAddFolder={this.handleAddFolder}                             
                            systemFolders={this.state.systemFolders} 
                            userFolders={this.state.userFolders} 
                            favorite={this.state.favorite} 
                        />
                    </TabItem>
                    <TabItem id="fontinfo" title={intl.get('fontmanager.category.fontinfo.title')}>
                        <FontInfo ref="fontInfo" />
                    </TabItem>
                </Tabs>
            </div>
            <div className="app-content">
                <FontListView ref="fontlistview" fontStyle={this.state.style} files={this.state.files} directory={this.state.directory} refreshFontInfo={this.updateFontInfo} />
            </div>
        </TabItem>
    );
  }
}

export default FontManager;
