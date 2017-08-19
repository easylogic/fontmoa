
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

import GlyfList from './glyflist'
import GlyfInfo from './glyfinfo'
import FontList from './fontlist'

import fontdb  from '../../util/fontdb'
import unicode from '../../util/unicode'
import common from '../../util/common'
import cssMaker from '../../util/cssMaker'

class GlyfManager extends Component {
 constructor () {
    super();

    const specialChars = common.createSpecialChars();

    this.state = { 
      specialChars : specialChars,
      blockList: [],
      selectedBlock: {},
      selectedFont : specialChars.files[0],
      favorite : [],
      glyf :[],
      selectedGlyf: 0,
      filteredGlyf: [] ,
    }

    this.cacheSpecialChars = {};

  }
  
  refreshGlyf = (f) => {
    this.updateGlyf(f.item.path);
    this.setState({
      selectedFont: f
    })
  }

  filterGlyf = (blockIndex, glyf) => {
    const block = unicode.getBlockForIndex(blockIndex);

    if (glyf.length) {
      return glyf.filter((unicode) => {
        return block.start <= unicode && unicode <= block.end;
      })
    } else {

      if (this.cacheSpecialChars[block.index]) {
        return this.cacheSpecialChars[block.index];
      }

      glyf = [];
      for(let start = block.start; start <= block.end; start++) {
        glyf[glyf.length] = start;
      }

      this.cacheSpecialChars[block.index] = glyf; 

      return glyf; 
    }
  }

  changeUnicodeBlock = (blockIndex) => {
    this.setState({
      filteredGlyf : this.filterGlyf(blockIndex, this.state.glyf),
    })
  }

  changeSelectedGlyf = (unicode, fontFamily) => {

    this.refs.glyfInfo.setState({
      selectedGlyf : unicode,
      selectedFont : this.state.selectedFont
    });

    this.props.appendInputText(String.fromCodePoint(unicode), fontFamily);

  }

  updateUnicodeBlock = (glyf) => {
    const blockList = unicode.checkBlockList(glyf);
    const selectedBlock = blockList[0];

    this.setState({
      glyf: glyf,
      filteredGlyf : this.filterGlyf(selectedBlock.index, glyf),
      blockList,
      selectedBlock,
    })
  }

  updateGlyf = (path) => {
    fontdb.glyfInfo(path, (font, css, glyf) => {
      if (glyf.length > 0 && common.isInSystemFolders(path) === false) {
        cssMaker.loadCss(css)
      }
      this.updateUnicodeBlock(glyf);              
    })
  }


  setActive = (id) => {
    this.refs.tabItem.setActive(id);    
  }  

  render() {
    return (
        <TabItem ref="tabItem"  id={this.props.id} active={this.props.active}>
          <div className="gm-glyf-list">
            <GlyfList 
                changeSelectedGlyf={this.changeSelectedGlyf} 
                selectedFont={this.state.selectedFont}   
                glyf={this.state.filteredGlyf}
            />
          </div>
          <div className="gm-font-list">
            <FontList 
              specialChars={this.state.specialChars} 
              selectedFont={this.state.selectedFont} 
              changeUnicodeBlock={this.changeUnicodeBlock}               
              selectedBlock={this.state.selectedBlock}               
              blockList={this.state.blockList} 
              refreshGlyf={this.refreshGlyf}
            />
          </div>
          <div className="gm-glyf-info">
            <GlyfInfo ref="glyfInfo" selectedGlyf={this.state.selectedGlyf} selectedFont={this.state.selectedFont} />
          </div>
        </TabItem>
    );
  }
}

export default GlyfManager; 
