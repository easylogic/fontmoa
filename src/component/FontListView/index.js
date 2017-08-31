import React, { Component } from 'react';
import { render } from 'react-dom'
import Observer from 'react-intersection-observer'
import './default.css';

import LocalFontItem from '../LocalFontItem'
import GoogleFontItem from '../GoogleFontItem'
import GoogleEarlyAccessFontItem from '../GoogleEarlyAccessFontItem'

class FontListView extends Component {

    static MAX_ITEM_COUNT = 30
    

    constructor (props) {
        super(props);

        const files = this.props.files || []
        this.state = {
            files,
            items : files.slice(0, FontListView.MAX_ITEM_COUNT),
            fontListContentStyle : 'row',
        }
    }

    refreshFiles = (files) => {
        this.setState({ files, items : files.slice(0, FontListView.MAX_ITEM_COUNT) })
    }

    loadFontList = (inView) => {
        if (inView) {
            const lastItemFont = this.refs.fontListContent.lastElementChild.previousElementSibling;
            if (!lastItemFont) return; 

            const start = parseInt(lastItemFont.getAttribute('data-index'), 10) + 1
            const end = start + FontListView.MAX_ITEM_COUNT; 

            const fontStyle = {
                fontSize : this.props.fontStyle.fontSize,
                content : this.props.fontStyle.content,
            }

            const items = this.state.files.filter((it, index) => {
                return start <= index && index <= end; 
            })

            if (items.length) {
                let frag = document.createDocumentFragment()

                items.forEach((font, index) => {
                    let $div = document.createElement('div');

                    render(this.renderItem(font, start + index, fontStyle), $div)
                    $div.firstChild.classList.add('scrolled');
                    frag.appendChild($div.firstChild)
                })

                this.refs.fontListContent.insertBefore(frag, this.refs.fontListContent.lastElementChild)
            }

        }
    }    
    

    chooseItem = (fontObj, fontStyle) => {

        if (fontObj.font) {
            return <LocalFontItem fontObj={fontObj} fontStyle={fontStyle} />;
        } else {
            if (fontObj.type === 'GoogleFonts') {
                return <GoogleFontItem fontObj={fontObj} />
            } else if (fontObj.type === 'GoogleFontsEarlyAccess') {
                return <GoogleEarlyAccessFontItem fontObj={fontObj} />
            }
        }

        return "";
    }

    renderItem = (fontObj, index, fontStyle) => {
        const key = (fontObj.file || fontObj.family || fontObj.name) + index;
        return (            
            <div 
                key={key} 
                className="font-item" 
                data-index={index}>
                { this.chooseItem(fontObj, fontStyle)}
            </div>
        )


    }

    render() {

        const fontStyle = {
            fontSize : this.props.fontStyle.fontSize,
            content : this.props.fontStyle.content,
        }

        const colorStyle = Object.assign({
            color: this.props.fontStyle.color,
            backgroundColor: this.props.fontStyle.backgroundColor,
        }, fontStyle);

        const items = this.state.items;

        if (this.refs.fontListContent) {
            const scrolled = this.refs.fontListContent.querySelectorAll('.scrolled');

            [...scrolled].forEach((node) => {
                node.parentNode.removeChild(node);
            })

        }

        return (
            <div className="font-list-view">
                <div ref="fontListContent" className="font-list-content" style={colorStyle} data-content-style="row">
                    {items.map((it, i) => {
                        return this.renderItem(it, i, fontStyle);
                    })}
                    <Observer ref="observer" className="font-item observer" onChange={(inView) => { this.loadFontList(inView) }}>{inView => ''}</Observer>                    
                </div>
            </div>
        )
    }
}

export default FontListView 