
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

    handleSearchFont = (e) => {

    }

    render() {
        return (
            <div className="navbar">
                <div className="inline">
                    <span > Search: &nbsp;</span>
                    <input type="text" className="input search-field" placeholder="설치된 폰트 검색해보아요." onChange={this.handleSearchFont} />
                </div>
                <div className="inline right">
                    <span>글자 변환</span>
                    <input type="text" className="input" onInput={this.onChangeText}  placeholder="텍스트를 입력하세요." />
                    <input type='color' className="input"  onChange={this.onChangeForeground} onInput={this.onChangeForeground} value="#000000" />
                    <input type='color' className="input"  onChange={this.onChangeBackground} onInput={this.onChangeBackground} value="#ffffff" />
                    <span style={{width: '200px'}}>
                        <input type='range' onInput={this.onChangeFontSize}  min="10" max="100" defaultValue="40" step="1" />
                    </span>
                    <input type="text" className="input font-size" readOnly={true} value={this.state.fontSize} />
                </div>

            </div>
        )
    }
}

export default Menubar 