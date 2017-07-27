import React, { Component } from 'react';
import './default.css';

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
        console.log(this.state.systemFolders)
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
                                this.state.systemFolders.map((it, index) => {
                                    return <div className="folder-item" key={index} data-path={it.path} data-name={it.name} onClick={this.handleFolderItemClick}></div>
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