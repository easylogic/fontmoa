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

    componentDidMount () {
        this.refs.fontSize.value = this.state.fontSize;
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
        this.refs.fontSize.value = fontSize;

        this.refreshFontSize(fontSize);
    }

    render() {
        return (
            <div className="navbar">
                <div className="inline right">
                    <span>{intl.get('fontmanager.menubar.typing.title')}</span>
                    <input type="text" className="input" onInput={this.onChangeText}  placeholder={intl.get('fontmanager.menubar.typing.inputText.placeholder')} />
                    <span className="range-component" style={{width: '200px'}}>
                        <span className="small">{intl.get('fontmanager.menubar.text.size.title')}</span> 
                        <input type='range' onInput={this.onChangeFontSize}  min="10" max="100" defaultValue="40" step="1" /> 
                        <span className="big">{intl.get('fontmanager.menubar.text.size.title')}</span>
                    </span>
                    <input type="text" className="input font-size" ref="fontSize" readOnly={true} />
                </div>

            </div>
        )
    }
}

export default Menubar 