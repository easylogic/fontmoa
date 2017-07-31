
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

        //for(const lang in font.name.preferredFamily) {
        //    fontList.push(font.name.preferredFamily[lang]);
        //}
        


        //for(const lang in font.name.uniqueSubfamily) {
        //    fontList.push(font.name.uniqueSubfamily[lang]);
        //}

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
    const contentstyle = props.contentstyle;
    const file = props.file;
    const index = props.index; 
    const item = file.item; 

    const style = Object.assign({}, {
        fontSize: props.fontStyle.fontSize,
        lineHeight: props.fontStyle.fontSize,
        fontFamily: getFontFamilyCollect(file)
    });

    const itemStyle = {
        color: props.fontStyle.color,
        backgroundColor: props.fontStyle.backgroundColor,
    }

    if (file.italic) {
        style.fontStyle = 'italic';
    }

    if (file.bold) {
        style.fontWeight = 'bold'
    } else {
        style.fontWeight = 'normal'
    }

    const isGrid = contentstyle === 'grid';

    let message = isGrid ? "Ag" : "The quick brown fox jumps over the lazy dog";

    if (file.currentLanguage === 'ko') {
        message = isGrid ? "한글" : "닭 잡아서 치킨파티 함."
    } else if (file.currentLanguage === 'zh') {
        message = "太阳";
    } else if (file.currentLanguage === 'ja') {
        message = isGrid ? "いろ" : "いろはにほへとちりぬるを";
    } else if (file.currentLanguage === 'he') {
        message = isGrid ? "רה" : 'דג סקרן שט בים מאוכזב ולפתע מצא לו חברה איך הקליטה';
    } else if (file.currentLanguage === 'ar') {
        message = "طارِ";        
    }

    message = props.fontStyle.content || message; 

    const rowStart = (index % 5 === 0) ? true : false; 
    const rowLast = (index % 5 === 4) ? true : false; 

    return (
        <div draggable={true} style={itemStyle} className="font-item" data-dir={item.dir} data-path={item.path} data-row-start={rowStart} data-row-last={rowLast} >
            <div className="font-info">
                <div className="font-family" title={file.subfamilyName}>{file.currentFamilyName}<span className="font-sub-family">({file.subfamilyName})</span></div>
                <div className="font-name">{item.name}</div>
              
            </div>
            <div className="font-item-preview" style={style}> {message}</div>
        </div>        
    )
}

class FontListView extends Component {

    constructor (props) {
        super(props);

        this.state = {
            selectedRow: false, 
            fontListContentStyle : 'grid'
        }
    }

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

    render() {
        return (
            <div className="font-list-view">
                <div className="font-list-header" >
                    <div className="title">디렉토리 {this.props.directory} : {this.props.files.length}</div>
                    <div className="tools">
                        <ul className="pill" onClick={this.handleTabClick}>
                            <li className={this.state.selectedRow ? 'active' : ''}><a href="#row">Row</a></li>
                            <li className={this.state.selectedRow ? '' : 'active'}><a href="#grid">Grid</a></li>
                        </ul>
                    </div>
                </div>
                <div className="font-list-content" data-content-style={this.state.fontListContentStyle} onDoubleClick={this.handleFontClick} onClick={this.selectFontClick}>
                    {this.props.files.map((it, i) => {
                        return <FileItem file={it} key={i} index={i} fontStyle={this.props.fontStyle} contentstyle={this.state.fontListContentStyle} />
                    })}
                </div>
            </div>
        )
    }
}

export default FontListView 