import intl from 'react-intl-universal'
import React, { Component } from 'react';
import './default.css';

class FontList extends Component {

    constructor (props) {
        super(props)

        this.state = {
            specialChars: this.props.specialChars,
            selectedFont : this.props.selectedFont
        }
    }

    componentWillMount = () => {
        this.props.refreshGlyf(this.state.selectedFont);
    }


    onChangeUnicodeBlock = (e) => {
        this.props.changeUnicodeBlock(+e.target.getAttribute('data-value'));
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


    onClickFontItem = (font) => {
        return (e) => {

            this.setState({ selectedFont : font  })
            this.props.refreshGlyf(font);
        }
    }

    render() {
        return (
            <div className="font-tree" onClick={this.onChangeUnicodeBlock}>
            {
                this.props.blockList.map((block, index) => {
                    const arr = Object.keys(block.alias);
                    let name = block.name;                            
                    if (arr.length) {
                        name = block.alias[arr[0]]
                    }
                    return (<div className="font-tree-item " key={index} data-value={block.index}>{name}</div>)
                })
            }
            </div>
        )
    }
}

export default FontList 