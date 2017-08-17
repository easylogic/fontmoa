import React, { Component } from 'react';
import Observer from 'react-intersection-observer'
import './default.css';

import common from '../../../util/common'
import fontdb from '../../../util/fontdb'
import cssMaker from '../../../util/cssMaker'

class FontListView extends Component {

    constructor (props) {
        super(props);

        this.state = {
            files: this.props.files || [],
            selectedRow: false, 
            fontListContentStyle : 'grid',
            faroviteFiles : []
        }

        this.init()
    }

    init = () => {
        this.loadFavoriteFiles();
    }

    loadFavoriteFiles = () => {
        fontdb.getFavoriteFilesPathList((faroviteFiles) => {
            this.setState({
                faroviteFiles
            })
        })
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

            const path = e.target.getAttribute('data-path');

            this.props.toggleFavorite(path, isToggleSelected);
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


            const path = e.target.getAttribute('data-path');

            this.props.refreshFontInfo(path);
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

    handleTabClick = (e) => {
        

        let href = e.target.getAttribute('href');

        if (!href) {
            href = e.target.querySelector("a").getAttribute("href");
        }
        const id = href.split('#').pop();

        this.setState({
            selectedRow: id === "row",
            fontListContentStyle: id || "grid"
        })
    }

    refreshFiles = (files) => {
         fontdb.getFavoriteFilesPathList((faroviteFiles) => {
            this.setState({
                faroviteFiles,
                files
            })
        })
    }

    refreshFontSize (fontSize) {
        this.refs.fontListContent.style.fontSize = fontSize;
    }

    refreshFontCont (content) {
        if (content) {
            const nodes = this.refs.fontListContent.querySelectorAll(".font-item-preview");

            if (nodes) {
                [...nodes].forEach((el) => {
                    el.textContent = content; 
                })
            }

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

    renderItem = (font, index, fontStyle) => {
        const contentstyle = this.state.fontListContentStyle;
        const item = font.item; 

        const style = Object.assign({}, font.collectStyle);
        const isGrid = contentstyle === 'grid';

        let message = fontStyle.content || common.getPangramMessage(font.currentLanguage, isGrid); 

        let favoriteClass = "add-favorite";
        let activeClass = "activation";

        if (this.checkFavorite(item.path)) {
            favoriteClass += " selected";
        }

        if (this.checkActive(item.path)) {
            activeClass += " selected";
        }        

        return (
            <Observer 
                draggable={true} 
                onDragStart={this.onDragStart} 
                key={item.path} 
                className="font-item" 
                data-dir={item.dir} 
                data-path={item.path}  
                data-family={font.currentFamilyName} 
                onChange={this.changeViewStatus(item.path, font)}>
                <div className="font-info">
                    <div className="font-family" title={font.subfamilyName}>
                        {font.currentFamilyName}
                        <span className="font-sub-family">({font.subfamilyName})</span>
                    </div>
                    <div className="tools">
                        <span className={favoriteClass} data-path={item.path} title="Add Favorite"><i className="icon icon-connection"></i></span>
                    </div>
                    <div className="activation">
                        <span className={activeClass} data-path={item.path} title="Activation">●</span>
                    </div>                    
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

        return (
            <div className="font-list-view">
                <div className="font-list-header" >
                    <div className="tools">
                        <ul className="pill" onClick={this.handleTabClick}>
                            <li className={this.state.selectedRow ? 'active' : ''}><a href="#row"><i className="icon icon-menu"></i></a></li>
                            <li className={this.state.selectedRow ? '' : 'active'}><a href="#grid"><i className="icon icon-list1"></i></a></li>
                        </ul>
                    </div>
                </div>
                <div ref="fontListContent" className="font-list-content" style={colorStyle} data-content-style={this.state.fontListContentStyle} onDoubleClick={this.handleFontClick} onClick={this.selectFontClick}>
                    {this.state.files.map((it, i) => {
                        return this.renderItem(it, i, fontStyle);
                    })}
                </div>
            </div>
        )
    }
}

export default FontListView 