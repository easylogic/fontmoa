import React, { Component } from 'react';

export default class TabItem extends Component {

    setActive (id) {
        this.tabItem.classList.toggle('active', this.props.id === id);
    }

    createItemClass = () => {
        let itemClass = ['tab-content'];

        if (this.props.active) {
            itemClass.push('active')
        }

        return itemClass.join(' ');
    }
    render () {
        return (
            <div ref={(tabItem) => {this.tabItem = tabItem;}} id={this.props.id} className={this.createItemClass()}>
                {React.Children.map(this.props.children, (child) => {
                    return child;
                })}
	        </div>
        );
    }
}
