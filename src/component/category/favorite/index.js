import intl from 'react-intl-universal'
import React, { Component } from 'react';

import fontdb from '../../../util/fontdb'

class Favorite extends Component {

    constructor(props) {
        super(props)

        this.state = {
            count : 0
        }

        this.loadCount();
    }

    loadCount = () => {
        fontdb.getFavoriteCount((count) => {
            this.setState({ count })
        })
    }

    refreshFiles = () => {
        fontdb.getFavoriteFiles((files) => {
            console.log(files);
            this.props.refreshFiles(files);
        })
    }        

    toggleFavorite = (path, isAdd) => {
        fontdb.toggleFavorite(path, isAdd, () => {
            this.loadCount();
        })
    }

    handleItemClick = (e) => {
        this.refreshFiles();
    }

    render() {
        return (
            <div className="library-list splitter favorite">
                <div className="group-label" onClick={this.handleItemClick}>
                    <a className="title">
                        <i className="icon icon-connection"></i> {intl.get('fontmanager.category.favorite.title')}  { this.state.count ? <span className="count label mini success">{this.state.count}</span> : "" }
                    </a>
                </div>
            </div>
        )
    }
}

export default Favorite 