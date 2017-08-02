
import React, { Component } from 'react';
import './default.css';

import common from '../../../util/common'

class GlyfInfo extends Component {

    render() {
        const unicode = this.props.selectedGlyf;
        const unicode16 = unicode.toString(16).toUpperCase();
        const char = String.fromCodePoint(this.props.selectedGlyf || 0) || "";
        const font = this.props.selectedFont;
        const style = {
            fontFamily : font.collectFontFamily
        }  

        let pos = {};

        const height = font.ascent + Math.abs(font.descent);
        const baseline = (font.ascent / height) * 100;
        const lowUnit = 100 - baseline;


        ["ascent", "descent", "baseline", "lineGap", "capHeight", "xHeight"].forEach((field) => {
            if (font[field]  > 0)  {
                pos[field] = ((font.ascent - font[field]) / font.ascent) * 100;
            } else if (font[field] < 0) {
                pos[field] = ((font.ascent + Math.abs(font[field])) / font.height) * 100;
            } else if (field == 'baseline') {
                pos[field] = baseline; 
            }
        })

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


        return (
            <div className='glyf-info-manager'>
                <div className="glyf-info-code">
                    <span className="unicode unicode-dec">{unicode}</span>
                    <span className="unicode unicode-16">{unicode16}</span>
                    <span className="unicode unicode-string">\u{unicode16}</span>
                    <span className="unicode unicode-entity">&amp;#{unicode};</span>
                    <span className="unicode unicode-entity-16">&amp;#x{unicode16};</span>                    
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
                        {bboxStyle.top ?  <div className="font-unit bbox" style={bboxStyle}></div> : "" }
                        
                    </span>
                    
                </div>
                <div className="glyf-info-selecte-text">

                </div>
            </div>
        )
    }
}

export default GlyfInfo 