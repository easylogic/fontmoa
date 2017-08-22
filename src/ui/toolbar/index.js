import React, { Component } from 'react';
import './default.css';

import ToolbarItem from './item'

class Toolbar extends Component {
    render() {
        return (
            <div className="toolbar">
                {this.props.items.map((item, i) => {
                    return <ToolbarItem key={i} item={item} onClick={this.props.onClick} />;
                })}
            </div>
        )
    }
}

export default Toolbar 