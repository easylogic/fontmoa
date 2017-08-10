import intl from 'react-intl-universal'
import React, { Component } from 'react';

import fontdb from '../../../../util/fontdb'

class Favorite extends Component {

    refreshFiles = () => {
        fontdb.getFavoriteFiles((files) => {
            this.props.refreshFiles(files);
        })
    }        

    handleItemClick = (e) => {
        this.refreshFiles();
    }

    render() {
        return (
            <div className="library-list splitter favorite">
                <div className="group-label" onClick={this.handleItemClick}><a className="title"><i className="icon icon-connection"></i> {intl.get('fontmanager.category.favorite.title')}</a></div>
            </div>
        )
    }
}

export default Favorite 