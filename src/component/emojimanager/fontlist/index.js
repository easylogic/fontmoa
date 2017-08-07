import intl from 'react-intl-universal'
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

    checkHideList = (currentMessage, key) => {
        const hasCheckFilter = this.state.filterKey !== '';
        let hasEmojiKey = key.includes(this.state.filterKey) === false;
        
        const tempKey = currentMessage['emojimanager.fontlist.names.' + key];
        if (hasEmojiKey && tempKey) {
            hasEmojiKey = tempKey.includes(this.state.filterKey) === false;
        }

        return hasCheckFilter && hasEmojiKey;
    }

    createEmojiList = (emojiKey, index, currentMessage) => {

        let className = "emoji-tree-node cate node-" + index;

        if (this.state.selectedEmojiKey === emojiKey) {
            className += " active";
        }

        if (this.checkHideList(currentMessage, emojiKey)) {
            className += " hide";
        }

        const mini = this.props.mini || false; 

        let message = currentMessage['emojimanager.fontlist.names.' + emojiKey] || emojiKey;
        let title = message;
        if (mini) {
            message = "";
        } else {
            title = "";
        }

        return (
            <a key={index} className={className} title={title} onClick={this.onClickEmojiItem(emojiKey)}>{message}</a>
        )
    }

    createEmojiTagList = (emojiTagKey, index, currentMessage) => {

        let className = "emoji-tree-node tag";

        if (this.state.selectedEmojiTagKey === emojiTagKey) {
            className += " active";
        }

        if (this.checkHideList(currentMessage, emojiTagKey)) {
            className += " hide";
        }        

        return (
            <a key={index} className={className} onClick={this.onClickEmojiTag(emojiTagKey)}>{currentMessage['emojimanager.fontlist.names.' + emojiTagKey] || emojiTagKey}</a>
        )
    }    

    render() {
        const currentLocale = intl.options.currentLocale ;
        const locales = intl.options.locales;
        const currentMessage = locales[currentLocale];

        return (
            <div className="emoji-category-list-container">
                <div className="emoji-key-search">
                    <input type="search" onInput={this.onInputSearchText} placeholder={intl.get('emojimanager.fontlist.search.inputText.placeholder')}/>
                </div>
                <div className="emoji-tree">
                    <div className="emoji-tree-level">
                        <div className="title">{intl.get('emojimanager.fontlist.category.title')}</div>                
                        {this.props.emojiKeys.map((emojiKey, index) => {
                            return this.createEmojiList(emojiKey, index, currentMessage)
                        })}
                    </div>
                    <div className="emoji-tree-level tags">
                        <div className="title">{intl.get('emojimanager.fontlist.tag.title')}</div>
                        {this.props.emojiTagsKeys.map((emojiTagKey, index) => {
                            return this.createEmojiTagList(emojiTagKey, index, currentMessage)
                        })}                
                    </div>
                </div>
            </div>
        )
    }
}

export default FontList 