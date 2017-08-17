import intl from 'react-intl-universal'

import React, { Component } from 'react';
import './default.css';

const _ = window.require('lodash');

class Menubar extends Component {
    constructor(props) {
        super(props)

        this.init();
    }

    init () {
        
        this.state = {
            content : "",
            fontSize: '40px',
        }

        this.refreshFontSize = _.debounce((fontSize) => {
            this.props.refreshFontSize(fontSize);
        }, 200);
    }

    change = (obj) => {
        this.setState(obj);

        this.props.refreshFontStyle(this.state);
    }

    onChangeText = (e) => {
        this.props.refreshFontContent(e.target.value);
    }

    onChangeFontSize = (e) => {
        const fontSize = e.target.value + 'px';

        this.refreshFontSize(fontSize);
    }

    toggleView = () => {
        this.props.toggleView();
    }

    render() {
        return (
            <div className="navbar">
                <div className="inline">
                    <span className="font-only-view" onClick={this.toggleView}><i className="icon icon-gear"></i></span>
                </div>
                <div className="inline right">
                    <input type="text" className="input" onInput={this.onChangeText}  placeholder={intl.get('fontmanager.menubar.typing.inputText.placeholder')} />
                    <span className="range-component">
                        <span className="small">{intl.get('fontmanager.menubar.text.size.title')}</span> 
                        <input type='range' onInput={this.onChangeFontSize}  min="10" max="100" defaultValue="40" step="1" /> 
                        <span className="big">{intl.get('fontmanager.menubar.text.size.title')}</span>
                    </span>
                </div>

            </div>
        )
    }
}

export default Menubar 