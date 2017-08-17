
import React, { Component } from 'react';
import './default.css';
import Observer from 'react-intersection-observer'

class GlyfList extends Component {

    static MAX_ITEM_COUNT = 1000

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

    loadGlyfList = (inView) => {
        if (inView) {
            const lastItemGlyf = this.refs.glyfList.lastElementChild.previousElementSibling;

            const start = parseInt(lastItemGlyf.getAttribute('data-index'), 10) + 1
            const end = start + GlyfList.MAX_ITEM_COUNT; 

            const items = this.props.glyf.filter((it, index) => {
                return start <= index && index <= end; 
            })

            if (items.length) {
                let frag = document.createDocumentFragment()

                items.forEach((unicode, index) => {
                    const char = String.fromCodePoint(unicode) || "";
                    let div = document.createElement('div');
                    div.setAttribute('data-unicode', unicode)
                    div.classList.add('glyf-item', 'scrolled')
                    div.setAttribute('data-index', start + index);
                    div.textContent = char; 
                    frag.appendChild(div)
                })

                this.refs.glyfList.insertBefore(frag, this.refs.glyfList.lastElementChild)
            }

        }
    }

    renderGlyf = () => {
        const style = this.props.selectedFont.collectStyle;
        const items = this.props.glyf.filter((it, index) => {
            return index < GlyfList.MAX_ITEM_COUNT;
        })

        if (this.refs.glyfList) {
            const scrolled = this.refs.glyfList.querySelectorAll('.scrolled');

            [...scrolled].forEach((node) => {
                node.parentNode.removeChild(node);
            })

        }

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
                        items.map((unicode, index) => {
                            const char = String.fromCodePoint(unicode) || "";

                            const tempAttrs = {
                                'data-unicode' : unicode,
                                className : 'glyf-item',
                                key : index, 
                                draggable : true, 
                                'data-index' : index 
                            }

                            return <div {...tempAttrs}>{char}</div>
                        })
                    }   

                    <Observer ref="observer" onChange={(inView) => { this.loadGlyfList(inView) }}>{inView => ' '}</Observer>
                </div>
            </div>
        )
    }


    render() {
        return this.renderGlyf();
    }
}

export default GlyfList 