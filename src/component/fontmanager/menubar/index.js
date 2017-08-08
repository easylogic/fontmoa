import intl from 'react-intl-universal'

import React, { Component } from 'react';
import './default.css';
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

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
            displayColorPickerForeground: false,
            backgroundColor: 'white',
            displayColorPickerBackground: false,
        }
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

    onChangeForeground = (color) => {
        this.change({ color: color.hex });
    }

    onChangeBackground = (color) => {
        this.change({ backgroundColor: color.hex });
    }

    onChangeFontSize = (e) => {
        const fontSize = e.target.value + 'px';
        this.refs.fontSize.value = fontSize;
        this.props.refreshFontSize(fontSize);
    }

    handleClickForeground = () => {
        this.setState({ displayColorPickerForeground: !this.state.displayColorPickerForeground })
    }

    handleCloseForeground = () => {
        this.setState({ displayColorPickerForeground: false })
    }

    handleClickBackground = () => {
        this.setState({ displayColorPickerBackground: !this.state.displayColorPickerBackground })
    }

    handleCloseBackground = () => {
        this.setState({ displayColorPickerBackground: false })
    }

    render() {

        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: this.state.color,
                },
                backgroundColor: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: this.state.backgroundColor,
                },                
                colorBlock: {
                    display: 'inline-block',
                    zIndex: '100',
                },                
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    verticalAlign: 'middle',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

        return (
            <div className="navbar">
                <div className="inline right">
                    <span>{intl.get('fontmanager.menubar.typing.title')}</span>
                    <input type="text" className="input" onInput={this.onChangeText}  placeholder={intl.get('fontmanager.menubar.typing.inputText.placeholder')} />
                    <div style={ styles.colorBlock }>
                        <div style={ styles.swatch } onClick={ this.handleClickForeground}>
                            <div style={ styles.color } />
                        </div>
                        { 
                            this.state.displayColorPickerForeground ? 
                            <div style={ styles.popover }><div style={ styles.cover } onClick={ this.handleCloseForeground }/>
                                <SketchPicker color={ this.state.color } onChange={ this.onChangeForeground } />
                            </div> 
                            : null 
                        }
                    </div>
                    <div style={ styles.colorBlock }>
                        <div style={ styles.swatch } onClick={ this.handleClickBackground}>
                            <div style={ styles.backgroundColor } />
                        </div>
                        { 
                            this.state.displayColorPickerBackground ? 
                            <div style={ styles.popover }><div style={ styles.cover } onClick={ this.handleCloseBackground }/>
                                <SketchPicker color={ this.state.backgroundColor } onChange={ this.onChangeBackground } />
                            </div> 
                            : null 
                        }
                    </div>
                    
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