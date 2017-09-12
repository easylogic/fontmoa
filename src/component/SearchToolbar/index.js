import React, {Component} from 'react';
import './default.css';
import SocialLink  from '../SocialLink'
class SearchToolbar extends Component {

  searchFont = (e) => {
    this.props.search();
  }

  getText = () => {
    return this.refs.searchText.value;
  }

  render() {
    return ( 
      <div className="search">
        {/*<span className="search-icon" onClick={this.showSearchFilter}><i className="material-icons">spellcheck</i></span>   */}           
        <div className="search-input">
          <input type="search" ref="searchText" onKeyUp={this.searchFont} onClick={this.searchFont} placeholder="Search" />
        </div>
        <div className="tools">
          <SocialLink />
        </div>
      </div>

    );
  }
}

export default SearchToolbar;
