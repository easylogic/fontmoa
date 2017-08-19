
import React, { Component } from 'react';
import './default.css';

class EmojiList extends Component {

    constructor() {
        super()

        this.state = {
            selectedUnicode : {id: ''}
        }
    }

    onClickGlyfItem = (e) => {
        const id = e.target.getAttribute('data-id');

        const list = this.props.glyf.filter((it) => it.id === id)

        this.setState({
            selectedUnicode : list[0]
        })
        this.props.changeSelectedGlyf(list[0])
    }

    render() {

        return (
            <div className='emoji-glyf-list-manager'>
                <div className="emoji-glyf-list" onClick={this.onClickGlyfItem}>
                {
                    this.props.glyf.map((emo, index) => {

                        const char = emo.emoji;
                        const selected = emo && this.state.selectedUnicode && emo.id === this.state.selectedUnicode.id;

                        return (<div key={index} title={emo.description} className="emoji-glyf-item" data-selected={selected} data-id={emo.id} >{char}</div>)
                    })
                }

                </div>
            </div>
        )
    }
}

export default EmojiList 