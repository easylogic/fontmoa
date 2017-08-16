
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

  render() {

    return (
        <div className="font-view">
            <pre>{JSON.stringify(this.state.font, null, 4)}</pre>
        </div>
    );
  }
}

export default FontView; 
