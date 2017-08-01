
import React, { Component } from 'react';
import './default.css';

const filesize = window.require('filesize');

class FontInfo extends Component {

    fieldList = [
        { key : "license", title : "라이센스" },                
        { key : "licenseURL", title : "License URL" },        
        { key : "copyright", title : "저작권" },        
        { key : "manufacturer", title : "제작사" },        
        { key : "vendorURL", title : "URL" },        
        { key : "version", title : "버전" },
        { key : 'trademark', title : '등록상표' },
        { key : "language", title : "언어" },
    ]

    getViewInfo (font) {

        let list = [];


        if (font && Object.keys(font).length) {
            const size = filesize.partial({ round: 1, spacer: "" });
            const lang = font.currentLanguage;            

            this.fieldList.forEach((field) => {
                if (font.name && font.name[field.key] && font.name[field.key][lang]) { 
                    list.push({ title : field.title, content : font.name[field.key][lang], key : field.key })
                } else if (font[field.key]) {
                    const content = Array.isArray(font[field.key]) ? font[field.key].join(', ') : font[field.key];
                    list.push({ title : field.title, content : content, key : field.key })
                }
            })

            list.push({ title : '파일 이름', content : font.item.name })

            if (font.size) {
                list.push({ title : '파일 크기', content : size(font.size) })
            }            
        }

        return list; 
    }

    onClickNoteItem = (e) => {
        
    }

    render() {

        const font = this.props.font;

        const viewInfo = this.getViewInfo(font);

        return (
            <div className="font-note">
                {viewInfo.map((it, i) => {
                    const key = (it.key || "").toLowerCase();

                    let activeClass = "";
                    let attrs = { }

                    if (key === 'copyright') {
                        activeClass = "active";
                    } else if (key === 'license') {
                        activeClass = "active";
                    } else if (key === 'url' || key === 'licenseurl') {
                        attrs.href =  it.content; 
                        attrs.target =  "_blank"; 
                    }

                    return (
                        <div className="file-note-item vmenu flat" key={i} onClick={this.onClickNoteItem}>
                            <a className={activeClass}>{it.title}</a>
                            <ul className="submenu"><li className={activeClass}><a {...attrs} >{it.content}</a></li></ul>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default FontInfo 