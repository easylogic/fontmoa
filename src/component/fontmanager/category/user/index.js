import intl from 'react-intl-universal'
import React, { Component } from 'react';

import fontdb from '../../../../util/fontdb'

var remote = window.require('electron').remote;
var dialog = remote.dialog;


class UserFolders extends Component {

    constructor (props) {
        super(props)

        this.state = {
            userFolders : [],
            selectedDirectoryId : '',
        }

        this.init()
    }

    init = () => {
        this.refreshDirectory()
    }

    refreshFiles = (directory) => {
        fontdb.getUserFiles(directory, (files) => {
            this.props.refreshFiles(files);
            this.setState({
                selectedDirectoryId : directory
            })
        })
    }    

    refreshDirectory = () => {
        fontdb.getUserFolders((userFolders) => {
            this.setState({ userFolders })
        })
    }

    updateDirectory = (directory) => {
        fontdb.update(directory, () => {
            this.refreshFiles(directory);
        });
    }

    removeDirectory = (directory) => {
        fontdb.removeDirectory(directory, () => {
            this.refreshDirectory();
        })
    }



    handleItemClick = (e) => {
        if (e.target.classList.contains('delete-library')) {
            const directoryId = e.target.getAttribute('data-directory-id')
            if (directoryId) {

                const directory = e.target.getAttribute('data-directory')
                const message = intl.get("fontmanager.category.delete.folder.message", { directory })

                dialog.showMessageBox(null, {
                    "type" : 'question',
                    "title" : intl.get('fontmanager.category.alert.OK'),
                    message,
                    buttons: ['Ok', 'Cancel'],

                },  (buttonIndex) => {
                    if (buttonIndex === 0) {
                        this.removeDirectory(directoryId)
                    }
                })


            }
        } else {
            const directoryId = e.target.getAttribute('data-directory-id')
            if (directoryId) {
                this.refreshFiles(directoryId)
            }
        }


    }

    handleAddFolder = (directory) => {
        fontdb.addFolder(directory, () => {
          this.refreshDirectory();
        }); 
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


    renderCountLabel = (item) => {
        return (
            item.files.length === 0 ? "" : <span className="count label mini success">{item.files.length}</span>
        )
    }

    renderItem = (item, index) => {
        if (item.directory) {

            let className = "item";
            if (this.state.selectedDirectoryId === item._id) {
                className += " active" ;
            }

            return (
                <div className={className} key={index} data-directory-id={item._id}>
                    <a className="library-item"  data-directory-id={item._id}>{item.name} {this.renderCountLabel(item)}</a>
                    <span title="Delete a user directory" className="delete-library" data-directory={item.name} data-directory-id={item._id}><i className="icon icon-x-mark"></i></span>
                </div>
            )
        }
        return "";

    }

    render() {
        return (
            <div className="library-list splitter user">
                <div className="group-label" title="Click if to add user directory"><a className="title"  onClick={this.onAddFolder}><i className="icon icon-user"></i> {intl.get('fontmanager.category.new.folder')}</a></div>
                <div ref="libraryItems" className="library-items"  onClick={this.handleItemClick}>
                {
                    this.state.userFolders.map((it, index) => {
                        return this.renderItem(it, index);
                    })
                }
                </div>
            </div>
        )
    }
}

export default UserFolders 