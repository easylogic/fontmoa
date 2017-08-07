
import React, { Component } from 'react';
import './default.css';

class GlyfList extends Component {

    onChange = (e) => {
        this.props.changeUnicodeBlock(e.target.value);
    }

    onClickGlyfItem = (e) => {
        const selectedNode = e.target.parentNode.querySelector('[data-selected=true]');

        if (selectedNode) {
            selectedNode.removeAttribute('data-selected');
        }
        e.target.setAttribute('data-selected', 'true');

        const unicode = parseInt(e.target.getAttribute('data-unicode'), 10) || 0;

        if (unicode > 0) {
            this.props.changeSelectedGlyf(unicode, this.props.selectedFont.collectStyle.fontFamily)
        }

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

                        const tempAttrs = {
                            'data-unicode' : unicode,
                            className : 'glyf-item',
                            key : index, 
                        }

                        return <div {...tempAttrs}>{char}</div>
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