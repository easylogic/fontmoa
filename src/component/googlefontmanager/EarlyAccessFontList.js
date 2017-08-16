
import React, { Component } from 'react';
import googlefont from '../../util/googlefont'

class EarlyAccessFontList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items : [],
    }

    this.loadFontList();
  }

  loadFontList = () => {
    googlefont.loadGoogleFontEarlyAccessList(() => {
        googlefont.getGoogleFontEarlyAccessList((json) => {
            this.setState(json);
        })
    })
  }

  onClickFontItem = (e) => {
    const list = this.state.items;
    const index = parseInt(e.target.getAttribute('data-index'), 10);

    this.props.refreshFontView(list[index]);
  }

  render() {

    return (
        <div className="early-access-list" onClick={this.onClickFontItem}>
        {this.state.items.map((font, index) => {
            return <div className="font-item" key={index} data-index={index}>{font.family}</div>
        })}
        </div>
    );
  }
}

export default EarlyAccessFontList; 
