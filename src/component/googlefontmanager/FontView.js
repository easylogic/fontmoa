
import React, { Component } from 'react';

import googlefont from '../../util/googlefont'

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

  downloadEarlyAccess = (e) => {
    const downloadLink = e.target.getAttribute('data-download-link');
    console.log('download link', downloadLink, e.target);
    googlefont.downloadEarlyAccess(downloadLink, () => {
        console.log('다운로드한 목록은 Font 탭에서 화인하실 수 있습니다.');
    });
  }

  renderEarlyAccessItem = () => {
      console.log(this.state.font, this.state.font.downloadUrl)
    return (
        <div className="early-access-item">
            <h2>{this.state.font.family}</h2>
            <p>{this.state.font.description}</p>
            <h3>Link</h3>
            <pre>{this.state.font.cssImport}</pre>
            <h3>Example</h3>
            <pre>{this.state.font.example}</pre>
            <div>
                <a className="license" href={this.state.font.licenseUrl} target="_blank">{this.state.font.license}</a>
                |
                <a className="download" onClick={this.downloadEarlyAccess} data-download-link={this.state.font.downloadUrl} target="_blank">Download</a>
            </div>
        </div>
    )
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
