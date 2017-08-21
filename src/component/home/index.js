
import React, { Component } from 'react';
import './default.css';

import {
  Window,
  List
} from '../common'


class Home extends Window {

  constructor (props) {
    super(props);

    this.state = {
      items : [
        { title : 'Category', value : 'category', tools : [
          {type: 'badge', value: '0'}, 
          'reload',
          'arrow'
        ] },
        { title : 'Fonts', value : 'font' },
        { title : 'Font Info', value : 'fontinfo' },
        { title : 'Glyf', value : 'glyf' },
        { title : 'Google Fonts', value : 'googlefont' },
        { title : 'Style', value : 'style' },
      ]
    }
  }

  onClickListItem = (item) => {
    this.props.showWindow(item.value);
  }

  render() {

    return (
        <div className="window home-window">
          <List items={this.state.items} onClick={this.onClickListItem} />
        </div>
    );
  }
}

export default Home; 
