import React, { Component } from 'react';
import './default.css';

class SearchFilterLayer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      typeText : '',
      fontSize : 40,
      categories : {
        'Serif' : false, 
        'Sans Serif' : false, 
        'Display' : false, 
        'Handwriting' : false, 
        'Monospace' : false
      },
      division : {
        'Google Fonts' : false, 
        "Google Fonts Early Access" : false, 
        'Free Fonts' : false,

      }
    }
  }

  getFontStyle () {
    return {
      typeText : this.state.typeText,
      fontSize : this.state.fontSize 
    }
  }

  changeTypeText = (e) => {

    if (e.keyCode === 13) {
      this.search()
    } else {
      const typeText = e.target.value;
      this.setState({ typeText })
    }
  }
  
  changeFontSize = (e) => {
    const fontSize = parseInt(e.target.value, 10);
    this.setState({ fontSize })
  }

  getSearchFilterOptions = () => {
    return {
      categories : {
        serif : this.state.categories['Serif'],
        'sans-serif' : this.state.categories['Sans Serif'],
        display : this.state.categories['Display'],
        handwriting : this.state.categories['Handwriting'],
        monospace : this.state.categories['Monospace'],
      },
      division : {
        "GoogleFonts" : this.state.division['Google Fonts'],
        "FreeFonts" : this.state.division['Free Fonts'],        
        "GoogleFontsEarlyAccess" : this.state.division['Google Fonts Early Access'],
      }
    }
  }

  search = () => {
    this.props.search();
  }

  toggleCategory = (key) => {
    return (e) => {

      let categories = this.state.categories;
      categories[key] = !categories[key]

      this.setState({ categories })
    }
  }

  toggleDivision = (key) => {
    return (e) => {

      let division = this.state.division;
      division[key] = !division[key]

      this.setState({ division })
    }
  }

  render() {

    const categories = this.state.categories;
    const cateKeys = Object.keys(categories);

    const division = this.state.division;
    const divisionKeys = Object.keys(division);

    return ( 
      <div className="search-filter-layer" onMouseUp={this.search}>
        <div className="search-item type-text">
          <span>
            <input type="text" placeholder="Type here to preview text" defaultValue={this.state.typeText} onKeyUp={this.changeTypeText} />
          </span>
          <span>
            <input type="range" max="250" min="10" defaultValue={this.state.fontSize} onChange={this.changeFontSize} />
          </span>
        </div>
        <div className="search-header">Categories</div>
        <div className="search-item">
          {cateKeys.map((key, index) => {

            const isSelected = categories[key];
            let className = "";
            if (isSelected) {
              className = " selected ";
            }

            return <label key={index} className={className} onClick={this.toggleCategory(key)} >{key}</label>
          })}
        </div>
        <div className="search-header">Division</div>
        <div className="search-item">
          {divisionKeys.map((key, index) => {

            const isSelected = division[key];
            let className = "";
            if (isSelected) {
              className = " selected ";
            }

            return <label key={index} className={className} onClick={this.toggleDivision(key)} >{key}</label>
          })}
        </div>
      </div>

    );
  }
}

export default SearchFilterLayer;
