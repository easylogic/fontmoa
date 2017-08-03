
import React, { Component } from 'react';
import './default.css';

class FontList extends Component {

    constructor (props) {
        super(props)

        this.state = {
            specialChars: { 
                type : 'specialChars', 
                name: '특수문자',                 
                files : [
                    { 
                        type : 'specialChars',
                        currentFamilyName: '특수문자', 
                        item : { path : ''},
                        collectStyle : {
                            fontFamily : 'serif, sans-serif'
                        }
                    }
                ]
            },
            selectedFont : this.props.selectedFont
        }
    }

    onClickFontItem = (font) => {
        return () => {
            this.setState({
                selectedFont : font 
            })
            this.props.refreshGlyf(font);
        }
    }

    createFontNames = (font) => {
        return (
            <ul className="font-tree-node child submenu">
            {font.files.map((f, index) => {
                const style = f.collectStyle;
                
                let className = "";

                if (this.state.selectedFont && this.state.selectedFont.item && this.state.selectedFont.item.path === f.item.path ) {
                    className += " active";
                }

                return (
                    <li className={className} key={index} onClick={this.onClickFontItem(f, index)}><a style={style}> {f.currentFamilyName} </a></li>
                )
            })}
            </ul>
        )
    }

    createFontList = (font, index) => {
        return (
            <div className="font-tree-item vmenu flat" key={index}>
                {font.type === 'specialChars' ? '' : <a className="font-tree-node parent">{font.name}</a>}
                {this.createFontNames(font)}
            </div>
        )
    }

    render() {
        return (
            <div className="font-tree">
                {this.createFontList(this.state.specialChars, 0)}
                {this.props.fontTree.map((font, index) => {
                    return this.createFontList(font, index)
                })}
            </div>
        )
    }
}

export default FontList 