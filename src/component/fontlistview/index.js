
import React, { Component } from 'react';
import './default.css';

const FileItem = (props) => {
    const item = props.file; 
    const index = props.index;
    const realpath = item.path;
    const ext = item.ext;

  

    return (
        <div className="font-item" data-dir={item.dir} data-index={index}>
            <div className="font-info">
                <div className="font-ext">{item.ext}</div>            
                <div className="font-name">{item.name}</div>
            </div>
            <div className="font-item-preview">

            </div>
        </div>        
    )
}

class FontListView extends Component {

    render() {
        return (
            <div className="font-list-view">
                <div className="font-list-header" >
                    <div className="title">디렉토리</div>
                </div>
                <div className="font-list-content">
                    {this.props.files.map((it, i) => {
                        return <FileItem file={it} key={it.path} />
                    })}
                </div>
            </div>
        )
    }
}

export default FontListView 