import React, { Component } from 'react';
import Observer from 'react-intersection-observer'
import './default.css';

import { common, cssMaker, db} from '../../../util'
import LabelInput from '../LabelInput'

const {shell} = window.require('electron');

const path = window.require('path');


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
        
        db.toggleFavorite(fileId, isToggleSelected)

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
        db.toggleActivation(fileId, isActive)


        let fontObj = this.state.fontObj;
        fontObj.activation = isActive;

        this.setState({ fontObj })
    }

    loadFontCss = (inView) => {
        if (inView) {
            if (common.isInSystemFolders(this.state.fontObj.file) === false) {
                const css = cssMaker.createFontCss(this.state.fontObj);
                cssMaker.loadCss(css)
            }
        }
    }

    refreshFont = (e) => {
        let node = e.target.querySelector('.material-icons');
        node.classList.add('spin')
        db.updateFontFile(this.state.fontObj.file, () => {
            console.log('font update is done', this.state.fontObj.file);
            setTimeout(() => node.classList.remove('spin') , 1000);
        })
        
    }

    openFontFile = (e) => {
        shell.openItem(this.state.fontObj.file); 
    }

    changeFontSize = (e) => {
        const fontSize = parseInt(e.target.value, 10);
        this.setState({ fontSize })
    }

    setNames = (font, key, result) => {
        const lang = font.currentLanguage;        
        if (font.name[key]) {
            result[key] = font.name[key][lang] || font.name[key]['en'];
        }

        if (result[key] && typeof result[key] === 'object') {
            const arr = Object.keys(result[key]).map(v => v);
            result[key] = (new TextDecoder('utf-8')).decode(new Uint8Array(arr));
        }
    }

    static FIELDS = ['license', 'licenseURL', 'designer', 'designerURL', 'copyright']

    getFontNames = (font) => {
        let result = {};

        LocalFontItem.FIELDS.forEach(key => {
            this.setNames(font, key, result);
        })

        return result; 
    }

    getDescriptionItem = (names) => {

        return Object.keys(names).map((key, index) => {
            if (key === 'license') {
                return (
                    <div key={index} className="desc-item">
                        <a href={names.licenseURL} target="_license">
                            <i className="material-icons">turned_in_not</i>
                            {names.license}
                        </a>
                    </div>)
            }  else if (key === 'designer') {
                return <div key={index} className="desc-item"><a href={names.designerURL} target="_designer"><i className="material-icons">turned_in_not</i> {names.designer}</a></div>
            }  else if (key === 'copyright') {
                return <div key={index} className="desc-item">{names.copyright}</div>
            }
            return "";
        })
    }

    getDirectoryName = () => {
        const dirname = path.dirname(this.state.fontObj.file);
        return dirname; 
        /*
        const directoryName = path.join(path.basename(path.dirname(dirname)) , path.basename(dirname)); 

        return directoryName;
        */
    }
    
    render () {

        const fontObj = this.state.fontObj;
        const dirname = this.getDirectoryName();
        const font = fontObj.font; 
        const style = Object.assign({ 
            fontSize : this.state.fontSize + 'px' 
        }, font.collectStyle);

        let message = common.getPangramMessage(font.currentLanguage); 

        let favoriteClass = "add-favorite";
        let favoriteIcon = (<i className="material-icons small">favorite_border</i>)
        //let activeClass = "activation";

        if (fontObj.favorite) {
            favoriteClass += " selected";
            favoriteIcon = (<i className="material-icons small">favorite</i>);
        }

        /*
        if (fontObj.activation) {
            activeClass += " selected";
        } */       

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
                <div className="directory-name">{dirname}</div>                
                <div ref="description" className="font-description" title="Font Description"> 
                    {this.getDescriptionItem(names)}
                </div>
                
                <div className="tools">
                    <span onClick={this.refreshFont} title="Refresh Font Information"><i className="material-icons">autorenew</i></span>
                    <span onClick={this.toggleDescription} title="Open Description"><i className="material-icons">apps</i></span>
                    <span className={favoriteClass}  onClick={this.toggleFavorite} title="Add Favorite">{favoriteIcon}</span>
                    <span className="divider">|</span>
                    <span onClick={this.openFontFile} title="Open Font File"><i className="material-icons">open_in_browser</i></span>
                </div>
                {/*
                <div className="activation">
                    <span className={activeClass} onClick={this.toggleActivation} title="Activation">●</span>
                </div>*/}

                <div className="font-item-preview" style={style} title="Click If write a text">
                    <div ref="message" className="message" contentEditable={true} dangerouslySetInnerHTML={{__html : message}} />
                </div>
                <LabelInput fontObj={fontObj} labels={fontObj.labels}/>
                <div className="toolbar">
                    <input type="range" max="250" min="10" defaultValue={this.state.fontSize} onChange={this.changeFontSize} />
                </div>                
            </Observer>
        )
    }
 
}

export default LocalFontItem 