import React, { Component } from 'react';
import './default.css';

class Menubar extends Component {
    constructor(props) {
        super(props)

        this.init();
    }

    init () {
        
        this.state = {
            selectedRow: true, 
            fontListContentStyle : 'row',            
        }

    }


    handleTabClick = (type, e) => {
        return (e) => {

            this.setState({
                selectedRow: type === "row",
                fontListContentStyle: type
            })
    
            this.props.refreshRowStyle(type);
        }
    }

    toggleView = () => {
        this.props.toggleView();
    }

    render() {
        return (
            <div className="fm-menubar">
                <div className="left">
                    <span className="font-only-view" onClick={this.toggleView}><i className="icon icon-gear"></i></span>
                </div>
                <div className="right">
                    <ul className="pill select-row-style">
                        <li className={this.state.selectedRow ? 'active' : ''}><a href="#row" onClick={this.handleTabClick('row')}><i className="icon icon-menu"></i></a></li>
                        <li className={this.state.selectedRow ? '' : 'active'}><a href="#grid" onClick={this.handleTabClick('grid')}><i className="icon icon-list1"></i></a></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Menubar 