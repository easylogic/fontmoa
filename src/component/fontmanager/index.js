import React from 'react';
import './default.css';

import { Window } from '../../ui'
import { db }  from '../../util'

import FontListView from '../FontListView'
import DirectoryManager from '../DirectoryManager'
import SearchFilterLayer from '../SearchFilterLayer'
import FontToolbar from '../FontToolbar'
import SearchToolbar from '../SearchToolbar'

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

  showSearchFilter = () => {
    this.refs.searchFilter.classList.toggle('open');
  }

  showDirectory = (isShow) => {
    this.refs.directory.classList.toggle('open', isShow);
  }  


  search = (filterOptions) => {

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      const tempFilter = filterOptions || {
        googleFontSearch : this.refs.searchFilterLayer.getSearchFilterOptions(),
        text : this.refs.search.getText() 
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

  showGoogleFont = (e) => {
    this.search({ text : "GoogleFonts" });
  }  

  showFreeFont = (e) => {
    this.search({ text : "FreeFonts" });
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
            <SearchToolbar ref="search" search={this.search} />
            <FontToolbar search={this.search} showDirectory={this.showDirectory} />
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
