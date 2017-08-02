
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

import GlyfList from './glyflist'
import GlyfInfo from './glyfinfo'
import FontList from './fontlist'

import fontdb  from '../../util/fontdb'
import unicode from '../../util/unicode'

class GlyfManager extends Component {
 constructor () {
    super();

    this.state = { 
      blockList: [],
      selectedBlock: {},
      selectedFont : {},
      fontTree : [], 
      favorite : [],
      glyf :[],
      selectedGlyf: 0,
      filteredGlyf: [] ,
    }

    this.refreshFontTree()
  }

  
  refreshGlyf = (f) => {
    this.updateGlyf(f.item.path);
    this.setState({
      selectedFont: f
    })
  }

  filterGlyf = (index, glyf) => {
    const block = unicode.getBlockForIndex(index);
    return glyf.filter((unicode) => {
      return block.start <= unicode && unicode <= block.end; 
    })
  }

  changeUnicodeBlock = (blockIndex) => {
    this.setState({
      filteredGlyf : this.filterGlyf(blockIndex, this.state.glyf),
    })
  }

  changeSelectedGlyf = (unicode) => {
    this.setState({
      selectedGlyf : unicode,
    })
  }

  updateUnicodeBlock = (glyf) => {
    const blockList = unicode.checkBlockList(glyf);

    this.setState({
      glyf: glyf,
      filteredGlyf : this.filterGlyf(0, glyf),
      blockList: blockList,
      selectedBlock: blockList[0]
    })
  }

  updateGlyf = (path) => {
    fontdb.glyfInfo(path, (glyf) => {
        this.updateUnicodeBlock(glyf);
    })
  }

  refreshFontTree = () => {
    fontdb.fontTree((tree) => {
      this.setState({
        fontTree: tree
      })
    })
  }

  render() {

    return (
        <TabItem active={this.props.active}>
          <div className="gm-glyf-list">
            <GlyfList changeSelectedGlyf={this.changeSelectedGlyf} changeUnicodeBlock={this.changeUnicodeBlock} selectedBlock={this.state.selectedBlock} blockList={this.state.blockList} selectedFont={this.state.selectedFont}   glyf={this.state.filteredGlyf}/>
          </div>
          <div className="gm-font-list">
            <FontList  selectedFont={this.state.selectedFont} refreshGlyf={this.refreshGlyf} fontTree={this.state.fontTree}/>
          </div>
          <div className="gm-glyf-info">
            <GlyfInfo selectedGlyf={this.state.selectedGlyf} selectedFont={this.state.selectedFont} />
          </div>
        </TabItem>
    );
  }
}

export default GlyfManager; 
