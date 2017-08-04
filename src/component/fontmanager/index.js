import React, { Component } from 'react';
import './default.css';

import {Tabs, TabItem} from '../../jui'

import Category from './category'
import FontListView from './fontlistview'
import FontInfo from './fontinfo'
import Menubar from './menubar'

import fontdb  from '../../util/fontdb'



const os = window.require('os') 

class FontManager extends Component {

  constructor () {
    super();

    this.state = { 
      files : [], 
      directory : "", 
      systemFolders: [],
      userFolders: [], 
      favorite : [],
      font :{},
      style: {
        fontSize: '40px'
      } 
    }

    this.refreshFolder()
  }

  getSystemFolders() {
    const platform = os.platform();
    switch (platform) {
      case "darwin" : 
        return [
            { name : 'fontmanager.category.system.folder.name', directory : '/Library/Fonts'}
        ];
      case "win32" : 
        return [
          { name : 'fontmanager.category.system.folder.name', directory : 'c:\\Windows\\Fonts'}
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

  handleAddFolder = (directory) => {
      fontdb.addFolder(directory, () => {
          this.refreshFolder();
      });
  }

  refreshFolder = () => {
    fontdb.folderList((list) => {
      this.setState({
        systemFolders : this.getSystemFolders(), 
        userFolders: list
      })
    })
  }

  render() {

    return (
        <TabItem active={this.props.active}>
            <div className="app-menu">
                <Menubar refreshFontStyle={this.refreshFontView} />
            </div>
            <div className="app-sidebar">
                <Tabs full={true} >
                    <TabItem id="category" title="Directory" active={true}>
                        <Category 
                            refreshFiles={this.updateDirectory} 
                            refreshDirectory={this.refreshFolder} 
                            handleAddFolder={this.handleAddFolder}                             
                            systemFolders={this.state.systemFolders} 
                            userFolders={this.state.userFolders} 
                            favorite={this.state.favorite} 
                        />
                    </TabItem>
                    <TabItem id="fontinfo" title="Font Info">
                        <FontInfo font={this.state.font} />
                    </TabItem>
                </Tabs>
            </div>
            <div className="app-content">
                <FontListView fontStyle={this.state.style} files={this.state.files} directory={this.state.directory} refreshFontInfo={this.updateFontInfo} />
            </div>
        </TabItem>
    );
  }
}

export default FontManager;
