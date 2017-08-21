import React, { Component } from 'react';
import { render } from 'react-dom'
import Observer from 'react-intersection-observer'
import './default.css';

import common from '../../../util/common'
import cssMaker from '../../../util/cssMaker'

class FontListView extends Component {

    static MAX_ITEM_COUNT = 30
    

    constructor (props) {
        super(props);

        this.state = {
            files: this.props.files || [],
            fontListContentStyle : 'row',
        }

        this.fontContent = ""
    }

    handleFontClick = (e) => {
        const path = e.target.getAttribute('data-path')
        console.log(path)
    }

    selectFontClick = (e) => {
        
        if (e.target.classList.contains('add-favorite')) {

            const isSelected = e.target.classList.contains('selected');
            const isToggleSelected = !isSelected; 
            e.target.classList.toggle('selected', isToggleSelected);

            const fileId = e.target.getAttribute('data-id');

            this.props.toggleFavorite(fileId, isToggleSelected);
        } else {

            if (e.shiftKey) {
                //multi select 

                e.target.classList.toggle('selected');                
            } else {
                [...document.querySelectorAll('.font-list-view .font-item.selected')].forEach((node) => {
                    node.classList.remove('selected');  
                });

                e.target.classList.add('selected');                
            }

        }


    }

    onDragStart = (e) => {
        const filepath = e.target.getAttribute('data-path');
        const nodes = this.refs.fontListContent.querySelectorAll('.font-item.selected');
        if (nodes) {
            const files = [...nodes].map((el) => {
                return el.getAttribute('data-path')
            })

            const dragFiles = files.filter((f) => {
                return f === filepath; 
            })

            if (dragFiles.length) {
                //이미 선택되어져 있는 리스트에 있는 아이템은 선택된 것들 모두 드래그 
                e.dataTransfer.setData("text", files.join(","));
            } else {
                // 선택되지 않은 아이템이 드래그 되었을 때 드래그 아이템 하나만 추가 
                e.dataTransfer.setData("text", [filepath]);
            }

        }
    }


    refreshFiles = (files) => {
        this.setState({ files })
    }

    refreshFontSize (fontSize) {
        this.refs.fontListContent.style.fontSize = fontSize;
    }

    refreshRowStyle = (fontListContentStyle) => {
        this.setState( {
            fontListContentStyle
        })
    }

    refreshFontContent (content) {
        if (content) {
            const nodes = this.refs.fontListContent.querySelectorAll(".font-item-preview");

            if (nodes) {
                [...nodes].forEach((el) => {
                    el.textContent = content; 
                })
            }

            this.fontContent = content; 

        }

    }


    checkFavorite = (path) => {
        return this.state.faroviteFiles.includes(path); 
    }

    checkActive = (path) => {
        return false; 
    }

    loadFontCss = (inView, path, font) => {
        if (inView) {
            if (common.isInSystemFolders(path) === false) {
                const css = cssMaker.createFontCss(path, font);
                cssMaker.loadCss(css)
            }

        }

    }

    changeViewStatus = (path, font) => {
        return (inView) => {
            this.loadFontCss(inView, path, font) 
        }
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

    renderItem = (fontObj, index, fontStyle) => {
        const contentstyle = this.state.fontListContentStyle;
        const font = fontObj.font; 
        const style = Object.assign({}, font.collectStyle);
        const isGrid = contentstyle === 'grid';

        let message = this.fontContent || fontStyle.content || common.getPangramMessage(font.currentLanguage, isGrid); 

        let favoriteClass = "add-favorite";
        let activeClass = "activation";

        if (fontObj.favorite) {
            favoriteClass += " selected";
        }

        if (fontObj.activation) {
            activeClass += " selected";
        }        

        return (
            <Observer 
                draggable={true} 
                onDragStart={this.onDragStart} 
                key={fontObj.file} 
                className="font-item" 
                data-index={index}
                data-path={fontObj.file}  
                data-family={font.currentFamilyName} 
                onChange={this.changeViewStatus(fontObj.file, font)}>
                <div className="font-info">
                    <div className="font-family" title={font.subfamilyName}>
                        {font.currentFamilyName}
                        <span className="font-sub-family">({font.subfamilyName})</span>
                    </div>
                </div>
                <div className="tools">
                    <span className={favoriteClass} data-id={fontObj._id} title="Add Favorite"><i className="icon icon-connection"></i></span>
                </div>
                <div className="activation">
                    <span className={activeClass} data-id={fontObj._id} title="Activation">●</span>
                </div>                    

                <div className="font-item-preview" style={style}>
                    <div>{message}</div>
                </div>
            </Observer>
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

        const items = this.state.files.filter((it, index) => {
            return index < FontListView.MAX_ITEM_COUNT;
        })

        if (this.refs.fontListContent) {
            const scrolled = this.refs.fontListContent.querySelectorAll('.scrolled');

            [...scrolled].forEach((node) => {
                node.parentNode.removeChild(node);
            })

        }

        return (
            <div className="font-list-view">
                <div ref="fontListContent" className="font-list-content" style={colorStyle} data-content-style={this.state.fontListContentStyle} onDoubleClick={this.handleFontClick} onClick={this.selectFontClick}>
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