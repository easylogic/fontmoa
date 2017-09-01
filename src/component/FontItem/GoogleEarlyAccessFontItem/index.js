import React, { Component } from 'react';
import './default.css';

import { googlefont} from '../../../util'

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

            googlefont.downloadEarlyAccess(link, () => {
                console.log('done');
                node.textContent = "font_download"
                node.classList.remove('spin')                
            });
        }
    }

    goUrl = (link, name) => {
        return () => {
            window.open(link, name || '_link');
        }
    }    
   
    render () {
           
        // 기타 다른 폰트들에 대해서 Rendering 객체를 다르게 해야할 것 같다. 
        const fontObj = this.state.fontObj; 
        const name = fontObj.name || fontObj.family;
        const preview = {__html : fontObj.description || ""}

        return (
            <div className="google-early-access-font-item">
                <div className="font-info">
                    <div className="font-family" title={fontObj.family}>
                        <i className="material-icons">cloud</i> {name} <span className="category">{fontObj.category}</span>
                    </div>
                </div> 
                <div className="tools">
                    {fontObj.downloadUrl ? <span className="link" title="Font Download" onClick={this.downloadUrl(fontObj.downloadUrl)} ><i className="material-icons">font_download</i></span> : ""}
                    {fontObj.licenseUrl ? <span className="link" title="View License" onClick={this.goUrl(fontObj.licenseUrl, 'License')} ><i className="material-icons">turned_in_not</i></span> : ""}
                    {fontObj.buyUrl ? <span className="link" onClick={this.goUrl(fontObj.buyUrl, 'Buy')} ><i className="material-icons">shopping_cart</i></span> : ""}
                </div>   
                <div className="font-item-preview">
                    <div dangerouslySetInnerHTML={preview} />
                </div>                             
            </div>
        )
    }
 
}

export default GoogleEarlyAccessItem 