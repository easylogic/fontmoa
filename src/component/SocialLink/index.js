import React, { Component } from 'react';
import './default.css';

const { shell } = window.require('electron').remote;

class SocialLink extends Component {


  goTwitter = () => {
    shell.openExternal('https://twitter.com/fontmoa');
  }

  goFacebook = () => {
    shell.openExternal('https://www.facebook.com/fontmoa/');
  }


  goGithub = () => {
    shell.openExternal('https://github.com/fontmoa/fontmoa');
  }

  goHome = () => {
    shell.openExternal('http://www.fontmoa.com/fontmoa/');
  }  

  goIconPack = () => {
    shell.openExternal('http://www.fontmoa.com/icon/');
  }  


  render() {
    return ( 
      <div className="social-link">
        <span onClick={this.goHome} title="Home Page"><i className="icon ion-home"></i></span>
        <span onClick={this.goFacebook} title="Facebook"><i className="icon ion-social-facebook"></i></span>
        <span onClick={this.goTwitter} title="twitter"><i className="icon ion-social-twitter"></i></span>
        <span onClick={this.goGithub} title="Github"><i className="icon ion-social-github"></i></span>
        <span className="divider">|</span>
        <span onClick={this.goIconPack} title="Icons"><i className="icon ion-android-happy"></i></span>
      </div>
    );
  }
}

export default SocialLink;
