
import React, { Component } from 'react';
import './default.css';

import common from '../../../util/common'

class GlyfList extends Component {

    constructor() {
        super()

        this.state = {
            selectedUnicode : 0
        }
    }

    onChange = (e) => {
        console.log(e.target);
        this.props.changeUnicodeBlock(e.target.value);
    }

    onClickGlyfItem = (e) => {
        const unicode = parseInt(e.target.getAttribute('data-unicode'), 10) || 0;
        this.setState({
            selectedUnicode : unicode
        })
        this.props.changeSelectedGlyf(unicode)
    }

    render() {
        const style = {
            fontFamily : common.getFontFamilyCollect(this.props.selectedFont)
        }        
        return (
            <div className='glyf-list-manager'>
                <div className="glyf-search">
                    <select className="input" onChange={this.onChange} defaultValue="{this.props.selectedBlock.index}">
                    {
                        this.props.blockList.map((block, index) => {
                            return (<option key={index} value={block.index}>{block.name}</option>)
                        })
                    }
                    </select>

                    <span className="block-count"> Count : {this.props.glyf.length}</span>
                </div>
                <div className="glyf-list" style={style} onClick={this.onClickGlyfItem}>
                {
                    this.props.glyf.map((unicode, index) => {
                        const isStart = index % 7 === 0;
                        const char = String.fromCodePoint(unicode) || "";
                        const code = '\\u' + unicode.toString(16); 

                        const selected = unicode === this.state.selectedUnicode;

                        return <div key={index} className="glyf-item" data-selected={selected} data-is-start={isStart} data-unicode={unicode} data-char={code}>{char}</div>
                    })
                }

                </div>
            </div>
        )
    }
}

export default GlyfList 