import React, { Component } from 'react';
import './default.css';

class ToolbarItem extends Component {

    render () {
        const item = this.props.item || {}; 

        let toolbarItemClass = "toolbar-item";

        if (item.right) {
            toolbarItemClass += " right";
        }
        return <span className={toolbarItemClass} onClick={e => this.props.onClick(item, e)}>{item.title}</span>
    }
}

export default ToolbarItem 