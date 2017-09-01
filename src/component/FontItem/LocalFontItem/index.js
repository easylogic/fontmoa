import React, { Component } from 'react';
import Observer from 'react-intersection-observer'
import './default.css';

import { common, cssMaker, fontdb} from '../../../util'

import LabelInput from '../LabelInput'


class LocalFontItem extends Component {


    constructor (props) {
        super(props);
        this.state = {
            fontObj: this.props.fontObj,
            fontSize: 40
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

    toggleDescription = (e) => {
        this.refs.description.classList.toggle('open');
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

    refreshFont = () => {
        fontdb.updateFontFile(this.state.fontObj.file, () => {
            console.log('font update is done', this.state.fontObj.file);
        })
        
    }

    changeFontSize = (e) => {
        const fontSize = parseInt(e.target.value, 10);
        this.setState({ fontSize })
    }

    getFontNames = (font) => {
        let result = {};
        const lang = font.currentLanguage;

        if (font.name.license) {
            result.license = font.name.license[lang] || font.name.license['en'];
        }

        if (font.name.licenseURL) {
            result.licenseURL = font.name.licenseURL[lang] || font.name.licenseURL['en'];
        }

        if (font.name.copyright) {
            result['Copyright'] = font.name.copyright[lang] || font.name.copyright['en'];
        }        

        return result; 
    }
    
    render () {

        const fontObj = this.state.fontObj;
        const font = fontObj.font; 
        const style = Object.assign({ 
            fontSize : this.state.fontSize + 'px' 
        }, font.collectStyle);

        let message = common.getPangramMessage(font.currentLanguage); 

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

        const names = this.getFontNames(fontObj.font);

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
                <div ref="description" className="font-description" title="Font Description"> 
                    {Object.keys(names).map((key, index) => {

                        if (key === 'license') {
                            return <div key={index} className="desc-item"><a href={names.licenseURL} target="_license"><i className="material-icons">turned_in_not</i> {names.license}</a></div>
                        }  else if (key === 'Copyright') {
                            return <div key={index} className="desc-item">{names[key]}</div>
                        }
                        return "";
                    })}
                </div>
                
                <div className="tools">
                    <span onClick={this.refreshFont} title="Refresh Font Information"><i className="material-icons">refresh</i></span>
                    <span onClick={this.toggleDescription} title="Open Description"><i className="material-icons">apps</i></span>
                    <span className={favoriteClass}  onClick={this.toggleFavorite} title="Add Favorite">{favoriteIcon}</span>
                </div>
                <div className="activation">
                    <span className={activeClass} onClick={this.toggleActivation} title="Activation">●</span>
                </div>                    

                <div className="font-item-preview" style={style} title="Click If write a text">
                    <div ref="message" className="message" contentEditable={true} dangerouslySetInnerHTML={{__html : message}} />
                </div>
                <LabelInput fontObj={fontObj} labels={fontObj.labels}/>
                <div className="toolbar">
                    <input type="range" max="250" min="5" defaultValue={this.state.fontSize} onChange={this.changeFontSize} />
                </div>                
            </Observer>
        )
    }
 
}

export default LocalFontItem 