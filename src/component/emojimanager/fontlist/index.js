
import React, { Component } from 'react';
import './default.css';

class FontList extends Component {

    constructor (props) {
        super(props)

        this.state = {
            selectedEmojiKey : this.props.selectedEmojiKey,
            selectedEmojiTag : this.props.selectedEmojiTag, 
            filterKey : '',
        }
    }

    onInputSearchText = (e)  => {
        this.setState({
            filterKey : e.target.value.trim()
        })
    }

    onClickEmojiItem = (emojiKey) => {
        return () => {
            this.setState({
                selectedEmojiKey : emojiKey,
            })
            this.props.refreshEmoji(emojiKey);
        }
    }

    onClickEmojiTag = (emojiTagKey) => {
        return () => {
            this.setState({
                selectedEmojiTagKey : emojiTagKey,
            })
            this.props.refreshEmojiTagKey(emojiTagKey);
        }
    }    

    createEmojiList = (emojiKey, index) => {

        let className = "emoji-tree-node cate";

        if (this.state.selectedEmojiKey === emojiKey) {
            className += " active";
        }

        if (this.state.filterKey !== '' && emojiKey.includes(this.state.filterKey) === false) {
            className += " hide";
        }

        return (
            <a key={index} className={className} onClick={this.onClickEmojiItem(emojiKey)}>{emojiKey}</a>
        )
    }

    createEmojiTagList = (emojiTagKey, index) => {

        let className = "emoji-tree-node tag";

        if (this.state.selectedEmojiTagKey === emojiTagKey) {
            className += " active";
        }

        if (this.state.filterKey !== '' && emojiTagKey.includes(this.state.filterKey) === false) {
            className += " hide";
        }        

        return (
            <a key={index} className={className} onClick={this.onClickEmojiTag(emojiTagKey)}>{emojiTagKey}</a>
        )
    }    

    render() {
        return (
            <div className="emoji-category-list-container">
                <div className="emoji-key-search">
                    <input type="search" onInput={this.onInputSearchText} placeholder="어떤 Emoji 를 찾으시나요?" />
                </div>
                <div className="emoji-tree">
                    <div className="emoji-tree-level">
                        <div className="title">Categories</div>                
                        {this.props.emojiKeys.map((emojiKey, index) => {
                            return this.createEmojiList(emojiKey, index)
                        })}
                    </div>
                    <div className="emoji-tree-level">
                        <div className="title">Tags</div>
                        {this.props.emojiTagsKeys.map((emojiTagKey, index) => {
                            return this.createEmojiTagList(emojiTagKey, index)
                        })}                
                    </div>
                </div>
            </div>
        )
    }
}

export default FontList 