
import React, { Component } from 'react';
import './default.css';

const filesize = window.require('filesize');

class FontInfo extends Component {

    fieldList = [
        { key : "version", title : "버전" },
        { key : "manufacturer", title : "제작사" },
        { key : "vendorURL", title : "URL" },
        { key : 'trademark', title : '등록상표' },
        { key : "copyright", title : "저작권" },
    ]

    getViewInfo (font) {

        let list = [];

        const size = filesize.partial({ round: 1, spacer: "" });
        const lang = font.currentLanguage;
        if (Object.keys(font).length) {
            console.log(font)
            list.push({ title : '파일 이름', content : font.item.name })

            if (font.size) {
                list.push({ title : '파일 크기', content : size(font.size) })
            }

            this.fieldList.forEach((field) => {
                if (font.name && font.name[field.key] && font.name[field.key][lang]) { 
                    list.push({ title : field.title, content : font.name[field.key][lang] })
                } else if (font[field.key]) {
                    list.push({ title : field.title, content : font[field.key] })
                }
            })
        }

        return list; 
    }

    render() {

        const font = this.props.font;

        const viewInfo = this.getViewInfo(font);

        return (
            <div className="font-note">
                {viewInfo.map((it, i) => {
                    return (
                        <div className="font-note-item" key={i}>
                            <div className="title">{it.title}</div>
                            <div className="content">{it.content}</div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default FontInfo 