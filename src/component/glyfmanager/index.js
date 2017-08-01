
import React, { Component } from 'react';
import './default.css';

import {TabItem} from '../../jui'

import GlyfList from './glyflist'
import FontList from './fontlist'

import fontdb  from '../../util/fontdb'

class GlyfManager extends Component {
 constructor () {
    super();

    this.state = { 
      selectedFont : {},
      fontTree : [], 
      favorite : [],
      glyf :[]
    }

    this.refreshFontTree()
  }

  
  refreshGlyf = (f) => {

    this.updateGlyf(f.item.path);
    this.setState({
      selectedFont: f
    })
  }

  updateGlyf = (path) => {
    fontdb.glyfInfo(path, (glyf) => {
        this.setState({
          glyf : glyf
        })
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
            <GlyfList   selectedFont={this.state.selectedFont}   glyf={this.state.glyf}/>
          </div>
          <div className="gm-font-list">
            <FontList  selectedFont={this.state.selectedFont} refreshGlyf={this.refreshGlyf} fontTree={this.state.fontTree}/>
          </div>
        </TabItem>
    );
  }
}

export default GlyfManager; 
