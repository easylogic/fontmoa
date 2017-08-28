import React from 'react';
import ReactDOM from 'react-dom'
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

    this.init();

  }

  init = () => {
    const system = this.state.systemFolders[0];
    fontdb.update(system.directory, system.type, (categoryId) => {
      fontdb.getFiles(categoryId, (files) => {
        this.setState({ isDone : true,  files })
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

  toggleActivation = (path, isActive) => {
      fontdb.toggleActivation(path, isActive)
  }

  toggleFavorite = (path, isAdd) => {
      fontdb.toggleFavorite(path, isAdd)
  }

  onKeyUpSearchText = (e) => {
    this.search();
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

  showSearchFilter = () => {
    this.refs.searchFilter.classList.toggle('open');
  }

  showDirectory = () => {
    this.refs.directory.classList.toggle('open');
  }  

  toggleCheckBox = (e) => {
    let $icon = e.target.querySelector('i.material-icons');

    if ($icon.textContent === 'check_box') {
      $icon.textContent = "check_box_outline_blank";
    } else {
      $icon.textContent = "check_box";
    }
  }

  isChecked = ($el) => {
    return ReactDOM.findDOMNode($el).querySelector(".material-icons").textContent === 'check_box';
  }

  search = (filterOptions) => {

    filterOptions = filterOptions || {
      categories : {
        serif : this.isChecked(this.refs.serif),
        sanserif : this.isChecked(this.refs.sansserif),
        display : this.isChecked(this.refs.display),
        handwriting : this.isChecked(this.refs.handwriting),
        monospace : this.isChecked(this.refs.monospace),
      },
      weight : (this.refs.thickness.value * 100),
      text : this.refs.searchText.value 
    }

    fontdb.searchFiles(filterOptions, (files) => {
      this.refreshFiles(files);
    })
  }

  toggleFavoriteList = (e) => {
    const $dom = e.target;
    $dom.classList.toggle('active');

    if ($dom.classList.contains('active')) {
      this.search({favorite: true});
    } else {
      this.search();
    }

  }

  render() {
    return (this.state.isDone && 
        <div className="window fontmanager-window font-manager" id={this.props.id}>
          <div className="app-menu">
            <div className="left">
              <span className="search-icon" onClick={this.showSearchFilter}><i className="material-icons">spellcheck</i></span>              
              <div className="search-input">
                <input type="search" ref="searchText" onKeyUp={this.onKeyUpSearchText} placeholder="Search" />
              </div>
            </div>
            <div className="right tools">
              <span onClick={this.toggleFavoriteList}><i className="material-icons">favorite</i></span>              
              <span onClick={this.showDirectory}><i className="material-icons">folder_special</i></span>
            </div>
          </div>
          <div ref="directory" className="app-directory">

          </div>
          <div ref="searchFilter" className="app-search-filter" onMouseUp={this.search}>
            <div className="search-header">Categories</div>
            <div className="search-item">
              <label onClick={this.toggleCheckBox} ref="serif"><i className="material-icons">check_box</i> Serif</label>
              <label onClick={this.toggleCheckBox} ref="sansserif"><i className="material-icons">check_box</i> Sans-Serif</label>
              <label onClick={this.toggleCheckBox} ref="display"><i className="material-icons">check_box</i> Display</label>
              <label onClick={this.toggleCheckBox} ref="handwriting"><i className="material-icons">check_box</i> Handwriting</label>
              <label onClick={this.toggleCheckBox} ref="monospace"><i className="material-icons">check_box</i> Monospace</label>
            </div>
            <div className="search-header">Thickness</div>
            <div className="search-item">
              <label className="inline" onClick={this.toggleCheckBox}><i className="material-icons">check_box</i></label>
              <span style={{ display: 'inline-block', width: '120px', 'paddingLeft': '20px'}}><input ref="thickness" type="range" max="9" min="1" step="1" defaultValue="4" /></span>
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
              <input type='range' style={{display:'inline-block',width:'100px'}} onInput={this.onChangeFontSize}  min="10" max="100" defaultValue="40" step="1" /> 
              <span className="big">A</span>
            </div>
            <div className="right tools">
              <div className="radio-box">
                <span ref="rowType" className="list-style row active" onClick={this.changeListStyle}><i className="material-icons">view_list</i></span>                  
                <span ref="gridType" className="list-style grid" onClick={this.changeListStyle}><i className="material-icons">grid_on</i></span>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default FontManager;
