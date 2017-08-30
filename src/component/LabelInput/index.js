import React, { Component } from 'react';
import './default.css';

import { fontdb} from '../../util'

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

    deleteLabel = (e) => {
        const label = e.target.getAttribute('data-label');

        const labels = this.state.labels.filter((l) => {
            return l !== label; 
        })

        this.updateLabels(labels, () => {
            this.setState( { labels })
        })
    }    

    onKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const label = this.refs.labelInput.textContent.trim();

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

    render() {
        return (
            <div className="label-list">
                { this.state.labels.map((label, index) => {
                    let realLabel = [label]; 
                    if (label.includes('italic')) {
                        realLabel = [label.replace('italic', ''), <i className="material-icons" key={label}>format_italic</i>]; 
                    }

                    let attrs = {
                        className : 'label',
                        key : index, 
                    }

                    let deleteIcon = "";

                    if (!this.state.readonly) {
                        attrs['data-label'] = label; 
                        attrs.onClick = this.deleteLabel;

                        deleteIcon = <i className="material-icons" >close</i>;
                    }
                    
                    return ( 
                        <span {...attrs} >{realLabel} {deleteIcon}</span> )
                })}
                {
                    this.state.readonly ? "" : <span className="label input" contentEditable={true} ref="labelInput" onKeyDown={this.onKeyDown} data-placeholder="label"></span>
                }
                
            </div>
        )
    }
}

export default LabelInput
