import React, { Component } from 'react';
import './default.css';

import fontdb from '../../util/fontdb'

class Category extends Component {

    constructor(props) {
        super(props)

        this.init();
    }

    init () {
        
        this.state = {
            systemFolders : this.props.systemFolders || [],
            files : [] 
        }
    }


    handleFolderItemClick = (e) => {

        const directory = e.target.getAttribute('data-path')
        if (directory) {
            fontdb.update(directory, () => {
                this.props.refreshFiles(directory);
            });
        }

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
                        <div className="folder-list"  onClick={this.handleFolderItemClick}>
                            {
                                this.state.systemFolders.map((it, index) => {
                                    return <div className="folder-item" key={index} data-path={it.path} data-name={it.name}></div>
                                })
                            }
                            
                        </div>
                    </div>
                    <div className="folder user-folder">
                        <div className="title">사용자 디렉토리</div>
                        <div className="folder-list"></div>
                    </div>       
                    <div className="folder favorite-folder">
                        <div className="title">즐겨찾기</div>  
                    </div>
                </div>
            </div>
        )
    }
}

export default Category 