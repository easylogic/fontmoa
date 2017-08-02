
import React, { Component } from 'react';
import './default.css';

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
        const unicode16  = this.props.selectedEmoji.codepoints[0].split('+')[1];
        const unicode = parseInt(unicode16, 16);
        const char = this.props.selectedEmoji.emoji;

        return (
            <div className='emoji-info-manager'>
                <div className="emoji-info-code" onClick={this.onClickUnicode}>
                    <span className="unicode unicode-dec" title={this.state.copyUnicodeMessage}>{unicode}</span>
                    <span className="unicode unicode-16" title={this.state.copyUnicodeMessage}>{unicode16}</span>
                    <span className="unicode unicode-string" title={this.state.copyUnicodeMessage}>\u{unicode16}</span>
                    <span className="unicode unicode-entity" title={this.state.copyUnicodeMessage}>&amp;#{unicode};</span>
                    <span className="unicode unicode-entity-16" title={this.state.copyUnicodeMessage}>&amp;#x{unicode16};</span>
                    <span className="unicode unicode-char" title={this.state.copyUnicodeMessage}>{char}</span>
                </div>                
                <div className="emoji-info-view">
                    <span className="char-view">
                        {char}
                    </span>
                    <div className="char-info">
                        <div className="desc-item">
                            <span className="cate cate-category">category</span>
                            <span className="description">{this.props.selectedEmoji.category}</span>
                        </div>
                        <div className="desc-item">
                            <span className="cate cate-description">description</span>
                            <span className="description">{this.props.selectedEmoji.description}</span>
                        </div>
                        <div className="desc-item">
                            <span className="cate cate-tags">tags</span>
                            <span className="description">{this.props.selectedEmoji.tags.join(', ')}</span>
                        </div>                                                
                    </div>
                </div>
                <div className="emoji-info-selecte-text">

                </div>
            </div>
        )
    }
}

export default GlyfInfo 