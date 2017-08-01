
import React, { Component } from 'react';
import './default.css';

import common from '../../../util/common'

class GlyfList extends Component {

    render() {
        const style = {
            fontFamily : common.getFontFamilyCollect(this.props.selectedFont)
        }        
        return (

            <div className="glyf-list" style={style}>
            {
                this.props.glyf.map((unicode, index) => {
                    const char = String.fromCodePoint(unicode);
                    return <div key={index} className="glyf-item">{char}</div>
                })
            }

            </div>
        )
    }
}

export default GlyfList 