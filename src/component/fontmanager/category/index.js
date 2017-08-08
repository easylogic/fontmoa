import intl from 'react-intl-universal'
import React, { Component } from 'react';
import './default.css';

import fontdb from '../../../util/fontdb'

var remote = window.require('electron').remote;
var dialog = remote.dialog;


class Category extends Component {


    handleFolderItemClick = (e) => {

        if (e.target.classList.contains("icon-trashcan")) {

            const directory = e.target.parentNode.getAttribute("data-directory")
            const message = intl.get("fontmanager.category.delete.folder.message", { directory})

            const self = this; 
            dialog.showMessageBox(null, {
                "type" : 'question',
                "title" : intl.get('fontmanager.category.alert.OK'),
                message,
                buttons: ['Ok', 'Cancel'],

            }, function (buttonIndex) {
                if (buttonIndex === 0) {
                    if (directory) {
                        fontdb.removeDirectory(directory, () => {
                            self.props.refreshDirectory();
                        })
                    } 
                } else {
                    
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

            if (path) {
                this.handleAddFolder(path[0]);
            }


        });

        
    }

    createSystemFolderList = () => {
        return this.props.systemFolders.map((it, index) => {
            return <a key={index} className="title" data-directory={it.directory}>{intl.get(it.name).d(it.name)}</a>
        })
    }

    createUserFolderList = () => {

        return (<ul className="submenu">
            {
                this.props.userFolders.map((it, index) => {
                    return <li key={index}><a className="folder-item" data-directory={it.directory}>{it.name}<i className="icon icon-trashcan" title={intl.get('fontmanager.category.delete.userfolder')} style={{float: 'right'}}></i></a></li>
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
                        <a className="title" title={intl.get('fontmanager.category.folder.list.plus.title')} onClick={this.onAddFolder}><i className="icon icon-plus"></i> {intl.get('fontmanager.category.new.folder')}</a>
                        { this.props.userFolders.length ? this.createUserFolderList() : "" }    
                        <a className="title">{intl.get('fontmanager.category.favorite.title')}</a>
                        { this.props.favorite.length ? this.createFavoriteList() : "" }                            
                    </div>
                </div>
            </div>
        )
    }
}

export default Category 