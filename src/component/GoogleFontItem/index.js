import React, { Component } from 'react';
import './default.css';

import { common, cssMaker, fontdb, googlefont} from '../../util'

import LabelInput from '../LabelInput'


class GoogleFontItem extends Component {

    constructor (props) {
        super(props);
        this.state = {
            fontObj: this.props.fontObj,
        }
    }


    downloadGoogleFont = (fontObj)  => {
        // 중복 체크 
        // 구글 폰트 모두 다운로드 
        googlefont.downloadGoogleFont(fontObj, () => {
            console.log(' google font done');
        });

    }

    downloadUrl = (link) => {
        // 구글 early access 폰트, zip 파일로 압축된 폰트 다운로드 
        // 중복 체크         
        return () => {
            googlefont.downloadEarlyAccess(link, () => {
                console.log('done');
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
        const labels = fontObj.variants || [];
        const previewUrl = "https://fonts.google.com/specimen/" + encodeURIComponent(fontObj.family)


        return (
            <div className="google-font-item">
                <div className="font-info">
                    <div className="font-family" title={fontObj.family}>
                        {name}
                    </div>
                </div> 
                <div className="tools">
                    <span className="link" title="All Font Download" onClick={e => this.downloadGoogleFont(fontObj)} ><i className="material-icons">font_download</i></span>
                    <span className="link" title="View Font" onClick={this.goUrl(previewUrl, 'Preview')} ><i className="material-icons">pageview</i></span>
                </div>   
                <LabelInput fontObj={fontObj} labels={labels} readonly={true} onClick={this.downloadGoogleFont} />
            </div>
        )
    }
 
}

export default GoogleFontItem 