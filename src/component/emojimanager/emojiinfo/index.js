
import React, { Component } from 'react';
import './default.css';

import common from '../../../util/common'

const { clipboard, remote } = window.require('electron');
const dialog = remote.dialog;

class GlyfInfo extends Component {

    constructor () {
        super();
        this.state = {
            copyUnicodeMessage : "유니코드를 복사합니다."
        }
    }

    onClickUnicode = (e) => {
        const copyText = e.target.innerText;
        clipboard.writeText(copyText);

        dialog.showMessageBox(null, {
            type: "none",
            title : "Information",
            message: "유니코드 [" + copyText + "] 를 복사하였습니다."
        })
    }

    render() {
        const unicode = this.props.selectedEmoji;
        const unicode16 = unicode.toString(16).toUpperCase();
        const char = String.fromCodePoint(unicode || 0) || "";

        return (
            <div className='glyf-info-manager'>
                <div className="glyf-info-code" onClick={this.onClickUnicode}>
                    <span className="unicode unicode-dec" title={this.state.copyUnicodeMessage}>{unicode}</span>
                    <span className="unicode unicode-16" title={this.state.copyUnicodeMessage}>{unicode16}</span>
                    <span className="unicode unicode-string" title={this.state.copyUnicodeMessage}>\u{unicode16}</span>
                    <span className="unicode unicode-entity" title={this.state.copyUnicodeMessage}>&amp;#{unicode};</span>
                    <span className="unicode unicode-entity-16" title={this.state.copyUnicodeMessage}>&amp;#x{unicode16};</span>
                    <span className="unicode unicode-char" title={this.state.copyUnicodeMessage}>{char}</span>
                </div>                
                <div className="glyf-info-view">
                    <span className="char-view">
                        {char}
                    </span>
                    
                </div>
                <div className="glyf-info-selecte-text">

                </div>
            </div>
        )
    }
}

export default GlyfInfo 