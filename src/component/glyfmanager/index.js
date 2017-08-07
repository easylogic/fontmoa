
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

    this.cacheSpecialChars = {};

    this.initFontTree();

  }

  initFontTree = () => {
    fontdb.fontTree((tree) => {
      const fontTree = tree; 
      const f = fontTree[0].files[0];

      if (f) {
        fontdb.glyfInfo(f.item.path, (glyf) => {
          const blockList = unicode.checkBlockList(glyf);
          const selectedBlock = blockList[0];
          const filteredGlyf = this.filterGlyf(selectedBlock.index, glyf);
          this.setState({
            fontTree,
            selectedFont : f,
            glyf,
            filteredGlyf,
            blockList,
            selectedBlock,
          })

        })
      }


    })
  }

  
  refreshGlyf = (f) => {
    this.updateGlyf(f.item.path);
    this.setState({
      selectedFont: f
    })
  }

  filterGlyf = (index, glyf) => {
    const block = unicode.getBlockForIndex(index);

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
        this.insertFontFaceCss(css);
        this.updateUnicodeBlock(glyf);
    })
  }

  insertFontFaceCss = (css) => {

    if (!document.getElementById(css.fontFamily)) {
      // css 로드 
      let link = document.createElement('link');
      link.id = css.fontFamily;
      link.rel = 'stylesheet';
      link.href =  css.csspath;
      document.head.appendChild(link);
    }
  }

  refreshFontTree = () => {
    fontdb.fontTree((tree) => {
      const fontTree = tree; 

      this.setState({
        fontTree,
      })

      this.refreshGlyf(fontTree[0].files[0]);
    })
  }

  setActive = (id) => {
    this.refs.tabItem.setActive(id);
  }  

  render() {
    return (
        <TabItem ref="tabItem" id={this.props.id} active={this.props.active}>
          <div className="gm-glyf-list">
            <GlyfList changeSelectedGlyf={this.changeSelectedGlyf} changeUnicodeBlock={this.changeUnicodeBlock} selectedBlock={this.state.selectedBlock} blockList={this.state.blockList} selectedFont={this.state.selectedFont}   glyf={this.state.filteredGlyf}/>
          </div>
          <div className="gm-font-list">
            <FontList  selectedFont={this.state.selectedFont} refreshGlyf={this.refreshGlyf} fontTree={this.state.fontTree}/>
          </div>
          <div className="gm-glyf-info">
            <GlyfInfo ref="glyfInfo" selectedGlyf={this.state.selectedGlyf} selectedFont={this.state.selectedFont} />
          </div>
        </TabItem>
    );
  }
}

export default GlyfManager; 
