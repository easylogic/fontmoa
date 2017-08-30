import React, { Component } from 'react';
import './default.css';

import { common, cssMaker, fontdb, googlefont} from '../../util'

class LabelInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fontObj: this.props.fontObj,
            labels : this.props.labels || [],
            readonly : this.props.readonly || false,
        }
    }

    updateLabels = (labels, callback) => {
        const fileId = this.state.fontObj._id;
        fontdb.updateLabels(fileId, labels, () => {
            callback && callback();
        })
    }

    onKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const label = this.refs.labelInput.textContent;

            if (!this.state.labels.includes(label)) {
                const labels = this.state.labels.concat([label]);
                this.refs.labelInput.textContent = "";
                this.updateLabels(labels, () => {
                    this.setState({ labels })
                });

            }
            return;
        }
    }

    downloadGoogleFont = (label) => {
        let fontObj = { 
            family : this.state.fontObj.family, 
            files : { 
                [label] : this.state.fontObj.files[label]
            } 
        }

        this.props.onClick(fontObj)
    }

    render() {
        let files = {};
        if (this.state.fontObj) {
            files = this.state.fontObj.files || [];
        }        
        return (
            <div className="label-list">
                { this.state.labels.map((label, index) => {
                    let realLabel = [label]; 
                    if (label.includes('italic')) {
                        realLabel = [label.replace('italic', ''), <i className="material-icons" key={label}>format_italic</i>]; 
                    }
                    
                    return (
                        <span className="label" key={index}>
                            {realLabel} 
                            {files[label] ? <span onClick={(e) => this.downloadGoogleFont(label) } title="Download Font"><i className="material-icons">file_download</i></span> : ""}
                        </span>
                    )
                })}
                {
                    this.state.readonly ? "" : <span className="label input" contentEditable={true} ref="labelInput" onKeyDown={this.onKeyDown} data-placeholder="label"></span>
                }
                
            </div>
        )
    }
}
