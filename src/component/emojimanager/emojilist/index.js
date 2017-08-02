
import React, { Component } from 'react';
import './default.css';

import common from '../../../util/common'

class EmojiList extends Component {

    constructor() {
        super()

        this.state = {
            selectedUnicode : 0
        }
    }

    onClickGlyfItem = (e) => {
        const unicode = parseInt(e.target.getAttribute('data-unicode'), 10) || 0;
        this.setState({
            selectedUnicode : unicode
        })
        this.props.changeSelectedGlyf(unicode)
    }

    render() {
        return (
            <div className='glyf-list-manager'>
                <div className="glyf-list" onClick={this.onClickGlyfItem}>
                {
                    this.props.glyf.map((unicode, index) => {
                        const isStart = index % 7 === 0;
                        const char = String.fromCodePoint(unicode) || "";
                        const code = '\\u' + unicode.toString(16); 

                        const selected = unicode === this.state.selectedUnicode;

                        return <div key={index} className="glyf-item" data-selected={selected} data-is-start={isStart} data-unicode={unicode} data-char={code}>{char}</div>
                    })
                }

                </div>
            </div>
        )
    }
}

export default EmojiList 