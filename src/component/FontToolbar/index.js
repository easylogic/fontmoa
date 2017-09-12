import React, {Component} from 'react';
import './default.css';

class FontToolbar extends Component {

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

  showGoogleFont = (e) => {
    this.props.search({ text : "GoogleFonts" });
  }  

  showFreeFont = (e) => {
    this.props.search({ text : "FreeFonts" });
  }    

  render() {
    return ( 
      <div className="tools">
        <div>
          <span onClick={this.showGoogleFont} title="Search Google Font"><i className="icon ion-social-google" style={{color: '#1565C0'}}></i> Google Fonts</span>
          <span onClick={this.showFreeFont} title="Search Free Fonts"><i className="icon ion-social-usd" style={{color: '#9E9D24'}}></i> Free Fonts</span>
        </div>
        <div>
          <span onClick={this.toggleFavoriteList} title="Favorite"><i className="material-icons">favorite</i></span>              
          <span onClick={this.showDirectory}  title="Directory"><i className="material-icons">folder_special</i></span>
        </div>
      </div>

    );
  }
}

export default FontToolbar;
