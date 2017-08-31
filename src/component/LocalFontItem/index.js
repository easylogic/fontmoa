import React, { Component } from 'react';
import Observer from 'react-intersection-observer'
import './default.css';

import { common, cssMaker, fontdb} from '../../util'

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

        let fontObj = this.state.fontObj;
        fontObj.favorite = isToggleSelected;

        this.setState({ fontObj })

    }

    toggleActivation = (e) => {
        const isActive = !this.state.fontObj.activation;
        const fileId = this.state.fontObj._id;
        
        // update file info 
        fontdb.toggleActivation(fileId, isActive)


        let fontObj = this.state.fontObj;
        fontObj.activation = isActive;

        this.setState({ fontObj })
    }

    loadFontCss = (inView) => {
        if (inView) {
            if (common.isInSystemFolders(this.state.fontObj.file) === false) {
                const css = cssMaker.createFontCss(this.state.fontObj.file, this.state.fontObj.font);
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
        const font = fontObj.font; 
        const style = Object.assign({}, font.collectStyle);

        let message = fontStyle.content || common.getPangramMessage(font.currentLanguage); 

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
            <Observer className="local-font-item" onChange={inView => this.loadFontCss(inView)}>
                <div className="font-info">
                    <div className="font-family" title={font.subfamilyName}>
                        {font.currentFamilyName}
                        <span className="font-sub-family">{ 
                            font.subfamilyName === 'Regular' ? "" : "(" + font.subfamilyName + ")"
                        }</span>
                    </div>
                </div>
                <div className="tools">
                    <span className={favoriteClass}  onClick={this.toggleFavorite} title="Add Favorite">{favoriteIcon}</span>
                </div>
                <div className="activation">
                    <span className={activeClass} onClick={this.toggleActivation} title="Activation">●</span>
                </div>                    

                <div className="font-item-preview" style={style}>
                    <div ref="message" contentEditable={true} dangerouslySetInnerHTML={{__html : message}} />
                </div>
                <LabelInput fontObj={fontObj} labels={fontObj.labels}/>
            </Observer>
        )
    }
 
}

export default LocalFontItem 