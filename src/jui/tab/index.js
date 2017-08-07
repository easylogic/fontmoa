
import React, { Component } from 'react';
import Children from 'react-children-utilities';
import './default.css';

export default class Tabs extends Component {

    constructor (props) {
        super(props)

        const activeTab = Children.filter(props.children, (child) => { return child.props.active }).map((it) => {
            return it.props.id;
        })[0];

        this.state = {
            activeTab : activeTab || ""
        }

        this.tabs = {}
    }

    onTabClick = (e) => {

        const id = e.target.getAttribute('data-id');

        const selectedNode = e.target.parentNode.querySelector('.active');
        if (selectedNode) {
            selectedNode.classList.remove('active');
        }
        e.target.classList.add('active');
        for(let tab in this.tabs) {
            this.tabs[tab].setActive(id);
        }
    }

    createItemClass = (child) => {
        let itemClass = [];

        if (child.props.id === this.state.activeTab) {
            itemClass.push('active')
        }

        return itemClass.join(' ');
    }

    render() {
        const self = this; 
        return (
            <div className="tabs full">
                <ul className="tab top" style={this.props.styles} onClick={this.handleTabClick} >
                    {React.Children.map(this.props.children, (child) => {

                        const style = Object.assign({}, child.props.style || {});

                        if (child.props.right) {
                            style.float = 'right';
                            style.marginRight = '10px'
                        }

                        return (<li style={style} className={this.createItemClass(child)} data-id={child.props.id} onClick={this.onTabClick}>
                            <a href={'#' + child.props.id} style={{pointerEvents: 'none'}}>{child.props.title}</a>
                        </li>)
                    })}
                </ul>
                <div className="tab-container">
                    {React.Children.map(this.props.children, (child) => {
                        return React.cloneElement(child, { 
                            ref : ((element) => {
                                self.tabs[child.props.id] = element; 
                            }),
                            active : this.state.activeTab === child.props.id 
                        })
                    })}
                </div>
            </div>
        );
    }
}
