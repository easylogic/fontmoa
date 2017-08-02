
import React, { Component } from 'react';
import './default.css';

class FontList extends Component {

    constructor (props) {
        super(props)

        this.state = {
            selectedEmojiKey : this.props.selectedEmojiKey
        }
    }

    onClickEmojiItem = (emojiKey) => {
        return () => {
            this.setState({
                selectedEmojiKey : emojiKey,
            })
            this.props.refreshEmoji(emojiKey);
        }
    }

    createEmojiList = (emojiKey, index) => {

        let className = "emoji-tree-node parent ";

        if (this.state.selectedEmojiKey == emojiKey) {
            className += " active";
        }

        return (
            <div className="emoji-tree-item vmenu flat" key={index}>
                <a className={className} onClick={this.onClickEmojiItem(emojiKey)}>{emojiKey}</a>
            </div>
        )
    }

    render() {
        return (
            <div className="emoji-tree">
                {this.props.emojiKeys.map((emojiKey, index) => {
                    return this.createEmojiList(emojiKey, index)
                })}
            </div>
        )
    }
}

export default FontList 