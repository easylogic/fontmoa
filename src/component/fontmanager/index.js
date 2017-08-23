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

  onKeyUpSearchText = (e) => {
    console.log(e);
  }

  inputPagramText = (e) => {
    this.refreshFontContent(e.target.value);
  }

  changeListStyle = (e) => {

    const rowStyle = e.target.classList.contains('row') ? 'row' : 'grid';

    if (rowStyle === 'row') {
      this.refs.rowType.classList.toggle('active', true);
      this.refs.gridType.classList.toggle('active', false);
    } else {
      this.refs.rowType.classList.toggle('active', false);
      this.refs.gridType.classList.toggle('active', true);
    }

    this.refreshRowStyle(rowStyle);
  }

  onChangeFontSize = (e) => {
      const fontSize = e.target.value + 'px';

      this.refreshFontSize(fontSize);
  }

  render() {
    return (this.state.isDone && 
        <div className="window fontmanager-window font-manager" id={this.props.id}>
          <div className="app-menu">
            <div className="left">
              <span className="search-icon"><i className="material-icons">spellcheck</i></span>              
              <div className="search-input">
                <input type="search" onKeyUp={this.onKeyUpSearchText} placeholder="Search" />
              </div>
            </div>
            <div className="right">
              <div className="radio-box">
                <span ref="rowType" className="list-style row active" onClick={this.changeListStyle}><i className="material-icons">view_list</i></span>                  
                <span ref="gridType" className="list-style grid" onClick={this.changeListStyle}><i className="material-icons">grid_on</i></span>
              </div>
            </div>
          </div>
          <div className="app-content">
              <FontListView ref="fontlistview" toggleActivation={this.toggleActivation}  toggleFavorite={this.toggleFavorite} fontStyle={this.state.style} files={this.state.files} />
          </div>
          <div className="app-toolbar">
            <div className="left tools">
              <input type="search" className="pangram-text" placeholder="Text" onChange={this.inputPagramText} />
            </div>
            <div className="center tools">
              <span className="small">A</span> 
              <input type='range' onInput={this.onChangeFontSize}  min="10" max="100" defaultValue="40" step="1" /> 
              <span className="big">A</span>
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
