import React from 'react';
import './default.css';

import { Window } from '../../ui'
import { db }  from '../../util'

import FontListView from '../FontListView'
import DirectoryManager from '../DirectoryManager'
import SearchFilterLayer from '../SearchFilterLayer'
import SocialLink  from '../SocialLink'

class FontManager extends Window {

  constructor (props) {
    super(props);

    this.state = { 
      files : [], 
    }

    this.init();

  }

  init = () => {

    db.initFontDirectory(() => {
      this.refreshAll();
    })

  }

  refreshAll = () => {
    this.refs.dir.refresh();
    this.search();
  }


  refreshFiles = (files) => {
    this.refs.fontlistview.refreshFiles(files);
  }

  searchFont = (e) => {
    this.search();
  }

  showSearchFilter = () => {
    this.refs.searchFilter.classList.toggle('open');
  }

  showDirectory = (e) => {
    const $dom = e.target;
    $dom.classList.toggle('active');    
    this.refs.directory.classList.toggle('open');
  }  


  search = (filterOptions) => {

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      const tempFilter = filterOptions || {
        googleFontSearch : this.refs.searchFilterLayer.getSearchFilterOptions(),
        text : this.refs.searchText.value 
      }
  
      db.searchFiles(tempFilter, (files) => {
        this.refreshFiles(files);
      })
    }, 100);

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

  dropFiles = (files) => {
    db.updateFiles(files, () => {
      this.refreshAll();
    });

  }

  render() {
    return ( 
        <div className="window fontmanager-window font-manager" id={this.props.id}>
          <div className="app-menu">
            <div className="search">
              <span className="search-icon" onClick={this.showSearchFilter}><i className="material-icons">spellcheck</i></span>              
              <div className="search-input">
                <input type="search" ref="searchText" onKeyUp={this.searchFont} onClick={this.searchFont} placeholder="Search" />
              </div>
            </div>
            <div className="tools">
              <div>
                <SocialLink />
              </div>
              <div>
                <span onClick={this.toggleFavoriteList} title="Favorite"><i className="material-icons">favorite</i></span>              
                <span onClick={this.showDirectory}  title="Directory"><i className="material-icons">folder_special</i></span>
              </div>
            </div>
          </div>
          <div ref="searchFilter" className="app-search-filter">
            <SearchFilterLayer ref="searchFilterLayer" search={this.search} />
          </div>
          <div className="app-content">
            <FontListView ref="fontlistview" />
          </div>
          <div ref="directory" className="app-directory">
            <DirectoryManager ref="dir" />
          </div>          
        </div>
    );
  }
}

export default FontManager;
