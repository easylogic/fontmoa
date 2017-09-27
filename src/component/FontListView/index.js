import React, { Component } from 'react';
import { render } from 'react-dom'
import Observer from 'react-intersection-observer'
import './default.css';

import {
    FreeFontItem,
    LocalFontItem,
    GoogleFontItem,
    GoogleEarlyAccessFontItem
} from '../FontItem'

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

            const items = this.state.files.filter((it, index) => {
                return start <= index && index <= end; 
            })

            if (items.length) {
                let frag = document.createDocumentFragment()

                items.forEach((font, index) => {
                    let $div = document.createElement('div');

                    render(this.renderItem(font, start + index), $div)
                    $div.firstChild.classList.add('scrolled');
                    frag.appendChild($div.firstChild)
                })

                this.refs.fontListContent.insertBefore(frag, this.refs.fontListContent.lastElementChild)
            }

        }
    }    
    

    chooseItem = (fontObj) => {

        let item = "";

        switch(fontObj.type) {
            case "GoogleFonts": 
                item = <GoogleFontItem fontObj={fontObj} app={this.props.app} />
                break; 
            case 'GoogleFontsEarlyAccess':
                item = <GoogleEarlyAccessFontItem fontObj={fontObj} app={this.props.app} />
                break;                 
            case 'FreeFonts': 
                item = <FreeFontItem fontObj={fontObj} app={this.props.app} />
                break;                 
            default: 
                item = <LocalFontItem fontObj={fontObj} app={this.props.app} />
        }

        return item; 
    }

    renderItem = (fontObj, index) => {
        const key = (fontObj.file ||  fontObj.family || fontObj.names.family || fontObj.name) + index;
        return (            
            <div 
                key={key} 
                className="font-item" 
                data-index={index}>
                { this.chooseItem(fontObj)}
            </div>
        )


    }

    render() {


        const items = this.state.items;

        if (this.refs.fontListContent) {
            const scrolled = this.refs.fontListContent.querySelectorAll('.scrolled');


            [...scrolled].forEach((node) => {
                node.parentNode.removeChild(node);
            })

        }

        return (
            <div className="font-list-view">
                <div ref="fontListContent" className="font-list-content" onClick={this.props.onClick}>
                    {items.map((it, i) => {
                        return this.renderItem(it, i);
                    })}
                    { items.length === 0 ? <div className="empty-item">No fonts.</div> : ""}
                    <Observer ref="observer" className="font-item observer" onChange={(inView) => { this.loadFontList(inView) }}>{inView => ''}</Observer>                    
                </div>
            </div>
        )
    }
}

export default FontListView 