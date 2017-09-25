import intl from 'react-intl-universal'
import React, { Component } from 'react';
import './default.css';

import LabelInput from '../LabelInput'

import { googlefont } from '../../../util'

class GoogleEarlyAccessItem extends Component {

    constructor (props) {
        super(props);
        this.state = {
            fontObj: this.props.fontObj,
        }
    }
    
    downloadUrl = (link) => {
        // 구글 early access 폰트, zip 파일로 압축된 폰트 다운로드 
        // 중복 체크         
        return (e) => {
            let node = e.target.querySelector('.material-icons');
            node.textContent = "autorenew"
            node.classList.add('spin')

            this.props.app.showLoading('Downloading...');

            googlefont.downloadEarlyAccess(link, () => {
                console.log('done');
                node.textContent = "font_download"
                node.classList.remove('spin')            
                
                this.props.app.hideLoading(1000);
            });
        }
    }

    goUrl = (link, name) => {
        return () => {
            window.open(link, name || '_link');
        }
    }    
   
    getTools () { 
        const fontObj = this.state.fontObj; 
        let results = [];
        
        if (fontObj.downloadUrl) { 
            results.push(<span className="link" key={0} title="Font Download" onClick={this.downloadUrl(fontObj.downloadUrl)} >{intl.get('fontmanager.title.download')}</span>);
        }

        if (fontObj.licenseUrl) { 
            if (results.length) results.push(<span  key={1} className="divider"></span>)            
            results.push(<span className="link"  key={2} title="View License" onClick={this.goUrl(fontObj.licenseUrl, 'License')} >{intl.get('fontmanager.title.license')}</span>)
        }

        return results; 
    }
   
    getLicenseIcon = (license) => {
        if (license && license.indexOf('SIL') > -1 ) {
            return (<img className="license-icon" src='./license/OFLlogos/PNG/OFLLogoCircBW.png' alt="license logo" width="30px"/>)
        } else {
            return (<i className="material-icons">cloud</i> )
        }
    }    

    render () {
           
        // 기타 다른 폰트들에 대해서 Rendering 객체를 다르게 해야할 것 같다. 
        const fontObj = this.state.fontObj; 
        const name = fontObj.name || fontObj.family;
        const preview = {__html : fontObj.description || ""}
        let cssLink = "";
        let exampleItem = "";
        if (fontObj.cssImport) {
            let descItem = fontObj.cssImport.split(/\n/);
            cssLink = descItem.shift();
            exampleItem = descItem.join('\n')
        }


        return (
            <div className="google-early-access-font-item">
                <div className="font-info">
                    <div className="font-family" title={fontObj.family}>
                        {this.getLicenseIcon(fontObj.license)} {name} <span className="category">{fontObj.category}</span>
                    </div>
                </div> 
                <div className="tools">
                   {this.getTools()}
                </div>   
                <div className="font-item-preview">
                    <div dangerouslySetInnerHTML={preview} />
                </div>      
                {cssLink ? (
                    <div className="font-description">
                        <h3>Link</h3>
                        <div className="desc-item">{cssLink}</div>
                    </div>
                ) : ""}
                {exampleItem ? (
                    <div className="font-description">
                        <h3>Example</h3>
                        <div className="desc-item">{exampleItem}</div>
                    </div>
                ) : ""}
                
                <LabelInput fontObj={fontObj} labels={fontObj.labels} readonly={true}/> 
            </div>
        )
    }
 
}

export default GoogleEarlyAccessItem 