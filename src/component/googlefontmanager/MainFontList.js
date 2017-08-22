
import React, { Component } from 'react';
import  { googlefont } from '../../util'

class MainFontList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items : [],
    }

    //this.loadFontList();
  }

  loadFontList = () => {
    googlefont.getGoogleFontList((json) => {
        this.setState(json);
    })
  }

  onClickFontItem = (e) => {
    const list = this.state.items;
    const index = parseInt(e.target.getAttribute('data-index'), 10);

    this.props.refreshFontView(Object.assign({ type : 'google'}, list[index]));
  }
  
  downloadAll = () => {
    this.props.downloadAll()
  }

  render() {

    return (
        <div className="main-list">
            <div className="title">Google Fonts <a href="#sync" onClick={this.downloadAll}>All Sync</a></div>
            <div className="fonts" onClick={this.onClickFontItem}>
                {this.state.items.map((font, index) => {
                    return <div className="font-item" key={index} data-index={index}>{font.family}</div>
                })}
            </div>
        </div>
    );
  }
}

export default MainFontList; 
