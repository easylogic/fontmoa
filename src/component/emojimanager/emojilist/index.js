
import React, { Component } from 'react';
import './default.css';

class EmojiList extends Component {

    constructor() {
        super()

        this.state = {
            selectedUnicode : 0
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
            <div className='glyf-list-manager'>
                <div className="glyf-list" onClick={this.onClickGlyfItem}>
                {
                    this.props.glyf.map((emo, index) => {

                        const char = emo.emoji;
                        const selected = emo.id === this.state.selectedUnicode.id;

                        return (
                        <div key={index} className="glyf-item" data-selected={selected} data-id={emo.id} >
                            {char}
                            <div className='desc'>{emo.description}</div>
                        </div>)
                    })
                }

                </div>
            </div>
        )
    }
}

export default EmojiList 