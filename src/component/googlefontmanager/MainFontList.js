
import React, { Component } from 'react';
import googlefont from '../../util/googlefont'

class MainFontList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items : [],
    }

    this.loadFontList();
  }

  loadFontList = () => {
    googlefont.loadGoogleFontList(() => {
        googlefont.getGoogleFontList((json) => {
            this.setState(json);
        })
    })
  }

  onClickFontItem = (e) => {
    const list = this.state.items;
    const index = parseInt(e.target.getAttribute('data-index'), 10);

    this.props.refreshFontView(Object.assign({ type : 'google'}, list[index]));
  }

  render() {

    return (
        <div className="main-list">
            <div className="title">Google Fonts</div>
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
