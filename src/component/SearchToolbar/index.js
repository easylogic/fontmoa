import intl from 'react-intl-universal'
import React, {Component} from 'react';
import './default.css';

const { shell } = window.require('electron').remote;

class SearchToolbar extends Component {

  searchFont = (e) => {
    this.props.search();
  }

  getText = () => {
    return this.refs.searchText.value;
  }


  goHome = () => {
    shell.openExternal('http://www.fontmoa.com/fontmoa/');
  }    

  showDirectory = (e) => {
    const $dom = e.target;
    $dom.classList.toggle('active');    

    this.props.showDirectory($dom.classList.contains('active'));
  }  


  toggleFavoriteList = (e) => {
    const $dom = e.target;
    $dom.classList.toggle('active');

    if ($dom.classList.contains('active')) {
      this.props.search({favorite: true});
    } else {
      this.props.search();
    }

  }

  render() {
    return ( 
      <div className="search">
        <span className="logo" onClick={this.goHome} title="Home Page">
          <img src="./icon.png" alt="FontMoa" width="30px" height="30px" /> FontMoa</span>
        <div className="search-input">           
          <input type="search" ref="searchText" onKeyUp={this.searchFont} onClick={this.searchFont} placeholder="Search" />
          <span className="search-icon" onClick={this.props.toggleSearchFilter}><i className="material-icons">search</i></span>          
        </div>
        <div className="tools">
          <span onClick={this.toggleFavoriteList} title={intl.get('searchtoolbar.title.favorite')}><i className="material-icons">favorite</i></span>
          <span onClick={this.showDirectory}  title={intl.get('searchtoolbar.title.directory')}><i className="material-icons">folder_special</i></span>
        </div>
      </div>

    );
  }
}

export default SearchToolbar;
