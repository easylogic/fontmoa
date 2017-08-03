
import React, { Component } from 'react';
import './default.css';

class FontList extends Component {

    constructor (props) {
        super(props)

        this.state = {
            selectedEmojiKey : this.props.selectedEmojiKey,
            selectedEmojiTag : this.props.selectedEmojiTag, 
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

    onClickEmojiTag = (emojiTag) => {
        return () => {
            this.setState({
                selectedemojiTag : emojiTag,
            })
            this.props.refreshEmojiTag(emojiTag);
        }
    }    

    createEmojiList = (emojiKey, index) => {

        let className = "emoji-tree-node category parent ";

        if (this.state.selectedEmojiKey === emojiKey) {
            className += " active";
        }

        return (
            <div className="emoji-tree-item vmenu flat" key={index}>
                <a className={className} onClick={this.onClickEmojiItem(emojiKey)}>{emojiKey}</a>
            </div>
        )
    }

    createEmojiTagList = (emojiTagKey, index) => {

        let className = "emoji-tree-node tag parent ";

        if (this.state.selectedEmojiTagKey === emojiTagKey) {
            className += " active";
        }

        return (
            <div className="emoji-tree-item vmenu flat" key={index}>
                <a className={className} onClick={this.onClickEmojiTag(emojiTagKey)}>{emojiTagKey}</a>
            </div>
        )
    }    

    render() {
        return (
            <div className="emoji-tree">
                {this.props.emojiKeys.map((emojiKey, index) => {
                    return this.createEmojiList(emojiKey, index)
                })}
                {this.props.emojiTagsKeys.map((emojiTag, index) => {
                    return this.createEmojiTagList(emojiTag, index)
                })}                
            </div>
        )
    }
}

export default FontList 