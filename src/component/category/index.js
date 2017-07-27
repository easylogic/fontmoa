
import React, { Component } from 'react';
import './default.css';

const fs = window.require('fs');
const path = window.require('path');

class Category extends Component {

    constructor(props) {
        super(props)

        this.init();
    }

    init () {
        this.state = {
            systemFolders : [
                { name : '시스템 폴더', path : '/Library/Fonts'}
            ],
            files : [] 
        }
    }

    updateContent (dir, files) {
        this.props.updateDirectory(
            files.map((it) => {
                return { 
                    path : path.resolve(dir, it),
                    dir : dir, 
                    name : path.basename(it), 
                    ext : path.extname(it) 
                }
            })
        )
        
        
    }

    handleFolderItemClick = (e) => {

        const filepath = e.target.getAttribute('data-path')

        console.log(filepath);

        console.log(fs)
        fs.readdir(filepath, (err, files) => {
            this.updateContent(filepath, files)
        })

    }
    render() {
        return (
            <div className="category">
                <div className="category-header" >
                    <div className="title">디렉토리</div>
                </div>
                <div className="category-toolbar">
                    <button type="button">추가</button>
                    <button type="button">삭제</button>
                </div>
                <div className="category-content" >
                    <div className="folder system-folder">
                        <div className="title">시스템 디렉토리</div>
                        <div className="folder-list">
                            {
                                this.state.systemFolders.map((it) => {
                                    return <div className="folder-item" data-path={it.path} data-name={it.name} onClick={this.handleFolderItemClick}></div>
                                })
                            }
                            
                        </div>
                    </div>
                    <div className="folder user-folder">
                        <div className="title">사용자 디렉토리</div>
                        <div className="folder-list"></div>
                    </div>                    
                </div>
            </div>
        )
    }
}

export default Category 