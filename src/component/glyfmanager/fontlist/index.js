import intl from 'react-intl-universal'
import React, { Component } from 'react';
import './default.css';

class FontList extends Component {

    constructor (props) {
        super(props)

        this.state = {
            specialChars: this.createSpecialChars(),
            selectedFont : this.props.selectedFont
        }
    }

    getMessage = (key) => {
        if (
            key === 'glyfmanager.fontlist.specialChars.title'
            || key === 'fontmanager.category.system.folder.name'
        ) {
            return intl.get(key);
        }

        return key; 
    }

    createSpecialChars = () => {
        return { 
            type : 'specialChars', 
            name: 'glyfmanager.fontlist.specialChars.title',                 
            files : [
                { 
                    type : 'specialChars',
                    currentFamilyName: 'glyfmanager.fontlist.specialChars.title', 
                    item : { path : ''},
                    collectStyle : {
                        fontFamily : ''
                    }
                }
            ]
        };
    }

    onClickFontItem = (font) => {
        return (e) => {

            this.setState({ selectedFont : font  })
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

                const message = this.getMessage(f.currentFamilyName) ;

                return (
                    <li 
                        className={className} 
                        key={index} 
                        onClick={this.onClickFontItem(f, index)}
                    >
                        <a style={style} href={`#${message}`}>{message}</a>
                    </li>
                )
            })}
            </ul>
        )
    }

    createFontList = (font, index) => {
        return (
            <div className="font-tree-item vmenu flat" key={index}>
                {font.type === 'specialChars' ? '' : <a className="font-tree-node parent"> {this.getMessage(font.name)} </a>}
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