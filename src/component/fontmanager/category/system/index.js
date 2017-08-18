import intl from 'react-intl-universal'
import React, { Component } from 'react';

import fontdb from '../../../../util/fontdb'
import common from '../../../../util/common'


class SystemFolders extends Component {

    constructor (props) {
        super(props)

        this.state = {
            systemFolders : common.getSystemFolders()
        }
    }

    loadFiles = (directory, type) => {
        directory = directory || this.state.systemFolders[0].directory; 
        type = type || this.state.systemFolders[0].type;

        fontdb.update(directory, type, () => {
            this.refreshFiles(directory);
        });
    }

    refreshFiles = (directory) => {
        fontdb.getFiles(directory, (files) => {
            this.props.refreshFiles(files);
        })
    }


    handleItemClick = (e) => {

        const directory = e.target.getAttribute('data-directory')
        const type = e.target.getAttribute('data-type')
        if (directory) {
            this.loadFiles(directory, type);
        }

    }

    renderItem = (item, index) => {
        return (
            <div className="item" data-type={item.type} data-directory={item.directory}  key={index}>
                <a key={index} className="title" ><i className="icon icon-tool"></i>  {intl.get(item.name).d(item.name)}</a>
            </div>
        )
    }

    render() {
        return (
            <div className="library-list splitter system">
                <div className="library-items" onClick={this.handleItemClick}>
                    {
                        this.state.systemFolders.map((it, index) => {
                            return this.renderItem(it, index);
                        })
                    }
                </div>
            </div>
        )
    }
}

export default SystemFolders 