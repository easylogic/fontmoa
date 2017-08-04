import intl from 'react-intl-universal'

import React, { Component } from 'react';
import './default.css';

import common from '../../../util/common'

const { clipboard, remote } = window.require('electron');
const dialog = remote.dialog;

class GlyfInfo extends Component {
    constructor (props) {
        super(props) 

        this.state = {
            selectedGlyf : this.props.selectedGlyf,
            selectedFont : this.props.selectedFont,
        }
    }

    onClickUnicode = (e) => {
        const copyText = e.target.innerText;
        clipboard.writeText(copyText);

        dialog.showMessageBox(null, {
            type: "none",
            title : "Information",
            message: intl.get('glyfmanager.glyfinfo.alert.copyText', { text: copyText })
        })
    }

    render() {
        const unicode = this.state.selectedGlyf;
        const unicode16 = unicode.toString(16).toUpperCase();
        const char = String.fromCodePoint(this.state.selectedGlyf || 0) || "";
        const font = this.state.selectedFont;
        const style = font.collectStyle;

        let pos = common.caculateFontUnit(font);
        console.log(font);

        const copyUnicodeMessage = intl.get('glyfmanager.glyfinfo.copyUnicodeMessage.title')

        return (
            <div className='glyf-info-manager'>
                <div className="glyf-info-code" onClick={this.onClickUnicode}>
                    <span className="unicode unicode-dec" title={copyUnicodeMessage}>{unicode}</span>
                    <span className="unicode unicode-16" title={copyUnicodeMessage}>{unicode16}</span>
                    <span className="unicode unicode-string" title={copyUnicodeMessage}>\u{unicode16}</span>
                    <span className="unicode unicode-entity" title={copyUnicodeMessage}>&amp;#{unicode};</span>
                    <span className="unicode unicode-entity-16" title={copyUnicodeMessage}>&amp;#x{unicode16};</span>
                    <span className="unicode unicode-char" style={style} title={copyUnicodeMessage}>{char}</span>
                </div>                
                <div className="glyf-info-view">
                    <span className="char-view" style={style}>
                        {char}
                        {
                            Object.keys(pos).map((field, index) => {
                                const style ={ top :  pos[field] + '%' };

                                return (
                                    <div 
                                        key={index} 
                                        className={`font-unit ${field}`} 
                                        data-pos={font[field]} 
                                        data-title={field} 
                                        style={style}
                                    ></div>
                                )
                                
                            })
                        }
                        
                    </span>
                    
                </div>
            </div>
        )
    }
}

export default GlyfInfo 