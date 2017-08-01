
import React, { Component } from 'react';
import './default.css';

import common from '../../../util/common'

class FontList extends Component {

    onClickFontItem = (font) => {
        return () => {
            this.props.refreshGlyf(font);
        }
    }

    createFontNames = (font) => {
        return (
            <ul className="font-tree-node submenu">
            {font.files.map((f, index) => {
                const style = {
                    fontFamily: common.getFontFamilyCollect(f)
                };
                
                if (f.italic) {
                    style.fontStyle = 'italic';
                }

                if (f.bold) {
                    style.fontWeight = 'bold'
                } else {
                    style.fontWeight = 'normal'
                }

                return (
                    <li key={index} onClick={this.onClickFontItem(f)}><a style={style}> {f.currentFamilyName} </a></li>
                )
            })}
            </ul>
        )
    }

    createFontList = (font, index) => {
        return (
            <div className="font-tree-item vmenu flat" key={index}>
                <a className="font-tree-node parent"><a >{font.name}</a></a>
                {this.createFontNames(font)}
            </div>
        )
    }

    render() {
        return (
            <div className="font-tree">
                {this.props.fontTree.map((font, index) => {
                    return this.createFontList(font, index)
                })}
            </div>
        )
    }
}

export default FontList 