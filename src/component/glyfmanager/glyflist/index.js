
import React, { Component } from 'react';
import './default.css';

class GlyfList extends Component {

    constructor() {
        super()

        this.state = {
            selectedUnicode : 0
        }
    }

    onChange = (e) => {
        this.props.changeUnicodeBlock(e.target.value);
    }

    onClickGlyfItem = (e) => {
        const unicode = parseInt(e.target.getAttribute('data-unicode'), 10) || 0;
        this.setState({
            selectedUnicode : unicode
        })
        this.props.changeSelectedGlyf(unicode)
    }

    renderGlyf = () => {
        const style = this.props.selectedFont.collectStyle;
        return (
            <div className='glyf-list-manager'>
                <div className="glyf-search">
                    <select className="input" onChange={this.onChange} defaultValue="{this.props.selectedBlock.index}">
                    {
                        this.props.blockList.map((block, index) => {
                            const arr = Object.keys(block.alias);
                            let name = block.name;                            
                            if (arr.length) {
                               name = block.alias[arr[0]]
                            }
                            return (<option key={index} value={block.index}>{name}</option>)
                        })
                    }
                    </select>

                    <span className="block-count"> Count : {this.props.glyf.length}</span>
                </div>
                <div className="glyf-list" ref="glyfList" style={style} onClick={this.onClickGlyfItem}>
                {



                    this.props.glyf.map((unicode, index) => {
                        const char = String.fromCodePoint(unicode) || "";
                        const code = '\\u' + unicode.toString(16); 

                        const selected = unicode === this.state.selectedUnicode;

                        return <div key={index} className="glyf-item" data-selected={selected} data-unicode={unicode} data-char={code}>{char}</div>
                    })
                }

                </div>
            </div>
        )
    }


    render() {
        return this.renderGlyf();
    }
}

export default GlyfList 