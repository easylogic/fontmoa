import intl from 'react-intl-universal'
import React, { Component } from 'react';

import fontdb from '../../../../util/fontdb'

var remote = window.require('electron').remote;
var dialog = remote.dialog;


class Library extends Component {

    constructor (props) {
        super(props)

        this.state = {
            library : [],
            selectLibraryId : '',
        }

        this.init()
    }

    init = () => {
        this.refreshLibrary()
    }

    refreshFiles = (libraryId) => {
        fontdb.getLibraryFiles(libraryId, (files) => {
            this.props.refreshFiles(files);
            this.setState({
                selectLibraryId: libraryId
            })
        })
    }    

    refreshLibrary = () => {
        fontdb.getLibraryList((library) => {
            this.setState({ library })
        })
    }

    addLibrary = (library) => {
        fontdb.addLibrary(library, () => {
            this.refreshLibrary();
        })
    }

    appendFileToLibrary = (library, files) => {
        fontdb.appendFileToLibrary(library, files, () => {
            // 라이브러리를 추가 할 때는 화면이 다른 화면이라 따로 상태를 업데이트 하지 않음. 
            this.refreshLibrary();
        })
    }

    deleteLibraryById = (id) => {
        fontdb.removeLibrary(id, () => {
            this.refreshLibrary();
        })
    }



    handleItemClick = (e) => {
        if (e.target.classList.contains('delete-library')) {
            const libraryId = e.target.getAttribute('data-library-id')
            if (libraryId) {


                const library = e.target.getAttribute('data-library')
                const message = intl.get("fontmanager.category.delete.library.message", { library })

                dialog.showMessageBox(null, {
                    "type" : 'question',
                    "title" : intl.get('fontmanager.category.alert.OK'),
                    message,
                    buttons: ['Ok', 'Cancel'],

                },  (buttonIndex) => {
                    if (buttonIndex === 0) {
                        this.deleteLibraryById(libraryId)
                    }
                })

                
            }
        } else {
            const libraryId = e.target.getAttribute('data-library-id')
            if (libraryId) {
                this.refreshFiles(libraryId)
            }
        }


    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const library = e.target.value + '';
            e.target.value = '';                        
            this.addLibrary(library);

        }
    }

    renderCountLabel = (item) => {
        return (
            item.files.length === 0 ? "" : <span className="count label mini success">{item.files.length}</span>
        )
    }

    preventDefault = (event) => {
        event.preventDefault()
    }

    onDropItem = (e) => {
        e.preventDefault();
        var files = e.dataTransfer.getData("text").split(',');
        const libraryId = e.target.getAttribute('data-library-id');
        this.appendFileToLibrary(libraryId, files);
        this.onDragLeaveItem(e);        
    }

    onDragEnterItem = (e) => {
        if (e.target) {
            e.target.classList.add('drop-item');
        }
    }

    onDragLeaveItem = (e) => {
        if (e.target) {
            e.target.classList.remove('drop-item');
        }
    }    

    renderItem = (item, index) => {
        if (item.library) {

            let className = "item";
            if (this.state.selectLibraryId === item._id) {
                className += " active" ;
            }
            
            return (
                <div className={className} key={index} onDragEnter={this.onDragEnterItem} onDragLeave={this.onDragLeaveItem} onDrop={this.onDropItem} onDragOver={this.preventDefault}  data-library-id={item._id}>
                    <a className="library-item">{item.library} {this.renderCountLabel(item)}</a>
                    <span title="Delete a library" className="delete-library" data-library-id={item._id} data-library={item.library}><i className="icon icon-x-mark"></i></span>
                </div>
            )
        }
        return "";

    }

    render() {
        return (
            <div className="library-list splitter library">
                <div className="group-label"><a className="title"><i className="icon icon-document"></i> {intl.get('fontmanager.category.library.title')}</a></div>
                <div className="library-items" onClick={this.handleItemClick}>
                {
                    this.state.library.map((it, index) => {
                        return this.renderItem(it, index);
                    })
                }
                </div>
                <div className="library-input">
                    <input type="text" className="input" title="라이브러리 이름을 입력하세요." placeholder="+ 라이브러리 이름" onKeyPress={this.handleKeyPress} />
                </div>
            </div>
        )
    }
}

export default Library 