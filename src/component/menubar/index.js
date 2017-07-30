
import React, { Component } from 'react';
import './default.css';

class Menubar extends Component {
    constructor(props) {
        super(props)

        this.init();
    }

    init () {
        
        this.state = {
            content : "",
            fontSize: '40px',
            color: 'black',
            backgroundColor: 'white' 
        }
    }

    change = (obj) => {
        this.setState(obj);

        this.props.refreshFontStyle(this.state);
    }

    onChangeText = (e) => {
        this.change({ content : e.target.value });
    }

    onChangeForeground = (e) => {
        this.change({ color : e.target.value });
    }

    onChangeBackground = (e) => {
        this.change({ backgroundColor : e.target.value });
    }

    onChangeFontSize = (e) => {
        this.change({ fontSize : e.target.value + 'px' });
    }

    render() {
        return (
            <div className="menubar">
               <input type="text" onInput={this.onChangeText}  placeholder="텍스트를 입력하세요." />
               <input type='color' onChange={this.onChangeForeground} onInput={this.onChangeForeground} value="#000000" />
               <input type='color' onChange={this.onChangeBackground} onInput={this.onChangeBackground} value="#ffffff" />
               <input type='range' onChange={this.onChangeFontSize}  min="10" max="100" defaultValue="40" step="1" />
            </div>
        )
    }
}

export default Menubar 