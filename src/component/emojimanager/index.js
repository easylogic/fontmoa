
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

import EmojiList from './emojilist'
import EmojiInfo from './emojiinfo'
import FontList from './fontlist'

import emoji from '../../util/emoji'

class EmojiManager extends Component {
 constructor () {
    super();

    const emojiTree = emoji.getEmojiList();
    const emojiKeys = Object.keys(emojiTree);
    const selectedEmojiKey = emojiKeys[0];
    const filteredEmoji = emojiTree[selectedEmojiKey];

    this.state = { 
      emoji : emojiTree,
      emojiKeys,
      selectedEmojiKey,
      selectedEmoji : filteredEmoji[0],
      filteredEmoji,
    }

  }

  changeSelectedGlyf = (emoji) => {
    this.setState({
      selectedEmoji : emoji
    })
    this.props.appendInputText(emoji.emoji);
  }

  refreshEmoji = (emojiKey) => {
    const selectedEmojiKey = emojiKey;
    const filteredEmoji = this.state.emoji[selectedEmojiKey];

    this.setState({ 
      selectedEmojiKey,
      filteredEmoji,
    })
  }

  render() {
    return (
        <TabItem active={this.props.active}>
          <div className="em-emoji-list">
            <EmojiList selectedEmoji={this.state.selectedEmoji} glyf={this.state.filteredEmoji} changeSelectedGlyf={this.changeSelectedGlyf}/>
          </div>
          <div className="em-font-list">
            <FontList  selectedEmojiKey={this.state.selectedEmojiKey} refreshEmoji={this.refreshEmoji} emojiKeys={this.state.emojiKeys}/>
          </div>
          <div className="em-emoji-info">
            <EmojiInfo selectedEmoji={this.state.selectedEmoji} />
          </div>
        </TabItem>
    );
  }
}

export default EmojiManager; 
