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

    downloadFont = (e) => {
        const fontObj = this.state.fontObj; 

        this.props.app.showLoading("Downloading...");

        font.downloadFile(fontObj.downloadURL, fontObj.downloadFileName, () => {
            console.log('done');
            this.props.app.hideLoading(1000);
        });
    }

    goUrl = (link, name) => {
        window.open(link, name || '_link');
    }    

    goBuyLink = (e) => {
        this.goUrl(this.state.fontObj.buyURL, 'Buy');
    }

   
    getLicenseIcon = (license) => {
        if (license && license.indexOf('SIL') > -1 ) {
            return (<img className="license-icon" src='./license/OFLlogos/PNG/OFLLogoCircBW.png' alt="SIL, Open Font License" width="30px"/>)
        } else {
            return (<i className="material-icons license-icon">turned_in_not</i>)
        }
    }
    
    getDescriptionItem = (names) => {

        return Object.keys(names).map((key, index) => {
            if (key === 'license') {
                return (
                    <div key={index} className="desc-item">
                        <a href={names.licenseURL} target="_license">
                            {this.getLicenseIcon(names.license)} 
                            {names.license}
                        </a>
                    </div>)
            }  else if (key === 'designer') {
                return <div key={index} className="desc-item"><a href={names.designerURL} target="_designer"><i className="material-icons">turned_in_not</i> {names.designer}</a></div>
            }  else if (key === 'manufacturer') {
                return <div key={index} className="desc-item"><a href={names.vendorURL} target="_designer"><i className="material-icons">turned_in_not</i> {names.manufacturer}</a></div>                
            }  else if (key === 'copyright') {
                return <div key={index} className="desc-item">{names.copyright}</div>
            }

            return <div key={index} className="desc-item hide"></div>;
        })
    }


    getTools () { 
        const fontObj = this.state.fontObj; 
        let results = [];

        results.push(<span key={0} className="link" onClick={this.toggleDescription} title="Open Description">{intl.get('fontmanager.title.detail')}</span>)
        if (fontObj.downloadURL) { 
            results.push(<span key={1} className="link" title="Font Download" onClick={this.downloadFont} >{intl.get('fontmanager.title.download')}</span>);
        }

        if (fontObj.buyURL) {
            if (results.length) results.push(<span key={3} className="divider"></span>)            
            results.push(<span key={2} className="link" onClick={this.goBuyLink} >Buy</span>)
        }

        return results; 
    }
   
    render () {
           
        const fontObj = this.state.fontObj; 
        const preview = {__html : fontObj.names.description || ""}


        return (
            <div className="free-font-item">
                <div className="font-info">
                    <div className="font-family" title={fontObj.names.family}>
                        {this.getLicenseIcon(fontObj.names.license)} {fontObj.names.family} - {fontObj.title}             
                    </div>
                </div> 
                <div className="tools">
                    {this.getTools()}
                </div>   
                <div ref="description" className="font-description" title="Font Description"> 
                    {this.getDescriptionItem(fontObj.names)}
                </div>

                {fontObj.previewImage ?        
                    (<div className="preview-image">
                        <img src={encodeURIComponent(fontObj.previewImage)} alt="Preview Font" />
                    </div>)  : ""
                }       
                {preview ? 
                    (<div className="font-item-preview">
                        <div dangerouslySetInnerHTML={preview} />
                    </div>)
                     : ""
                }
                <LabelInput fontObj={fontObj} labels={fontObj.labels} readonly={true}/>        
            </div>
        )
    }
 
}

export default FreeFontItem