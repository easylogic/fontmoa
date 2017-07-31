import React, { Component } from 'react';

export default class TabItem extends Component {
    constructor(props) {
        super(props)

        console.log(props);
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
            <div id={this.props.id} className={this.createItemClass()}>
                {React.Children.map(this.props.children, (child) => {
                    return child;
                })}
	        </div>
        );
    }
}
