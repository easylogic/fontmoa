
import React, { Component } from 'react';
import './default.css';

import common from '../../../util/common'

class GlyfList extends Component {

    onChange = (e) => {
        console.log(e.target);
        this.props.changeUnicodeBlock(e.target.value);
    }

    render() {
        const style = {
            fontFamily : common.getFontFamilyCollect(this.props.selectedFont)
        }        
        return (
            <div className='glyf-list-manager'>
                <div className="glyf-search">
                    <select onChange={this.onChange} defaultValue="{this.props.selectedBlock.index}">
                    {
                        this.props.blockList.map((block, index) => {
                            return (<option key={index} value={block.index}>{block.name}</option>)
                        })
                    }
                    </select>
                </div>
                <div className="glyf-list" style={style}>

                {
                    this.props.glyf.map((unicode, index) => {
                        const char = String.fromCodePoint(unicode) || "";
                        const code = '\\u' + unicode.toString(16); 
                        return <div key={index} className="glyf-item" data-char={code}>{char}</div>
                    })
                }

                </div>
            </div>
        )
    }
}

export default GlyfList 