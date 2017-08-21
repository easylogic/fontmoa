import intl from 'react-intl-universal'
import React, { Component } from 'react';

const _ = window.require('lodash');

class Toolbar extends Component {
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

    render() {
        return (
            <div>
                <div className="fm-toolbar">
                    <div className="left">
                        <input type="text" className="content-input" onInput={this.onChangeText}  placeholder={intl.get('fontmanager.menubar.typing.inputText.placeholder')} />
                    </div>
                    <div className="right">
                        <span className="range-component">
                            <span className="small">{intl.get('fontmanager.menubar.text.size.title')}</span> 
                            <input type='range' onInput={this.onChangeFontSize}  min="10" max="100" defaultValue="40" step="1" /> 
                            <span className="big">{intl.get('fontmanager.menubar.text.size.title')}</span>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Toolbar 