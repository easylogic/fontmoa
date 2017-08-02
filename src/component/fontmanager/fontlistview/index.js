
import React, { Component } from 'react';
import './default.css';

const FileItem = (props) => {
    const contentstyle = props.contentstyle;
    const file = props.file;
    const index = props.index; 
    const item = file.item; 

    const style = Object.assign({}, {
        fontSize: props.fontStyle.fontSize,
        lineHeight: props.fontStyle.fontSize,
        fontFamily: file.collectFontFamily
    });

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
        <div draggable={true} className="font-item" data-dir={item.dir} data-path={item.path} data-row-start={rowStart} data-row-last={rowLast} >
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

        const fontStyle = {
            fontSize : this.props.fontStyle.fontSize,
            content : this.props.fontStyle.content,
        }

        const colorStyle = {
            color: this.props.fontStyle.color,
            backgroundColor: this.props.fontStyle.backgroundColor,
        }

        return (
            <div className="font-list-view">
                <div className="font-list-header" >
                    <div className="title">디렉토리 {this.props.directory} : {this.props.files.length}</div>
                    <div className="tools">
                        <ul className="pill" onClick={this.handleTabClick}>
                            <li className={this.state.selectedRow ? 'active' : ''}><a href="#row"><i className="icon icon-menu"></i></a></li>
                            <li className={this.state.selectedRow ? '' : 'active'}><a href="#grid"><i className="icon icon-dashboardlist"></i></a></li>
                        </ul>
                    </div>
                </div>
                <div className="font-list-content" style={colorStyle} data-content-style={this.state.fontListContentStyle} onDoubleClick={this.handleFontClick} onClick={this.selectFontClick}>
                    {this.props.files.map((it, i) => {
                        return <FileItem file={it} key={i} index={i} fontStyle={fontStyle} contentstyle={this.state.fontListContentStyle} />
                    })}
                </div>
            </div>
        )
    }
}

export default FontListView 