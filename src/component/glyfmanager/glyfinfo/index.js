
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
        const unicode = this.props.selectedGlyf;
        const unicode16 = unicode.toString(16).toUpperCase();
        const char = String.fromCodePoint(this.props.selectedGlyf || 0) || "";
        const font = this.props.selectedFont;
        const style = {
            fontFamily : font.collectFontFamily
        }  

        let pos = common.caculateFontUnit(font);

/*
        let bboxStyle = {}

        if (font.bbox) {
            bboxStyle = {
                left : (font.bbox.minX / font.unitsPerEm) * 100,
                top : ((font.ascent - font.bbox.maxY) / font.ascent) * 100,
                width: ((font.bbox.maxX - font.bbox.minX) / font.unitsPerEm) * 100, 
                height: ((font.bbox.maxY - font.bbox.minY) / height) * 100,
            }
            Object.keys(bboxStyle).forEach(function(key) {
                bboxStyle[key] += '%';
            })
        }
*/

        return (
            <div className='glyf-info-manager'>
                <div className="glyf-info-code" onClick={this.onClickUnicode}>
                    <span className="unicode unicode-dec" title={this.state.copyUnicodeMessage}>{unicode}</span>
                    <span className="unicode unicode-16" title={this.state.copyUnicodeMessage}>{unicode16}</span>
                    <span className="unicode unicode-string" title={this.state.copyUnicodeMessage}>\u{unicode16}</span>
                    <span className="unicode unicode-entity" title={this.state.copyUnicodeMessage}>&amp;#{unicode};</span>
                    <span className="unicode unicode-entity-16" title={this.state.copyUnicodeMessage}>&amp;#x{unicode16};</span>                    
                </div>                
                <div className="glyf-info-view">
                    <span className="char-view" style={style}>
                        {char}
                        {
                            Object.keys(pos).map((field, index) => {
                                const style ={ top :  pos[field] + '%' };

                                return (
                                    <div key={index} className={`font-unit ${field}`} data-pos={font[field]} data-title={field} style={style}></div>
                                )
                                
                            })
                        }
                        
                    </span>
                    
                </div>
                <div className="glyf-info-selecte-text">

                </div>
            </div>
        )
    }
}

export default GlyfInfo 