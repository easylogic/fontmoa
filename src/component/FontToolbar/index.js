import React, {Component} from 'react';
import './default.css';

class FontToolbar extends Component {

  showGoogleFont = (e) => {
    this.props.search({ type : "GoogleFonts" });
  }  

  showFreeFont = (e) => {
    this.props.search({ type : "FreeFonts" });
  }    

  render() {
    return ( 
      <div className="tools">
        <div>
          <span onClick={this.showGoogleFont} title="Search Google Font"><i className="icon ion-social-google" style={{color: '#1565C0'}}></i> Google Fonts</span>
          <span onClick={this.showFreeFont} title="Search Free Fonts"><i className="icon ion-social-usd" style={{color: '#9E9D24'}}></i> Free Fonts</span>
        </div>
        <div>
          
        </div>
      </div>

    );
  }
}

export default FontToolbar; 
