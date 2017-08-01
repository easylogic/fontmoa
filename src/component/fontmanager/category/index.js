import React, { Component } from 'react';
import './default.css';

import fontdb from '../../../util/fontdb'

var remote = window.require('electron').remote;
var dialog = remote.dialog;


class Category extends Component {


    handleFolderItemClick = (e) => {

        if (e.target.classList.contains("icon-trashcan")) {

            const directory = e.target.parentNode.getAttribute("data-directory")
            const message = directory + " 디렉토리를 지우시겠습니까?\r\n디렉토리를 지우시면 기존에 가지고 있던 폰트 파일 목록도 같이 지워집니다."

            const self = this; 
            dialog.showMessageBox(null, {
                "type" : 'question',
                "title" : "확인",
                message,
                buttons: ['Ok', 'Cancel'],

            }, function (buttonIndex) {
                if (buttonIndex === 0) {
                    // 확인 
                    if (directory) {
                        fontdb.removeDirectory(directory, () => {
                            self.props.refreshDirectory();
                        })
                    } 
                } else {
                    // 취소 
                }
            })


        } else {
            const directory = e.target.getAttribute('data-directory')
            if (directory) {
                fontdb.update(directory, () => {
                    this.props.refreshFiles(directory);
                });
            }
        }



    }

    handleAddFolder = (path) => {
        this.props.handleAddFolder(path);        
    }

    onAddFolder = (e) => {     
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, (path) => {
            const realPath = path[0]

            this.handleAddFolder(realPath);
        });

        
    }

    createSystemFolderList = () => {
        return this.props.systemFolders.map((it, index) => {
            return <a key={index} className="title" data-directory={it.directory}>{it.name}</a>
        })
    }

    createUserFolderList = () => {

        return (<ul className="submenu">
            {
                this.props.userFolders.map((it, index) => {
                    return <li key={index}><a className="folder-item" data-directory={it.directory}>{it.name}<i className="icon icon-trashcan" title="Delete directory" style={{float: 'right'}}></i></a></li>
                })
            }
        </ul>);
                     
    }

    createFavoriteList = () => {
        return (<ul className="submenu">
            {
                this.props.favorite.map((it, index) => {
                    return <li key={index}><a className="folder-item" data-directory={it.directory}>{it.name}</a></li>
                })
            }
        </ul>);
    }

    render() {
        return (
            <div className="category">
                <div className="category-content menu" >
                    <div className="folder-list vmenu rect"  onClick={this.handleFolderItemClick}>
                        { this.createSystemFolderList() }
                        <a className="title" title="눌러서 디렉토리를 추가하세요." onClick={this.onAddFolder}><i className="icon icon-plus"></i> 사용자 디렉토리</a>
                        { this.props.userFolders.length ? this.createUserFolderList() : "" }    
                        <a className="title">즐겨찾기</a>
                        { this.props.favorite.length ? this.createFavoriteList() : "" }                            
                    </div>
                </div>
            </div>
        )
    }
}

export default Category 