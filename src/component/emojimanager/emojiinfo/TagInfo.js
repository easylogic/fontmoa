import intl from 'react-intl-universal'
import React, { Component } from 'react';

class TagInfo extends Component {

    onClickLabelItem = (e) => {
        const emojiTagKey = e.target.getAttribute('data-tag');
        this.props.refreshEmojiTagKey(emojiTagKey);
    }

    render() {
        const currentLocale = intl.options.currentLocale ;
        const locales = intl.options.locales;
        const currentMessage = locales[currentLocale];

        return (
            <span className="description">
                {this.props.tags.map((tag, index) => {
                    const tagName = currentMessage['emojimanager.fontlist.names.' + tag] || tag;
                    return <span key={index} className="label small success" data-tag={tag} onClick={this.onClickLabelItem}>{tagName}</span>
                })}
            </span>
        )
    }
}

export default TagInfo 