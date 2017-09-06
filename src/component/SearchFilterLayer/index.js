import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './default.css';

class SearchFilterLayer extends Component {

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
  
  getSearchFilterOptions = () => {
    return {
      category : {
        serif : this.isChecked(this.refs.serif),
        sanserif : this.isChecked(this.refs.sansserif),
        display : this.isChecked(this.refs.display),
        handwriting : this.isChecked(this.refs.handwriting),
        monospace : this.isChecked(this.refs.monospace),
      },
      weight : this.isChecked(this.refs.fontWeight) ? (this.refs.thickness.value * 100) : 0,
    }
  }

  search = () => {
    this.props.search();
  }

  render() {
    return ( 
      <div className="search-filter-layer" onMouseUp={this.search}>
        <h3>Google Fonts Search</h3>
        <div className="search-header">Categories</div>
        <div className="search-item">
          <label onClick={this.toggleCheckBox} ref="serif"><i className="material-icons">check_box_outline_blank</i> Serif</label>
          <label onClick={this.toggleCheckBox} ref="sansserif"><i className="material-icons">check_box_outline_blank</i> Sans-Serif</label>
          <label onClick={this.toggleCheckBox} ref="display"><i className="material-icons">check_box_outline_blank</i> Display</label>
          <label onClick={this.toggleCheckBox} ref="handwriting"><i className="material-icons">check_box_outline_blank</i> Handwriting</label>
          <label onClick={this.toggleCheckBox} ref="monospace"><i className="material-icons">check_box_outline_blank</i> Monospace</label>
        </div>
        <div className="search-header">Thickness</div>
        <div className="search-item">
          <label ref="fontWeight" className="inline" onClick={this.toggleCheckBox}><i className="material-icons">check_box_outline_blank</i></label>
          <span style={{ display: 'inline-block', width: '120px', 'paddingLeft': '20px'}}><input ref="thickness" type="range" max="9" min="1" step="1" defaultValue="4" /></span>
        </div>
      </div>

    );
  }
}

export default SearchFilterLayer;
