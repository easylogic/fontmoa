import intl from 'react-intl-universal'
import React, { Component } from 'react';
import './default.css';
import LabelInput from '../LabelInput'
import { font } from '../../../util'

/**
 * Free Font Item View 
 * 
 * @see README.md  in resources/fonts
 * 
 */
class FreeFontItem extends Component {

    constructor (props) {
        super(props);
        this.state = {
            fontObj: this.props.fontObj,
        }
    }

    
    toggleDescription = (e) => {
        this.refs.description.classList.toggle('open');
    }

    
    downloadUrl = (link) => {
        // 구글 early access 폰트, zip 파일로 압축된 폰트 다운로드 
        // 중복 체크         
        return (e) => {
            this.props.app.showLoading("Downloading...");

            font.downloadFile(link, () => {
                console.log('done');
                this.props.app.hideLoading(1000);
            });
        }
    }

    goUrl = (link, name) => {
        return () => {
            window.open(link, name || '_link');
        }
    }    

    getLicense = (fontObj) => {
        if (fontObj.license) {
            return <div className="desc-item"> {fontObj.license} - {fontObj.licenseDescription}</div>
        }

        return "";
    }

    getFontTitle = () => {
        const fontObj = this.state.fontObj; 

        let icon = "";
        
        if (fontObj.icon) {
            icon = <i key={0} className="material-icons">{fontObj.icon}</i> ;
        } else if (fontObj.iconImageUrl) {
            icon = <img key={1} alt="icon" src={fontObj.iconImageUrl} className="icon-image" />;
        } else {
            icon = <i key={2} className="material-icons">card_giftcard</i> ;
        }

        const linkText = [icon, <span key={4}>{fontObj.family} - {fontObj.name}</span>]

        if (fontObj.link) {
            return <a className="link" href={fontObj.link} target="_font_link">{linkText}</a>
        } else {
            return linkText
        }

    }

    getTools () { 
        const fontObj = this.state.fontObj; 
        let results = [];
        
        if (fontObj.downloadUrl) { 
            results.push(<span key={0} className="link" title="Font Download" onClick={this.downloadUrl(fontObj.downloadUrl)} >{intl.get('fontmanager.title.download')}</span>);
        }

        if (fontObj.license) {
            if (results.length) results.push(<span key={1} className="divider"></span>)
            results.push(<span key={2} className="link" onClick={this.toggleDescription} title="Open Description">{intl.get('fontmanager.title.detail')}</span>);
        }

        if (fontObj.licenseUrl) { 
            if (results.length) results.push(<span key={3} className="divider"></span>)            
            results.push(<span key={4} className="link" title="View License" onClick={this.goUrl(fontObj.licenseUrl, 'License')} >License</span>)
        }

        if (fontObj.buyUrl) {
            if (results.length) results.push(<span key={5} className="divider"></span>)            
            results.push(<span key={6} className="link" onClick={this.goUrl(fontObj.buyUrl, 'Buy')} >Buy</span>)
        }

        return results; 
    }
   
    render () {
           
        const fontObj = this.state.fontObj; 
        const preview = {__html : fontObj.description || ""}


        return (
            <div className="free-font-item">
                <div className="font-info">
                    <div className="font-family" title={fontObj.family}>
                        {this.getFontTitle()}                        
                    </div>
                </div> 
                <div className="tools">
                    {this.getTools()}
                </div>   
                <div ref="description" className="font-description" title="Font Description"> 
                    {this.getLicense(fontObj)}
                </div>       
                <div className="preview-image">
                    {fontObj.previewImage ? <img src={encodeURIComponent(fontObj.previewImage)} alt="Preview Font" /> : ""}
                </div>                         
                <div className="font-item-preview">
                    <div dangerouslySetInnerHTML={preview} />
                </div>
                <LabelInput fontObj={fontObj} labels={fontObj.labels} readonly={true}/>        
            </div>
        )
    }
 
}

export default FreeFontItem