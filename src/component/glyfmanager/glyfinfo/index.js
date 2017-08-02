
import React, { Component } from 'react';
import './default.css';

import common from '../../../util/common'

class GlyfInfo extends Component {

    render() {
        const unicode = this.props.selectedGlyf;
        const unicode16 = unicode.toString(16).toUpperCase();
        const char = String.fromCodePoint(this.props.selectedGlyf || 0) || "";

        const style = {
            fontFamily : common.getFontFamilyCollect(this.props.selectedFont)
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
                    <div className="char-view" style={style}>{char}</div>
                </div>
                <div className="glyf-info-selecte-text">

                </div>
            </div>
        )
    }
}

export default GlyfInfo 