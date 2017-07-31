
import React, { Component } from 'react';
import './default.css';

export default class Tabs extends Component {

    handleTabClick = (e) => {
        console.log(e.target.href)
    }

    createItemClass = (child) => {
        let itemClass = [];

        if (child.props.active) {
            itemClass.push('active')
        }

        return itemClass.join(' ');
    }

    render() {
        return (
            <div className="tabs full">
                <ul className="tab top" onClick={this.handleTabClick} >
                    {React.Children.map(this.props.children, (child) => {
                        return (<li className={this.createItemClass(child)}>
                            <a href={'#' + child.props.id}>{child.props.title}</a>
                        </li>)
                    })}
                </ul>
                <div className="tab-container">
                    {React.Children.map(this.props.children, (child) => {
                        return child
                    })}
                </div>
            </div>
        );
    }
}
