import React, { Component } from 'react';
import { render } from 'react-dom'
import Observer from 'react-intersection-observer'
import './default.css';

import { common, cssMaker, fontdb, googlefont} from '../../../util'

class LabelInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            labels : this.props.labels || [],
            readonly : this.props.readonly || false,
        }
    }

    updateLabels = (labels, callback) => {
        const file = this.props.file;
        fontdb.updateLabels(file, labels, () => {
            callback && callback();
        })
    }

    onKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const label = this.refs.labelInput.textContent;

            if (!this.state.labels.includes(label)) {
                const labels = this.state.labels.concat([label]);
                this.refs.labelInput.textContent = "";
                this.updateLabels(labels, () => {
                    this.setState({ labels })
                });

            }
            return;
        }
    }

    downloadGoogleFont = (label) => {
        let fontObj = { 
            family : this.props.fontObj.family, 
            files : { 
                [label] : this.props.fontObj.files[label]
            } 
        }

        this.props.onClick(fontObj)
    }

    render() {
        let files = {};
        if (this.props.fontObj) {
            files = this.props.fontObj.files || [];
        }        
        return (
            <div className="label-list">
                { this.state.labels.map((label, index) => {
                    let realLabel = [label]; 
                    if (label.includes('italic')) {
                        realLabel = [label.replace('italic', ''), <i className="material-icons" key={label}>format_italic</i>]; 
                    }
                    
                    return (
                        <span className="label" key={index}>
                            {realLabel} 
                            {files[label] ? <span onClick={(e) => this.downloadGoogleFont(label) } title="Download Font"><i className="material-icons">file_download</i></span> : ""}
                        </span>
                    )
                })}
                {
                    this.state.readonly ? "" : <span className="label input" contentEditable={true} ref="labelInput" onKeyDown={this.onKeyDown} data-placeholder="label"></span>
                }
                
            </div>
        )
    }
}

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

            e.target.querySelector('.material-icons').textContent = isToggleSelected ? 'favorite' : 'favorite_border';

            e.target.classList.toggle('selected', isToggleSelected);

            const fileId = e.target.getAttribute('data-id');

            this.props.toggleFavorite(fileId, isToggleSelected);

        } else if (e.target.classList.contains('activation')) {
            const isSelected = e.target.classList.contains('selected');
            const isToggleSelected = !isSelected; 
            e.target.classList.toggle('selected', isToggleSelected);

            const fileId = e.target.getAttribute('data-id');

            this.props.toggleActivation(fileId, isToggleSelected);
        } else if (e.target.classList.contains('link')) {
            // NOOP

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

    updateLabels = (fontObj) => {
        return (labels) => {
            fontdb.updateLabels(fontObj._id, labels, () => {
                console.log('updated labels')
            })
        }
    }
    
    renderFontItem = (fontObj, index, fontStyle) => {
        const contentstyle = this.state.fontListContentStyle;
        const font = fontObj.font; 
        const style = Object.assign({}, font.collectStyle);
        const isGrid = contentstyle === 'grid';

        let message = this.fontContent || fontStyle.content || common.getPangramMessage(font.currentLanguage, isGrid); 

        let favoriteClass = "add-favorite";
        let favoriteIcon = (<i className="material-icons small">favorite_border</i>)
        let activeClass = "activation";

        if (fontObj.favorite) {
            favoriteClass += " selected";
            favoriteIcon = (<i className="material-icons small">favorite</i>);
        }

        if (fontObj.activation) {
            activeClass += " selected";
        }        

        return (
            <Observer 
                draggable={true} 
                onDragStart={this.onDragStart} 
                key={index} 
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
                    <span className={favoriteClass} data-id={fontObj._id} title="Add Favorite">{favoriteIcon}</span>
                </div>
                <div className="activation">
                    <span className={activeClass} data-id={fontObj._id} title="Activation">●</span>
                </div>                    

                <div className="font-item-preview" style={style}>
                    <div>{message}</div>
                </div>
                <LabelInput file={fontObj.file} labels={fontObj.labels} onChange={this.updateLabels(fontObj)} />
            </Observer>
        )
    }

    downloadGoogleFont = (fontObj)  => {
        // 중복 체크 
        // 구글 폰트 모두 다운로드 
        googlefont.downloadGoogleFont(fontObj, () => {
            console.log(' google font done');
        });

    }
    downloadUrl = (link) => {
        // 구글 early access 폰트, zip 파일로 압축된 폰트 다운로드 
        // 중복 체크         
        return () => {
            googlefont.downloadEarlyAccess(link, () => {
                console.log('done');
            });
        }
    }

    goUrl = (link, name) => {
        return () => {
            window.open(link, name || '_link');
        }
    }

    renderFontInfo = (fontObj, index, fontStyle) => {

        // 기타 다른 폰트들에 대해서 Rendering 객체를 다르게 해야할 것 같다. 

        const name = fontObj.name || fontObj.family;
        const labels = fontObj.variants || [];
        const preview = {__html : fontObj.description || ""}
        const licenseUrl = fontObj.licenseUrl; 
        let previewUrl = ""

        if (fontObj.files && Object.keys(fontObj.files).length && !licenseUrl) {
            previewUrl = "https://fonts.google.com/specimen/" + encodeURIComponent(fontObj.family)
        }

        return (
            <Observer key={name} className="font-item font-info-item" data-index={index} >
                <div className="font-info">
                    <div className="font-family" title={fontObj.family}>
                        {name}
                    </div>
                </div> 
                <div className="tools">
                    {fontObj.files && Object.keys(fontObj.files).length ? <span className="link" title="All Font Download" onClick={e => this.downloadGoogleFont(fontObj)} ><i className="material-icons">font_download</i></span> : ""}
                    {fontObj.downloadUrl ? <span className="link" title="Font Download" onClick={this.downloadUrl(fontObj.downloadUrl)} ><i className="material-icons">font_download</i></span> : ""}
                    {licenseUrl ? <span className="link" title="View License" onClick={this.goUrl(licenseUrl, 'License')} ><i className="material-icons">turned_in_not</i></span> : ""}
                    {previewUrl ? <span className="link" title="View Font" onClick={this.goUrl(previewUrl, 'Preview')} ><i className="material-icons">pageview</i></span> : ""}                    
                    {fontObj.buyUrl ? <span className="link" onClick={this.goUrl(fontObj.buyUrl, 'Buy')} ><i className="material-icons">shopping_cart</i></span> : ""}
                </div>   
                <div className="font-info-item-preview">
                    <div dangerouslySetInnerHTML={preview} />
                </div>                             
                <LabelInput fontObj={fontObj} labels={labels} readonly={true} onClick={this.downloadGoogleFont} />                
            </Observer>
        )
    }    

    renderItem = (fontObj, index, fontStyle) => {

        if (fontObj.font) {
            return this.renderFontItem(fontObj, index, fontStyle);
        } else {
            return this.renderFontInfo(fontObj, index, fontStyle);
        }

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