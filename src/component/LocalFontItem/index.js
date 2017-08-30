import React, { Component } from 'react';
import { render } from 'react-dom'
import Observer from 'react-intersection-observer'
import './default.css';

import { common, cssMaker, fontdb, googlefont} from '../../util'

import LabelInput from '../LabelInput'


class LocalFontItem extends Component {


    constructor (props) {
        super(props);
        this.state = {
            fontObj: this.props.fontObj,
            fontListContentStyle : this.props.fontListContentStyle,
            fontStyle : this.props.fontStyle,
        }
    }

    toggleFavorite = (e) => {

        const isToggleSelected = !this.state.fontObj.favorite;
        const fileId = this.state.fontObj._id;
        
        fontdb.toggleFavorite(fileId, isToggleSelected)

        this.setState({
            fontObj : { favorite :  isToggleSelected }
        })

    }

    toggleActivation = (e) => {
        const isActive = !this.state.fontObj.activation;
        const fileId = this.state.fontObj._id;
        
        // update file info 
        fontdb.toggleActivation(fileId, isActive)

        // modify state 
        this.setState({
            fontObj : { activation :  isActive }
        })

    }

    loadFontCss = (inView, path, font) => {
        if (inView) {
            if (common.isInSystemFolders(path) === false) {
                const css = cssMaker.createFontCss(path, font);
                cssMaker.loadCss(css)
            }

        }

    }

    refreshFontContent = (content) => {
        this.refs.message.textContent = content; 
    }
    
    render () {

        const fontObj = this.state.fontObj;
        const fontStyle = this.state.fontStyle;
        const contentStyle = this.state.fontListContentStyle;
        const font = fontObj.font; 
        const style = Object.assign({}, font.collectStyle);
        const isGrid = contentstyle === 'grid';

        let message = fontStyle.content || common.getPangramMessage(font.currentLanguage, isGrid); 

        let favoriteClass = "add-favorite";
        let favoriteIcon = (<i className="material-icons small">favorite_border</i>)
        let activeClass = "activation";

        if (fontObj.favorite) {
            favoriteClass += " selected";
            favoriteIcon = (<i className="material-icons small">favorite</i>);
        }

        if (fontObj.activation) {
            activeClass += " selected";
        }        

        return (
            <div className="local-font-item" >
                <div className="font-info">
                    <div className="font-family" title={font.subfamilyName}>
                        {font.currentFamilyName}
                        <span className="font-sub-family">({font.subfamilyName})</span>
                    </div>
                </div>
                <div className="tools">
                    <span className={favoriteClass}  onClick={this.toggleFavorite} title="Add Favorite">{favoriteIcon}</span>
                </div>
                <div className="activation">
                    <span className={activeClass} onClick={this.toggleActivation} title="Activation">●</span>
                </div>                    

                <div className="font-item-preview" style={style}>
                    <div ref="message">{message}</div>
                </div>
                <LabelInput file={fontObj.file} labels={fontObj.labels}/>
            </div>
        )
    }
 
}

export default LocalFontItem 