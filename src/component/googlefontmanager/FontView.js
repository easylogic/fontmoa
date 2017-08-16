
import React, { Component } from 'react';

class FontView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      font : [],
    }

  }

  refreshFontView = (font) => {
      this.setState({
          font
      })
  }

  renderEarlyAccessItem = () => {
    return <pre>{JSON.stringify(this.state.font, null, 4)}</pre>
  }

  renderGoogleFontItem = () => {
      return <pre>{JSON.stringify(this.state.font, null, 4)}</pre>
  }

  renderItem = () => {

    if (this.state.font.type === 'google') {
        return this.renderGoogleFontItem();
    } else {
        return this.renderEarlyAccessItem();
    }

  }

  render() {

    return (
        <div className="font-view">
            { this.renderItem() }
        </div>
    );
  }
}

export default FontView; 
