import React, { Component } from 'react';
import './default.css';

import { googlefont} from '../../util'

import LabelInput from '../LabelInput'


class GoogleFontItem extends Component {

    constructor (props) {
        super(props);
        this.state = {
            fontObj: this.props.fontObj,
        }
    }


    downloadGoogleFont = (e)  => {
        // 중복 체크 
        // 구글 폰트 모두 다운로드 
        let node = e.target.querySelector('.material-icons');
        node.textContent = "autorenew"
        node.classList.add('spin')

        googlefont.downloadGoogleFont(this.state.fontObj, () => {
            console.log(' google font done');
            node.textContent = "font_download"
            node.classList.remove('spin')
        });

    }

    goUrl = (link, name) => {
        return () => {
            console.log(link);
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
                    <div className="font-family" title={fontObj.family} onClick={this.goUrl(previewUrl, 'Preview')} >
                        <i className="material-icons">cloud</i> {name}  <span className="category">{fontObj.category}</span>
                    </div>
                </div> 
                <div className="tools">
                    <span className="link" title="All Font Download" onClick={this.downloadGoogleFont} ><i className="material-icons">font_download</i></span>
                    <span className="link" title="View Font" onClick={this.goUrl(previewUrl, 'Preview')} ><i className="material-icons">pageview</i></span>
                </div>   
                <LabelInput fontObj={fontObj} labels={labels} readonly={true} onClick={this.downloadGoogleFont} />
            </div>
        )
    }
 
}

export default GoogleFontItem 