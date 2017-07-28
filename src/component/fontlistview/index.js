
import React, { Component } from 'react';
import './default.css';

const getFontFamilyCollect = (font) => {
    let fontList = [];

    fontList.push(font.familyName);
    fontList.push(font.fullName);
    fontList.push(font.postscriptName);

    if (font.name) {
        for(const lang in font.name.familyName) {
            fontList.push(font.name.familyName[lang]);
        }

        for(const lang in font.name.uniqueSubfamily) {
            fontList.push(font.name.uniqueSubfamily[lang]);
        }

        for(const lang in font.name.fullName) {
            fontList.push(font.name.fullName[lang]);
        }
        
        for(const lang in font.name.postscriptName) {
            fontList.push(font.name.postscriptName[lang]);
        }        
    }



    return fontList.map((f) => {
        return f;
    }).join(', ');
    
}

const FileItem = (props) => {
    const file = props.file;
    const item = file.item; 

    const style = {
        fontSize: 40,
        fontFamily: getFontFamilyCollect(file)
    }

    if (file.italic) {
        style.fontStyle = 'italic';
    }

    if (file.bold) {
        style.fontWeight = 'bold'
    }

    let message = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";

    if (file.currentLanguage === 'ko') {
        message = "다람쥐 헌 쳇바퀴에 타고파. 1234567890"
    }

    return (
        <div className="font-item" data-dir={item.dir} data-path={item.path}>
            <div className="font-info">
                <div className="font-family">{file.currentFamilyName} (<span>{file.subfamilyName}</span>)</div>
                <div className="font-name">{item.name}</div>
              
            </div>
            <div className="font-item-preview" style={style}> {message}</div>
        </div>        
    )
}

class FontListView extends Component {

    handleFontClick = (e) => {
        console.log(e.target)
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
                        return <FileItem file={it} key={i} />
                    })}
                </div>
            </div>
        )
    }
}

export default FontListView 