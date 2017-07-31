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
                <div className="category-content menu" >
                    <div className="folder-list vmenu rect"  onClick={this.handleFolderItemClick}>
                        <a className="title">시스템 디렉토리</a>
                        <ul className="submenu">
                        {
                            this.state.systemFolders.map((it, index) => {
                                return <li key={index}><a className="folder-item" key={index} data-path={it.path} data-name={it.name}></a></li>
                            })
                        }
                        </ul>
                        <a className="title">사용자 디렉토리</a>
                        <ul className="submenu">
                        </ul>                        
                        <a className="title">즐겨찾기</a>
                        <ul className="submenu">
                        </ul>                                                
                    </div>
                </div>
            </div>
        )
    }
}

export default Category 