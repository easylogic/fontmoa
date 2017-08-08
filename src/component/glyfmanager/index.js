
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

import GlyfList from './glyflist'
import GlyfInfo from './glyfinfo'
import FontList from './fontlist'

import fontdb  from '../../util/fontdb'
import unicode from '../../util/unicode'
import common from '../../util/common'

class GlyfManager extends Component {
 constructor () {
    super();

    const specialChars = common.createSpecialChars();

    this.state = { 
      specialChars : specialChars,
      blockList: [],
      selectedBlock: {},
      selectedFont : specialChars.files[0],
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
      const font = fontTree[0].files[0];

      if (font) {
        fontdb.glyfInfo(font.item.path, (glyf) => {
          const blockList = unicode.checkBlockList(glyf);
          const selectedBlock = blockList[0];
          const filteredGlyf = this.filterGlyf(selectedBlock.index, glyf);
          this.setState({
            fontTree,
            //f : font,       // 제일 처음에는 특수문자를 보여줄꺼라 font 를 설정하지 않음. 
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
      if (glyf.length > 0) {
        this.insertFontFaceCss(css);
      }
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
        <TabItem ref="tabItem"  id={this.props.id} active={this.props.active}>
          <div className="gm-glyf-list">
            <GlyfList changeSelectedGlyf={this.changeSelectedGlyf} changeUnicodeBlock={this.changeUnicodeBlock} selectedBlock={this.state.selectedBlock} blockList={this.state.blockList} selectedFont={this.state.selectedFont}   glyf={this.state.filteredGlyf}/>
          </div>
          <div className="gm-font-list">
            <FontList specialChars={this.state.specialChars} selectedFont={this.state.selectedFont} refreshGlyf={this.refreshGlyf} fontTree={this.state.fontTree}/>
          </div>
          <div className="gm-glyf-info">
            <GlyfInfo ref="glyfInfo" selectedGlyf={this.state.selectedGlyf} selectedFont={this.state.selectedFont} />
          </div>
        </TabItem>
    );
  }
}

export default GlyfManager; 
