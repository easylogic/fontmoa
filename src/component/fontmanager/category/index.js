import React, { Component } from 'react';
import './default.css';

import System from './system'
import Library from './library'
import User from './user'
import Favorite from './favorite'

class Category extends Component {

    componentDidMount = () => {
        if (this.refs.system) {
            this.refs.system.loadFiles();
        }
    }

    render() {
        return (
            <div className="category">
                <div className="category-content " >
                    <Favorite ref="favorite" refreshFiles={this.props.refreshFiles} />                    
                    <System ref="system" refreshFiles={this.props.refreshFiles} />
                    <User ref="user" refreshFiles={this.props.refreshFiles} />
                    <Library ref="library" refreshFiles={this.props.refreshFiles} />
                </div>
            </div>
        )
    }
}

export default Category 