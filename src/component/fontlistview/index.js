
import React, { Component } from 'react';
import './default.css';

const getFontFamilyCollect = (font) => {
    let fontList = [];

    //console.log(font);

    fontList.push(font.familyName);
//    fontList.push(font.fullName);
//    fontList.push(font.postscriptName);


    if (font.name) {
       // console.log(font.name)
        for(const lang in font.name.fontFamily) {
            fontList.push(font.name.fontFamily[lang]);
        }
        for(const lang in font.name.preferredFamily) {
            fontList.push(font.name.preferredFamily[lang]);
        }
        

        /*
        for(const lang in font.name.uniqueSubfamily) {
            fontList.push(font.name.uniqueSubfamily[lang]);
        }

        for(const lang in font.name.fullName) {
            fontList.push(font.name.fullName[lang]);
        }
        
        for(const lang in font.name.postscriptName) {
            fontList.push(font.name.postscriptName[lang]);
        } */        
    }



    return fontList.map((f) => {
        return f;
    }).join(', ');
    
}

const FileItem = (props) => {
    const file = props.file;
    const index = props.index; 
    const item = file.item; 

    const style = {
        fontSize: 40,
        lineHeight: '40px',
        fontFamily: getFontFamilyCollect(file)
    }

    if (file.italic) {
        style.fontStyle = 'italic';
    }

    if (file.bold) {
        style.fontWeight = 'bold'
    } else {
        style.fontWeight = 'normal'
    }

    let message = "Ag";

    if (file.currentLanguage === 'ko') {
        message = "한글"
    } else if (file.currentLanguage === 'zh') {
        message = "太阳";
    } else if (file.currentLanguage === 'ja') {
        message = "いろ";

    }

    const rowStart = (index % 5 === 0) ? true : false; 
    const rowLast = (index % 5 === 4) ? true : false; 

    return (
        <div draggable={true} className="font-item" data-dir={item.dir} data-path={item.path} data-row-start={rowStart} data-row-last={rowLast} >
            <div className="font-info">
                <div className="font-family" title={file.subfamilyName}>{file.currentFamilyName}</div>
                <div className="font-name">{item.name}</div>
              
            </div>
            <div className="font-item-preview" style={style}> {message}</div>
        </div>        
    )
}

class FontListView extends Component {

    handleFontClick = (e) => {
        const path = e.target.getAttribute('data-path')
        console.log(path)
    }

    selectFontClick = (e) => {

        [...document.querySelectorAll('.font-list-view .font-item.selected')].forEach((node) => {
            node.classList.remove('selected');  
        });

        e.target.classList.add('selected');

        const path = e.target.getAttribute('data-path');

        this.props.refreshFontInfo(path);
    }

    render() {
        return (
            <div className="font-list-view">
                <div className="font-list-header" >
                    <div className="title">디렉토리 {this.props.directory} : {this.props.files.length}</div>
                </div>
                <div className="font-list-content" onDoubleClick={this.handleFontClick} onClick={this.selectFontClick}>
                    {this.props.files.map((it, i) => {
                        return <FileItem file={it} key={i} index={i} />
                    })}
                </div>
            </div>
        )
    }
}

export default FontListView 