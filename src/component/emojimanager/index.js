
import React, { Component } from 'react';
import './default.css';

import EmojiList from './emojilist'
import EmojiInfo from './emojiinfo'
import FontList from './fontlist'

import emoji from '../../util/emoji'

class EmojiManager extends Component {
 constructor () {
    super();

    const emojiTags = emoji.getEmojiTagList();
    const emojiTree = emoji.getEmojiList();
    const emojiTagsKeys = Object.keys(emojiTags).sort((a, b) => {
      return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
    });
    const emojiKeys = Object.keys(emojiTree);
    const selectedEmojiKey = emojiKeys[0];
    const selectedEmojiTag = emojiTagsKeys[0];
    const filteredEmoji = emojiTree[selectedEmojiKey];

    this.state = { 
      emojiTags,
      emojiTagsKeys,
      selectedEmojiTag,
      emoji : emojiTree,
      emojiKeys,
      selectedEmojiKey,
      selectedEmoji : filteredEmoji[0],
      filteredEmoji,
    }

  }

  changeSelectedGlyf = (emoji) => {
    if (emoji) {
      this.setState({
        selectedEmoji : emoji
      })
      this.props.appendInputText(emoji.emoji);
    }

  }

  refreshEmoji = (emojiKey) => {
    const selectedEmojiKey = emojiKey;
    const filteredEmoji = this.state.emoji[selectedEmojiKey];
    const selectedEmoji = filteredEmoji[0];
    this.setState({ 
      selectedEmojiKey,
      filteredEmoji,
      selectedEmoji,
    })
  }

  refreshEmojiTagKey = (emojiTagKey) => {
    const selectedEmojiTagKey = emojiTagKey;
    const filteredEmoji = this.state.emojiTags[emojiTagKey];
    const selectedEmoji = filteredEmoji[0];
    this.setState({ 
      selectedEmojiTagKey,
      filteredEmoji,
      selectedEmoji,
    })
  }  

  render() {
    return (
        <div className="window hide emojimanager-window">
          <div className="em-emoji-list">
            <EmojiList 
                selectedEmoji={this.state.selectedEmoji} 
                glyf={this.state.filteredEmoji} 
                changeSelectedGlyf={this.changeSelectedGlyf}
            />
          </div>
          <div className="em-font-list">
            <FontList  
              mini={this.props.mini}
              selectedEmojiTagKey={this.state.selectedEmojiTagKey} 
              selectedEmojiKey={this.state.selectedEmojiKey}
              refreshEmojiTagKey={this.refreshEmojiTagKey} 
              refreshEmoji={this.refreshEmoji} 
              emojiKeys={this.state.emojiKeys} 
              emojiTagsKeys={this.state.emojiTagsKeys}
            />
          </div>
          <div className="em-emoji-info">
            <EmojiInfo 
              selectedEmoji={this.state.selectedEmoji} 
              refreshEmojiTagKey={this.refreshEmojiTagKey} 
            />
          </div>
        </div>
    );
  }
}

export default EmojiManager; 
